import { Schedule, CreateScheduleInput, UpdateScheduleInput } from "./schedules.types.js";
export declare class SchedulesRepository {
    static findAll(): Promise<Schedule[]>;
    static findById(id: string): Promise<Schedule | null>;
    static findByRoomId(roomId: string): Promise<Schedule[]>;
    static findOverlapping(roomId: string, dayOfWeek: number, startTime: string, endTime: string, excludeScheduleId?: string | null): Promise<Schedule[]>;
    static create(data: CreateScheduleInput): Promise<Schedule>;
    static update(id: string, data: UpdateScheduleInput): Promise<Schedule | null>;
    static delete(id: string): Promise<boolean>;
}
