const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { getTransporter } = require("./mailer");
const { checkCredentials, signToken, requireAdmin } = require("./adminAuth");
const {
  readContent,
  listItems,
  createItem,
  updateItem,
  deleteItem,
  updateSingleton,
  COLLECTIONS,
} = require("./contentStore");
const {
  upload,
  uploadBuffer,
  listMedia,
  deleteMedia,
  FOLDERS: MEDIA_FOLDERS,
} = require("./uploadHandler");
const { fetchGithubStats } = require("./githubStats");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
// Note: uploaded images/PDFs are now served directly from Cloudinary's own
// URLs — nothing to serve locally, so no /uploads static route is needed.

app.get("/", (req, res) => {
  res.json({ message: "Portfolio backend is running", port });
});

// ── Public: live GitHub open-source activity (real data, cached 1hr) ────
app.get("/api/github-stats", async (req, res) => {
  const username = req.query.username || "Arun-21BEECE006";
  try {
    const data = await fetchGithubStats(username);
    res.json(data);
  } catch (error) {
    res
      .status(502)
      .json({ error: `Could not fetch GitHub stats: ${error.message}` });
  }
});

// ── Public content (read-only) ──────────────────────────────────────────
// The frontend fetches everything it renders from here at runtime, so
// admin edits go live immediately without a rebuild or redeploy.
app.get("/api/content", (req, res) => {
  try {
    res.json(readContent());
  } catch (error) {
    console.error("Error reading content:", error.message);
    res.status(500).json({ error: "Could not read content" });
  }
});

// ── Admin auth ───────────────────────────────────────────────────────────
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  try {
    if (!checkCredentials(email, password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ token: signToken(email) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/verify", requireAdmin, (req, res) => {
  res.json({ ok: true, email: req.admin.email });
});

app.get("/api/admin/collections", requireAdmin, (req, res) => {
  res.json({ collections: COLLECTIONS });
});

// ── Admin — singleton objects (profile, resume, conference) ─────────────
app.put("/api/admin/singleton/:key", requireAdmin, (req, res) => {
  try {
    res.json(updateSingleton(req.params.key, req.body));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// ── Admin — media library (file uploads for project galleries, resume, etc.) ──
// IMPORTANT: these must be registered BEFORE the generic "/api/admin/:collection"
// routes below, otherwise Express matches "upload"/"media" as a :collection param.
app.post("/api/admin/upload", requireAdmin, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file received" });
    try {
      const folder = req.body.folder || "misc";
      const result = await uploadBuffer(
        req.file.buffer,
        folder,
        req.file.originalname,
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

app.get("/api/admin/media", requireAdmin, async (req, res) => {
  try {
    const folder = req.query.folder || "misc";
    const files = await listMedia(folder);
    res.json({ folders: MEDIA_FOLDERS, files });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.delete("/api/admin/media", requireAdmin, async (req, res) => {
  const { folder, name } = req.query;
  if (!folder || !name)
    return res.status(400).json({ error: "folder and name are required" });
  try {
    res.json(await deleteMedia(folder, name));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// ── Admin CRUD — collections (projects, skillOrbs, experience, etc.) ────
app.post("/api/admin/:collection", requireAdmin, (req, res) => {
  try {
    res.status(201).json(createItem(req.params.collection, req.body));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.put("/api/admin/:collection/:id", requireAdmin, (req, res) => {
  try {
    res.json(updateItem(req.params.collection, req.params.id, req.body));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.delete("/api/admin/:collection/:id", requireAdmin, (req, res) => {
  try {
    res.json(deleteItem(req.params.collection, req.params.id));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.post("/api/sendEmail", async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: "All fields (name, email, subject, message) are required.",
    });
  }

  try {
    const transporter = getTransporter();
    const notifyTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from: `"Arun Kumar Portfolio" <${process.env.SMTP_USER}>`,
      to: notifyTo,
      replyTo: email,
      subject: `📩 New portfolio contact: ${subject}`,
      text: `Someone contacted you through your portfolio website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      attachments: [
        {
          filename: "thank-you.jpg",
          path: path.join(__dirname, "images", "image.jpg"),
          cid: "posterImage",
        },
      ],
      html: `
        <div style="background:#0B0E14;padding:24px;border-radius:12px;max-width:600px;margin:auto;font-family:Arial,sans-serif;">
          <h1 style="color:#4FD1C5;border-bottom:2px solid #4FD1C5;padding-bottom:10px;">New message from your portfolio</h1>
          <p style="color:#7C8798;margin-top:0;">
            Someone just contacted you through the contact form on your portfolio website.
          </p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr>
              <td style="color:#7C8798;padding:6px 0;width:90px;vertical-align:top;">Name</td>
              <td style="color:#E8ECF1;padding:6px 0;"><b>${name}</b></td>
            </tr>
            <tr>
              <td style="color:#7C8798;padding:6px 0;vertical-align:top;">Email</td>
              <td style="color:#E8ECF1;padding:6px 0;"><a href="mailto:${email}" style="color:#4FD1C5;">${email}</a></td>
            </tr>
            <tr>
              <td style="color:#7C8798;padding:6px 0;vertical-align:top;">Subject</td>
              <td style="color:#E8ECF1;padding:6px 0;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#121722;border-radius:8px;border:1px solid #232C3D;">
            <p style="color:#7C8798;margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
            <p style="color:#E8ECF1;margin:0;white-space:pre-line;line-height:1.6;">${message}</p>
          </div>
          <p style="color:#7C8798;font-size:12px;margin-top:20px;">
            Reply directly to this email to respond to ${name} at ${email}.
          </p>
          <div style="text-align:center;margin-top:20px;">
            <img src="cid:posterImage" alt="" style="width:100%;max-width:480px;border-radius:10px;" />
          </div>
        </div>`,
    });

    res
      .status(200)
      .json({ message: "Email sent successfully", id: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ error: "Error sending email" });
  }
});

app.post("/api/thankYouMail", async (req, res) => {
  const { email, name } = req.body || {};
  if (!email) return res.status(400).json({ error: "email is required." });

  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"Arun Kumar" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank you for contacting Arun Kumar",
      text: `Hi${name ? ` ${name}` : ""},\n\nThank you for contacting Arun Kumar through his portfolio. Your message has been received, and he'll get back to you as soon as possible.\n\n— Arun Kumar`,
      attachments: [
        {
          filename: "thank-you.jpg",
          path: path.join(__dirname, "images", "thankyou.jpg"),
          cid: "posterImage",
        },
      ],
      html: `
        <div style="background:#0B0E14;padding:24px;border-radius:12px;max-width:600px;margin:auto;font-family:Arial,sans-serif;">
          <h2 style="color:#E8ECF1;text-align:center;margin-top:0;">
            Thank you for contacting Arun Kumar${name ? `, ${name}` : ""}!
          </h2>
          <p style="color:#7C8798;text-align:center;line-height:1.6;">
            Your message was received through Arun's portfolio, and he appreciates you taking
            the time to reach out. He'll reply to you directly at this email address as soon
            as he can.
          </p>
          <div style="text-align:center;margin-top:20px;">
            <img src="cid:posterImage" alt="" style="width:100%;max-width:480px;border-radius:10px;" />
          </div>
          <p style="color:#3A4457;text-align:center;font-size:11px;margin-top:24px;">
            This is an automated confirmation — no need to reply to this specific email.
          </p>
        </div>`,
    });

    res
      .status(200)
      .json({ message: "Thank-you email sent", id: info.messageId });
  } catch (error) {
    console.error("Error sending thank-you email:", error.message);
    res.status(500).json({ error: "Error sending thank-you email" });
  }
});

// Only bind a port when run directly (local dev / a real Node host like
// Render or Railway). When imported by api/index.js for Vercel's serverless
// runtime, Vercel calls the exported app itself — it doesn't need a listener.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

module.exports = app;
