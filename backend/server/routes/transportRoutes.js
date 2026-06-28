import express from "express";
import {
  createTransportRoute,
  deleteTransportRoute,
  getTransportRoutes,
  updateTransportRoute,
} from "../controllers/transportController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getTransportRoutes);
router.post("/", authorizeRoles("admin", "hod", "accountant"), createTransportRoute);
router.put("/:id", authorizeRoles("admin", "hod"), updateTransportRoute);
router.delete("/:id", authorizeRoles("admin"), deleteTransportRoute);

export default router;
