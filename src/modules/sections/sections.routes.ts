import { Router } from "express";
import {
  getAllSectionsHandler,
  getSectionByIdHandler,
  createSectionHandler,
  updateSectionHandler,
  deleteSectionHandler,
} from "./sections.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllSectionsHandler);
router.get("/:id", getSectionByIdHandler);

// Admin-only routes
router.post("/", authenticateUser, authorizeRoles("admin"), createSectionHandler);
router.patch("/:id", authenticateUser, authorizeRoles("admin"), updateSectionHandler);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteSectionHandler);

export default router;
