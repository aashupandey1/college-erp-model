import express from "express";
import {
  createTimetable,
  deleteTimetable,
  getTimetables,
  updateTimetable,
} from "../controllers/timetableController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getTimetables);
router.post("/", authorizeRoles("admin", "hod"), createTimetable);
router.put("/:id", authorizeRoles("admin", "hod"), updateTimetable);
router.delete("/:id", authorizeRoles("admin"), deleteTimetable);

export default router;

