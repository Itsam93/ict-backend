import express from "express";
import {
  trackView,
  markCompleted,
} from "../controllers/resourceAnalyticsController.js";

import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   RESOURCE ANALYTICS ROUTES
   (VIEW + COMPLETION TRACKING)
===================================================== */

/**
 * TRACK RESOURCE VIEW TIME
 * - records time spent
 * - updates last viewed timestamp
 */
router.post("/view", protectUser, trackView);

/**
 * MARK RESOURCE AS COMPLETED
 * - used for learning progress tracking
 */
router.post("/complete", protectUser, markCompleted);

export default router;