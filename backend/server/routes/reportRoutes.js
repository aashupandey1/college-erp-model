import express from "express";
import {
  createReport,
  deleteReport,
  getReports,
  updateReport,
} from "../controllers/reportController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getReports);
router.post("/", authorizeRoles("admin", "hod", "accountant"), createReport);
router.put("/:id", authorizeRoles("admin", "hod"), updateReport);
router.delete("/:id", authorizeRoles("admin"), deleteReport);

export default router;
