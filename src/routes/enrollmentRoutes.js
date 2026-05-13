import express from "express";
import {
  createEnrollment,
  getEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
} from "../controllers/enrollmentController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.post("/", createEnrollment);

/* ADMIN ONLY */
router.get("/", protect, adminOnly, getEnrollments);
router.put("/:id", protect, adminOnly, updateEnrollmentStatus);
router.delete("/:id", protect, adminOnly, deleteEnrollment);

export default router;