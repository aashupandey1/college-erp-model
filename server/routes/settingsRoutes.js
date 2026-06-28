import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getSettings);
router.put("/", authorizeRoles("admin"), updateSettings);

export default router;
