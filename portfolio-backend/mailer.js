const nodemailer = require("nodemailer");

// Reads credentials from environment variables ONLY. Never hardcode
// email/app-password values in source — see README for setup instructions.
function getTransporter() {
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP_USER / SMTP_PASS are not set. Copy .env.example to .env and fill them in."
    );
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 465,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 20000,
    socketTimeout: 20000,
  });
}

module.exports = { getTransporter };
