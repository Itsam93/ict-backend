import Contact from "../models/Contact.js";
import { sendEmail } from "../utils/emailService.js";
import {
  contactTemplate,
  autoReplyTemplate,
  adminReplyTemplate,
} from "../utils/emailTemplates.js";

/* ======================================================
   SEND MESSAGE (PUBLIC USER)
====================================================== */
export const sendMessage = async (req, res) => {
  try {
    const { name, email, message, subject, phone, course } = req.body;

    console.log("📩 NEW CONTACT:", req.body);

    /* ================= SAVE MESSAGE ================= */
    const contact = await Contact.create({
      name,
      email,
      message,
      subject,
      phone,
      course,
      isRead: false,
      isReplied: false,
    });

    console.log("💾 MESSAGE SAVED");

    /* ================= NOTIFY ADMIN ================= */
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Message from ${name}`,
        html: contactTemplate({
          name,
          email,
          message,
          phone,
          course,
        }),
      });

      console.log("📨 ADMIN NOTIFIED");
    } catch (err) {
      console.error("❌ ADMIN EMAIL FAILED:", err.message);
    }

    /* ================= AUTO REPLY TO USER ================= */
    try {
      await sendEmail({
        to: email,
        subject: "We received your message - Zerototechafrica",
        html: autoReplyTemplate(name),
      });

      console.log("📩 AUTO REPLY SENT");
    } catch (err) {
      console.error("❌ AUTO REPLY FAILED:", err.message);
    }

    /* ================= RESPONSE ================= */
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error("❌ SEND MESSAGE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET ALL MESSAGES (ADMIN DASHBOARD)
====================================================== */
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   MARK MESSAGE AS READ
====================================================== */
export const markAsRead = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.isRead = true;
    await message.save();

    return res.json({
      success: true,
      message: "Marked as read",
    });
  } catch (error) {
    console.error("MARK AS READ ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE MESSAGE (ADMIN)
====================================================== */
export const deleteMessage = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   ADMIN MANUAL REPLY (DASHBOARD FEATURE)
====================================================== */
export const replyToMessage = async (req, res) => {
  try {
    const { id, replyMessage } = req.body;

    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    /* OPTIONAL: prevent duplicate replies */
    if (message.isReplied) {
      return res.status(400).json({
        success: false,
        message: "Message already replied to",
      });
    }

    /* ================= SEND REPLY EMAIL ================= */
    await sendEmail({
      to: message.email,
      subject: "Response from Zerototechafrica",
      html: adminReplyTemplate({
        name: message.name,
        replyMessage,
        originalMessage: message.message,
      }),
    });

    /* ================= UPDATE DB ================= */
    message.isReplied = true;
    message.replyMessage = replyMessage;
    message.repliedAt = new Date();

    await message.save();

    return res.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error("ADMIN REPLY ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};