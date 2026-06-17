import express from "express";
import {
  registerUser,
  resendVerificationEmail,
  changePassword,
  loginUser,
  verifyUserEmail,
  getUserProfile,
  googleAuth, 
} from "../controllers/authUserController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/google", googleAuth);

router.get("/verify-email/:token", verifyUserEmail);
router.post("/resend-verification", resendVerificationEmail);

router.put("/change-password", protect, changePassword);
router.get("/profile", protect, getUserProfile);

export default router;