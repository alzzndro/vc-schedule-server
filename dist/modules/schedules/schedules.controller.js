import { SchedulesService } from "./schedules.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/params.js";
export const getAllSchedulesHandler = asyncHandler(async (req, res) => {
    const schedules = await SchedulesService.getAllSchedules();
    res.status(200).json(new ApiResponse({
        message: "Schedules fetched successfully",
        data: schedules,
    }));
});
export const getScheduleByIdHandler = asyncHandler(async (req, res) => {
    const id = getParam(req.params.id);
    const schedule = await SchedulesService.getScheduleById(id);
    res.status(200).json(new ApiResponse({
        message: "Schedule fetched successfully",
        data: schedule,
    }));
});
export const getSchedulesByRoomIdHandler = asyncHandler(async (req, res) => {
    const roomId = getParam(req.params.roomId);
    const schedules = await SchedulesService.getSchedulesByRoomId(roomId);
    res.status(200).json(new ApiResponse({
        message: "Schedules for room fetched successfully",
        data: schedules,
    }));
});
export const createScheduleHandler = asyncHandler(async (req, res) => {
    const { room_id, subject, teacher, day_of_week, start_time, end_time } = req.body;
    // Attach current authenticated user id as creator if available
    const created_by = req.user?.userId;
    const newSchedule = await SchedulesService.createSchedule({
        room_id,
        subject,
        teacher,
        day_of_week,
        start_time,
        end_time,
        created_by,
    });
    res.status(201).json(new ApiResponse({
        message: "Schedule created successfully",
        data: newSchedule,
    }));
});
export const updateScheduleHandler = asyncHandler(async (req, res) => {
    const id = getParam(req.params.id);
    const { room_id, subject, teacher, day_of_week, start_time, end_time } = req.body;
    const updatedSchedule = await SchedulesService.updateSchedule(id, {
        room_id,
        subject,
        teacher,
        day_of_week,
        start_time,
        end_time,
    });
    res.status(200).json(new ApiResponse({
        message: "Schedule updated successfully",
        data: updatedSchedule,
    }));
});
export const deleteScheduleHandler = asyncHandler(async (req, res) => {
    const id = getParam(req.params.id);
    await SchedulesService.deleteSchedule(id);
    res.status(200).json(new ApiResponse({
        message: "Schedule deleted successfully",
    }));
});
//# sourceMappingURL=schedules.controller.js.map