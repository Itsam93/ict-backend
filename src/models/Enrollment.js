// models/Entitlement.js
import mongoose from "mongoose";

const entitlementSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },

    type: {
      type: String,
      enum: ["course", "resource"],
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
    },

    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },

    accessLevel: {
      type: String,
      enum: ["view", "stream"], 
      default: "stream",
    },

    expiresAt: Date, // optional (for subscriptions later)
  },
  { timestamps: true }
);

export default mongoose.model("Entitlement", entitlementSchema);