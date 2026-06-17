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


export const sendBankTransferEmail = async ({ userEmail, amount, reference, resourceTitle }) => {
  try {
    const bankName = process.env.BANK_NAME || "Access Bank";
    const accountNumber = process.env.ACCOUNT_NUMBER || "0123456789";
    const accountName = process.env.ACCOUNT_NAME || "AMP MEDIA LTD"; 

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #111; font-size: 22px; font-weight: 600; margin-bottom: 10px;">Complete Your Purchase</h2>
        <p>Thank you for ordering <strong>${resourceTitle}</strong>. To complete your payment and gain access, please make a bank transfer to the account details below:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e9ecef;">
          <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Amount:</strong> <span style="font-size: 18px; font-weight: 600; color: #111;">₦${amount.toLocaleString()}</span></p>
          <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Bank Name:</strong> ${bankName}</p>
          <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Account Number:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">${accountNumber}</span></p>
          <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Account Name:</strong> ${accountName}</p>
          <p style="margin: 0; font-size: 15px;"><strong>Payment Reference:</strong> <span style="color: #dc3545; font-weight: bold; font-family: monospace;">${reference}</span></p>
        </div>

        <div style="background-color: #fff3cd; border: 1px solid #ffeba2; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 13px; color: #856404;">
            ⚠️ <strong>Important:</strong> Please ensure you paste the Payment Reference <strong>${reference}</strong> exactly into your banking app's payment description/remarks field. This allows our team to match your credit alert and verify your access instantly.
          </p>
        </div>

        <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
          If you have any questions or need manual assistance, feel free to reply directly to this email.
        </p>
      </div>
    `;

    const response = await sendEmail({
      to: userEmail,
      subject: `Invoice & Bank Transfer Instructions [Ref: ${reference}]`,
      html: emailHtml,
    });

    return response;
  } catch (error) {
    console.error("❌ BANK TRANSFER EMAIL ERROR:", error.message);
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