const path = require("path");
const Database = require("better-sqlite3");

const db = new Database(path.join(__dirname, "chat.db"));

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");

// Create the chat_logs table
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT (datetime('now')),
    user_message TEXT NOT NULL,
    bot_reply TEXT,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    response_ms INTEGER DEFAULT 0,
    cached INTEGER DEFAULT 0,
    success INTEGER DEFAULT 1,
    error_message TEXT
  )
`);

// Create the saved_cache table (the "notebook")
db.exec(`
  CREATE TABLE IF NOT EXISTS saved_cache (
    question TEXT PRIMARY KEY,
    answer TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// Create the events table (page visits, chat opens, messages sent)
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT (datetime('now')),
    event_type TEXT NOT NULL,
    session_id TEXT
  )
`);

const insertLog = db.prepare(`
  INSERT INTO chat_logs (user_message, bot_reply, input_tokens, output_tokens, response_ms, cached, success, error_message)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

function logChat({ userMessage, botReply, inputTokens, outputTokens, responseMs, cached, success, errorMessage }) {
  insertLog.run(
    userMessage,
    botReply || null,
    inputTokens || 0,
    outputTokens || 0,
    responseMs || 0,
    cached ? 1 : 0,
    success ? 1 : 0,
    errorMessage || null
  );
}

// Dashboard queries
function getStats() {
  const total = db.prepare("SELECT COUNT(*) as count FROM chat_logs").get();
  const today = db.prepare("SELECT COUNT(*) as count FROM chat_logs WHERE timestamp >= date('now')").get();
  const cached = db.prepare("SELECT COUNT(*) as count FROM chat_logs WHERE cached = 1").get();
  const errors = db.prepare("SELECT COUNT(*) as count FROM chat_logs WHERE success = 0").get();
  const avgResponse = db.prepare("SELECT AVG(response_ms) as avg FROM chat_logs WHERE success = 1 AND cached = 0").get();
  const totalTokens = db.prepare("SELECT SUM(input_tokens + output_tokens) as total FROM chat_logs").get();

  return {
    totalChats: total.count,
    todayChats: today.count,
    cachedChats: cached.count,
    cacheHitRate: total.count > 0 ? Math.round((cached.count / total.count) * 100) : 0,
    errorCount: errors.count,
    errorRate: total.count > 0 ? Math.round((errors.count / total.count) * 100) : 0,
    avgResponseMs: Math.round(avgResponse.avg || 0),
    totalTokens: totalTokens.total || 0,
  };
}

function getRecentLogs(limit = 50) {
  return db.prepare("SELECT * FROM chat_logs ORDER BY id DESC LIMIT ?").all(limit);
}

function getHourlyActivity() {
  return db.prepare(`
    SELECT strftime('%H', timestamp) as hour, COUNT(*) as count
    FROM chat_logs
    WHERE timestamp >= date('now')
    GROUP BY hour
    ORDER BY hour
  `).all();
}

function getTopQuestions(limit = 10) {
  return db.prepare(`
    SELECT user_message, COUNT(*) as count
    FROM chat_logs
    GROUP BY user_message
    ORDER BY count DESC
    LIMIT ?
  `).all(limit);
}

// Event tracking
const insertEvent = db.prepare("INSERT INTO events (event_type, session_id) VALUES (?, ?)");

function logEvent(eventType, sessionId) {
  insertEvent.run(eventType, sessionId || null);
}

function getEngagementStats() {
  const pageVisits = db.prepare("SELECT COUNT(*) as count FROM events WHERE event_type = 'page_visit'").get();
  const chatOpens = db.prepare("SELECT COUNT(*) as count FROM events WHERE event_type = 'chat_open'").get();
  const messagesSent = db.prepare("SELECT COUNT(*) as count FROM events WHERE event_type = 'message_sent'").get();

  const todayVisits = db.prepare("SELECT COUNT(*) as count FROM events WHERE event_type = 'page_visit' AND timestamp >= date('now')").get();
  const todayOpens = db.prepare("SELECT COUNT(*) as count FROM events WHERE event_type = 'chat_open' AND timestamp >= date('now')").get();
  const todayMessages = db.prepare("SELECT COUNT(*) as count FROM events WHERE event_type = 'message_sent' AND timestamp >= date('now')").get();

  // Unique visitors (by session_id)
  const uniqueVisitors = db.prepare("SELECT COUNT(DISTINCT session_id) as count FROM events WHERE event_type = 'page_visit' AND session_id IS NOT NULL").get();
  const todayUnique = db.prepare("SELECT COUNT(DISTINCT session_id) as count FROM events WHERE event_type = 'page_visit' AND session_id IS NOT NULL AND timestamp >= date('now')").get();

  return {
    total: { pageVisits: pageVisits.count, chatOpens: chatOpens.count, messagesSent: messagesSent.count, uniqueVisitors: uniqueVisitors.count },
    today: { pageVisits: todayVisits.count, chatOpens: todayOpens.count, messagesSent: todayMessages.count, uniqueVisitors: todayUnique.count },
    chatOpenRate: pageVisits.count > 0 ? Math.round((chatOpens.count / pageVisits.count) * 100) : 0,
    messageRate: chatOpens.count > 0 ? Math.round((messagesSent.count / chatOpens.count) * 100) : 0,
  };
}

function getDailyVisits(days = 7) {
  return db.prepare(`
    SELECT date(timestamp) as day, 
           COUNT(CASE WHEN event_type = 'page_visit' THEN 1 END) as visits,
           COUNT(CASE WHEN event_type = 'chat_open' THEN 1 END) as opens,
           COUNT(CASE WHEN event_type = 'message_sent' THEN 1 END) as messages
    FROM events
    WHERE timestamp >= date('now', '-' || ? || ' days')
    GROUP BY day
    ORDER BY day
  `).all(days);
}

function getDailyChats(days = 7) {
  return db.prepare(`
    SELECT date(timestamp) as day,
           COUNT(*) as total,
           COUNT(CASE WHEN cached = 1 THEN 1 END) as cached,
           COUNT(CASE WHEN cached = 0 THEN 1 END) as ai
    FROM chat_logs
    WHERE timestamp >= date('now', '-' || ? || ' days')
    GROUP BY day
    ORDER BY day
  `).all(days);
}

// Saved cache (manual Q&A that survives restarts)
function getSavedCache() {
  return db.prepare("SELECT question, answer FROM saved_cache ORDER BY created_at").all();
}

function addSavedCache(question, answer) {
  db.prepare("INSERT OR REPLACE INTO saved_cache (question, answer) VALUES (?, ?)").run(question, answer);
}

function deleteSavedCache(question) {
  return db.prepare("DELETE FROM saved_cache WHERE question = ?").run(question).changes > 0;
}

module.exports = { logChat, getStats, getRecentLogs, getHourlyActivity, getTopQuestions, getSavedCache, addSavedCache, deleteSavedCache, logEvent, getEngagementStats, getDailyVisits, getDailyChats };
