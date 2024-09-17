# Чат с пользователями и базой данных

<p align="center">
    <img src="./readme_data/3_users_chat.gif">
<p>

## Server
 
```js
// /server/app.js
 
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

```
 
## Client

### Для работы с headers вынесем подключение в отдельный файл

```js
// client/src/socket.js
"use client";
import io from "socket.io-client";

let socket;

export const initSocket = (token) => {
  if (!socket) {
    const backendBaseUrl = "http://127.0.0.1:3000";
    let options = {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    };

    socket = io(backendBaseUrl, options);
    console.log("Connecting to socket server");
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error(
      "Socket not initialized. Call initSocket(serverUrl) first."
    );
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

```

### Хук для работы с сокетом и получение AccessToken

```jsx
//  hooks/useSocket.js
import { useEffect, useState } from "react";
import { initSocket, getSocket, disconnectSocket } from "../socket";
import axiosInstance from "../axiosInstance";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const response = await axiosInstance.get(`/tokens/refresh`);
        if (!response.status === 200) {
          throw new Error("Failed to fetch tokens");
        }
        const { data } = response;
        const socketIo = initSocket(data.accessToken);
        setSocket(socketIo);
      } catch (error) {
        console.error(error);
      }
    };
    initializeSocket();
  }, []);

  return socket;
};


```


### Пример использования

```jsx
  const socket = useSocket();
 

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
```