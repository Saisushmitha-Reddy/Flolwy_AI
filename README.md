# ⚡ Flowly — AI-Powered Meeting Productivity Assistant

> Turn every meeting into a prioritized action plan — in real time or from a recording.

![Flowly](https://img.shields.io/badge/Flowly-v1.0.0-6c63ff?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)
![Claude](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## 📌 What is Flowly?

Flowly is an AI productivity assistant that eliminates the cognitive overhead that follows every meeting. After 6–8 back-to-back calls, no one has time to reconstruct what was decided, extract action items, and figure out what to do next — across 5 different apps.

Flowly closes the full loop:

```
Meeting audio  →  Transcript  →  Structured summary  →  Action items  →  Task dashboard
```

It supports two first-class capture modes:

| Mode | How it works |
|------|-------------|
| 🎙 **Live Mode** | Flowly runs in your browser during the meeting, transcribing in real time. Summary + tasks are ready the moment you end the session. |
| 📁 **Upload Mode** | Record your meeting any way you like, upload the file (or paste notes), and let Flowly process it after. |

**Core design principle:** The AI proposes. The human confirms. No task is ever added to your dashboard without your explicit approval.

---

## ✨ Features

- 🎙 **Live Meeting Mode** — Browser mic capture via Web Speech API, real-time transcript, live action item feed
- 📁 **Upload Mode** — Drag & drop audio files or paste transcripts; same pipeline, same output
- 🤖 **AI-powered processing** — Claude Sonnet generates structured summaries: Key Points · Decisions · Open Questions
- ✅ **Review & Confirm flow** — Edit, accept, or reject each task before it hits your board
- 📊 **Task Dashboard** — Filter by status/priority, update task states, track progress
- 🕐 **Meeting History** — Log of all processed meetings
- ⚙️ **Preferences** — Configurable reminders and end-of-day summaries

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router v6 |
| Build tool | Vite |
| Backend | Node.js + Express |
| AI | Anthropic Claude Sonnet (`claude-sonnet-4-20250514`) |
| Speech | Web Speech API (browser-native, no third-party cost) |
| Styling | Plain CSS with CSS variables (no UI library dependency) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/flowly.git
cd flowly
```

### 2. Install dependencies

```bash
npm run install:all
```

This installs both root (server) and `client/` dependencies in one command.

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_key_here
PORT=3001
```

### 4. Run in development

```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend** → http://localhost:5173 (Vite dev server with HMR)
- **Backend API** → http://localhost:3001

### 5. Production build

```bash
npm run build       # builds React app to client/dist/
NODE_ENV=production npm run server   # serves API + static build
```

---

## 📁 Project Structure

```
flowly/
├── server/
│   └── index.js          # Express API (process-meeting, live-actions, upload-audio)
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # Navigation with live badges
│   │   │   └── UI.jsx          # Reusable components (Button, Card, Tag, etc.)
│   │   ├── pages/
│   │   │   ├── CapturePage.jsx  # Live Mode + Upload Mode
│   │   │   ├── SummaryPage.jsx  # AI-generated meeting summary
│   │   │   ├── ReviewPage.jsx   # Task review & confirm flow
│   │   │   ├── DashboardPage.jsx # Task management board
│   │   │   ├── HistoryPage.jsx  # Meeting history log
│   │   │   └── SettingsPage.jsx # User preferences
│   │   ├── hooks/
│   │   │   ├── useMeetingStore.js  # Global in-memory state
│   │   │   └── useToast.js         # Toast notification hook
│   │   ├── utils/
│   │   │   ├── api.js       # All fetch calls to /api
│   │   │   └── helpers.js   # Formatters, demo data, utilities
│   │   ├── styles/
│   │   │   └── globals.css  # CSS variables + global animations
│   │   ├── App.jsx          # Route definitions
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   └── vite.config.js
├── .env.example
├── .gitignore
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/process-meeting` | Full AI analysis — summary + tasks |
| `POST` | `/api/live-actions` | Extract action items from partial transcript |
| `POST` | `/api/upload-audio` | Accept audio file upload |

### `POST /api/process-meeting`

**Request:**
```json
{
  "transcript": "Meeting transcript text...",
  "title": "Product Sync",
  "mode": "live"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Product Sync",
    "mode": "live",
    "date": "2026-03-25T10:00:00.000Z",
    "discussion_points": ["..."],
    "decisions": ["..."],
    "open_questions": ["..."],
    "tasks": [
      {
        "description": "Assign onboarding flow to frontend team",
        "priority": "high",
        "due_date": "Today",
        "assignee": "Marcus"
      }
    ]
  }
}
```

---

## 🎙 Live Mode — How the Mic Capture Works

Flowly uses the browser's native **Web Speech API** (`webkitSpeechRecognition`) — no third-party transcription service required. This means:

- ✅ Works across all browser-based meeting platforms (Zoom, Meet, Teams, Webex)
- ✅ No additional cost or API key needed for transcription
- ✅ Audio never leaves the browser until you choose to process it
- ⚠️ Best supported in Chrome and Edge (Firefox/Safari have limited support)

When mic access is unavailable (e.g. in demo environments), Flowly automatically falls back to a demo transcript so the full pipeline can still be demonstrated.

---

## 🔊 Adding Real Audio Transcription (Upload Mode)

The upload endpoint currently acknowledges the file and returns a prompt to paste the transcript. To wire up real audio transcription, integrate one of the following in `server/index.js`:

**Option A — OpenAI Whisper:**
```javascript
const { OpenAI } = require("openai");
const openai = new OpenAI();

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream(tempFilePath),
  model: "whisper-1",
});
const transcript = transcription.text;
```

**Option B — AssemblyAI:**
```javascript
const { AssemblyAI } = require("assemblyai");
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_KEY });
const transcript = await client.transcripts.transcribe({ audio: audioBuffer });
```

**Option C — Deepgram:**
```javascript
const { createClient } = require("@deepgram/sdk");
const deepgram = createClient(process.env.DEEPGRAM_KEY);
const { result } = await deepgram.listen.prerecorded.transcribeFile(buffer, { model: "nova-2" });
```

---

## 🗺 Roadmap

This repo implements **Phase 1** of the Flowly PRD.

| Phase | Theme | Status |
|-------|-------|--------|
| **Phase 1** | Dual input: Live + Upload, summary, review & confirm, dashboard | ✅ Complete |
| **Phase 2** | Native Zoom/Meet/Teams bots, Google Calendar sync, Slack/Notion export | 🔜 Planned |
| **Phase 3** | Adaptive prioritization, mobile app (iOS/Android), multilingual | 🔜 Planned |
| **Phase 4** | Shared team summaries, team task assignment, enterprise SSO | 🔜 Planned |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/add-calendar-sync`)
3. Commit your changes (`git commit -m 'Add calendar sync'`)
4. Push to the branch (`git push origin feature/add-calendar-sync`)
5. Open a Pull Request

---

## 📄 License

MIT © 2026 Flowly

---

## 🙏 Acknowledgments

- Product design and PRD by **Sai Sushmitha Ancha**
- AI powered by [Anthropic Claude](https://anthropic.com)
- Built with [React](https://react.dev), [Vite](https://vitejs.dev), and [Express](https://expressjs.com)
