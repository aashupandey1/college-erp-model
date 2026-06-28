import express from "express";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../controllers/studentController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", authorizeRoles("admin", "hod", "accountant"), createStudent);
router.put("/:id", authorizeRoles("admin", "hod"), updateStudent);
router.delete("/:id", authorizeRoles("admin"), deleteStudent);

export default router;
