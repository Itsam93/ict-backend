import Transaction from "../models/Transaction.js";
import Entitlement from "../models/Entitlement.js";
import Course from "../models/Course.js"

/* ================= CREATE PENDING TRANSACTION ================= */
export const createPendingTransaction = async ({
  email,
  productType,
  productId,
  amount,
  reference,
}) => {
  return await Transaction.create({
    email,
    productType,
    productId,
    amount,
    reference,
    status: "pending",
  });
};

/* ================= MARK TRANSACTION AS PAID ================= */
export const markTransactionAsPaid = async (transaction, paystackData) => {
  transaction.status = "paid";
  transaction.paidAt = paystackData.paid_at;

  await transaction.save();

  return transaction;
};

/* ================= PROCESS FULFILLMENT (ENTITLEMENT CREATION) ================= */
export const processFulfillment = async (transaction) => {
  try {
    if (!transaction) {
      throw new Error("Transaction is required for fulfillment");
    }

    const { userId, productId, productType } = transaction;

    if (!userId || !productId || !productType) {
      throw new Error("Invalid transaction payload");
    }

    /* =========================================================
       STEP 1: VALIDATE PRODUCT EXISTS
    ========================================================= */
    let product = null;

    switch (productType) {
      case "Resource":
        product = await Resource.findById(productId);
        break;

      case "Course":
        product = await Course.findById(productId);
        break;

      default:
        throw new Error(`Unsupported product type: ${productType}`);
    }

    if (!product) {
      throw new Error("Product not found during fulfillment");
    }

    /* =========================================================
       STEP 2: IDEMPOTENCY CHECK (PREVENT DUPLICATES)
    ========================================================= */
    const existing = await Entitlement.findOne({
      userId,
      productId,
      productType,
    });

    if (existing) {
      return {
        success: true,
        message: "Entitlement already exists",
        entitlement: existing,
      };
    }

    /* =========================================================
       STEP 3: CREATE ENTITLEMENT (GRANT ACCESS)
    ========================================================= */
    const entitlement = await Entitlement.create({
      userId,
      productId,
      productType,
      grantedAt: new Date(),
      source: "payment",
      status: "active",
    });

    /* =========================================================
       STEP 4: OPTIONAL PRODUCT METRICS UPDATE
       (safe analytics layer)
    ========================================================= */
    if (product.views !== undefined) {
      product.salesCount = (product.salesCount || 0) + 1;
      await product.save();
    }

    /* =========================================================
       STEP 5: LOG SUCCESS
    ========================================================= */
    console.log("🎉 FULFILLMENT SUCCESS:", {
      userId,
      productId,
      productType,
      entitlementId: entitlement._id,
    });

    return {
      success: true,
      entitlement,
    };
  } catch (err) {
    console.error("❌ FULFILLMENT ERROR:", err.message);

    throw err; 
  }
};