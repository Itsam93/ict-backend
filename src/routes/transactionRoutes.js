import express from "express";

import {
  initializeTransaction,
  verifyTransaction,
  getTransactions,
  deleteTransaction,
  getUserTransactions, 
} from "../controllers/transactionController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";


import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   PUBLIC PAYMENT ROUTES
========================= */

// Initialize payment 
router.post("/init", protectUser, initializeTransaction);

// Verify payment (Paystack callback check)
router.get("/verify/:reference", verifyTransaction);


/* =========================
   USER PAYMENT ROUTES
========================= */

router.get(
  "/my",
  protectUser,
  getUserTransactions
);


/* =========================
   ADMIN ROUTES
========================= */
router.get(
  "/",
  protectAdmin,
  adminOnly,
  getTransactions
);


router.delete(
  "/:id",
  protectAdmin,
  adminOnly,
  deleteTransaction
);

export default router;