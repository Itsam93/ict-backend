// providers/paystack.provider.js
import axios from "axios";

export const initializePaystackTransaction = async (payload) => {
  return axios.post(
    "https://api.paystack.co/transaction/initialize",
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const verifyPaystackTransaction = async (reference) => {
  return axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );
};