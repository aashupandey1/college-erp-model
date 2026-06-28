import express from "express";
import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "../controllers/libraryController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getBooks);
router.post("/", authorizeRoles("admin", "hod", "faculty"), createBook);
router.put("/:id", authorizeRoles("admin", "hod", "faculty"), updateBook);
router.delete("/:id", authorizeRoles("admin"), deleteBook);

export default router;
