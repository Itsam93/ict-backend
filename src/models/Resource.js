import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["PDF", "Video", "Image", "Audio"],
      required: true,
    },

    /* ================= CLOUDINARY STORAGE ================= */
    fileUrl: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      default: null,
    },

    fileSize: {
      type: Number,
      default: null,
    },

    /* ================= ANALYTICS ================= */
    views: {
      type: Number,
      default: 0,
    },

    downloads: {
      type: Number,
      default: 0,
    },

    lastAccessedAt: {
      type: Date,
      default: null,
    },

    /* ================= PUBLISH CONTROL ================= */
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES (PERFORMANCE OPTIMIZATION) ================= */
resourceSchema.index({ isPublished: 1, createdAt: -1 });
resourceSchema.index({ price: 1 });

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;