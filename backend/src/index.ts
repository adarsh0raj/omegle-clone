import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import { UserManager } from "./managers/UserManager";

const app = express();
const server = http.createServer(http);

const io = new Server (server, {
    cors: {
        origin: "*"
    }
});

const userManager = new UserManager();

io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  userManager.addUser("rand1", socket);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    userManager.removeUser(socket.id);
  });
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});