import { Router } from "express";
import { getAllSchedulesHandler, getScheduleByIdHandler, getSchedulesByRoomIdHandler, createScheduleHandler, updateScheduleHandler, deleteScheduleHandler, } from "./schedules.controller.js";
import { authenticateUser, authorizeRoles, } from "../../middleware/auth.middleware.js";
const router = Router();
// Publicly readable endpoints (no token required)
router.get("/", getAllSchedulesHandler);
router.get("/room/:roomId", getSchedulesByRoomIdHandler);
router.get("/:id", getScheduleByIdHandler);
// Admin-only write endpoints
router.post("/", authenticateUser, authorizeRoles("admin"), createScheduleHandler);
router.patch("/:id", authenticateUser, authorizeRoles("admin"), updateScheduleHandler);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteScheduleHandler);
export default router;
//# sourceMappingURL=schedules.routes.js.map