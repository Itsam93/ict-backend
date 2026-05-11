import { Resend } from "resend";

/* ================= GET RESEND INSTANCE ================= */
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing");
    throw new Error("RESEND_API_KEY not loaded");
  }

  return new Resend(process.env.RESEND_API_KEY);
};

/* ================= SEND EMAIL ================= */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const resend = getResend(); 

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return response;

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);
    throw error;
  }
};

export const testEmail = async () => {
  try {
    console.log("🧪 RUNNING TEST EMAIL...");

    const res = await sendEmail({
      to: process.env.ADMIN_EMAIL || "samogleks@gmail.com",
      subject: "Test Email from Resend",
      html: "<h2>✅ Resend is working perfectly</h2>",
    });

    console.log("🧪 TEST EMAIL RESULT:", res);

  } catch (err) {
    console.error("❌ TEST EMAIL FAILED:", err.message);
  }
};