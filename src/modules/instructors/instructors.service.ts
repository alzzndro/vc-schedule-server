import { InstructorsRepository } from "./instructors.repository.js";
import { CreateInstructorInput, UpdateInstructorInput } from "./instructors.types.js";
import { ApiError, notFound } from "../../utils/errors.js";

export class InstructorsService {
  static async getAllInstructors() {
    return InstructorsRepository.findAll();
  }

  static async getInstructorById(id: string) {
    const instructor = await InstructorsRepository.findById(id);
    if (!instructor) {
      throw notFound("Instructor not found");
    }
    return instructor;
  }

  static async createInstructor(data: CreateInstructorInput) {
    if (!data.name || data.name.trim() === "") {
      throw new ApiError("Instructor name is required", 400);
    }

    const existingInstructor = await InstructorsRepository.findByName(data.name.trim());
    if (existingInstructor) {
      throw new ApiError(`Instructor with name '${data.name}' already exists`, 400);
    }

    return InstructorsRepository.create({
      name: data.name.trim(),
    });
  }

  static async updateInstructor(id: string, data: UpdateInstructorInput) {
    // Check if instructor exists
    const existing = await this.getInstructorById(id);

    if (existing.name === "Default Instructor") {
      throw new ApiError("Cannot edit the Default Instructor", 400);
    }

    if (!data.name || data.name.trim() === "") {
      throw new ApiError("Instructor name cannot be empty", 400);
    }

    const existingInstructor = await InstructorsRepository.findByName(data.name.trim());
    if (existingInstructor && existingInstructor.id !== id) {
      throw new ApiError(`Instructor with name '${data.name}' already exists`, 400);
    }

    const updated = await InstructorsRepository.update(id, {
      name: data.name.trim(),
    });
    
    if (!updated) {
      throw notFound("Instructor not found for updating");
    }
    return updated;
  }

  static async deleteInstructor(id: string) {
    const instructor = await this.getInstructorById(id);
    if (instructor.name === "Default Instructor") {
      throw new ApiError("Cannot delete the Default Instructor", 400);
    }
    return InstructorsRepository.delete(id);
  }
}
