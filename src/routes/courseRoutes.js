import express from "express";

import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getMyCourses,
} from "../controllers/courseController.js";

import { protectAdmin, protectUser } from "../middleware/authMiddleware.js";

import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/", getCourses);

/* ================= USER ================= */
router.get("/my-courses", protectUser, getMyCourses);

/* ================= SINGLE COURSE ================= */
router.get("/:id", getCourseById);

/* ================= ADMIN ================= */
router.post("/", protectAdmin, adminOnly, createCourse);

router.put("/:id", protectAdmin, adminOnly, updateCourse);

router.delete("/:id", protectAdmin, adminOnly, deleteCourse);

export default router;