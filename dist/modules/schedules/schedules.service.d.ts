import { CreateScheduleInput, UpdateScheduleInput } from "./schedules.types.js";
export declare class SchedulesService {
    static getAllSchedules(): Promise<import("./schedules.types.js").Schedule[]>;
    static getScheduleById(id: string): Promise<import("./schedules.types.js").Schedule>;
    static getSchedulesByRoomId(roomId: string): Promise<import("./schedules.types.js").Schedule[]>;
    static createSchedule(data: CreateScheduleInput): Promise<import("./schedules.types.js").Schedule>;
    static updateSchedule(id: string, data: UpdateScheduleInput): Promise<import("./schedules.types.js").Schedule>;
    static deleteSchedule(id: string): Promise<boolean>;
}
