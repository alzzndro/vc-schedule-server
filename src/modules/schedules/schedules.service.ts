import { SchedulesRepository } from "./schedules.repository.js";
import { CreateScheduleInput, UpdateScheduleInput } from "./schedules.types.js";
import { RoomsService } from "../rooms/rooms.service.js";
import { SectionsService } from "../sections/sections.service.js";
import { ApiError, notFound } from "../../utils/errors.js";

// Utility to convert time string (HH:MM or HH:MM:SS) to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
  const parts = timeStr.split(":");
  if (parts.length < 2) {
    throw new ApiError(`Invalid time format: ${timeStr}. Expected HH:MM or HH:MM:SS`, 400);
  }
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new ApiError(`Invalid time values: ${timeStr}`, 400);
  }
  return hours * 60 + minutes;
};

// Helper to format TIME string (e.g. "08:00:00") to human readable form (e.g. "08:00")
const formatTimeStr = (t: string) => t.substring(0, 5);

export class SchedulesService {
  static async getAllSchedules() {
    return SchedulesRepository.findAll();
  }

  static async getScheduleById(id: string) {
    const schedule = await SchedulesRepository.findById(id);
    if (!schedule) {
      throw notFound("Schedule not found");
    }
    return schedule;
  }

  static async getSchedulesByRoomId(roomId: string) {
    // Verify room exists
    await RoomsService.getRoomById(roomId);
    return SchedulesRepository.findByRoomId(roomId);
  }

  static async createSchedule(data: CreateScheduleInput) {
    const { room_id, section_id, subject, teacher, day_of_week, start_time, end_time } = data;

    // 1. Verify classroom and section exist
    const room = await RoomsService.getRoomById(room_id);
    const section = await SectionsService.getSectionById(section_id);

    // 2. Validate day of week (1=Mon, 6=Sat)
    if (day_of_week < 1 || day_of_week > 6) {
      throw new ApiError("Schedules can only be set from Monday to Saturday (1 to 6)", 400);
    }

    // 3. Validate times are within 7:00 AM to 9:00 PM
    const startMins = timeToMinutes(start_time);
    const endMins = timeToMinutes(end_time);
    const minMins = 7 * 60; // 07:00 AM = 420 mins
    const maxMins = 21 * 60; // 09:00 PM = 1260 mins

    if (startMins < minMins || startMins > maxMins) {
      throw new ApiError("Schedules start time must be between 7:00 AM and 9:00 PM", 400);
    }

    if (endMins < minMins || endMins > maxMins) {
      throw new ApiError("Schedules end time must be between 7:00 AM and 9:00 PM", 400);
    }

    if (startMins >= endMins) {
      throw new ApiError("Schedule start time must be before end time", 400);
    }

    // 4. Conflict detection: Check for overlapping schedules in the same room OR same section on the same day
    const conflicts = await SchedulesRepository.findOverlapping(
      room_id,
      day_of_week,
      start_time,
      end_time,
      null,
      section_id
    );

    if (conflicts.length > 0) {
      for (const conflict of conflicts) {
        if (conflict.room_id === room_id) {
          throw new ApiError(
            `Schedule conflict: Classroom '${room.name}' is already booked for '${conflict.subject}' (${formatTimeStr(conflict.start_time)} - ${formatTimeStr(conflict.end_time)}) by teacher '${conflict.teacher}'`,
            400
          );
        }
        if (conflict.section_id === section_id) {
          throw new ApiError(
            `Section conflict: Section '${section.name}' is already booked in ${conflict.room_name} for '${conflict.subject}' (${formatTimeStr(conflict.start_time)} - ${formatTimeStr(conflict.end_time)})`,
            400
          );
        }
      }
    }

    return SchedulesRepository.create(data);
  }

  static async updateSchedule(id: string, data: UpdateScheduleInput) {
    // 1. Verify schedule exists
    const existingSchedule = await this.getScheduleById(id);

    // Determine final values after update
    const finalRoomId = data.room_id !== undefined ? data.room_id : existingSchedule.room_id;
    const finalSectionId = data.section_id !== undefined ? data.section_id : existingSchedule.section_id;
    const finalDayOfWeek = data.day_of_week !== undefined ? data.day_of_week : existingSchedule.day_of_week;
    const finalStartTime = data.start_time !== undefined ? data.start_time : existingSchedule.start_time;
    const finalEndTime = data.end_time !== undefined ? data.end_time : existingSchedule.end_time;

    // Validate room if changed
    let roomName = existingSchedule.room_name;
    if (data.room_id !== undefined && data.room_id !== existingSchedule.room_id) {
      const room = await RoomsService.getRoomById(data.room_id);
      roomName = room.name;
    }

    // Validate section if changed
    let sectionName = existingSchedule.section_name;
    if (data.section_id !== undefined && data.section_id !== existingSchedule.section_id) {
      const section = await SectionsService.getSectionById(data.section_id);
      sectionName = section.name;
    }

    // Validate day of week
    if (finalDayOfWeek < 1 || finalDayOfWeek > 6) {
      throw new ApiError("Schedules can only be set from Monday to Saturday (1 to 6)", 400);
    }

    // Validate times
    const startMins = timeToMinutes(finalStartTime);
    const endMins = timeToMinutes(finalEndTime);
    const minMins = 7 * 60;
    const maxMins = 21 * 60;

    if (startMins < minMins || startMins > maxMins) {
      throw new ApiError("Schedules start time must be between 7:00 AM and 9:00 PM", 400);
    }

    if (endMins < minMins || endMins > maxMins) {
      throw new ApiError("Schedules end time must be between 7:00 AM and 9:00 PM", 400);
    }

    if (startMins >= endMins) {
      throw new ApiError("Schedule start time must be before end time", 400);
    }

    // Conflict detection (excluding current schedule)
    const conflicts = await SchedulesRepository.findOverlapping(
      finalRoomId,
      finalDayOfWeek,
      finalStartTime,
      finalEndTime,
      id,
      finalSectionId
    );

    if (conflicts.length > 0) {
      for (const conflict of conflicts) {
        if (conflict.room_id === finalRoomId) {
          throw new ApiError(
            `Schedule conflict: Classroom '${roomName}' is already booked for '${conflict.subject}' (${formatTimeStr(conflict.start_time)} - ${formatTimeStr(conflict.end_time)}) by teacher '${conflict.teacher}'`,
            400
          );
        }
        if (conflict.section_id === finalSectionId) {
          throw new ApiError(
            `Section conflict: Section '${sectionName}' is already booked in ${conflict.room_name} for '${conflict.subject}' (${formatTimeStr(conflict.start_time)} - ${formatTimeStr(conflict.end_time)})`,
            400
          );
        }
      }
    }

    const updated = await SchedulesRepository.update(id, data);
    if (!updated) {
      throw notFound("Schedule not found for updating");
    }
    return updated;
  }

  static async deleteSchedule(id: string) {
    await this.getScheduleById(id);
    return SchedulesRepository.delete(id);
  }
}
