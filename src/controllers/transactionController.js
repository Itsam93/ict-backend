import mongoose from "mongoose";

import Transaction from "../models/Transaction.js";
import { getProductByType } from "../services/productService.js";
import {
  initializePaystackTransaction,
  verifyPaystackTransaction,
} from "../services/paymentService.js";

import {
  createPendingTransaction,
  markTransactionAsPaid,
  processFulfillment,
} from "../services/transactionService.js";

import { grantEntitlement } from "../services/entitlementService.js";

import { sendEmail } from "../utils/emailService.js";
import { paymentSuccessTemplate } from "../utils/emailTemplates.js";


export const initializeTransaction = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { productType, productId } = req.body;

    if (!productType || !productId) {
      return res.status(400).json({
        success: false,
        message: "productType and productId are required",
      });
    }

    const normalizedType =
      productType.charAt(0).toUpperCase() +
      productType.slice(1).toLowerCase();

    if (!["Course", "Resource"].includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product type",
      });
    }

    const product = await getProductByType(normalizedType, productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const amount = Number(product.price);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product price",
      });
    }

    const reference = `TXN-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

    await createPendingTransaction({
      userId: user._id.toString(),
      email: user.email.toLowerCase(),
      productType: normalizedType,
      productId: product._id.toString(),
      amount,
      reference,
    });

    const paystackResponse = await initializePaystackTransaction({
      email: user.email.toLowerCase(),
      amount,
      reference,
      metadata: {
        userId: user._id.toString(),
        productType: normalizedType,
        productId: product._id.toString(),
      },
    });

    return res.status(200).json({
      success: true,
      data: paystackResponse,
    });
  } catch (err) {
    console.error("INIT TRANSACTION ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Payment initialization failed",
    });
  }
};


export const verifyTransaction = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Reference is required",
      });
    }

    const transaction = await Transaction.findOne({ reference });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.status === "paid" && transaction.fulfilled) {
      return res.json({
        success: true,
        message: "Transaction already processed",
        data: {
          reference: transaction.reference,
          status: transaction.status,
          fulfilled: transaction.fulfilled,
        },
      });
    }

    const paystackData = await verifyPaystackTransaction(reference);

    if (!paystackData || paystackData.status !== "success") {
      transaction.status = "failed";
      await transaction.save();

      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    transaction.status = "paid";
    transaction.paidAt = new Date();
    transaction.gatewayResponse = paystackData;

    await transaction.save();

    const alreadyFulfilled = transaction.fulfilled === true;

    if (!alreadyFulfilled) {
      await grantEntitlement({
        userId: transaction.userId,
        productId: transaction.productId,
        productType: transaction.productType,
        transactionRef: transaction.reference,
      });

      await processFulfillment(transaction);

      transaction.fulfilled = true;
      await transaction.save();
    }

    try {
      await sendEmail({
        to: transaction.email,
        subject: "Access Granted 🎉",
        html: paymentSuccessTemplate({
          amount: transaction.amount,
          product: transaction.productType,
        }),
      });
    } catch (emailErr) {
      console.warn(
        "Email failed but transaction succeeded:",
        emailErr.message
      );
    }

    return res.json({
      success: true,
      message: "Payment verified and access granted",
      data: {
        reference: transaction.reference,
        status: transaction.status,
        fulfilled: transaction.fulfilled,
        productType: transaction.productType,
        productId: transaction.productId,
      },
    });

  } catch (err) {
    console.error("VERIFY TRANSACTION ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const user = req.user;

    const transactions = await Transaction.find({
      email: user.email.toLowerCase(),
      status: "paid",
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.error("GET MY TRANSACTIONS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const transactions = await Transaction.find({
      email: user.email, 
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: transactions,
    });

  } catch (err) {
    console.error("GET USER TRANSACTIONS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user transactions",
    });
  }
};