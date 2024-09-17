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
