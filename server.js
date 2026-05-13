import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

/* ================= ENV VALIDATION ================= */
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is not set");
}

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

/* ================= SERVER START ================= */
const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    await connectDB();
    console.log("🗄️ Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    /* ================= GRACEFUL SHUTDOWN ================= */
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down server...");
      server.close(() => {
        console.log("✔ Server closed");
        process.exit(0);
      });
    });

    process.on("SIGTERM", () => {
      console.log("\n🛑 SIGTERM received");
      server.close(() => {
        console.log("✔ Server closed");
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

startServer();