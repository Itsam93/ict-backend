import axios from "axios";
import Purchase from "../models/Purchase.js";
import Resource from "../models/Resource.js";
import Transaction from "../models/Transaction.js";


/* ================= INIT RESOURCE PAYMENT ================= */
export const initializeResourcePayment = async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    if (!resource.price || isNaN(resource.price)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource price",
      });
    }

    const amount = Math.round(Number(resource.price));

    const reference = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create pending purchase first
    await Purchase.create({
      email,
      resource: id,
      amount,
      reference,
      status: "pending",
    });

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // kobo
        reference,
        callback_url: `${process.env.CLIENT_URL}/payment-success`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      success: true,
      data: response.data.data,
    });

  } catch (err) {
    console.error(
      "RESOURCE PAY ERROR:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      message:
        err.response?.data?.message ||
        "Payment initialization failed",
    });
  }
};

/* ================= VERIFY RESOURCE PAYMENT ================= */
export const verifyResourcePayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const purchase = await Purchase.findOne({ reference });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    const paystackData = response.data.data;
    const isSuccess = paystackData.status === "success";

    purchase.status = isSuccess ? "paid" : "failed";
    await purchase.save();

    return res.json({
      success: true,
      data: purchase,
    });

  } catch (err) {
    console.error("VERIFY ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message:
        err.response?.data?.message ||
        "Payment verification failed",
    });
  }
};



