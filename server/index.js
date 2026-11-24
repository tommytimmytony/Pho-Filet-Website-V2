const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const chatRoutes = require("./routes/chat");
const statsRoutes = require("./routes/stats");
const eventsRoutes = require("./routes/events");
const { requireAuth, handleLogin, handleCheck, handleLogout } = require("./auth");
const cache = require("./cache");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Public API routes
app.use("/api/chat", chatRoutes);

// Auth routes (public)
app.post("/api/auth/login", handleLogin);
app.get("/api/auth/check", handleCheck);
app.post("/api/auth/logout", handleLogout);

// Event logging POST is public (visitors trigger page_visit, chat_open, message_sent)
const { logEvent } = require("./db");
app.post("/api/events", (req, res) => {
  const { event, sessionId } = req.body;
  const allowed = ["page_visit", "chat_open", "message_sent"];
  if (!event || !allowed.includes(event)) {
    return res.status(400).json({ error: `Event must be one of: ${allowed.join(", ")}` });
  }
  logEvent(event, sessionId || null);
  res.json({ success: true });
});

// Protected API routes (dashboard only)
app.use("/api/stats", requireAuth, statsRoutes);
app.use("/api/events", requireAuth, eventsRoutes);

// Serve the built React app (production) or project root (dev fallback)
const distPath = path.join(__dirname, "..", "dist");
const fs = require("fs");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback: serve index.html for any non-API route (e.g. /dashboard)
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, "..")));
}

app.listen(PORT, () => {
  cache.loadSaved();
  console.log(`Pho Filet server running at http://localhost:${PORT}`);
});
