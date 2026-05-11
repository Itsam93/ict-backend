import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

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
  protectAdmin,
  adminOnly,
  upload.single("file"),
  uploadResourceFile
);

router.delete(
  "/resources/:publicId",
  protectAdmin,
  adminOnly,
  deleteUploadedFile
);

export default router;