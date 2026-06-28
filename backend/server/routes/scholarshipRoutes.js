import express from "express";
import {
  createScholarshipApplication,
  deleteScholarshipApplication,
  getScholarshipApplications,
  updateScholarshipApplication,
} from "../controllers/scholarshipController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getScholarshipApplications);
router.post("/", authorizeRoles("admin", "hod", "accountant"), createScholarshipApplication);
router.put("/:id", authorizeRoles("admin", "hod"), updateScholarshipApplication);
router.delete("/:id", authorizeRoles("admin"), deleteScholarshipApplication);

export default router;
