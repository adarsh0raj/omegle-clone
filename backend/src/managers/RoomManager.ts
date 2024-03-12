import { User } from "./UserManager";

let GLOBAL_ROOM_ID = 0;

interface Room {
    user1: User;
    user2: User;
    roomId: string;
}
export class RoomManager {
    private rooms: Map<string, Room>;
    constructor() {
        this.rooms = new Map<string, Room>();
    }

    createRoom(user1: User, user2: User) {
        const roomId = this.generate().toString();
        this.rooms.set(roomId, { user1, user2, roomId });

        user1?.socket.emit("send-offer", {
            roomId
        });
    }

    onOffer(roomId: string, sdp: string) {
        const room = this.rooms.get(roomId);
        if(room) {
            room.user2?.socket.emit("offer", {
                sdp
            });
        }
    }

    onAnswer(roomId: string, sdp: string) {
        const room = this.rooms.get(roomId);
        if(room) {
            room.user1?.socket.emit("answer", {
                sdp
            });
        }
    }

    generate() {
        return GLOBAL_ROOM_ID++;
    }
}