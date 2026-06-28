import express from "express";
import {
  createFaculty,
  deleteFaculty,
  getFaculty,
  getFacultyById,
  updateFaculty,
} from "../controllers/facultyController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getFaculty);
router.get("/:id", getFacultyById);
router.post("/", authorizeRoles("admin", "hod"), createFaculty);
router.put("/:id", authorizeRoles("admin", "hod"), updateFaculty);
router.delete("/:id", authorizeRoles("admin"), deleteFaculty);

export default router;
