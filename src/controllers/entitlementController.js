import Entitlement from "../models/Entitlement.js";

/* =========================================================
   GET MY ENTITLEMENTS (USER DASHBOARD SOURCE OF TRUTH)
========================================================= */
export const getMyEntitlements = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const entitlements = await Entitlement.find({ userId })
      .select("productId productType source grantedAt")
      .lean();

    return res.json({
      success: true,
      data: entitlements,
    });
  } catch (err) {
    console.error("GET ENTITLEMENTS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch entitlements",
    });
  }
};

/* =========================================================
   CHECK SINGLE PRODUCT ACCESS (GENERIC + REUSABLE)
========================================================= */
export const checkEntitlement = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;
    const { productType } = req.query; 
    // allows: Resource | Course | future types

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!productId || !productType) {
      return res.status(400).json({
        success: false,
        message: "productId and productType are required",
      });
    }

    const exists = await Entitlement.exists({
      userId,
      productId,
      productType,
    });

    return res.json({
      success: true,
      hasAccess: !!exists,
    });
  } catch (err) {
    console.error("CHECK ENTITLEMENT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Check failed",
    });
  }
};