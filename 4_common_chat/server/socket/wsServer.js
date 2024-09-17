const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

const connectionCb = (request, socket, head) => {
  console.log("Parsing session from request...");
  // Используем cookieParser для парсинга кук из запроса
  cookieParser()(request, {}, () => {
    const token = request.cookies.refreshToken;

    try {
      // достаем из кук токен и проверяем его
      const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      console.log("Session is parsed!");

      // Если все ок, то подключаемся к веб-сокету
      // request - это объект запроса, socket - это сокет, head - это заголовок
      // ws - это объект веб-сокета
      wss.handleUpgrade(request, socket, head, function (ws) {
        // Подключаемся к веб-сокету и передаем в него пользователя из кук
        wss.emit("connection", ws, request, user.user);
      });
    } catch (error) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
  });
};

module.exports = { connectionCb, wss };
