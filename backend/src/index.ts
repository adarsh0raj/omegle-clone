import { Server, Socket } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {});

io.on("connection", (socket: Socket) => {
  console.log("A user connected");
});

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});