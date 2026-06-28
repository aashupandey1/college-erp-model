import express from "express";
import {
  createAttendance,
  deleteAttendance,
  getAttendance,
  updateAttendance,
} from "../controllers/attendanceController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAttendance);
router.post("/", authorizeRoles("admin", "hod", "faculty"), createAttendance);
router.put("/:id", authorizeRoles("admin", "hod", "faculty"), updateAttendance);
router.delete("/:id", authorizeRoles("admin", "hod"), deleteAttendance);

export default router;
