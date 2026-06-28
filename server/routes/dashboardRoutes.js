import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { getAdminDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.use(protect);

router.get(
  "/admin",
  authorizeRoles("admin"),
  getAdminDashboard
);

export default router;