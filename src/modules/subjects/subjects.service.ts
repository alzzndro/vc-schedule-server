import { SubjectsRepository } from "./subjects.repository.js";
import { CreateSubjectInput, UpdateSubjectInput } from "./subjects.types.js";
import { ApiError, notFound } from "../../utils/errors.js";

export class SubjectsService {
  static async getAllSubjects() {
    return SubjectsRepository.findAll();
  }

  static async getSubjectById(id: string) {
    const subject = await SubjectsRepository.findById(id);
    if (!subject) {
      throw notFound("Subject not found");
    }
    return subject;
  }

  static async createSubject(data: CreateSubjectInput) {
    if (!data.name || data.name.trim() === "") {
      throw new ApiError("Subject name is required", 400);
    }

    const existingSubject = await SubjectsRepository.findByName(data.name.trim());
    if (existingSubject) {
      throw new ApiError(`Subject with name '${data.name}' already exists`, 400);
    }

    return SubjectsRepository.create({
      name: data.name.trim(),
    });
  }

  static async updateSubject(id: string, data: UpdateSubjectInput) {
    // Check if subject exists
    const existing = await this.getSubjectById(id);

    if (existing.name === "Default Subject") {
      throw new ApiError("Cannot edit the Default Subject", 400);
    }

    if (!data.name || data.name.trim() === "") {
      throw new ApiError("Subject name cannot be empty", 400);
    }

    const existingSubject = await SubjectsRepository.findByName(data.name.trim());
    if (existingSubject && existingSubject.id !== id) {
      throw new ApiError(`Subject with name '${data.name}' already exists`, 400);
    }

    const updated = await SubjectsRepository.update(id, {
      name: data.name.trim(),
    });
    
    if (!updated) {
      throw notFound("Subject not found for updating");
    }
    return updated;
  }

  static async deleteSubject(id: string) {
    const subject = await this.getSubjectById(id);
    if (subject.name === "Default Subject") {
      throw new ApiError("Cannot delete the Default Subject", 400);
    }
    return SubjectsRepository.delete(id);
  }
}
