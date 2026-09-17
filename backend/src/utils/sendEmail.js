const nodemailer = require("nodemailer");

/**
 * Sends an email via SMTP if configured, otherwise logs it to the console.
 * This keeps auth flows (register / forgot-password) working out of the box
 * even before you wire up a real SMTP provider.
 */
const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    if (process.env.NODE_ENV === "production") throw new Error("SMTP is not configured.");
    console.log("--- sendEmail (SMTP not configured, logging instead) ---");
    console.log({ to, subject, text });
    console.log("----------------------------------------------------------");
    return { delivered: false, skipped: true, error: "SMTP is not configured." };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
  return { delivered: true, providerMessageId: info.messageId || "" };
};

module.exports = sendEmail;
