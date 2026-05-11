import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/emailService.js";

/* =========================================
   REGISTER USER (SIGNUP + EMAIL VERIFICATION)
========================================= */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    /* ================= HASH PASSWORD ================= */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= EMAIL VERIFICATION TOKEN ================= */
    const verificationToken = crypto.randomBytes(32).toString("hex");

    /* ================= CREATE USER ================= */
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24h
      isEmailVerified: false,
    });

    /* ================= SEND VERIFICATION EMAIL ================= */
    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify Your Account",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome, ${fullName}</h2>
          <p>Click the button below to verify your account:</p>
          <a href="${verifyLink}" 
             style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
             Verify Email
          </a>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error("REGISTER USER ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================
   VERIFY EMAIL (ACTIVATION STEP)
========================================= */
export const verifyUserEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // 🔴 SAFETY FIX: ensure string
    const cleanEmail = typeof email === "string" ? email : email?.email;

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");

    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await sendEmail({
      to: cleanEmail,
      subject: "Resend Email Verification",
      html: `
        <div>
          <h2>Verify your account</h2>
          <a href="${verifyLink}">
            Click here to verify
          </a>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "Verification email resent successfully",
    });

  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   LOGIN USER (STRICT EMAIL VERIFICATION GATE)
========================================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ================= VALIDATION ================= */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* ================= FIND USER ================= */
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ================= BLOCK NON-USER ROLES ================= */
    if (user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    /* ================= EMAIL VERIFICATION ================= */
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    /* ================= PASSWORD CHECK ================= */
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ================= UPDATE LOGIN TIMESTAMP ================= */
    user.lastLoginAt = new Date();
    await user.save();

    /* ================= GENERATE TOKEN ================= */
    const token = generateToken(user._id);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token,
      },
    });

  } catch (error) {
    console.error("LOGIN USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================
   GET CURRENT USER PROFILE (DASHBOARD READY)
========================================= */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};