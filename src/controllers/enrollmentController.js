import Enrollment from "../models/Enrollment.js";
import { sendEmail } from "../utils/emailService.js";
import { enrollmentTemplate } from "../utils/emailTemplates.js";

/* =========================
   CREATE ENROLLMENT (LEAD / FORM)
========================= */
export const createEnrollment = async (req, res) => {
  try {
    const { fullName, email, phone, course } = req.body;

    const enrollment = await Enrollment.create({
      fullName,
      email,
      phone,
      course,
      status: "pending",
      paymentStatus: "pending",
    });

    // ✅ SEND EMAIL (correct place)
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "New Enrollment",
      html: enrollmentTemplate({ fullName, email, course }),
    });

    res.status(201).json({
      success: true,
      message: "Enrollment submitted successfully",
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL ENROLLMENTS (ADMIN)
========================= */
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("course")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE STATUS (ADMIN)
========================= */
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    enrollment.status = req.body.status || enrollment.status;
    await enrollment.save();

    res.json({
      success: true,
      message: "Status updated",
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE ENROLLMENT (ADMIN)
========================= */
export const deleteEnrollment = async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Enrollment deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



