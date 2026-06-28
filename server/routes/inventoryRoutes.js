import express from "express";
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
  updateInventoryItem,
} from "../controllers/inventoryController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getInventoryItems);
router.post("/", authorizeRoles("admin", "accountant"), createInventoryItem);
router.put("/:id", authorizeRoles("admin", "accountant"), updateInventoryItem);
router.delete("/:id", authorizeRoles("admin"), deleteInventoryItem);

export default router;
