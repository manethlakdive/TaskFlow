import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // dev only — production eke specific origin ekak dnna
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // client eken userId ekak evanawa, e userta private events (invites vage) evanna
    socket.on("identify", (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });

    // user board ekak open kalama, e board eke room ekata join wenawa
    socket.on("board:join", (boardId) => {
      if (boardId) socket.join(`board:${boardId}`);
    });

    socket.on("board:leave", (boardId) => {
      if (boardId) socket.leave(`board:${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialised yet — call initSocket first");
  return io;
};