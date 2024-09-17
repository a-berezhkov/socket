/**
 * Отправляет сообщение всем клиентам
 * @param {*} clients - socket clients
 * @param {*} message  - сообщение
 */
const broadcast = (clients, message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = { broadcast };
