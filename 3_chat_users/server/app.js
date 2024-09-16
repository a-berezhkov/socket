require("dotenv").config();
const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const apiRouter = require("./routes/api/api.routes");
const serverConfig = require("./config/serverConfig");
const ChatService = require("./service/ChatService");

const app = express();

const server = http.createServer(app);
const socketIo = require("socket.io");

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  const accessToken = socket.handshake.headers.authorization?.split(" ")[1];
  try {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, { user } = { user: {} }) => {
        if (err) {
          console.log(err);
          throw new Error("Authentication error");
        }
        socket.user = user;
        next();
      }
    );
  } catch (error) {
    console.log(error);
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.name);

  socket.on("join-room", (room) => {
    socket.join(room.roomId);
    console.log(`User ${socket.user.email} joined room: ${room.roomId}`);
    socket.to(room.roomId).emit(
      "message",
      JSON.stringify({
        sender: socket.user,
        message: `${socket.user.email} has joined the room`,
      })
    );
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room.roomId);
    console.log(`User ${socket.user.username} left room: ${room.roomId}`);
    socket
      .to(room.roomId)
      .emit("message", `${socket.user.username} has left the room`);
  });

  socket.on("message", async ({ room, message, sender, receiver }) => {
    console.log(`Message in room ${room}: ${message}`);
    const result = await ChatService.sendMessage({
      fromId: sender.id,
      toId: receiver.id,

      message,
    });
    console.log(result);

    io.to(room).emit("message", JSON.stringify({ sender, message }));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.username);
  });
});

serverConfig(app);

app.use("/api", apiRouter);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
