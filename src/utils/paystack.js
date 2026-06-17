import axios from "axios";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

/**
 * @param {string} email 
 * @param {number} amount
 * @param {object} metadata 
 */
export const initializePayment = async ({ email, amount, metadata = {} }) => {
  try {
    const amountInKobo = Math.round(amount * 100);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amountInKobo, 
        metadata, 
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data?.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    throw new Error(`Paystack Init Failed: ${errorMsg}`);
  }
};

export const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    return response.data?.data; 
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    throw new Error(`Paystack Verification Failed: ${errorMsg}`);
  }
};