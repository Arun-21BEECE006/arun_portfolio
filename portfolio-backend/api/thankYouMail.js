const path = require("path");
const { getTransporter } = require("../mailer");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body || {};
  if (!email) return res.status(400).json({ error: "email is required." });

  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"Arun Kumar — Portfolio" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank you for reaching out!",
      text: "Thanks for contacting me through my portfolio — I'll get back to you soon.",
      attachments: [
        { filename: "thank-you.jpg", path: path.join(__dirname, "..", "images", "thankyou.jpg"), cid: "posterImage" },
      ],
      html: `
        <div style="background:#0B0E14;padding:24px;border-radius:12px;max-width:600px;margin:auto;font-family:Arial,sans-serif;">
          <h2 style="color:#E8ECF1;text-align:center;">Thanks for reaching out${name ? `, ${name}` : ""}!</h2>
          <p style="color:#7C8798;text-align:center;line-height:1.6;">
            I appreciate your interest and will get back to you as soon as I can.
          </p>
          <div style="text-align:center;margin-top:20px;">
            <img src="cid:posterImage" alt="" style="width:100%;max-width:480px;border-radius:10px;" />
          </div>
        </div>`,
    });

    res.status(200).json({ message: "Thank-you email sent", id: info.messageId });
  } catch (error) {
    console.error("Error sending thank-you email:", error.message);
    res.status(500).json({ error: "Error sending thank-you email" });
  }
};
