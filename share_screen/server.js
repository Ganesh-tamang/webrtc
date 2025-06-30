const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const ROOM_ID = "screen-room";
let sharerId = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("send_sharerid", ()=>{
    socket.emit("sharerid",sharerId)
  });

  socket.on("join-room", () => {
    socket.join(ROOM_ID);

    if (!sharerId) {
      sharerId = socket.id;
      socket.emit("you-are-sharer");
    } else {
      socket.emit("connect-to-sharer", sharerId);
      io.to(sharerId).emit("new-viewer", socket.id);
    }
  });

  socket.on("offer", ({ target, sdp }) => {
    io.to(target).emit("offer", { from: socket.id, sdp });
  });

  socket.on("answer", ({ target, sdp }) => {
    io.to(target).emit("answer", { from: socket.id, sdp });
  });

  socket.on("ice-candidate", ({ target, candidate }) => {
    io.to(target).emit("ice-candidate", { from: socket.id, candidate });
   });

  socket.on("disconnect", () => {
    if (socket.id === sharerId) {
      sharerId = null;
      io.to(ROOM_ID).emit("sharer-left");
    }
});
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
