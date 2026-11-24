const crypto = require("crypto");

// Generate a random token on each server start
const TOKEN_SECRET = crypto.randomBytes(32).toString("hex");
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function generateToken() {
  const payload = { created: Date.now() };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("hex");
  return `${data}.${signature}`;
}

function verifyToken(token) {
  if (!token) return false;
  const [data, signature] = token.split(".");
  if (!data || !signature) return false;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("hex");
  if (signature !== expected) return false;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64").toString());
    return Date.now() - payload.created < TOKEN_EXPIRY;
  } catch {
    return false;
  }
}

// Middleware: protect dashboard API routes
function requireAuth(req, res, next) {
  const token = req.cookies?.dashboard_token;
  if (verifyToken(token)) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// Login route handler
function handleLogin(req, res) {
  const { password } = req.body;
  const correct = process.env.DASHBOARD_PASSWORD;
  if (!correct) {
    return res.status(500).json({ error: "DASHBOARD_PASSWORD not set in .env" });
  }
  if (password === correct) {
    const token = generateToken();
    res.cookie("dashboard_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: TOKEN_EXPIRY,
    });
    return res.json({ success: true });
  }
  res.status(401).json({ error: "Wrong password" });
}

// Check if user is authenticated
function handleCheck(req, res) {
  const token = req.cookies?.dashboard_token;
  res.json({ authenticated: verifyToken(token) });
}

// Logout
function handleLogout(req, res) {
  res.clearCookie("dashboard_token");
  res.json({ success: true });
}

module.exports = { requireAuth, handleLogin, handleCheck, handleLogout };
