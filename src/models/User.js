import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, 
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /* ================= ACCOUNT STATUS ================= */
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ================= VERIFICATION FLOW ================= */
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },

    /* ================= SECURITY ================= */
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },

    /* ================= OPTIONAL UX ================= */
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);