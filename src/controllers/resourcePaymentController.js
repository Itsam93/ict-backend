import Purchase from "../models/Purchase.js";
import Resource from "../models/Resource.js";
import Transaction from "../models/Transaction.js";
import { initializePayment, verifyPayment } from "../utils/paystack.js";

export const initializeResourcePayment = async (req, res) => {
  try {
    const { email } = req.body;
    const id = req.params.id || req.body.resourceId || req.body.id;
    const userId = req.user?._id;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource item not found in data collection" });
    }

    let cleanPrice = typeof resource.price === "string" 
      ? resource.price.replace(/[^0-9.]/g, "") 
      : resource.price;

    const numericPrice = parseFloat(cleanPrice);

    if (!numericPrice || isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid price configuration for this resource. Resolved value: ${resource.price}`,
      });
    }

    const amount = Math.round(numericPrice); 

    const reference = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await Purchase.create({
      email,
      resource: id,
      amount,
      reference,
      status: "pending",
    });

    const paymentData = await initializePayment({
      email,
      amount, 
      metadata: {
        userId,
        productId: resource._id,
        productType: "resource",
      },
    });

    paymentData.reference = reference;

    return res.json({
      success: true,
      data: paymentData,
    });
  } catch (err) {
    console.error("RESOURCE PAY INIT ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Payment initialization failed",
    });
  }
};

export const verifyResourcePayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackData = await verifyPayment(reference);
    const isSuccess = paystackData.status === "success";

    const purchase = await Purchase.findOne({ reference });
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase logging profile not found",
      });
    }

    purchase.status = isSuccess ? "paid" : "failed";
    await purchase.save();

    if (isSuccess) {
      const userId = paystackData.metadata?.userId || req.user?._id;
      const productId = paystackData.metadata?.productId || purchase.resource;

      await Transaction.findOneAndUpdate(
        { reference: reference },
        {
          userId,
          productId,
          productType: "resource",
          amount: purchase.amount,
          reference: reference,
          status: "paid",
        },
        { upsert: true, new: true }
      );
    }

    return res.json({
      success: true,
      data: purchase,
    });
  } catch (err) {
    console.error("RESOURCE PAY VERIFY ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Payment verification failed",
    });
  }
};