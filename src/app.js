import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import ctaRoutes from "./routes/ctaRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import authUserRoutes from "./routes/authUserRoutes.js";
import resourceAnalyticsRoutes from "./routes/resourceAnalyticsRoutes.js";
import paystackRoutes from "./routes/paystackRoutes.js";
import entitlementRoutes from "./routes/entitlementRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { limiter } from "./middleware/rateLimit.js";

const app = express();

/* ================= PATH CONFIG ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= ENV CONFIG ================= */
const CLIENT_URL =
  process.env.CLIENT_URL ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

/* ================= SECURITY / CORS ================= */
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin
    // (mobile apps, postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      CLIENT_URL,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
       "https://zero-to-tech.vercel.app",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  }, 

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],

  exposedHeaders: ["Content-Length"],

  optionsSuccessStatus: 200,
};

/* ================= MIDDLEWARE ================= */
app.use(cors(corsOptions));

/* Handle preflight requests */
app.options(/.*/, cors(corsOptions));

/* Body parsers */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* Rate limiter */
app.use(limiter);

/* ================= STATIC FILES ================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running...",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", authUserRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/enrollments", enrollmentRoutes);

app.use("/api/cms/hero", heroRoutes);
app.use("/api/cms/cta", ctaRoutes);

app.use("/api/admin/users", adminUserRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/entitlements", entitlementRoutes);

app.use("/api/resources", resourceRoutes);

app.use("/api/testimonials", testimonialRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/purchases", purchaseRoutes);

app.use("/api/uploads", uploadRoutes);

app.use(
  "/api/resources/analytics",
  resourceAnalyticsRoutes
);

app.use("/api/paystack", paystackRoutes);

/* ================= 404 HANDLER ================= */
app.use(notFound);

/* ================= GLOBAL ERROR HANDLER ================= */
app.use(errorHandler);

export default app;