import mongoose from "mongoose";

const entitlementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    productType: {
      type: String,
      enum: ["Resource", "Course"],
      required: true,
      index: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    source: {
      type: String,
      enum: ["payment", "admin_grant"],
      default: "payment",
    },

    transactionRef: String,

    grantedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* =========================================================
   FIX: Prevent OverwriteModelError in dev/hot reload
========================================================= */
const Entitlement =
  mongoose.models.Entitlement ||
  mongoose.model("Entitlement", entitlementSchema);

export default Entitlement;