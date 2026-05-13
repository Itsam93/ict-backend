import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

/**
 * OPTIONAL: if you have a dedicated upload controller
 * (recommended for clean architecture)
 */
import {
  uploadResourceFile,
  deleteUploadedFile,
} from "../controllers/uploadController.js";

const router = express.Router();

/* =====================================================
   ADMIN UPLOAD ROUTES
===================================================== */

/**
 * UPLOAD FILE (RESOURCE ASSET)
 * - PDF / Video / Image
 * - Stored in Cloudinary via controller
 */
router.post(
  "/resources",
  protect,
  adminOnly,
  upload.single("file"),
  uploadResourceFile
);

router.delete(
  "/resources/:publicId",
  protect,
  adminOnly,
  deleteUploadedFile
);

export default router;