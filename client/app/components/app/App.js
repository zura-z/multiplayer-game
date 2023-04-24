"use client";

import { useEffect, useState } from "react";
import Rooms from "./rooms";
import Game from "./game";

import { useSocketConnection } from "../../hooks/useSocketConnection";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playersInRoom, setPlayersInRoom] = useState([]);

  // Socket Connection
  const socket = useSocketConnection();

  useEffect(() => {
    socket?.on("connect", () => {
      socket?.on("startGame", (bool, data) => {
        setGameStarted(bool);
        setPlayersInRoom(data);
      });
    });
  }, [socket]);

  return (
    <div>
      {!gameStarted && <Rooms playersInRoom={playersInRoom} />}

      {gameStarted && <Game />}
    </div>
  );
}

export default App;
