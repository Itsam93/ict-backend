import express from "express";
import {
  registerUser,
  resendVerificationEmail,
  changePassword,
  loginUser,
  verifyUserEmail,
  getUserProfile,
} from "../controllers/authUserController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

// Register new user (signup + email verification sent)
router.post("/register", registerUser);

// Verify email via token
router.get("/verify-email/:token", verifyUserEmail);

router.post("/resend-verification", resendVerificationEmail);

// Login (STRICT: only verified users allowed)
router.post("/login", loginUser);

router.put("/change-password", protect, changePassword);


/* =========================
   PROTECTED ROUTES
========================= */
router.get("/profile", protect, getUserProfile);

export default router;