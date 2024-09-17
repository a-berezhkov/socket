# Server Socket

https://www.npmjs.com/package/ws

## Установка 

```
npm install ws
```

## Добавляем socket сервер

Приложение Express (`app`) будет обрабатывать маршруты и запросы, а HTTP-сервер (`server`) будет прослушивать входящие запросы и передавать их приложению Express для обработки.

`http.createServer` возвращает объект сервера. Этот объект имеет метод `listen`.

```js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // интеграция WebSocket с HTTP-сервером

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

```


## Слушатели объекта `http.Server`

1. `request` - запускается каждый раз, когда сервер получает новый HTTP-запрос.

```js
server.on('request', (req, res) => {
    console.log(`Received request for ${req.url}`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, world!');
});
```

2. `connection` - запускается, когда с сервером устанавливается новое TCP-соединение.

```js
server.on('connection', (socket) => {
    console.log('New connection from', socket.remoteAddress);
});
```

3. `close` - генерируется, когда сервер закрыт. После этого события больше соединения приниматься не будут.

```js
server.on('close', () => {
    console.log('Server is closing');
});
```
4. `connect` - сервер получает метод HTTP CONNECT. Используется для протоколов туннелирования, таких как HTTPS через HTTP.

```js
server.on('connect', (req, socket, head) => {
    console.log('Received HTTP CONNECT method');
    socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    socket.pipe(socket); // Echo back the connection
});
```
5. `upgrade` - сервер получает запрос на обновление HTTP.Используется для переключения протоколов, например, с HTTP на WebSockets.
```js
server.on("", (request, socket, head) => {
  console.log("upgrade");
  console.log(head.toString());
});
```


## Слушатели объекта сервера WebSocket

Событие connection срабатывает каждый раз, когда новый клиент устанавливает соединение с сервером WebSocket.

Принимает один параметр — объект socket, который представляет собой соединение WebSocket с клиентом. Этот объект позволяет серверу отправлять и получать сообщения от клиента, а также управлять состоянием соединения.

```js
wss.on("connection", (socket) => {
  console.log("a user connected");
}
```

`socket` так же имеет набор методов 

```js
wss.on("connection", (socket) => {
    console.log(socket);
    
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("message", (msg) => {
    console.log("message: " + msg);
  });
  socket.on("close", (code, reason) => {
    console.log("close: " + code);
    console.log("close: " + reason.toString()); //Convert the reason from Buffer to string
  });
  socket.on("error", (error) => {
    console.log("error: " + error);
  });
});
```

 