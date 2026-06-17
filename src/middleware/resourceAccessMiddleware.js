import Purchase from "../models/Purchase.js";
import Transaction from "../models/Transaction.js";

export const canAccessResource = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email;
    const resourceId = req.params.id;

    if (!userId || !resourceId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request parameters",
      });
    }

    const purchase = await Purchase.findOne({
      user: userId,
      resource: resourceId,
      status: { $in: ["completed", "paid"] },
    });

    const transaction = await Transaction.findOne({
      email: userEmail,
      productType: "Resource",
      productId: resourceId,
      status: "paid",
    });

    const hasAccess = Boolean(purchase || transaction);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Please purchase this resource.",
      });
    }

    return next();

  } catch (err) {
    console.error("RESOURCE ACCESS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to verify resource access",
    });
  }
};