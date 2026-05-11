import Purchase from "../models/Purchase.js";

/**
 * =========================
 * PUBLIC: GET PURCHASES BY EMAIL
 * GET /api/purchases/my?email=example@gmail.com
 * =========================
 */
export const getMyPurchases = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const purchases = await Purchase.find({ email })
      .populate("resource", "title price type description")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: purchases,
    });
  } catch (err) {
    console.error("GET MY PURCHASES ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * =========================
 * ADMIN: GET ALL PURCHASES
 * GET /api/purchases
 * =========================
 */
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("resource", "title price type")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: purchases,
    });
  } catch (err) {
    console.error("GET ALL PURCHASES ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * =========================
 * CREATE PURCHASE (AFTER PAYMENT VERIFY)
 * =========================
 */
export const createPurchase = async (req, res) => {
  try {
    const { email, resource, amount, reference } = req.body;

    if (!email || !resource) {
      return res.status(400).json({
        success: false,
        message: "Email and resource are required",
      });
    }

    const purchase = await Purchase.create({
      email,
      resource,
      amount,
      reference,
      status: "paid",
    });

    res.status(201).json({
      success: true,
      data: purchase,
    });
  } catch (err) {
    console.error("CREATE PURCHASE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * =========================
 * DELETE PURCHASE (ADMIN ONLY)
 * =========================
 */
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    await purchase.deleteOne();

    res.json({
      success: true,
      message: "Purchase deleted",
    });
  } catch (err) {
    console.error("DELETE PURCHASE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};