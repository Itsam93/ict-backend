import express from "express";

import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getMyCourses,
} from "../controllers/courseController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/", getCourses);

/* ================= USER ================= */
router.get("/my-courses", protect, getMyCourses);

/* ================= SINGLE COURSE ================= */
router.get("/:id", getCourseById);

/* ================= ADMIN ================= */
router.post("/", protect, adminOnly, createCourse);

router.put("/:id", protect, adminOnly, updateCourse);

router.delete("/:id", protect, adminOnly, deleteCourse);

export default router;