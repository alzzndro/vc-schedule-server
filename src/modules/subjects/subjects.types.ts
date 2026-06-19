export interface Subject {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSubjectInput {
  name: string;
}

export interface UpdateSubjectInput {
  name: string;
}
