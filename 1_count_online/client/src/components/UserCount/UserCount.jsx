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
