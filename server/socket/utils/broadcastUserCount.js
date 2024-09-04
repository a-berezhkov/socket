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