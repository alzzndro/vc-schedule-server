export interface Instructor {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateInstructorInput {
  name: string;
}

export interface UpdateInstructorInput {
  name: string;
}
