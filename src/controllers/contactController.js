import Contact from "../models/Contact.js";
import { sendEmail } from "../utils/emailService.js";
import {
  contactTemplate,
  autoReplyTemplate,
  adminReplyTemplate,
} from "../utils/emailTemplates.js";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message, subject, phone, course } = req.body;

    console.log("📩 NEW CONTACT:", req.body);

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

    if (message.isReplied) {
      return res.status(400).json({
        success: false,
        message: "Message already replied to",
      });
    }

    await sendEmail({
      to: message.email,
      subject: "Response from Zerototechafrica",
      html: adminReplyTemplate({
        name: message.name,
        replyMessage,
        originalMessage: message.message,
      }),
    });

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

export const handleNewsletterSubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required to subscribe.",
      });
    }

    const duplicateSubscriber = await Contact.findOne({
      email,
      subject: "Newsletter Subscription",
    });

    if (duplicateSubscriber) {
      return res.status(400).json({
        success: false,
        message: "This email address is already subscribed to our newsletter channel.",
      });
    }

    console.log(`🗞️ NEW NEWSLETTER SUBSCRIPTION REQUEST: ${email}`);

    const subscriberLog = await Contact.create({
      name: "Newsletter Subscriber",
      email: email,
      subject: "Newsletter Subscription",
      message: "User opted-in via the website footer newsletter subscription form block.",
      isRead: false,
      isReplied: true, 
    });

    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Zero-to-tech-africa Newsletter!",
        html: autoReplyTemplate("Subscriber"), 
      });
      console.log("📩 NEWSLETTER WELCOME CONFIRMATION DESPATCHED");
    } catch (mailErr) {
      console.error("❌ NEWSLETTER WELCOME EMAIL DISPATCH FAILED:", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Subscription processed successfully.",
      data: subscriberLog,
    });

  } catch (error) {
    console.error("❌ NEWSLETTER SUBSCRIBE CONTROLLER ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error processing subscription.",
    });
  }
};