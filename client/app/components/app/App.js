"use client";

import { useEffect, useState } from "react";
import Rooms from "./rooms";
import Game from "./game";

import { io } from "socket.io-client";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playersInRoom, setPlayersInRoom] = useState([]);
  const [room, setRoom] = useState("");

  // Socket Connection
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected");

      newSocket?.on("current-room", (room) => setRoom(room));

      newSocket?.on("users-in-a-current-room", (data) => {
        setPlayersInRoom(data);
      });
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    playersInRoom.length == 2 ? setGameStarted(true) : setGameStarted(false);
  }, [playersInRoom]);

  return (
    <main>
      {!gameStarted && (
        <Rooms
          socket={socket}
          room={room}
          playersInRoom={playersInRoom}
          setPlayersInRoom={setPlayersInRoom}
        />
      )}

      {gameStarted && <Game />}
    </main>
  );
}

export default App;
