import express from "express";
import {
  getMyPurchases,
  getAllPurchases,
  deletePurchase,
} from "../controllers/purchaseController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.post("/my", getMyPurchases); 

/* ================= ADMIN ================= */
router.get("/", protect, adminOnly, getAllPurchases);
router.delete("/:id", protect, adminOnly, deletePurchase);

export default router;