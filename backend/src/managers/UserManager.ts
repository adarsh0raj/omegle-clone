import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
    name: string;
    socket: Socket;
}

export class UserManager {
    private users: User[];
    private queue: string[];
    private roomManager: RoomManager;
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }

    addUser(name: string, socket: Socket) {
        this.users.push({ name, socket });
        this.queue.push(socket.id);
        socket.send("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }

    removeUser(socketId: string) {
        const user = this.users.find((user) => user.socket.id === socketId);
        this.users = this.users.filter((user) => user.socket.id != socketId);
        this.queue = this.queue.filter((id) => id != socketId);
    }

    clearQueue() {
        if(this.queue.length < 2) return;
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        const user1 = this.users.find(x => x.socket.id === id1);
        const user2 = this.users.find(x => x.socket.id === id2);
        if(!user1 || !user2) return;
        this.roomManager.createRoom(user1, user2);
    }

    initHandlers(socket: Socket) {
        socket.on("offer", ({sdp, roomId}) => {
            this.roomManager.onOffer(roomId, sdp);
        })

        socket.on("answer", ({sdp, roomId}) => {
            this.roomManager.onAnswer(roomId, sdp);
        })
    }
}