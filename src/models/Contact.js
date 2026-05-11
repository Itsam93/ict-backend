import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    message: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      default: "General Inquiry",
    },

    phone: {
      type: String,
      default: null,
    },

    course: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    isReplied: {
      type: Boolean,
      default: false,
    },

    replyMessage: {
      type: String,
      default: null,
    },

    repliedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;