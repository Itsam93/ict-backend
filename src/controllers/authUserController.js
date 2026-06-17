import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/emailService.js";
import { OAuth2Client } from "google-auth-library"; 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google signature token is missing.",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        isEmailVerified: true, 
        isActive: true,
        role: "user", 
      });
    } else {
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account is currently disabled.",
        });
      }

      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        user.isActive = true;
        await user.save();
      }
    }

    user.lastLoginAt = new Date();
    await user.save();

    const appToken = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Successfully authenticated with Google",
      token: appToken,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: appToken,
      },
    });
  } catch (error) {
    console.error("❌ GOOGLE AUTH BACKEND ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Google verification failed. Token is invalid or expired.",
    });
  }
};

export const registerUser = async (req, res) => {
  let user;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    console.log("📨 VERIFY LINK:", verifyLink);

    user = await User.create({
      fullName,
      email,
      password: hashedPassword,

      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,

      isEmailVerified: false,

      isActive: false,
    });

    console.log("✅ USER CREATED:", user.email);

    const emailResponse = await sendEmail({
      to: email,
      subject: "Verify Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Welcome to Zero To Tech Africa, ${fullName}</h2>

          <p>
            Thank you for registering.
            Please verify your email address to activate your account.
          </p>

          <div style="margin:30px 0;">
            <a
              href="${verifyLink}"
              style="
                display:inline-block;
                padding:12px 22px;
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
              "
            >
              Verify Email
            </a>
          </div>

          <p>
            This verification link will expire in 24 hours.
          </p>

          <p>
            If you did not create this account, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log("EMAIL SENT:", emailResponse);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });

  } catch (error) {
    console.error("❌ REGISTER USER ERROR FULL:", error);

    if (user) {
      try {
        await User.findByIdAndDelete(user._id);

        console.log(
          "🗑️ USER DELETED AFTER EMAIL FAILURE:",
          user.email
        );
      } catch (deleteError) {
        console.error(
          "❌ FAILED TO DELETE USER AFTER EMAIL ERROR:",
          deleteError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Registration failed. Unable to send verification email.",
    });
  }
};

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
    user.isActive = true; 

    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });

  } catch (error) {
    console.error("❌ VERIFY EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail =
      typeof email === "string" ? email : email?.email;

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

    const token = crypto.randomBytes(32).toString("hex");

    user.emailVerificationToken = token;
    user.emailVerificationExpires =
      Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const emailResponse = await sendEmail({
      to: cleanEmail,
      subject: "Resend Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Verify Your Account</h2>

          <p>
            Click the button below to verify your account.
          </p>

          <div style="margin:30px 0;">
            <a
              href="${verifyLink}"
              style="
                display:inline-block;
                padding:12px 22px;
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
              "
            >
              Verify Email
            </a>
          </div>

          <p>
            This link expires in 24 hours.
          </p>
        </div>
      `,
    });

    console.log("✅ RESEND EMAIL RESPONSE:", emailResponse);

    return res.json({
      success: true,
      message: "Verification email resent successfully",
    });

  } catch (error) {
    console.error("❌ RESEND VERIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password too short",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("❌ CHANGE PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in",
      });
    }

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

    user.lastLoginAt = new Date();

    await user.save();

    const token = generateToken(user._id);

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
    console.error("❌ LOGIN USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

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
    console.error("❌ PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};