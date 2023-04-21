const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
  },
});

instrument(io, {
  auth: false,
});

const PORT = process.env.PORT || 3001
httpServer.listen(PORT);
