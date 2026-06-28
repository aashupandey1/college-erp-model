import express from "express";
import {
  createResearchProject,
  deleteResearchProject,
  getResearchProjects,
  updateResearchProject,
} from "../controllers/researchController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getResearchProjects);
router.post("/", authorizeRoles("admin", "hod"), createResearchProject);
router.put("/:id", authorizeRoles("admin", "hod"), updateResearchProject);
router.delete("/:id", authorizeRoles("admin"), deleteResearchProject);

export default router;
