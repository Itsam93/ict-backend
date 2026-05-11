import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  replyToMessage,
} from "../controllers/contactController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTE
========================= */
router.post("/", sendMessage);

/* =========================
   ADMIN ROUTES
========================= */
router.get("/", protectAdmin, adminOnly, getMessages);

router.put("/:id/read", protectAdmin, adminOnly, markAsRead);

router.delete("/:id", protectAdmin, adminOnly, deleteMessage);

router.post("/reply", protectAdmin, adminOnly, replyToMessage);

export default router;