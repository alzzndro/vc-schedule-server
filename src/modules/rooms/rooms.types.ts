export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRoomInput {
  name: string;
  capacity?: number;
  type?: string;
}

export interface UpdateRoomInput {
  name?: string;
  capacity?: number;
  type?: string;
}
