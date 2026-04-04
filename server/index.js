require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Anthropic = require("@anthropic-ai/sdk");
const path = require("path");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } });
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── Health check ───────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ status: "ok", version: "1.0.0" }));

// ─── Process meeting transcript ─────────────────────────
app.post("/api/process-meeting", async (req, res) => {
  const { transcript, title, mode } = req.body;

  if (!transcript || transcript.trim().length < 10) {
    return res.status(400).json({ error: "Transcript is required and must be non-empty." });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are an expert AI meeting assistant. Analyze the following meeting transcript carefully and extract structured information.

Return ONLY a valid JSON object with this exact structure — no markdown, no explanation:

{
  "discussion_points": ["clear, concise point 1", "point 2", ...],
  "decisions": ["decision 1", "decision 2", ...],
  "open_questions": ["question 1", ...],
  "tasks": [
    {
      "description": "specific, actionable task description",
      "priority": "high|medium|low",
      "due_date": "e.g. Today, Tomorrow, This Friday, Next Monday — or empty string if not mentioned",
      "assignee": "person's name if explicitly mentioned, else empty string"
    }
  ]
}

Rules:
- discussion_points: 3–6 key topics discussed
- decisions: concrete decisions made (can be empty array)
- open_questions: unresolved questions (can be empty array)
- tasks: every actionable item mentioned; at least 1, max 10
- priority: infer from context (deadlines, urgency language)
- Keep all text concise and actionable

Meeting title: ${title || "Meeting"}
Mode: ${mode || "unknown"}

Transcript:
${transcript}`,
        },
      ],
    });

    const raw = message.content[0].text.trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    res.json({
      success: true,
      data: {
        ...result,
        title: title || "Meeting",
        date: new Date().toISOString(),
        mode: mode || "upload",
      },
    });
  } catch (err) {
    console.error("Process meeting error:", err);
    res.status(500).json({ error: "Failed to process meeting. Check your API key and try again.", detail: err.message });
  }
});

// ─── Extract live action items ──────────────────────────
app.post("/api/live-actions", async (req, res) => {
  const { transcript } = req.body;
  if (!transcript || transcript.trim().length < 20) return res.json({ tasks: [] });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Extract action items from this meeting transcript so far. Return ONLY a JSON array of strings. If none found, return []. No explanation, no markdown.

Transcript:
${transcript}`,
        },
      ],
    });

    const raw = message.content[0].text.trim().replace(/```json|```/g, "").trim();
    const tasks = JSON.parse(raw);
    res.json({ tasks: Array.isArray(tasks) ? tasks : [] });
  } catch (err) {
    res.json({ tasks: [] });
  }
});

// ─── Upload audio file (placeholder for transcription) ─
app.post("/api/upload-audio", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const { title, mode } = req.body;
  const fileSizeMB = (req.file.size / 1024 / 1024).toFixed(1);

  // In production: pipe req.file.buffer to Whisper / Deepgram / AssemblyAI
  // For now, acknowledge the upload and prompt user to paste transcript
  res.json({
    success: true,
    message: `File "${req.file.originalname}" (${fileSizeMB} MB) received. Paste your transcript below to process it, or integrate a transcription service (Whisper/Deepgram) in server/index.js.`,
    filename: req.file.originalname,
    size: fileSizeMB,
    mimetype: req.file.mimetype,
  });
});

// ─── Serve React build in production ────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../client/dist/index.html")));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Flowly server running on http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/health\n`);
});
