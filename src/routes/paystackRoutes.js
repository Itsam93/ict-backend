import express from "express";
import { paystackWebhook } from "../controllers/paystackWebhookController.js";

const router = express.Router();

/**
 * IMPORTANT:
 * DO NOT use auth middleware here
 * Paystack cannot send JWT
 */
router.post("/webhook", paystackWebhook);

export default router;