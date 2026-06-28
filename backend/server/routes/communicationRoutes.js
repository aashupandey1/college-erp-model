import express from "express";
import {
  createNotice,
  deleteNotice,
  getNotices,
  updateNotice,
} from "../controllers/communicationController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotices);
router.post("/", authorizeRoles("admin", "hod"), createNotice);
router.put("/:id", authorizeRoles("admin", "hod"), updateNotice);
router.delete("/:id", authorizeRoles("admin"), deleteNotice);

export default router;
