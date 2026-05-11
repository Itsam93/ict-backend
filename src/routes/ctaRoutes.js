import express from "express";
import { getCta, updateCta } from "../controllers/ctaController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getCta);
router.put("/", protectAdmin, adminOnly, updateCta);

export default router;