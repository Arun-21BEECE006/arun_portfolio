const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function checkCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminHash) {
    throw new Error(
      "ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set. Copy .env.example to .env and fill them in."
    );
  }
  if (email !== adminEmail) return false;
  return bcrypt.compareSync(password, adminHash);
}

function signToken(email) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in .env");
  return jwt.sign({ email, role: "admin" }, secret, { expiresIn: "7d" });
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);
    if (payload.role !== "admin") throw new Error("Not admin");
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { checkCredentials, signToken, requireAdmin };
