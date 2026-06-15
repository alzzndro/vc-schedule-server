import { CreateRoomInput, UpdateRoomInput } from "./rooms.types.js";
export declare class RoomsService {
    static getAllRooms(): Promise<import("./rooms.types.js").Room[]>;
    static getRoomById(id: string): Promise<import("./rooms.types.js").Room>;
    static createRoom(data: CreateRoomInput): Promise<import("./rooms.types.js").Room>;
    static updateRoom(id: string, data: UpdateRoomInput): Promise<import("./rooms.types.js").Room>;
    static deleteRoom(id: string): Promise<boolean>;
}
