import express from "express";
import {
  createBusPass,
  deleteBusPass,
  getBusPasses,
  updateBusPass,
} from "../controllers/busPassController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getBusPasses);
router.post("/", authorizeRoles("admin", "hod", "accountant"), createBusPass);
router.put("/:id", authorizeRoles("admin", "hod", "accountant"), updateBusPass);
router.delete("/:id", authorizeRoles("admin"), deleteBusPass);

export default router;

