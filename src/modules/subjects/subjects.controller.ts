import { Request, Response } from "express";
import { SubjectsService } from "./subjects.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/params.js";

export const getAllSubjectsHandler = asyncHandler(async (req: Request, res: Response) => {
  const subjects = await SubjectsService.getAllSubjects();
  res.status(200).json(
    new ApiResponse({
      message: "Subjects fetched successfully",
      data: subjects,
    })
  );
});

export const getSubjectByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const subject = await SubjectsService.getSubjectById(id);
  res.status(200).json(
    new ApiResponse({
      message: "Subject fetched successfully",
      data: subject,
    })
  );
});

export const createSubjectHandler = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const newSubject = await SubjectsService.createSubject({ name });
  res.status(201).json(
    new ApiResponse({
      message: "Subject created successfully",
      data: newSubject,
    })
  );
});

export const updateSubjectHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const { name } = req.body;
  const updatedSubject = await SubjectsService.updateSubject(id, { name });
  res.status(200).json(
    new ApiResponse({
      message: "Subject updated successfully",
      data: updatedSubject,
    })
  );
});

export const deleteSubjectHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  await SubjectsService.deleteSubject(id);
  res.status(200).json(
    new ApiResponse({
      message: "Subject deleted successfully",
    })
  );
});
