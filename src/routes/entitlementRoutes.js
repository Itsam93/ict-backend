import express from "express";
import {
  getMyEntitlements,
  checkEntitlement,
} from "../controllers/entitlementController.js";

import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   USER ENTITLEMENTS (LOGGED-IN USER ONLY)
========================================================= */
router.get("/my", protectUser, getMyEntitlements);

/* =========================================================
   CHECK SINGLE RESOURCE ACCESS
   GET /api/entitlements/check/:productId
========================================================= */
router.get("/check/:productId", protectUser, checkEntitlement);

export default router;