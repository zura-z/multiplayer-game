"use client"

import { useState } from "react";
import Rooms from "./components/rooms";
import Game from "./components/game";

function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <main>
      {!gameStarted && <Rooms />}

      {gameStarted && <Game />} 
    </main>
  );
}

export default Home;
