const express = require("express");
const { logEvent, getEngagementStats, getDailyVisits } = require("../db");

const router = express.Router();

// Log an event (page_visit, chat_open, message_sent)
router.post("/", (req, res) => {
  const { event, sessionId } = req.body;
  const allowed = ["page_visit", "chat_open", "message_sent"];
  if (!event || !allowed.includes(event)) {
    return res.status(400).json({ error: `Event must be one of: ${allowed.join(", ")}` });
  }
  logEvent(event, sessionId || null);
  res.json({ success: true });
});

// Get engagement stats
router.get("/stats", (req, res) => {
  res.json(getEngagementStats());
});

// Get daily visit breakdown
router.get("/daily", (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 7, 90);
  res.json(getDailyVisits(days));
});

module.exports = router;
