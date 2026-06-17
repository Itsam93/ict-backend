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

router.post("/init", protect, initializeTransaction);

router.get("/verify/:reference", verifyTransaction);


router.get(
  "/my",
  protect,
  getUserTransactions
);


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