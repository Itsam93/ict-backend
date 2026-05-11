import Testimonial from "../models/Testimonial.js";

/* =========================
   CREATE TESTIMONIAL (ADMIN)
========================= */
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL TESTIMONIALS (PUBLIC)
========================= */
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      isPublished: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE TESTIMONIAL (ADMIN)
========================= */
export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE TESTIMONIAL (ADMIN)
========================= */
export const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Testimonial deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};