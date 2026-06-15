import { RoomsRepository } from "./rooms.repository.js";
import { ApiError, notFound } from "../../utils/errors.js";
export class RoomsService {
    static async getAllRooms() {
        return RoomsRepository.findAll();
    }
    static async getRoomById(id) {
        const room = await RoomsRepository.findById(id);
        if (!room) {
            throw notFound("Classroom not found");
        }
        return room;
    }
    static async createRoom(data) {
        if (!data.name || data.name.trim() === "") {
            throw new ApiError("Classroom name is required", 400);
        }
        const existingRoom = await RoomsRepository.findByName(data.name.trim());
        if (existingRoom) {
            throw new ApiError(`Classroom with name '${data.name}' already exists`, 400);
        }
        return RoomsRepository.create({
            ...data,
            name: data.name.trim(),
        });
    }
    static async updateRoom(id, data) {
        // Check if room exists
        await this.getRoomById(id);
        if (data.name !== undefined) {
            if (data.name.trim() === "") {
                throw new ApiError("Classroom name cannot be empty", 400);
            }
            const existingRoom = await RoomsRepository.findByName(data.name.trim());
            if (existingRoom && existingRoom.id !== id) {
                throw new ApiError(`Classroom with name '${data.name}' already exists`, 400);
            }
            data.name = data.name.trim();
        }
        const updated = await RoomsRepository.update(id, data);
        if (!updated) {
            throw notFound("Classroom not found for updating");
        }
        return updated;
    }
    static async deleteRoom(id) {
        // Check if room exists
        await this.getRoomById(id);
        return RoomsRepository.delete(id);
    }
}
//# sourceMappingURL=rooms.service.js.map