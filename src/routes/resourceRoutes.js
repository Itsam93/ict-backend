import express from "express";

import {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  viewResource,
} from "../controllers/resourceController.js";

import {
  initializeResourcePayment,
  verifyResourcePayment,
} from "../controllers/resourcePaymentController.js";

import {
  protect, adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   PUBLIC ROUTES
===================================================== */

/**
 * GET ALL RESOURCES
 * Public metadata listing only
 */
router.get("/", getResources);

/**
 * INITIATE RESOURCE PAYMENT
 */
router.post(
  "/pay/:id",
  protect,
  initializeResourcePayment
);

/**
 * VERIFY RESOURCE PAYMENT
 */
router.get(
  "/verify/:reference",
  verifyResourcePayment
);

/**
 * VIEW PURCHASED RESOURCE
 * Protected in-app access only
 */
router.get(
  "/view/:id",
  protect,
  viewResource
);

/* =====================================================
   ADMIN ROUTES
===================================================== */

/**
 * CREATE RESOURCE
 * File already uploaded separately via:
 * POST /api/uploads/resources
 */
router.post(
  "/",
  protect,
  adminOnly,
  createResource
);

/**
 * UPDATE RESOURCE
 */
router.put(
  "/:id",
  protect,
  adminOnly,
  updateResource
);

/**
 * DELETE RESOURCE
 * Includes Cloudinary cleanup
 */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteResource
);

export default router;