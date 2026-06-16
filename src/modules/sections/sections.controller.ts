import { Request, Response } from "express";
import { SectionsService } from "./sections.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/params.js";

export const getAllSectionsHandler = asyncHandler(async (req: Request, res: Response) => {
  const sections = await SectionsService.getAllSections();
  res.status(200).json(
    new ApiResponse({
      message: "Sections fetched successfully",
      data: sections,
    })
  );
});

export const getSectionByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const section = await SectionsService.getSectionById(id);
  res.status(200).json(
    new ApiResponse({
      message: "Section fetched successfully",
      data: section,
    })
  );
});

export const createSectionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const newSection = await SectionsService.createSection({ name });
  res.status(201).json(
    new ApiResponse({
      message: "Section created successfully",
      data: newSection,
    })
  );
});

export const updateSectionHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const { name } = req.body;
  const updatedSection = await SectionsService.updateSection(id, { name });
  res.status(200).json(
    new ApiResponse({
      message: "Section updated successfully",
      data: updatedSection,
    })
  );
});

export const deleteSectionHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  await SectionsService.deleteSection(id);
  res.status(200).json(
    new ApiResponse({
      message: "Section deleted successfully",
    })
  );
});
