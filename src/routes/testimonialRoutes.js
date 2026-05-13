import express from "express";
import {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getTestimonials);

/* ADMIN ONLY */
router.post("/", protect, adminOnly, createTestimonial);
router.put("/:id", protect, adminOnly, updateTestimonial);
router.delete("/:id", protect, adminOnly, deleteTestimonial);

export default router;