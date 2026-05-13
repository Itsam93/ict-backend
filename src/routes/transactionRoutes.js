import express from "express";

import {
  initializeTransaction,
  verifyTransaction,
  getTransactions,
  deleteTransaction,
  getUserTransactions, 
} from "../controllers/transactionController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = express.Router();

/* =========================
   PUBLIC PAYMENT ROUTES
========================= */

// Initialize payment 
router.post("/init", protect, initializeTransaction);

// Verify payment (Paystack callback check)
router.get("/verify/:reference", verifyTransaction);


/* =========================
   USER PAYMENT ROUTES
========================= */

router.get(
  "/my",
  protect,
  getUserTransactions
);


/* =========================
   ADMIN ROUTES
========================= */
router.get(
  "/",
  protect,
  adminOnly,
  getTransactions
);


router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTransaction
);

export default router;