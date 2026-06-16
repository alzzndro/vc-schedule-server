export interface Section {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSectionInput {
  name: string;
}

export interface UpdateSectionInput {
  name: string;
}
