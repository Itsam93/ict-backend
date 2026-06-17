import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import Purchase from "../models/Purchase.js";
import Resource from "../models/Resource.js";
import { verifyPayment } from "../utils/paystack.js";

export const paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    if (event.event !== "charge.success") {
      return res.status(200).send("Event ignored");
    }

    const data = event.data;

    const reference = data.reference;
    const email = data.customer.email;
    const amount = data.amount / 100;

    const existingTx = await Transaction.findOne({ reference });

    if (existingTx) {
      return res.status(200).send("Already processed");
    }

    const verified = await verifyPayment(reference);

    if (verified.status !== "success") {
      return res.status(400).send("Payment not valid");
    }

    const resourceId = verified.metadata?.resourceId;

    if (!resourceId) {
      return res.status(400).send("Missing metadata");
    }

    const transaction = await Transaction.create({
      email,
      productType: "resource",
      productId: resourceId,
      amount,
      reference,
      providerReference: data.id,
      status: "paid",
      paidAt: new Date(),
    });

 
    await Purchase.findOneAndUpdate(
      { reference },
      {
        userEmail: email,
        resource: resourceId,
        amount,
        status: "paid",
        reference,
      },
      { upsert: true, new: true }
    );

    await Resource.findByIdAndUpdate(resourceId, {
      $inc: { salesCount: 1 },
    });

    return res.status(200).send("Webhook processed");

  } catch (err) {
    console.error("PAYSTACK WEBHOOK ERROR:", err);
    return res.status(500).send("Webhook error");
  }
};