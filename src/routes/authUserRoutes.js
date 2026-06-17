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

router.post("/register", registerUser);

router.get("/verify-email/:token", verifyUserEmail);

router.post("/resend-verification", resendVerificationEmail);

router.post("/login", loginUser);

router.put("/change-password", protect, changePassword);


router.get("/profile", protect, getUserProfile);

export default router;