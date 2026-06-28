import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from "../controllers/assignmentController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAssignments);
router.post("/", authorizeRoles("admin", "hod", "teacher"), createAssignment);
router.put("/:id", authorizeRoles("admin", "hod", "teacher"), updateAssignment);
router.delete("/:id", authorizeRoles("admin", "hod"), deleteAssignment);

export default router;

