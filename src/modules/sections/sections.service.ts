import { SectionsRepository } from "./sections.repository.js";
import { CreateSectionInput, UpdateSectionInput } from "./sections.types.js";
import { ApiError, notFound } from "../../utils/errors.js";

export class SectionsService {
  static async getAllSections() {
    return SectionsRepository.findAll();
  }

  static async getSectionById(id: string) {
    const section = await SectionsRepository.findById(id);
    if (!section) {
      throw notFound("Class section not found");
    }
    return section;
  }

  static async createSection(data: CreateSectionInput) {
    if (!data.name || data.name.trim() === "") {
      throw new ApiError("Class section name is required", 400);
    }

    const existingSection = await SectionsRepository.findByName(data.name.trim());
    if (existingSection) {
      throw new ApiError(`Class section with name '${data.name}' already exists`, 400);
    }

    return SectionsRepository.create({
      name: data.name.trim(),
    });
  }

  static async updateSection(id: string, data: UpdateSectionInput) {
    // Check if section exists
    const existing = await this.getSectionById(id);

    if (existing.name === "Default Section") {
      throw new ApiError("Cannot edit the Default Section", 400);
    }

    if (!data.name || data.name.trim() === "") {
      throw new ApiError("Class section name cannot be empty", 400);
    }

    const existingSection = await SectionsRepository.findByName(data.name.trim());
    if (existingSection && existingSection.id !== id) {
      throw new ApiError(`Class section with name '${data.name}' already exists`, 400);
    }

    const updated = await SectionsRepository.update(id, {
      name: data.name.trim(),
    });
    
    if (!updated) {
      throw notFound("Class section not found for updating");
    }
    return updated;
  }

  static async deleteSection(id: string) {
    const section = await this.getSectionById(id);
    if (section.name === "Default Section") {
      throw new ApiError("Cannot delete the Default Section", 400);
    }
    return SectionsRepository.delete(id);
  }
}
