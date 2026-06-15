import { Router } from "express";
import { getAllRoomsHandler, getRoomByIdHandler, createRoomHandler, updateRoomHandler, deleteRoomHandler, } from "./rooms.controller.js";
import { authenticateUser, authorizeRoles, } from "../../middleware/auth.middleware.js";
const router = Router();
// Publicly readable endpoints (no token required)
router.get("/", getAllRoomsHandler);
router.get("/:id", getRoomByIdHandler);
// Admin-only write endpoints
router.post("/", authenticateUser, authorizeRoles("admin"), createRoomHandler);
router.patch("/:id", authenticateUser, authorizeRoles("admin"), updateRoomHandler);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteRoomHandler);
export default router;
//# sourceMappingURL=rooms.routes.js.map