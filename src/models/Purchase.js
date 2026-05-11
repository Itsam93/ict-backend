import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentProvider: {
      type: String,
      default: "paystack",
    },
  },
  { timestamps: true }
);

purchaseSchema.index({ email: 1 });
purchaseSchema.index({ reference: 1 });

export default mongoose.model("Purchase", purchaseSchema);