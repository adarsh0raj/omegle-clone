import { User } from "./UserManager";

let GLOBAL_ROOM_ID = 1;

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

    // deleteRoom(roomId: string) {
    //     const room = this.rooms.get(roomId);
    //     if(room) {
    //         room.user1?.socket.emit("room-deleted", {
    //             roomId
    //         });
    //         room.user2?.socket.emit("room-deleted", {
    //             roomId
    //         });
    //         this.rooms.delete(roomId);
    //     }
    // }

    onOffer(roomId: string, sdp: string) {
        const room = this.rooms.get(roomId);
        if(room) {
            room.user2?.socket.emit("offer", {
                sdp,
                roomId
            });
        }
    }

    onAnswer(roomId: string, sdp: string) {
        const room = this.rooms.get(roomId);
        if(room) {
            room.user1?.socket.emit("answer", {
                sdp,
                roomId
            });
        }
    }

    generate() {
        return GLOBAL_ROOM_ID++;
    }
}