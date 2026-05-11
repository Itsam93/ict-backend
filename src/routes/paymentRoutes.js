import express from "express";
import {
  getPayments,
  deletePayment,
} from "../controllers/paymentController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ADMIN */
router.get("/", protectAdmin, adminOnly, getPayments);

router.delete("/:id", protectAdmin, adminOnly, deletePayment);


export default router; 








