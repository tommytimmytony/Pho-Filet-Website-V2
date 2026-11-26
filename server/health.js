const { logHealthCheck } = require("./db");
const { chat } = require("./ai");

const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function runHealthCheck() {
  const start = Date.now();
  try {
    const reply = await chat([{ role: "user", content: "Hi" }]);
    const responseMs = Date.now() - start;
    logHealthCheck({ status: "ok", responseMs, errorMessage: null });
  } catch (err) {
    const responseMs = Date.now() - start;
    logHealthCheck({ status: "error", responseMs, errorMessage: err.message });
  }
}

function startHealthChecks() {
  // Run immediately on startup
  runHealthCheck();
  // Then every 5 minutes
  setInterval(runHealthCheck, PING_INTERVAL);
  console.log("Health checks started (every 5 min)");
}

module.exports = { startHealthChecks };
