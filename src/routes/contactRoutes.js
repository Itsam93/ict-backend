import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  replyToMessage,
  handleNewsletterSubscribe, 
} from "../controllers/contactController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", sendMessage);

router.post("/subscribe", handleNewsletterSubscribe); 


router.get("/", protect, adminOnly, getMessages);

router.put("/:id/read", protect, adminOnly, markAsRead);

router.delete("/:id", protect, adminOnly, deleteMessage);

router.post("/reply", protect, adminOnly, replyToMessage);

export default router;