import express from "express";
import {
  getMyEntitlements,
  checkEntitlement,
} from "../controllers/entitlementController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyEntitlements);

router.get("/check/:productId", protect, checkEntitlement);

export default router;