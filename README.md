# Pho Filet Website V2

🍜 A single-page restaurant website for **Pho Filet**, a Vietnamese restaurant in San Antonio, Texas.

**Live site:** https://phofilet.com

---

## About

My family restaurant didn't have a website so I created one. This is the V2 rewrite — rebuilt with React, featuring an AI-powered chatbot for customers to ask questions about the menu, hours, and location.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite | UI with hot reload |
| Styling | Custom CSS (CSS variables) | Responsive design, no frameworks |
| Backend | Node.js + Express | API server |
| AI | Google Gemini (`gemini-3.5-flash-lite`) | Chatbot responses |
| Analytics | Google Analytics | Visitor tracking |

## Project Structure

```
Pho-Filet-Website-V2/
├── public/                 # Static assets (logo)
├── src/                    # React app
│   ├── components/
│   │   ├── Header.jsx      # Logo, hours dropdown, contact buttons
│   │   ├── Menu.jsx        # Menu with search & category nav
│   │   ├── ChatWidget.jsx  # Floating AI chat bubble
│   │   └── Footer.jsx      # Simple footer
│   ├── data/
│   │   └── menu.js         # Menu items data (41 items, 9 categories)
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # All styles
├── server/                 # Express API server
│   ├── ai/
│   │   ├── gemini.js       # Gemini provider (active)
│   │   ├── claude.js       # Claude provider (swappable)
│   │   ├── openai.js       # OpenAI provider (stub)
│   │   └── index.js        # Provider switcher (reads AI_PROVIDER env var)
│   ├── routes/
│   │   └── chat.js         # POST /api/chat endpoint
│   ├── cache.js            # In-memory response cache
│   ├── .env                # API keys (not committed)
│   └── index.js            # Express entry point
├── index.html              # Vite entry point
├── vite.config.js          # Vite config (proxies /api to Express)
└── package.json
```

## Features

### Menu
- 41 menu items across 9 categories (Appetizers, Pho, Vermicelli, Plates, Fried Rice, Lo Mein, Vietnamese Sandwiches, Vegetarian, Drinks)
- Live search/filter by dish name or ingredient
- Sticky category navigation bar

### AI Chatbot
- Floating chat widget (bottom-right corner)
- Powered by Google Gemini (free tier)
- Answers questions about menu, hours, location, dietary needs
- Markdown-formatted responses (bold, lists, italics)
- **Swappable AI provider** — change `AI_PROVIDER` in `.env` to switch between `gemini`, `claude`, or `openai`

### Caching
- In-memory cache with 1-hour TTL
- Normalizes questions (lowercase, strip punctuation) so similar questions hit the same cache
- Only caches first messages (follow-ups need conversation context)
- Cache hits: **<0.1s** and **0 tokens** used

| Scenario | What happens | Speed |
|----------|-------------|-------|
| New question, no history | Calls Gemini, caches result | 3–6s |
| Same/similar question again | Returns cached response | <0.1s |
| Follow-up in conversation | Always calls Gemini (context matters) | 3–6s |
| Cache expires (1 hour) | Calls Gemini again, re-caches | 3–6s |

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Gemini API key (free: [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Setup
```bash
# Install dependencies
npm install

# Add your API key
# Edit server/.env and set GEMINI_API_KEY=your-key-here

# Start the API server
npm run server

# In another terminal, start the React dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run server` | Start Express API server (port 3000) |

## Switching AI Providers

The AI layer is designed to be swappable. Edit `server/.env`:

```env
# Options: gemini, claude, openai
AI_PROVIDER=gemini
```

Each provider follows the same interface: `chat(message, history) → { reply, usage }`.

## Roadmap

- [x] React rewrite with Vite
- [x] AI chatbot (Gemini)
- [x] Response caching
- [ ] SQLite logging (conversation logs, usage stats)
- [ ] Admin dashboard (health checks, analytics, chat logs)

## What I Learned

- **V1:** HTML, CSS, JavaScript fundamentals — layout and responsive design
- **V2:** React components, Vite tooling, REST APIs, AI API integration, caching strategies, provider abstraction pattern
