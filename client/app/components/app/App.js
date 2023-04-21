"use client"

import { useState } from "react";
import Rooms from "./rooms";
import Game from "./game";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <main>
      {!gameStarted && <Rooms />}

      {gameStarted && <Game />} 
    </main>
  );
}

export default App;
