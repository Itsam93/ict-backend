import axios from "axios";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import { sendEmail } from "../utils/emailService.js";
import { paymentSuccessTemplate } from "../utils/emailTemplates.js";



/* =========================
   GET ALL PAYMENTS (ADMIN)
========================= */
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await Payment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};