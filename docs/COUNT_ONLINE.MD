# Количество посетителей сайта

## Server

```js
// server/socket/utils/broadcastUserCount.js
function broadcastUserCount(wss) {
    const userCount = wss.clients.size;
    const message = JSON.stringify({ type: 'USER_COUNT', data: userCount });
  
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
module.exports = broadcastUserCount;

```


Подключаем в `app.js`

```js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const broadcastUserCount = require("./socket/utils/broadcastUserCount");

wss.on("connection", (ws) => {
  console.log("a user connected");
  broadcastUserCount(wss);
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## Client

```jsx
// client/src/components/UserCount/UserCount.jsx
import React, { useState, useEffect, useRef } from "react";

const UserCount = () => {
  const [userCount, setUserCount] = useState(0);

  const ws = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");
    const socket = ws.current;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "USER_COUNT") {
        setUserCount(message.data);
      }
    };
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>Connected Users: {userCount}</h2>
    </div>
  );
};

export default UserCount;

```