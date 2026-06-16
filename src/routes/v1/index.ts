import { Router } from "express";
import authRoutes from "../../modules/auth/auth.routes.js";
import userRoutes from "../../modules/users/users.routes.js";
import roomsRoutes from "../../modules/rooms/rooms.routes.js";
import schedulesRoutes from "../../modules/schedules/schedules.routes.js";
import sectionsRoutes from "../../modules/sections/sections.routes.js";

const router = Router();

/**
 * AUTHENTICATION PATHWAYS
 * Accessible under: /api/v1/auth/*
 */
router.use("/auth", authRoutes);

/**
 * USER MANAGEMENT PATHWAYS
 * Accessible under: /api/v1/users/*
 */
router.use("/users", userRoutes);

/**
 * ROOMS PATHWAYS
 * Accessible under: /api/v1/rooms/*
 */
router.use("/rooms", roomsRoutes);

/**
 * SCHEDULES PATHWAYS
 * Accessible under: /api/v1/schedules/*
 */
router.use("/schedules", schedulesRoutes);

/**
 * SECTIONS PATHWAYS
 * Accessible under: /api/v1/sections/*
 */
router.use("/sections", sectionsRoutes);

export default router;
