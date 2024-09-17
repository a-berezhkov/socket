import React, { useContext, useEffect, useRef, useState } from "react";
import axiosInstance, { accessToken } from "./../axiosInstance";
import { UserContext } from "../context/UserContext";

import { useSocket } from "../hooks/useSocket";
import axios from "axios";

function ChatApp() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { user: authUser } = useContext(UserContext);

  const socket = useSocket();

  //Загружаем все чаты с пользователями
  useEffect(() => {
    axiosInstance.get("/users/chats").then(({ data }) => {
      setUsers(data);
    });
  }, []);

  socket?.on("message", (msg) => {
    const message = JSON.parse(msg);
    setMessages([...messages, message]);
  });

  const handleUserClick = async (user) => {
    setSelectedUser(user); // ставим выбранного пользователя для чата
    const roomId = [authUser.id, user.id].sort().join("_"); // Генерим roomId

    const { data } = await axios.post("api/chat/messages", {
      fromId: authUser.id,
      toId: user.id,
    });
    setMessages(data);

    // Отправляем на сервер запрос на присоединение к комнате
    socket.emit("join-room", {
      roomId: roomId,
    });
  };

  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        room: [authUser.id, selectedUser.id].sort().join("_"),
        message,
        sender: authUser,
        receiver: selectedUser,
      };
      socket.emit("message", chatMessage); // Отправляем сообщение на сервер
      setMessage(""); // Чистим поле ввода
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          width: "30%",
          padding: "10px",
          borderRight: "1px solid black",
        }}
      >
        <h3>Список пользователей</h3>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer" }}
            >
              {user.email}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: "70%", padding: "10px" }}>
        {selectedUser ? (
          <div>
            <h3>Chat with {selectedUser.email}</h3>
            <div
              style={{
                height: "300px",
                overflowY: "scroll",
                border: "1px solid gray",
                padding: "10px",
              }}
            >
              <ul>
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    style={{
                      textAlign:
                        msg.sender.id === authUser.id ? "right" : "left",
                    }}
                  >
                    <strong>
                      {msg.sender.id === authUser.id
                        ? "You"
                        : selectedUser.email}
                    </strong>
                    : {msg.message}
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        ) : (
          <div>Select a user to start a chat</div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;
