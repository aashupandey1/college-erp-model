import express from "express";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from "../controllers/hostelController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getRooms);
router.post("/", authorizeRoles("admin", "hod", "accountant"), createRoom);
router.put("/:id", authorizeRoles("admin", "hod"), updateRoom);
router.delete("/:id", authorizeRoles("admin"), deleteRoom);

export default router;
