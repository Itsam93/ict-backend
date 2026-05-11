import express from "express";
import {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getTestimonials);

/* ADMIN ONLY */
router.post("/", protectAdmin, adminOnly, createTestimonial);
router.put("/:id", protectAdmin, adminOnly, updateTestimonial);
router.delete("/:id", protectAdmin, adminOnly, deleteTestimonial);

export default router;