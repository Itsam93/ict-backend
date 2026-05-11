import axios from "axios";

export const initializePaystackTransaction = async ({
  email,
  amount,
  reference,
  metadata,
}) => {
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount: amount * 100,
      reference,
      callback_url: `${process.env.CLIENT_URL}/payment-success`,
      metadata,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data;
};

export const verifyPaystackTransaction = async (reference) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data.data;
};