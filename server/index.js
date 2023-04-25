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

const MAX_PLAYERS = 2;

function startGameTimer() {
  // Start the game length timer
  const gameDuration = 10; // in seconds
  let remainingGameTime = gameDuration;
  const gameInterval = setInterval(() => {
    remainingGameTime--;
    io.emit("game-timer", remainingGameTime);

    if (remainingGameTime === 0) {
      clearInterval(gameInterval);
      io.emit("game-over");
    }
  }, 1000);
}

function startGame() {
  console.log("Game has started");

  const warmupDuration = 5; // in seconds
  let remainingWarmupTime = warmupDuration;
  const warmupInterval = setInterval(() => {
    remainingWarmupTime--;
    io.emit("warmup-timer", remainingWarmupTime);

    if (remainingWarmupTime === 0) {
      clearInterval(warmupInterval);

      startGameTimer();
    }
  }, 1000);
}

io.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    socket.join(room);

    socket.emit("current-room", room);

    const userQuantity = io.sockets.adapter.rooms.get(room);

    if ([...userQuantity].length == MAX_PLAYERS) {
      io.emit("startGame", true, [...userQuantity]);

      startGame(room);
    } else {
      io.emit("startGame", false, [...userQuantity]);
    }
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);

    socket.emit("current-room", "");

    const userQuantity = io.sockets.adapter.rooms.get(room) || [];

    io.emit("startGame", false, [...userQuantity]);
  });
});

instrument(io, {
  auth: false,
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT);
