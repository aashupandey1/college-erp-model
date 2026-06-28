import express from "express";
import {
  createFee,
  deleteFee,
  getFees,
  updateFee,
} from "../controllers/feeController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getFees);
router.post("/", authorizeRoles("admin", "accountant", "hod"), createFee);
router.put("/:id", authorizeRoles("admin", "accountant"), updateFee);
router.delete("/:id", authorizeRoles("admin", "accountant"), deleteFee);

export default router;
