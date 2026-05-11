import Purchase from "../models/Purchase.js";
import Transaction from "../models/Transaction.js";

/**
 * =====================================================
 * RESOURCE ACCESS CONTROL MIDDLEWARE (PRODUCTION SAFE)
 * =====================================================
 *
 * Ensures only users who have successfully purchased
 * a resource can access it.
 *
 * Supports:
 * - Purchase model (legacy flow)
 * - Transaction model (new flow)
 *
 */
export const canAccessResource = async (req, res, next) => {
  try {
    /* ================= USER VALIDATION ================= */
    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email;
    const resourceId = req.params.id;

    if (!userId || !resourceId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request parameters",
      });
    }

    /* =====================================================
       CHECK 1: PURCHASE MODEL (LEGACY SUPPORT)
    ===================================================== */
    const purchase = await Purchase.findOne({
      user: userId,
      resource: resourceId,
      status: { $in: ["completed", "paid"] },
    });

    /* =====================================================
       CHECK 2: TRANSACTION MODEL (NEW SYSTEM FLOW)
    ===================================================== */
    const transaction = await Transaction.findOne({
      email: userEmail,
      productType: "Resource",
      productId: resourceId,
      status: "paid",
    });

    /* =====================================================
       FINAL ACCESS DECISION
    ===================================================== */
    const hasAccess = Boolean(purchase || transaction);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Please purchase this resource.",
      });
    }

    /* ================= PASS CONTROL ================= */
    return next();

  } catch (err) {
    console.error("RESOURCE ACCESS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to verify resource access",
    });
  }
};