export interface Schedule {
  id: string;
  room_id: string;
  room_name?: string; // Opt joined room name
  section_id: string;
  section_name?: string; // Opt joined section name
  subject: string;
  teacher: string;
  day_of_week: number; // 1 = Monday, 6 = Saturday
  start_time: string; // TIME format e.g., '08:00:00'
  end_time: string; // TIME format e.g., '10:00:00'
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateScheduleInput {
  room_id: string;
  section_id: string;
  subject: string;
  teacher: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_by?: string;
}

export interface UpdateScheduleInput {
  room_id?: string;
  section_id?: string;
  subject?: string;
  teacher?: string;
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
}
