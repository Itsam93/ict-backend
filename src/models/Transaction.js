import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    /* ================= USER (AUTH-BASED) ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // fallback for older records
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    /* ================= PRODUCT ================= */
    productType: {
      type: String,
      enum: ["Course", "Resource"],
      required: true,
      index: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "productType",
      index: true,
    },

    /* ================= PAYMENT INFO ================= */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    providerReference: {
      type: String, // Paystack reference (returned after verification)
      default: null,
    },

    paymentProvider: {
      type: String,
      default: "paystack",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },

    /* ================= PAYMENT TIMELINE ================= */
    paidAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },

    /* ================= OPTIONAL METADATA ================= */
    metadata: {
      type: Object,
      default: {},
    },

    /* ================= FULFILLMENT TRACKING ================= */
    fulfilled: {
      type: Boolean,
      default: false,
    },

    fulfilledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES (IMPORTANT FOR PERFORMANCE) ================= */
transactionSchema.index({ email: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ productType: 1, productId: 1 });
transactionSchema.index({ createdAt: -1 });

/* ================= MODEL ================= */
const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;