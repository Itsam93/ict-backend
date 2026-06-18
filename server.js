import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`MISSING REQUIRED ENV: ${key}`);
    process.exit(1);
  }
});

if (!process.env.PAYSTACK_SECRET_KEY) {
  console.warn("WARNING: PAYSTACK_SECRET_KEY is not set");
}

if (!process.env.CLIENT_URL) {
  console.warn("WARNING: CLIENT_URL is not set");
}

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE REJECTION:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

const startServer = async () => {
  try {
    console.log("Starting server...");

    await connectDB();
    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    const shutdown = (signal) => {
      console.log(`\n🛑 ${signal} received. Shutting down server...`);

      server.close(() => {
        console.log("✔ HTTP server closed");
        process.exit(0);
      });

      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
};

startServer();