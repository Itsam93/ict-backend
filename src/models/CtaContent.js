import mongoose from "mongoose";

const ctaSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    primaryButton: String,
    secondaryButton: String,
  },
  { timestamps: true }
);

const CtaContent = mongoose.model("CtaContent", ctaSchema);

export default CtaContent;