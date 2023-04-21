"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Rooms() {
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");

  const [playersInRoom, setPlayersInRoom] = useState([]);

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

  const joinRoom = (e) => {
    e.preventDefault();

    socket?.emit("join-room", input);

    socket?.on("users-in-a-current-room", (data) => {
      setPlayersInRoom(data);
    });

    setInput("");
  };

  const leaveRoom = (e) => {
    socket?.emit("leave-room", room);
  };

  return (
    <div>
      <h2>Current room: {room}</h2>

      <h5>{room && `Players: ${playersInRoom?.length}/2`}</h5>

      <form onSubmit={joinRoom}>
        <label>Create custom room</label>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <input type="submit" value="Enter room" />
      </form>

      {room && <button onClick={leaveRoom}>Laave Room</button>}
    </div>
  );
}
