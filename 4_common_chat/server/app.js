require("dotenv").config();
const express = require("express");
const http = require("http");
const apiRouter = require("./routes/api/api.routes");
const serverConfig = require("./config/serverConfig");
const { connectionCb, wss } = require("./socket/wsServer");

const app = express();

serverConfig(app);

app.use("/api", apiRouter);

const wssCb = require("./socket/wssCb");
const server = http.createServer(app);

// Ловим событие переключения на сокеты
server.on("upgrade", connectionCb);
// Ловим событие подключения к веб-сокету см connectionCb  wss.emit("connection", ws, request, user.user);
wss.on("connection", wssCb);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
