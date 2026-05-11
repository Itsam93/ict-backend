import express from "express";
import {
  createEnrollment,
  getEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
} from "../controllers/enrollmentController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.post("/", createEnrollment);

/* ADMIN ONLY */
router.get("/", protectAdmin, adminOnly, getEnrollments);
router.put("/:id", protectAdmin, adminOnly, updateEnrollmentStatus);
router.delete("/:id", protectAdmin, adminOnly, deleteEnrollment);

export default router;