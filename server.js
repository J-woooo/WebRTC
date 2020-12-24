const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (rooms[roomID]) {
      // 룸이 존재한다면, 유저 확인
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      // other user check
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  // offer event, send an event payload offer
  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  // answer, answer payload
  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  // ice candidate, agree proper connection
  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});

server.listen(8000, () => console.log("server is running on port 8000"));
