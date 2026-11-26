import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
function StatCard({ label, value, detail }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {detail && <span className="stat-detail">{detail}</span>}
    </div>
  );
}

const CHART_COLORS = ["#c0392b", "#e74c3c", "#f39c12", "#27ae60", "#3498db", "#9b59b6"];

function DailyChatChart({ data }) {
  if (!data || data.length === 0) return <p className="dash-empty">No chat data yet</p>;
  const formatted = data.map((d) => ({
    ...d,
    day: d.day.slice(5), // "11-24" instead of "2026-11-24"
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="day" fontSize={12} />
        <YAxis allowDecimals={false} fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar dataKey="ai" name="AI responses" fill="#c0392b" stackId="a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="cached" name="Cached" fill="#f39c12" stackId="a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CacheDonutChart({ stats }) {
  if (!stats || stats.totalChats === 0) return <p className="dash-empty">No data yet</p>;
  const data = [
    { name: "Cache hits", value: stats.cachedChats },
    { name: "AI calls", value: stats.totalChats - stats.cachedChats },
  ];
  const colors = ["#f39c12", "#c0392b"];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function HourlyActivityChart({ data }) {
  if (!data || data.length === 0) return <p className="dash-empty">No activity today</p>;
  // Fill all 24 hours
  const hourMap = Object.fromEntries(data.map((d) => [d.hour, d.count]));
  const full = Array.from({ length: 24 }, (_, i) => ({
    hour: String(i).padStart(2, "0"),
    count: hourMap[String(i).padStart(2, "0")] || 0,
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={full}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="hour" fontSize={11} interval={2} />
        <YAxis allowDecimals={false} fontSize={12} />
        <Tooltip labelFormatter={(h) => `${h}:00`} />
        <Bar dataKey="count" name="Chats" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DailyVisitorsChart({ data }) {
  if (!data || data.length === 0) return <p className="dash-empty">No visit data yet</p>;
  const formatted = data.map((d) => ({
    ...d,
    day: d.day.slice(5),
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="day" fontSize={12} />
        <YAxis allowDecimals={false} fontSize={12} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="visits" name="Visits" stroke="#c0392b" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="opens" name="Chat opens" stroke="#f39c12" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="messages" name="Messages" stroke="#3498db" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function LogRow({ log, onCorrect }) {
  const [editing, setEditing] = useState(false);
  const [corrected, setCorrected] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setCorrected(log.bot_reply || "");
    setEditing(true);
  }

  async function handleSave() {
    if (!corrected.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/stats/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: log.user_message, answer: corrected.trim() }),
      });
      setEditing(false);
      onCorrect();
    } catch (err) {
      console.error("Failed to save correction:", err);
    } finally {
      setSaving(false);
    }
  }

  const time = new Date(log.timestamp + "Z").toLocaleString();
  return (
    <>
      <tr className={log.success ? "" : "log-error"}>
        <td>{time}</td>
        <td className="log-message">{log.user_message}</td>
        <td className="log-reply">
          {log.success ? (log.bot_reply?.slice(0, 120) + (log.bot_reply?.length > 120 ? "…" : "")) : log.error_message}
        </td>
        <td>{log.response_ms}ms</td>
        <td>{log.input_tokens + log.output_tokens}</td>
        <td>{log.cached ? "✅" : ""}</td>
        <td>{log.success ? "✅" : "❌"}</td>
        <td>
          {log.success && !editing && (
            <button className="correct-btn" onClick={startEdit} title="Correct this answer">✏️</button>
          )}
        </td>
      </tr>
      {editing && (
        <tr className="correct-row">
          <td colSpan={8}>
            <div className="correct-form">
              <span className="correct-label">Correct answer for: <strong>{log.user_message}</strong></span>
              <textarea
                className="correct-textarea"
                value={corrected}
                onChange={(e) => setCorrected(e.target.value)}
                rows={3}
              />
              <div className="correct-actions">
                <button className="correct-save" onClick={handleSave} disabled={saving || !corrected.trim()}>
                  {saving ? "Saving…" : "Save to cache"}
                </button>
                <button className="correct-cancel" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function CacheManager({ onUpdate }) {
  const [entries, setEntries] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editAnswer, setEditAnswer] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const fetchCache = useCallback(async () => {
    try {
      const res = await fetch("/api/stats/cache");
      setEntries(await res.json());
    } catch (err) {
      console.error("Failed to fetch cache:", err);
    }
  }, []);

  useEffect(() => { fetchCache(); }, [fetchCache]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/stats/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), answer: answer.trim() }),
      });
      setQuestion("");
      setAnswer("");
      fetchCache();
      onUpdate();
    } catch (err) {
      console.error("Failed to add cache entry:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(key) {
    try {
      await fetch(`/api/stats/cache/${encodeURIComponent(key)}`, { method: "DELETE" });
      fetchCache();
      onUpdate();
    } catch (err) {
      console.error("Failed to delete cache entry:", err);
    }
  }

  function startEdit(entry) {
    setEditingKey(entry.key);
    setEditAnswer(entry.reply);
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditAnswer("");
  }

  async function handleEditSave(entry) {
    if (!editAnswer.trim()) return;
    setEditSaving(true);
    try {
      // Delete old entry then re-add with updated answer
      await fetch(`/api/stats/cache/${encodeURIComponent(entry.key)}`, { method: "DELETE" });
      await fetch("/api/stats/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: entry.question || entry.key, answer: editAnswer.trim() }),
      });
      setEditingKey(null);
      setEditAnswer("");
      fetchCache();
      onUpdate();
    } catch (err) {
      console.error("Failed to update cache entry:", err);
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <>
      <form className="cache-form" onSubmit={handleAdd}>
        <input
          className="cache-input"
          type="text"
          placeholder="Question (e.g., Do you have gluten free noodles?)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <textarea
          className="cache-input cache-textarea"
          placeholder="Answer (supports **Markdown**)"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={2}
        />
        <button className="cache-add-btn" type="submit" disabled={saving || !question.trim() || !answer.trim()}>
          {saving ? "Adding…" : "Add to cache"}
        </button>
      </form>

      {entries.length === 0 ? (
        <p className="dash-empty">No cached responses yet</p>
      ) : (
        <div className="cache-list">
          {entries.map((entry) => (
            <div key={entry.key} className={`cache-entry ${entry.manual ? "cache-manual" : ""}`}>
              <div className="cache-entry-header">
                <span className="cache-question">{entry.question || entry.key}</span>
                <div className="cache-entry-actions">
                  {entry.manual && <span className="cache-badge">Manual</span>}
                  <button className="cache-edit" onClick={() => startEdit(entry)} title="Edit answer">✏️</button>
                  <button className="cache-delete" onClick={() => handleDelete(entry.key)} title="Remove from cache">✕</button>
                </div>
              </div>
              {editingKey === entry.key ? (
                <div className="cache-edit-form">
                  <textarea
                    className="cache-input cache-textarea"
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="cache-edit-actions">
                    <button className="cache-save-btn" onClick={() => handleEditSave(entry)} disabled={editSaving || !editAnswer.trim()}>
                      {editSaving ? "Saving…" : "Save"}
                    </button>
                    <button className="cache-cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="cache-answer">{entry.reply.slice(0, 150)}{entry.reply.length > 150 ? "…" : ""}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setError("Wrong password");
        setPassword("");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>🍜 Dashboard</h1>
        <p>Enter the admin password to continue.</p>
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="login-error">{error}</p>}
        <button className="login-btn" type="submit" disabled={loading || !password}>
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(null); // null = checking
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [topQuestions, setTopQuestions] = useState([]);
  const [engagement, setEngagement] = useState(null);
  const [dailyChats, setDailyChats] = useState([]);
  const [hourlyActivity, setHourlyActivity] = useState([]);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, logsRes, topRes, engRes, dailyChatsRes, hourlyRes, dailyVisitsRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/stats/logs?limit=50"),
        fetch("/api/stats/top-questions"),
        fetch("/api/events/stats"),
        fetch("/api/stats/daily-chats"),
        fetch("/api/stats/activity"),
        fetch("/api/events/daily"),
      ]);
      if (statsRes.status === 401) { setAuthenticated(false); return; }
      setStats(await statsRes.json());
      setLogs(await logsRes.json());
      setTopQuestions(await topRes.json());
      setEngagement(await engRes.json());
      setDailyChats(await dailyChatsRes.json());
      setHourlyActivity(await hourlyRes.json());
      setDailyVisits(await dailyVisitsRes.json());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchData();
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData, autoRefresh, authenticated]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
  }

  if (authenticated === null) {
    return <div className="dash-loading">Checking authentication…</div>;
  }
  if (!authenticated) {
    return <LoginScreen onLogin={() => { setAuthenticated(true); }} />;
  }
  if (loading) {
    return <div className="dash-loading">Loading dashboard…</div>;
  }

  return (
    <div className="dash">
      <header className="dash-header">
        <div className="dash-header-left">
          <Link to="/" className="dash-back">← Back to site</Link>
          <h1>🍜 Pho Filet Dashboard</h1>
        </div>
        <div className="dash-header-right">
          <label className="dash-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (10s)
          </label>
          <button className="dash-refresh-btn" onClick={fetchData}>Refresh now</button>
          <button className="dash-logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <section className="dash-section">
        <h2>💬 Chat Q&A Manager</h2>
        <p className="dash-hint">Add, edit, or remove pre-loaded answers. Common questions will respond instantly without using AI tokens.</p>
        <CacheManager onUpdate={fetchData} />
      </section>

      <section className="dash-section">
        <h2>📝 Recent conversations</h2>
        <p className="dash-hint">Review AI responses and click ✏️ to correct wrong answers — corrections become cached Q&A entries.</p>
        {logs.length === 0 ? (
          <p className="dash-empty">No conversations yet. Try chatting on the main site!</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Question</th>
                  <th>Response</th>
                  <th>Speed</th>
                  <th>Tokens</th>
                  <th>Cached</th>
                  <th>OK</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <LogRow key={log.id} log={log} onCorrect={fetchData} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {stats && (
        <section className="stat-grid">
          <StatCard label="Total chats" value={stats.totalChats} />
          <StatCard label="Today" value={stats.todayChats} />
          <StatCard label="Cache hit rate" value={`${stats.cacheHitRate}%`} detail={`${stats.cachedChats} cached`} />
          <StatCard label="Avg response" value={`${stats.avgResponseMs}ms`} detail="Excluding cached" />
          <StatCard label="Error rate" value={`${stats.errorRate}%`} detail={`${stats.errorCount} errors`} />
          <StatCard label="Tokens used" value={stats.totalTokens.toLocaleString()} />
        </section>
      )}

      <div className="chart-grid">
        <section className="dash-section chart-card">
          <h2>📊 Daily Chat Volume</h2>
          <DailyChatChart data={dailyChats} />
        </section>
        <section className="dash-section chart-card">
          <h2>🍩 Cache Hits vs AI Calls</h2>
          <CacheDonutChart stats={stats} />
        </section>
        <section className="dash-section chart-card">
          <h2>⏰ Hourly Activity (Today)</h2>
          <HourlyActivityChart data={hourlyActivity} />
        </section>
        <section className="dash-section chart-card">
          <h2>📈 Daily Visitors</h2>
          <DailyVisitorsChart data={dailyVisits} />
        </section>
      </div>

      {engagement && (
        <section className="dash-section">
          <h2>Engagement</h2>
          <div className="stat-grid">
            <StatCard label="Page visits" value={engagement.today.pageVisits} detail={`${engagement.total.pageVisits} total`} />
            <StatCard label="Unique visitors" value={engagement.today.uniqueVisitors} detail={`${engagement.total.uniqueVisitors} total`} />
            <StatCard label="Chat opens" value={engagement.today.chatOpens} detail={`${engagement.chatOpenRate}% of visitors`} />
            <StatCard label="Messages sent" value={engagement.today.messagesSent} detail={`${engagement.messageRate}% of chat opens`} />
          </div>
          <div className="funnel">
            <div className="funnel-step">
              <div className="funnel-bar" style={{ width: "100%" }} />
              <span className="funnel-label">Visit site</span>
              <span className="funnel-count">{engagement.total.pageVisits}</span>
            </div>
            <div className="funnel-step">
              <div className="funnel-bar funnel-mid" style={{ width: engagement.chatOpenRate + "%" }} />
              <span className="funnel-label">Open chat</span>
              <span className="funnel-count">{engagement.total.chatOpens} ({engagement.chatOpenRate}%)</span>
            </div>
            <div className="funnel-step">
              <div className="funnel-bar funnel-end" style={{ width: (engagement.total.pageVisits > 0 ? Math.round((engagement.total.messagesSent / engagement.total.pageVisits) * 100) : 0) + "%" }} />
              <span className="funnel-label">Send message</span>
              <span className="funnel-count">{engagement.total.messagesSent} ({engagement.total.pageVisits > 0 ? Math.round((engagement.total.messagesSent / engagement.total.pageVisits) * 100) : 0}%)</span>
            </div>
          </div>
        </section>
      )}

      <div className="dash-columns">
        <section className="dash-section dash-top-questions">
          <h2>Top questions</h2>
          {topQuestions.length === 0 ? (
            <p className="dash-empty">No data yet</p>
          ) : (
            <ol className="top-list">
              {topQuestions.map((q, i) => (
                <li key={i}>
                  <span className="top-question">{q.user_message}</span>
                  <span className="top-count">{q.count}×</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="dash-section dash-health">
          <h2>System health</h2>
          <div className="health-grid">
            <div className="health-item">
              <span className="health-dot" data-status={stats && stats.errorRate < 10 ? "ok" : "warn"} />
              <span>Gemini API</span>
              <span className="health-value">{stats?.errorRate < 10 ? "Healthy" : "Degraded"}</span>
            </div>
            <div className="health-item">
              <span className="health-dot" data-status="ok" />
              <span>Cache</span>
              <span className="health-value">{stats?.cacheHitRate}% hit rate</span>
            </div>
            <div className="health-item">
              <span className="health-dot" data-status={stats && stats.avgResponseMs < 5000 ? "ok" : "warn"} />
              <span>Response time</span>
              <span className="health-value">{stats?.avgResponseMs}ms avg</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
