import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",

  "application/pdf",

  "video/mp4",
  "video/mpeg",
  "video/quicktime",


  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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


export const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 1024 * 1024 * 100, 
  },
});