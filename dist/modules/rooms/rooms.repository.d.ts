import { Room, CreateRoomInput, UpdateRoomInput } from "./rooms.types.js";
export declare class RoomsRepository {
    static findAll(): Promise<Room[]>;
    static findById(id: string): Promise<Room | null>;
    static findByName(name: string): Promise<Room | null>;
    static create(data: CreateRoomInput): Promise<Room>;
    static update(id: string, data: UpdateRoomInput): Promise<Room | null>;
    static delete(id: string): Promise<boolean>;
}
