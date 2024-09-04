const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const broadcastUserCount = require("./socket/utils/broadcastUserCount");

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("a user connected");
  broadcastUserCount(wss);

  ws.on("close", () => {
    console.log("Client disconnected");
    broadcastUserCount(wss);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
