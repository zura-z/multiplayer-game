const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    socket.join(room);

    socket.emit("current-room", room);

    const userQuantity = io.sockets.adapter.rooms.get(room);
    
    io.to(room).emit("users-in-a-current-room", [...userQuantity]);
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);

    socket.emit("current-room", "");

    const userQuantity = io.sockets.adapter.rooms.get(room);
    
    io.to(room).emit("users-in-a-current-room", [...userQuantity]);
  });
});

instrument(io, {
  auth: false,
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT);
