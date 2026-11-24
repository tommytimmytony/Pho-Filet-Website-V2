// Generate a simple session ID per browser tab
const sessionId = crypto.randomUUID();

export function trackEvent(event) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, sessionId }),
  }).catch(() => {}); // Fire and forget — don't break the app if tracking fails
}

export { sessionId };
