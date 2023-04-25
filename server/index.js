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
const WARMUP_TIME = 6;
const GAME_TIME = 14;
const QUESTION = "32*32";
const ANSWER = "1024";

let winners = [];

function startGame() {
  console.log("Game has started");

  // reset winners
  winners = [];

  const warmupDuration = WARMUP_TIME; // in seconds
  let remainingWarmupTime = warmupDuration;
  const warmupInterval = setInterval(() => {
    remainingWarmupTime--;
    io.emit("warmup-timer", remainingWarmupTime);

    if (remainingWarmupTime === 0) {
      clearInterval(warmupInterval);

      // Start the game length timer
      const gameDuration = GAME_TIME; // in seconds
      let remainingGameTime = gameDuration;
      const gameInterval = setInterval(() => {
        remainingGameTime--;
        io.emit("game-timer", remainingGameTime);

        if (remainingGameTime === 0) {
          clearInterval(gameInterval);
          io.emit("game-over", winners);
        }
      }, 1000);

      io.emit("question", QUESTION, ANSWER);
    }
  }, 1000);
}

io.on("connection", (socket) => {
  // Handle user answers during started game
  socket.on("answer", (answer) => {
    if (answer == ANSWER) {
      // add to list
      winners.push(socket.id);

      console.log("added", winners);
    } else {
      // remove from list

      const index = winners.indexOf(socket.id);
      if (index > -1) {
        winners.splice(index, 1);

        console.log("spliced", winners);
      }
    }
  });

  socket.on("join-room", (room) => {
    socket.join(room);

    socket.emit("current-room", room);

    const userQuantity = io.sockets.adapter.rooms.get(room);

    if ([...userQuantity].length == MAX_PLAYERS) {
      io.emit("startGame", true, [...userQuantity]);

      startGame();
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
