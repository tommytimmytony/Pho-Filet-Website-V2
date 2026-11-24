const express = require("express");
const ai = require("../ai");
const cache = require("../cache");
const { logChat } = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  // Only cache when there's no prior conversation history (first question)
  const isFirstMessage = !history || history.length === 0;

  if (isFirstMessage) {
    const cached = cache.get(message);
    if (cached) {
      console.log(`Cache hit (${cache.size} entries)`);
      logChat({ userMessage: message, botReply: cached, cached: true, success: true });
      return res.json({ reply: cached, usage: { inputTokens: 0, outputTokens: 0 }, cached: true });
    }
  }

  try {
    const start = Date.now();
    const result = await ai.chat(message, history || []);
    const duration = Date.now() - start;
    console.log(`AI response: ${duration}ms, ${result.usage.inputTokens}+${result.usage.outputTokens} tokens`);

    if (isFirstMessage) {
      cache.set(message, result.reply);
    }

    logChat({
      userMessage: message,
      botReply: result.reply,
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      responseMs: duration,
      cached: false,
      success: true,
    });

    res.json({
      reply: result.reply,
      usage: result.usage,
      cached: false,
    });
  } catch (err) {
    console.error("Chat error:", err.message);
    logChat({ userMessage: message, success: false, errorMessage: err.message });
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
