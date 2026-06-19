import { Request, Response } from "express";
import { InstructorsService } from "./instructors.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/params.js";

export const getAllInstructorsHandler = asyncHandler(async (req: Request, res: Response) => {
  const instructors = await InstructorsService.getAllInstructors();
  res.status(200).json(
    new ApiResponse({
      message: "Instructors fetched successfully",
      data: instructors,
    })
  );
});

export const getInstructorByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const instructor = await InstructorsService.getInstructorById(id);
  res.status(200).json(
    new ApiResponse({
      message: "Instructor fetched successfully",
      data: instructor,
    })
  );
});

export const createInstructorHandler = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const newInstructor = await InstructorsService.createInstructor({ name });
  res.status(201).json(
    new ApiResponse({
      message: "Instructor created successfully",
      data: newInstructor,
    })
  );
});

export const updateInstructorHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const { name } = req.body;
  const updatedInstructor = await InstructorsService.updateInstructor(id, { name });
  res.status(200).json(
    new ApiResponse({
      message: "Instructor updated successfully",
      data: updatedInstructor,
    })
  );
});

export const deleteInstructorHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  await InstructorsService.deleteInstructor(id);
  res.status(200).json(
    new ApiResponse({
      message: "Instructor deleted successfully",
    })
  );
});
