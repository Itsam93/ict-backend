import express from "express";
import { paystackWebhook } from "../controllers/paystackWebhookController.js";

const router = express.Router();

router.post("/webhook", paystackWebhook);

export default router;