import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* =====================================================
   UPLOAD FILE TO CLOUDINARY
===================================================== */
export const uploadResourceFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "resources",
        resource_type: "auto",
      }
    );

    return res.status(200).json({
      success: true,
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

/* =====================================================
   DELETE FILE FROM CLOUDINARY
===================================================== */
export const deleteUploadedFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });

    if (result.result !== "ok") {
      return res.status(400).json({
        success: false,
        message: "File deletion failed",
        data: result,
      });
    }

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (err) {
    console.error("DELETE UPLOAD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};