import React, { useState, useEffect } from "react";
import "./Chat.css";
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Создаем соединение с сервером WebSocket
    const socket = new WebSocket("ws://localhost:3000");

    // Обработчик события onmessage
    socket.onmessage = (event) => {
      // Парсим JSON-строку в объект
      const message = JSON.parse(event.data);
      // Если тип сообщения - "CHAT_MESSAGE", добавляем его в список сообщений
      if (message.type === "CHAT_MESSAGE") {
        setMessages((prevMessages) => [...prevMessages, message.data]);
      }
    };

    // Сохраняем объект WebSocket в состоянии
    setWs(socket);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (input.trim() !== "" && ws && ws.readyState === WebSocket.OPEN) {
      // Отправляем сообщение на сервер

      ws.send(JSON.stringify({ type: "CHAT_MESSAGE", data: input }));

      // Добавляем сообщение в список сообщений
      setMessages((prevMessages) => [...prevMessages, input]);

      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="chat-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
