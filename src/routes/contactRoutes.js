import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  replyToMessage,
} from "../controllers/contactController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTE
========================= */
router.post("/", sendMessage);

/* =========================
   ADMIN ROUTES
========================= */
router.get("/", protect, adminOnly, getMessages);

router.put("/:id/read", protect, adminOnly, markAsRead);

router.delete("/:id", protect, adminOnly, deleteMessage);

router.post("/reply", protect, adminOnly, replyToMessage);

export default router;