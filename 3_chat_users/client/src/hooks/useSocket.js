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
