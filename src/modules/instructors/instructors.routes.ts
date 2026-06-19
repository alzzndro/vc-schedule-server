import { Router } from "express";
import {
  getAllInstructorsHandler,
  getInstructorByIdHandler,
  createInstructorHandler,
  updateInstructorHandler,
  deleteInstructorHandler,
} from "./instructors.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllInstructorsHandler);
router.get("/:id", getInstructorByIdHandler);

// Admin-only routes
router.post("/", authenticateUser, authorizeRoles("admin"), createInstructorHandler);
router.patch("/:id", authenticateUser, authorizeRoles("admin"), updateInstructorHandler);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteInstructorHandler);

export default router;
