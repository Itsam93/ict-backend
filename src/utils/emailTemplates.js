/* CONTACT NOTIFICATION */
export const contactTemplate = (data) => `
  <h2>New Contact Message</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Message:</strong></p>
  <p>${data.message}</p>
`;

/* ENROLLMENT NOTIFICATION */
export const enrollmentTemplate = (data) => `
  <h2>New Enrollment</h2>
  <p><strong>Name:</strong> ${data.fullName}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Course:</strong> ${data.course}</p>
`;

/* PAYMENT SUCCESS */
export const paymentSuccessTemplate = (data) => `
  <h2>Payment Successful</h2>
  <p>Thank you for enrolling in <strong>${data.course}</strong></p>
  <p>Amount Paid: ₦${data.amount}</p>
`;

/* USER AUTO RESPONSE */
export const autoReplyTemplate = (name) => `
  <h2>Hello ${name},</h2>
  <p>We received your message. Our team will get back to you shortly.</p>
`;

export const adminReplyTemplate = (data) => `
  <h2>Response from Zerototechafrica</h2>
  <p>Hi ${data.name},</p>
  <p>${data.replyMessage}</p>
  <hr/>
  <p><strong>Your original message:</strong></p>
  <p>${data.originalMessage}</p>
  <br/>
  <p>Regards,<br/>Zerototechafrica Support Team</p>
`;