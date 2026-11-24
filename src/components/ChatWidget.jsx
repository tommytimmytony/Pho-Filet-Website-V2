import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { trackEvent } from "../utils/tracking";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const hasTrackedOpen = useRef(false);
  const [messages, setMessages] = useState([
    { role: "greeting", content: "Hi! 👋 Ask me anything about our menu, hours, or location." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && !hasTrackedOpen.current) {
      trackEvent("chat_open");
      hasTrackedOpen.current = true;
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    trackEvent("message_sent");

    const userMsg = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.filter((m) => m.role !== "greeting") }),
      });
      const data = await res.json();
      setMessages([...history, { role: "assistant", content: data.reply || data.error }]);
    } catch {
      setMessages([...history, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-widget">
      <button
        className="chat-toggle"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={handleToggle}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <span className="chat-header-icon">🍜</span>
            <div>
              <h2>Pho Filet Assistant</h2>
              <p>Ask about our menu, hours & more</p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === "user" ? "user" : "bot"}`} role={msg.role === "greeting" ? "status" : undefined}>
                  {msg.role === "user" ? msg.content : <Markdown>{msg.content}</Markdown>}
              </div>
            ))}
            {loading && (
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              className="chat-input"
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button className="chat-send" type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
