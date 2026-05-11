import express from "express";
import {
  getMyPurchases,
  getAllPurchases,
  deletePurchase,
} from "../controllers/purchaseController.js";

import { protectAdmin, adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.post("/my", getMyPurchases); 

/* ================= ADMIN ================= */
router.get("/", protectAdmin, adminOnly, getAllPurchases);
router.delete("/:id", protectAdmin, adminOnly, deletePurchase);

export default router;