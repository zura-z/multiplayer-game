import { useEffect, useState } from "react";
import { useSocketConnection } from "@/app/hooks/useSocketConnection";

export default function Game() {
  const [warmupTimer, setWarmupTimer] = useState(null);
  const [gameTimer, setGameTimer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winners, setWinners] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [input, setInput] = useState("");

  const socket = useSocketConnection();

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connect good");

      socket?.on("warmup-timer", (data) => setWarmupTimer(data || null));
      socket?.on("game-timer", (data) => setGameTimer(data || null));
      socket?.on("game-over", (data) => {
        setGameOver(true);
        setWinners(data);
      });

      socket?.on("question", (question, answer) => {
        setQuestion(question);
        setAnswer(answer);
      });
    });
  }, [socket]);

  useEffect(() => {
    socket?.emit("answer", input);
  }, [input]);

  return (
    <div>
      Game here
      {warmupTimer && <h1>Game starts in: {warmupTimer}</h1>}
      {gameTimer && (
        <>
          <h1>Game Has Started {gameTimer}</h1>

          <h2>Question: {question}</h2>

          <input value={input} onChange={(e) => setInput(e.target.value)} />
        </>
      )}
      {gameOver && (
        <>
          <h1>Game Has Ended</h1>

          {winners?.map((winner, id) => {
            return <h5 key={id}>Winner: {winner}</h5>;
          })}
        </>
      )}
    </div>
  );
}
