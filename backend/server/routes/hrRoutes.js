import express from "express";
import {
  createStaffMember,
  deleteStaffMember,
  getStaffMembers,
  updateStaffMember,
} from "../controllers/hrController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getStaffMembers);
router.post("/", authorizeRoles("admin", "hod"), createStaffMember);
router.put("/:id", authorizeRoles("admin", "hod"), updateStaffMember);
router.delete("/:id", authorizeRoles("admin"), deleteStaffMember);

export default router;
