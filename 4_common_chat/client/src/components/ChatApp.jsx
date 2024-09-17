import React, { useContext, useEffect, useRef, useState } from "react";
import axiosInstance from "./../axiosInstance";
import { UserContext } from "../context/UserContext";

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { user } = useContext(UserContext);

  const ws = useRef(null);

  useEffect(() => {
    axiosInstance.get("/chat/messages").then(({ data }) => setMessages(data));
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:3000`);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.current.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      switch (type) {
        case "ERROR":
          alert(payload);
          break;
        case "NEW_MESSAGE":
          setMessages((prevMessages) => [...prevMessages, payload]);
          break;
        case "UPDATE_MESSAGE":
          console.log(payload);

          setMessages((prevMessages) =>
            prevMessages.map((msg) => (msg.id === payload.id ? payload : msg))
          );
          break;
        case "DELETE_MESSAGE":
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== payload)
          );
          break;
        default:
          break;
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      ws.current.send(
        JSON.stringify({ type: "NEW_MESSAGE", payload: inputMessage })
      );
      setInputMessage("");
    }
  };

  const updateMessage = (id) => {
    const newText = prompt("Edit your message:");
    if (newText) {
      ws.current.send(
        JSON.stringify({
          type: "UPDATE_MESSAGE",
          payload: { id, message: newText },
        })
      );
    }
  };

  const deleteMessage = (id) => {
    ws.current.send(JSON.stringify({ type: "DELETE_MESSAGE", payload: id }));
  };

  return (
    <div>
      <div>
        <h2>Chat</h2>
        <ul>
          {messages.map((message) => {
            // Обновить можно только в течение 5 минут после отправки
            const messageTimestamp = new Date(message.createdAt);
            const now = new Date();
            const timeDiff = now - messageTimestamp;
            const canEdit = timeDiff <= 5 * 60 * 1000;
            return (
              <li key={message.id}>
                <small>Sent by: {message.User.email} </small>
                {message.message}
                {canEdit && message.userId === user?.id && (
                  <button onClick={() => updateMessage(message.id)}>
                    Edit
                  </button>
                )}
                {message.userId === user?.id && (
                  <button onClick={() => deleteMessage(message.id)}>
                    Delete
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatApp;
