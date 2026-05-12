import dotenv from "dotenv";

/* =====================================================
   LOAD ENV VARIABLES
===================================================== */

const envResult = dotenv.config();

if (envResult.error) {
  console.error("❌ Failed to load .env file");
  console.error(envResult.error);
  process.exit(1);
}

/* =====================================================
   IMPORT APP + DATABASE
===================================================== */

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

/* =====================================================
   CONNECT DATABASE
===================================================== */

try {
  console.log("🔄 Connecting to MongoDB...");
  await connectDB();
  console.log("✅ MongoDB connection successful");
} catch (error) {
  console.error("❌ MongoDB connection failed");
  console.error(error);
  process.exit(1);
}

/* =====================================================
   START SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("========================================");
  console.log(`Server running on port ${PORT}`);
  console.log("========================================");
});

/* =====================================================
   GLOBAL ERROR HANDLERS
===================================================== */

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:");
  console.error(reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:");
  console.error(error);
});