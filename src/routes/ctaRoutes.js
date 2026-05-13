import express from "express";
import { getCta, updateCta } from "../controllers/ctaController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCta);
router.put("/", protect, adminOnly, updateCta);

export default router;