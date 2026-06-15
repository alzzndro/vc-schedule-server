import { RoomsService } from "./rooms.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/params.js";
export const getAllRoomsHandler = asyncHandler(async (req, res) => {
    const rooms = await RoomsService.getAllRooms();
    res.status(200).json(new ApiResponse({
        message: "Rooms fetched successfully",
        data: rooms,
    }));
});
export const getRoomByIdHandler = asyncHandler(async (req, res) => {
    const id = getParam(req.params.id);
    const room = await RoomsService.getRoomById(id);
    res.status(200).json(new ApiResponse({
        message: "Room fetched successfully",
        data: room,
    }));
});
export const createRoomHandler = asyncHandler(async (req, res) => {
    const { name, capacity, type } = req.body;
    const newRoom = await RoomsService.createRoom({ name, capacity, type });
    res.status(201).json(new ApiResponse({
        message: "Room created successfully",
        data: newRoom,
    }));
});
export const updateRoomHandler = asyncHandler(async (req, res) => {
    const id = getParam(req.params.id);
    const { name, capacity, type } = req.body;
    const updatedRoom = await RoomsService.updateRoom(id, { name, capacity, type });
    res.status(200).json(new ApiResponse({
        message: "Room updated successfully",
        data: updatedRoom,
    }));
});
export const deleteRoomHandler = asyncHandler(async (req, res) => {
    const id = getParam(req.params.id);
    await RoomsService.deleteRoom(id);
    res.status(200).json(new ApiResponse({
        message: "Room deleted successfully",
    }));
});
//# sourceMappingURL=rooms.controller.js.map