import express from "express";
import {
  createHeroContent,
  getHeroContents,
  getSingleHeroContent,
  updateHeroContent,
  deleteHeroContent,
} from "../controllers/heroController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */

/* Get all heroes */
router.get("/", getHeroContents);

/* Get single hero (optional but useful) */
router.get("/:id", getSingleHeroContent);

/* ================= ADMIN ================= */

/* Create new hero */
router.post("/", protect, adminOnly, createHeroContent);

/* Update hero */
router.put("/:id", protect, adminOnly, updateHeroContent);

/* Delete hero */
router.delete("/:id", protect, adminOnly, deleteHeroContent);

export default router;