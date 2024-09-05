const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    // Рассылаем сообщение всем клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        // client !== ws но не самому себе
        client.send(message.toString());
      }
    });
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
