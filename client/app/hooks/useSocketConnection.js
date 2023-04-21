import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocketConnection = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected");
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};