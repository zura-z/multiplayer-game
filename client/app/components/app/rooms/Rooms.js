"use client";

import { useState } from "react";

export default function Rooms({ socket, room, playersInRoom, setPlayersInRoom }) {
  const [input, setInput] = useState("");

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
