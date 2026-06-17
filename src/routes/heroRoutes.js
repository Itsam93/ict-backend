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

router.get("/", getHeroContents);

router.get("/:id", getSingleHeroContent);

router.post("/", protect, adminOnly, createHeroContent);

router.put("/:id", protect, adminOnly, updateHeroContent);

router.delete("/:id", protect, adminOnly, deleteHeroContent);

export default router;