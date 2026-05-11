import Entitlement from "../models/Entitlement.js";

/**
 * Grant access after payment
 */
export const grantEntitlement = async ({
  userId,
  productId,
  productType,
  transactionRef,
}) => {
  return Entitlement.findOneAndUpdate(
    { userId, productId, productType },
    {
      userId,
      productId,
      productType,
      transactionRef,
      source: "payment",
      grantedAt: new Date(),
    },
    { upsert: true, new: true }
  );
};

/**
 * Check access
 */
export const hasEntitlement = async ({
  userId,
  productId,
  productType,
}) => {
  return Entitlement.exists({
    userId,
    productId,
    productType,
  });
};

/**
 * Get all user entitlements
 */
export const getUserEntitlements = async (userId) => {
  return Entitlement.find({ userId });
};