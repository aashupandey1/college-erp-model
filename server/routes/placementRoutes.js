import express from "express";
import {
  createPlacementDrive,
  deletePlacementDrive,
  getPlacementDrives,
  updatePlacementDrive,
} from "../controllers/placementController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getPlacementDrives);
router.post("/", authorizeRoles("admin", "hod", "accountant"), createPlacementDrive);
router.put("/:id", authorizeRoles("admin", "hod"), updatePlacementDrive);
router.delete("/:id", authorizeRoles("admin"), deletePlacementDrive);

export default router;
