import express from "express";
import {
  createExam,
  deleteExam,
  getExams,
  updateExam,
} from "../controllers/examController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getExams);
router.post("/", authorizeRoles("admin", "hod", "faculty"), createExam);
router.put("/:id", authorizeRoles("admin", "hod", "faculty"), updateExam);
router.delete("/:id", authorizeRoles("admin", "hod"), deleteExam);

export default router;
