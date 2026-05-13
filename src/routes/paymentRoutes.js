import express from "express";
import {
  getPayments,
  deletePayment,
} from "../controllers/paymentController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADMIN */
router.get("/", protect, adminOnly, getPayments);

router.delete("/:id", protect, adminOnly, deletePayment);


export default router; 








