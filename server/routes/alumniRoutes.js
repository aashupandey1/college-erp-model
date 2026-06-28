import express from "express";
import {
  createAlumni,
  deleteAlumni,
  getAlumni,
  updateAlumni,
} from "../controllers/alumniController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAlumni);
router.post("/", authorizeRoles("admin", "hod"), createAlumni);
router.put("/:id", authorizeRoles("admin", "hod"), updateAlumni);
router.delete("/:id", authorizeRoles("admin"), deleteAlumni);

export default router;
