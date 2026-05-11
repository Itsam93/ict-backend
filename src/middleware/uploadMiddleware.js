import multer from "multer";
import path from "path";

/* =====================================================
   MULTER STORAGE
===================================================== */

const storage = multer.diskStorage({});

/* =====================================================
   ALLOWED FILE TYPES
===================================================== */

const allowedMimeTypes = [
  // Images
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",

  // PDFs
  "application/pdf",

  // Videos
  "video/mp4",
  "video/mpeg",
  "video/quicktime",

  // Documents (optional)
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/* =====================================================
   FILE FILTER
===================================================== */

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, PDFs, videos, and documents are allowed."
      ),
      false
    );
  }
};

/* =====================================================
   MULTER CONFIG
===================================================== */

export const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB
  },
});