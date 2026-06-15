import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getMe,
  updateMyPassword,
  updateMyProfile,
} from "./users.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = Router();

// Apply token validation globally to ALL routes inside this user module
router.use(authenticateUser);

// GET ALL USERS - admin
router.get("/", authorizeRoles("admin"), getAllUsers);

// GET ME - *
router.get(
  "/me",
  authorizeRoles("admin", "student", "staff", "faculty"),
  getMe,
); // Fetch current authenticated user profile

// GET ME - admin, staff, faculty
router.get("/:id", authorizeRoles("admin", "staff", "faculty"), getUserById); // Fetch specific user by ID

// Profile Modification Pathways
router.patch(
  "/me/profile",
  authorizeRoles("admin", "student", "staff", "faculty"),
  updateMyProfile,
);

router.patch(
  "/me/password",
  authorizeRoles("admin", "student", "staff", "faculty"),
  updateMyPassword,
);

export default router;
