export interface Schedule {
    id: string;
    room_id: string;
    room_name?: string;
    subject: string;
    teacher: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    created_by?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateScheduleInput {
    room_id: string;
    subject: string;
    teacher: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    created_by?: string;
}
export interface UpdateScheduleInput {
    room_id?: string;
    subject?: string;
    teacher?: string;
    day_of_week?: number;
    start_time?: string;
    end_time?: string;
}
