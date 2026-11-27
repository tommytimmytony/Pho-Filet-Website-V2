// Simple in-memory cache with TTL (time-to-live)
class ChatCache {
  constructor(ttlMinutes = 60) {
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000;
  }

  // Normalize the question so small variations hit the same cache entry
  _makeKey(message) {
    return message
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Load saved manual entries from SQLite on startup
  loadSaved() {
    const { getSavedCache } = require("./db");
    const saved = getSavedCache();
    for (const { question, answer } of saved) {
      const key = this._makeKey(question);
      // Manual entries never expire — use Infinity as timestamp
      this.cache.set(key, { question, reply: answer, timestamp: Infinity, manual: true });
    }
    if (saved.length > 0) {
      console.log(`Loaded ${saved.length} saved cache entries from database`);
    }
  }

  get(message) {
    const key = this._makeKey(message);
    const entry = this.cache.get(key);
    if (!entry) return null;
    // Manual entries (Infinity timestamp) never expire
    if (entry.timestamp !== Infinity && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.reply;
  }

  set(message, reply) {
    const key = this._makeKey(message);
    this.cache.set(key, { question: message, reply, timestamp: Date.now() });
  }

  get size() {
    return this.cache.size;
  }

  // Return all cached entries (for the dashboard)
  getAll() {
    const now = Date.now();
    const entries = [];
    for (const [key, entry] of this.cache) {
      if (entry.timestamp !== Infinity && now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        continue;
      }
      entries.push({
        key,
        question: entry.question,
        reply: entry.reply,
        manual: entry.manual || false,
        addedAt: entry.timestamp === Infinity ? "Saved" : new Date(entry.timestamp).toISOString(),
      });
    }
    return entries;
  }

  // Manual entry — save to memory AND SQLite
  setManual(question, reply) {
    const key = this._makeKey(question);
    this.cache.set(key, { question, reply, timestamp: Infinity, manual: true });
    const { addSavedCache } = require("./db");
    addSavedCache(question, reply);
  }

  // Delete from memory AND SQLite (if manual)
  delete(key) {
    const entry = this.cache.get(key);
    if (entry?.manual) {
      const { deleteSavedCache } = require("./db");
      deleteSavedCache(entry.question);
    }
    return this.cache.delete(key);
  }
}

module.exports = new ChatCache(60 * 24 * 14);
