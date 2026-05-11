import mongoose from "mongoose";
import Resource from "../models/Resource.js";
import Purchase from "../models/Purchase.js";
import Transaction from "../models/Transaction.js";
import { initializePayment, verifyPayment } from "../utils/paystack.js";
import cloudinary from "../config/cloudinary.js";
import { hasEntitlement } from "../services/entitlementService.js";


/* =========================
   CREATE RESOURCE (CLOUDINARY)
========================= */
export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      fileUrl,
      cloudinaryId,
    } = req.body;

    const resource = await Resource.create({
      title,
      description,
      price,
      type,
      fileUrl,
      cloudinaryId,
    });

    return res.status(201).json({
      success: true,
      data: resource,
    });

  } catch (err) {
    console.error("CREATE RESOURCE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET ALL RESOURCES
========================= */
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: resources,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE RESOURCE (CLOUDINARY SAFE)
========================= */
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,

        fileUrl:
          req.body.fileUrl || resource.fileUrl,

        cloudinaryId:
          req.body.cloudinaryId ||
          resource.cloudinaryId,
      },
      { new: true }
    );

    return res.json({
      success: true,
      data: updated,
    });

  } catch (err) {
    console.error("UPDATE RESOURCE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   DELETE RESOURCE (CLOUDINARY CLEANUP)
========================= */
export const deleteResource = async (req, res) => {
  try {
    const resourceId = req.params.id;

    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: "Resource ID is required",
      });
    }

    /* ================= FIND RESOURCE ================= */
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    /* ================= DELETE FROM CLOUDINARY ================= */
    if (resource.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(resource.cloudinaryId, {
          resource_type: "auto",
        });
      } catch (cloudErr) {
        console.warn(
          "Cloudinary deletion failed (continuing DB cleanup):",
          cloudErr.message
        );
      }
    }

    /* ================= DELETE FROM DATABASE ================= */
    await Resource.findByIdAndDelete(resourceId);

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });

  } catch (err) {
    console.error("DELETE RESOURCE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting resource",
    });
  }
};


/* ================= VIEW RESOURCE (SECURE IN-APP ACCESS) ================= */

export const viewResource = async (req, res) => {
  try {
    const userId = req.user._id;
    const resourceId = req.params.id;

    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const access = await hasEntitlement({
      userId,
      productId: resource._id,
      productType: "Resource",
    });

    if (!access) {
      return res.status(403).json({
        success: false,
        message: "NO_ENTITLEMENT",
        requiresPurchase: true,
      });
    }

    resource.views += 1;
    resource.lastAccessedAt = new Date();
    await resource.save();

    return res.json({
      success: true,
      data: resource,
    });
  } catch (err) {
    console.error("VIEW RESOURCE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};