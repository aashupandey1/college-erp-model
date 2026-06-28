import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/accountController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getTransactions);
router.post("/", authorizeRoles("admin", "accountant", "hod"), createTransaction);
router.put("/:id", authorizeRoles("admin", "accountant"), updateTransaction);
router.delete("/:id", authorizeRoles("admin", "accountant"), deleteTransaction);

export default router;
