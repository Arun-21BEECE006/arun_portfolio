const path = require("path");
const { getTransporter } = require("../mailer");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields (name, email, subject, message) are required." });
  }

  try {
    const transporter = getTransporter();
    const notifyTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: notifyTo,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      attachments: [
        { filename: "thank-you.jpg", path: path.join(__dirname, "..", "images", "image.jpg"), cid: "posterImage" },
      ],
      html: `
        <div style="background:#0B0E14;padding:24px;border-radius:12px;max-width:600px;margin:auto;font-family:Arial,sans-serif;">
          <h1 style="color:#4FD1C5;border-bottom:2px solid #4FD1C5;padding-bottom:10px;">New Portfolio Contact</h1>
          <p style="color:#E8ECF1;"><b>Name:</b> ${name}</p>
          <p style="color:#E8ECF1;"><b>Email:</b> ${email}</p>
          <p style="color:#E8ECF1;"><b>Subject:</b> ${subject}</p>
          <p style="color:#E8ECF1;"><b>Message:</b> ${message}</p>
          <div style="text-align:center;margin-top:20px;">
            <img src="cid:posterImage" alt="" style="width:100%;max-width:480px;border-radius:10px;" />
          </div>
        </div>`,
    });

    res.status(200).json({ message: "Email sent successfully", id: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ error: "Error sending email" });
  }
};
