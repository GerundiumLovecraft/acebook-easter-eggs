let io;
const userSocketMap = {};

function initSocket(server) {
  const { Server } = require("socket.io");
  const JWT = require("jsonwebtoken");

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth.token;

    if (token) {
      try {
        const decoded = JWT.decode(token);
        const userId = decoded.sub;
        socket.userId = userId;
        userSocketMap[userId] = socket.id;
        console.log("A user connected:", userId);
      } catch (err) {
        console.log("Invalid token on socket connection");
      }
    }

    socket.on("disconnect", () => {
      delete userSocketMap[socket.userId];
      console.log("User disconnected:", socket.userId);
    });
  });
}

function getIo() {
  return io;
}

function getUserSocketMap() {
  return userSocketMap;
}

module.exports = { initSocket, getIo, getUserSocketMap };
