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
    socket?.on("users-in-a-current-room", (data) => setPlayersInRoom(data));
  }, [socket]);

  useEffect(() => {
    playersInRoom.length == 2 ? setGameStarted(true) : setGameStarted(false);
  }, [playersInRoom]);

  return (
    <div>
      {!gameStarted && <Rooms playersInRoom={playersInRoom} setPlayersInRoom={setPlayersInRoom} />}

      {gameStarted && <Game />}
    </div>
  );
}

export default App;
