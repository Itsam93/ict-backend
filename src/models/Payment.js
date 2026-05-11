import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    /* ================= USER INFO ================= */
    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    /* ================= COURSE ================= */
    course: {
      type: String,
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    /* ================= PAYMENT DETAILS ================= */
    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    transactionId: {
      type: String, 
    },

    channel: {
      type: String, 
    },

    paidAt: {
      type: Date,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    /* ================= RELATIONS ================= */
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
    },

    /* ================= FLAGS ================= */
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;