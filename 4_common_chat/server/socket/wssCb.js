const clients = new Map();
const { broadcast } = require("./broadcastMessage");
const ChatService = require("../service/ChatService");

const wssCb = async (ws, request, user) => {
  //Добавляем пользователя в мапу
  clients.set(user.id, ws);

  ws.on("error", console.error);

  //Получаем сообщение от клиента
  ws.on("message", async function (message) {
    const { type, payload } = JSON.parse(message); /// пример message =  {type: "action_type", payload: { body: "Hello" }}

    //В зависимости от типа (type) сообщения выполняем разные действия
    // оборачиваем в try catch чтобы отлавливать ошибки
    try {
      switch (type) {
        case "NEW_MESSAGE":
          const message = await ChatService.addMessageToChat({
            userId: user.id,
            message: payload,
          });
          broadcast(clients, { type: "NEW_MESSAGE", payload: message });
          break;
        case "UPDATE_MESSAGE":
          const messageToUpdate = await ChatService.updateMessageInChat(
            payload.id,
            { message: payload.message }
          );
          broadcast(clients, {
            type: "UPDATE_MESSAGE",
            payload: messageToUpdate,
          });
          break;
        case "DELETE_MESSAGE":
          const deletedID = await ChatService.deleteMessageFromChat(payload);
          broadcast(clients, { type: "DELETE_MESSAGE", payload: deletedID });
          break;
        default:
          break;
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          payload: error.message,
        })
      );
    }
  });

  ws.on("close", function () {
    clients.delete(user.id);
  });
};

module.exports = wssCb;
