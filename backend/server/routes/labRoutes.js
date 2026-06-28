import express from "express";
import {
  createLab,
  deleteLab,
  getLabs,
  updateLab,
} from "../controllers/labController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getLabs);
router.post("/", authorizeRoles("admin", "hod"), createLab);
router.put("/:id", authorizeRoles("admin", "hod"), updateLab);
router.delete("/:id", authorizeRoles("admin"), deleteLab);

export default router;

