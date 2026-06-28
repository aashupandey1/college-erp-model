import express from "express";
import {
  createGrievance,
  deleteGrievance,
  getGrievances,
  updateGrievance,
} from "../controllers/grievanceController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getGrievances);
router.post("/", authorizeRoles("admin", "hod", "accountant"), createGrievance);
router.put("/:id", authorizeRoles("admin", "hod"), updateGrievance);
router.delete("/:id", authorizeRoles("admin"), deleteGrievance);

export default router;
