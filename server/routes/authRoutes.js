import express from "express";
import { getCurrentUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

export default router;
