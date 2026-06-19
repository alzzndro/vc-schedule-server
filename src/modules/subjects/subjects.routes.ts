import { Router } from "express";
import {
  getAllSubjectsHandler,
  getSubjectByIdHandler,
  createSubjectHandler,
  updateSubjectHandler,
  deleteSubjectHandler,
} from "./subjects.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllSubjectsHandler);
router.get("/:id", getSubjectByIdHandler);

// Admin-only routes
router.post("/", authenticateUser, authorizeRoles("admin"), createSubjectHandler);
router.patch("/:id", authenticateUser, authorizeRoles("admin"), updateSubjectHandler);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteSubjectHandler);

export default router;
