import express from "express";
import {
  createHeroContent,
  getHeroContents,
  getSingleHeroContent,
  updateHeroContent,
  deleteHeroContent,
} from "../controllers/heroController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */

/* Get all heroes */
router.get("/", getHeroContents);

/* Get single hero (optional but useful) */
router.get("/:id", getSingleHeroContent);

/* ================= ADMIN ================= */

/* Create new hero */
router.post("/", protectAdmin, adminOnly, createHeroContent);

/* Update hero */
router.put("/:id", protectAdmin, adminOnly, updateHeroContent);

/* Delete hero */
router.delete("/:id", protectAdmin, adminOnly, deleteHeroContent);

export default router;