const express = require("express");
const { getStats, getRecentLogs, getHourlyActivity, getTopQuestions, getDailyChats, getHealthSummary, getHealthHistory } = require("../db");
const cache = require("../cache");

const router = express.Router();

// Overview stats
router.get("/", (req, res) => {
  res.json(getStats());
});

// Recent chat logs
router.get("/logs", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  res.json(getRecentLogs(limit));
});

// Hourly activity for today
router.get("/activity", (req, res) => {
  res.json(getHourlyActivity());
});

// Most asked questions
router.get("/top-questions", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  res.json(getTopQuestions(limit));
});

// Daily chat volume (last N days)
router.get("/daily-chats", (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 7, 90);
  res.json(getDailyChats(days));
});

// Health check summary (last 24h)
router.get("/health", (req, res) => {
  res.json(getHealthSummary());
});

// Health check history (for chart)
router.get("/health/history", (req, res) => {
  const hours = Math.min(parseInt(req.query.hours) || 24, 168);
  res.json(getHealthHistory(hours));
});

// List all cached entries
router.get("/cache", (req, res) => {
  res.json(cache.getAll());
});

// Add a manual cache entry
router.post("/cache", (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: "Both question and answer are required" });
  }
  cache.setManual(question.trim(), answer.trim());
  res.json({ success: true, size: cache.size });
});

// Delete a cache entry
router.delete("/cache/:key", (req, res) => {
  const deleted = cache.delete(req.params.key);
  res.json({ success: deleted, size: cache.size });
});

module.exports = router;
