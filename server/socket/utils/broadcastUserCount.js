function broadcastUserCount(wss) {
    const userCount = wss.clients.size;
    const message = JSON.stringify({ type: 'USER_COUNT', data: userCount });
    console.log(message);
    
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      
    }
  
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  

module.exports = broadcastUserCount;