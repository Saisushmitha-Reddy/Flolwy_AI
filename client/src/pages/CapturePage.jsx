import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Card, CardTitle, Button, ModeToggle, AudioViz, ProgressBar, ToastContainer } from "../components/UI.jsx";
import { useMeetingStore } from "../hooks/useMeetingStore.js";
import { useToast } from "../hooks/useToast.js";
import { processMeeting, getLiveActions, uploadAudio } from "../utils/api.js";
import { demoTranscript } from "../utils/helpers.js";

export default function CapturePage() {
  const navigate = useNavigate();
  const { setCurrentMeeting } = useMeetingStore();
  const { toasts, showToast } = useToast();

  const [mode, setMode] = useState("live");

  // Live session state
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [liveActions, setLiveActions] = useState([]);
  const [timerSecs, setTimerSecs] = useState(0);
  const [liveMeetingTitle, setLiveMeetingTitle] = useState("");

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // Processing
  const [processing, setProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([]);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef("");
  const actionCheckRef = useRef(null);

  // ── Live session ─────────────────────────────────────
  const startSession = useCallback(() => {
    setSessionActive(true);
    setSessionPaused(false);
    setTranscript("");
    setInterimText("");
    setLiveActions([]);
    transcriptRef.current = "";
    setTimerSecs(0);

    timerRef.current = setInterval(() => setTimerSecs((s) => s + 1), 1000);

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      let finalText = "";

      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            finalText += e.results[i][0].transcript + " ";
            transcriptRef.current = finalText;
            scheduleActionCheck();
          } else {
            interim += e.results[i][0].transcript;
          }
        }
        setTranscript(finalText);
        setInterimText(interim);
      };

      rec.onerror = () => runDemoTranscript();
      rec.start();
      recognitionRef.current = rec;
    } else {
      runDemoTranscript();
    }
  }, []);

  const runDemoTranscript = () => {
    showToast("Mic unavailable — running demo transcript", "info");
    const lines = demoTranscript().split("\n");
    let i = 0;
    const add = () => {
      if (i >= lines.length) {
        transcriptRef.current = lines.join(" ");
        setTranscript(lines.join(" "));
        scheduleActionCheck();
        return;
      }
      transcriptRef.current += " " + lines[i];
      setTranscript((t) => t + (t ? " " : "") + lines[i]);
      i++;
      setTimeout(add, 1800);
    };
    add();
  };

  const scheduleActionCheck = () => {
    clearTimeout(actionCheckRef.current);
    actionCheckRef.current = setTimeout(async () => {
      if (transcriptRef.current.trim().length < 30) return;
      try {
        const actions = await getLiveActions(transcriptRef.current);
        if (actions.length) {
          setLiveActions((prev) => {
            const existing = prev.map((a) => a.toLowerCase());
            const newOnes = actions.filter((a) => !existing.includes(a.toLowerCase()));
            return [...prev, ...newOnes];
          });
        }
      } catch {}
    }, 7000);
  };

  const pauseSession = () => {
    if (sessionPaused) {
      recognitionRef.current?.start();
      setSessionPaused(false);
    } else {
      recognitionRef.current?.stop();
      setSessionPaused(true);
    }
  };

  const endSession = async () => {
    clearInterval(timerRef.current);
    clearTimeout(actionCheckRef.current);
    try { recognitionRef.current?.stop(); } catch {}
    setSessionActive(false);

    const final = transcriptRef.current || demoTranscript();
    const title = liveMeetingTitle || "Live Meeting " + new Date().toLocaleDateString();
    await runProcessing(final, title, "live");
  };

  // ── Upload mode ──────────────────────────────────────
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (f) setUploadFile(f);
  };

  const processUpload = async () => {
    const text = pasteText.trim();
    const title = uploadTitle || "Uploaded Meeting " + new Date().toLocaleDateString();

    if (!text && !uploadFile) {
      showToast("Please upload a file or paste a transcript", "error");
      return;
    }

    let transcript = text;
    if (!transcript && uploadFile) {
      setUploading(true);
      // Simulate upload progress
      await new Promise((res) => {
        let p = 0;
        const iv = setInterval(() => {
          p += Math.random() * 18;
          if (p >= 100) { p = 100; clearInterval(iv); setUploadProgress(100); setTimeout(res, 400); }
          setUploadProgress(Math.min(p, 100));
        }, 200);
      });
      setUploading(false);
      // In production: send to server for Whisper transcription
      // For now, use demo transcript
      transcript = demoTranscript();
      showToast("File received — using demo transcript (integrate Whisper for real transcription)", "info");
    }

    await runProcessing(transcript, title, "upload");
  };

  // ── Common processing ────────────────────────────────
  const runProcessing = async (transcript, title, mode) => {
    setProcessing(true);
    const steps = [
      { label: "Transcribing audio...", delay: 0 },
      { label: "Generating summary...", delay: 1200 },
      { label: "Extracting action items...", delay: 2400 },
      { label: "Prioritizing tasks...", delay: 3600 },
    ];

    steps.forEach(({ label, delay }) => {
      setTimeout(() => setProcessingSteps((prev) => [...prev, label]), delay);
    });

    try {
      const result = await processMeeting({ transcript, title, mode });
      setCurrentMeeting(result);
      showToast(`✨ ${result.tasks?.length || 0} tasks extracted`, "success");
      navigate("/summary");
    } catch (err) {
      showToast("API error — using demo data", "error");
      // Demo fallback
      const demo = buildDemoResult(title, mode);
      setCurrentMeeting(demo);
      navigate("/summary");
    } finally {
      setProcessing(false);
      setProcessingSteps([]);
    }
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (processing) return <ProcessingOverlay steps={processingSteps} />;

  return (
    <div>
      <PageHeader title="New Meeting" subtitle="Choose your capture mode — live or upload." />
      <ModeToggle value={mode} onChange={setMode} />

      {mode === "live" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Live session card */}
          <Card>
            <CardTitle>Live Session</CardTitle>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              {sessionActive ? (
                <div style={pill.live}><div style={pill.dot} /> LIVE</div>
              ) : (
                <div style={pill.idle}><span>●</span> Not recording</div>
              )}
              {sessionActive && <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700 }}>{fmt(timerSecs)}</div>}
            </div>

            {sessionActive && <div style={{ marginBottom: 16 }}><AudioViz /></div>}

            <CardTitle>Live Transcript</CardTitle>
            <div style={styles.transcriptBox}>
              {!sessionActive && !transcript ? (
                <span style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 13 }}>
                  Start a session to see live transcription...
                </span>
              ) : (
                <span>
                  <span style={{ color: "var(--text)" }}>{transcript}</span>
                  <span style={{ color: "var(--text3)" }}>{interimText}</span>
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              {!sessionActive ? (
                <Button variant="primary" size="lg" onClick={startSession}>▶ Start Session</Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={pauseSession}>{sessionPaused ? "▶ Resume" : "⏸ Pause"}</Button>
                  <Button variant="danger" onClick={endSession}>⏹ End Session</Button>
                </>
              )}
            </div>

            {sessionActive && (
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 6 }}>Meeting name (optional)</label>
                <input
                  value={liveMeetingTitle}
                  onChange={(e) => setLiveMeetingTitle(e.target.value)}
                  placeholder="e.g. Product Standup"
                  style={styles.input}
                />
              </div>
            )}
          </Card>

          {/* Live actions card */}
          <Card>
            <CardTitle>Live Action Items</CardTitle>
            <div style={styles.actionFeed}>
              {liveActions.length === 0 ? (
                <div style={{ padding: 20, color: "var(--text3)", fontSize: 13, textAlign: "center", fontStyle: "italic" }}>
                  Action items will appear here as your meeting progresses...
                </div>
              ) : (
                liveActions.map((a, i) => (
                  <div key={i} style={styles.actionItem}>
                    <span style={{ color: "var(--accent2)", flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 13 }}>{a}</span>
                  </div>
                ))
              )}
            </div>
            <p style={{ marginTop: 16, color: "var(--text3)", fontSize: 12, lineHeight: 1.5 }}>
              💡 Flowly detects action items in real time. After the session ends, you'll review and confirm them.
            </p>
          </Card>
        </div>
      ) : (
        /* Upload mode */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <CardTitle>Upload Recording</CardTitle>

            <div
              style={{ ...styles.uploadZone, ...(dragOver ? styles.uploadZoneHover : {}) }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById("file-input").click()}
            >
              <input id="file-input" type="file" accept=".mp3,.mp4,.wav,.m4a,.ogg" onChange={handleFileDrop} style={{ display: "none" }} />
              <div style={{ fontSize: 36, marginBottom: 10 }}>🎵</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 4 }}>
                {uploadFile ? uploadFile.name : "Drop your recording here"}
              </div>
              <div style={{ color: "var(--text2)", fontSize: 13 }}>
                {uploadFile ? `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB` : "or click to browse"}
              </div>
              <div style={{ color: "var(--text3)", fontSize: 12, marginTop: 6 }}>MP3, MP4, WAV, M4A, OGG · Max 500MB</div>
            </div>

            {uploading && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>Uploading... {Math.floor(uploadProgress)}%</div>
                <ProgressBar value={uploadProgress} />
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 6 }}>Meeting name (optional)</label>
              <input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g. Client Kickoff" style={styles.input} />
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 6 }}>Or paste transcript / meeting notes</label>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={7}
                placeholder="Paste your meeting notes or transcript here..."
                style={{ ...styles.input, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            <Button variant="primary" style={{ marginTop: 12, width: "100%" }} onClick={processUpload}>
              ⚡ Process Meeting
            </Button>
          </Card>

          {/* How it works */}
          <Card>
            <CardTitle>How Upload Mode Works</CardTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                ["Record your meeting", "Use Zoom, Voice Memos, or any recorder."],
                ["Upload or paste", "Upload the file or paste your transcript / notes."],
                ["AI processes it", "Flowly generates a structured summary and extracts action items."],
                ["Review & confirm", "You approve every task before it hits your dashboard."],
              ].map(([title, sub], i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, background: "var(--accent-glow)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, color: "var(--accent2)", fontWeight: 700 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

function ProcessingOverlay({ steps }) {
  const labels = ["Transcribing audio", "Generating summary", "Extracting action items", "Prioritizing tasks"];
  return (
    <div>
      <PageHeader title="Processing Meeting" />
      <Card style={{ textAlign: "center", padding: 64 }}>
        <div style={{ width: 48, height: 48, border: "3px solid var(--border2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Analyzing your meeting...</div>
        <div style={{ color: "var(--text2)", fontSize: 14, marginBottom: 28 }}>This usually takes 10–30 seconds</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 260, margin: "0 auto" }}>
          {labels.map((label, i) => {
            const done = steps.length > i + 1;
            const active = steps.length === i + 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: done ? "var(--green)" : active ? "var(--text)" : "var(--text3)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0, animation: active ? "pulse-dot 1s infinite" : "none" }} />
                {label}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function buildDemoResult(title, mode) {
  return {
    title, mode,
    date: new Date().toISOString(),
    discussion_points: [
      "Onboarding flow redesign — wireframes completed, implementation starts Thursday",
      "Welcome email copy is blocking the onboarding flow",
      "Q2 investor deck — updated metrics required from analytics dashboard",
      "Monday review session scheduled for investor deck at 2 PM",
    ],
    decisions: [
      "Frontend team to begin onboarding implementation by Thursday",
      "Jamie from content to be looped in for welcome email copy",
      "Investor deck review confirmed for Monday at 2 PM",
    ],
    open_questions: [
      "Is the Thursday dev start date realistic given current sprint load?",
      "Who is the final approver on the investor deck metrics?",
    ],
    tasks: [
      { description: "Assign onboarding flow to frontend team and create Jira ticket", priority: "high", due_date: "Today", assignee: "Marcus" },
      { description: "Send welcome email copy brief to Jamie", priority: "high", due_date: "Tomorrow", assignee: "Sarah" },
      { description: "Pull Q2 metrics from analytics dashboard", priority: "medium", due_date: "Friday EOD", assignee: "" },
      { description: "Send calendar invite for Monday deck review at 2 PM", priority: "medium", due_date: "Today", assignee: "" },
      { description: "Finalize welcome email copy", priority: "medium", due_date: "This Friday", assignee: "Jamie" },
      { description: "Set up staging environment for QA before sprint end", priority: "high", due_date: "Wednesday", assignee: "Dev team" },
    ],
  };
}

const pill = {
  live: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--red-dim)", border: "1px solid rgba(239,68,68,0.25)", color: "var(--red)", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600 },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "var(--live)", animation: "pulse-dot 1.5s infinite" },
  idle: { display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text3)", borderRadius: 20, padding: "6px 14px", fontSize: 13 },
};

const styles = {
  transcriptBox: { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 16, height: 200, overflowY: "auto", fontSize: 14, lineHeight: 1.7 },
  actionFeed: { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", maxHeight: 220, overflowY: "auto" },
  actionItem: { padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 10, animation: "slide-in 0.3s ease" },
  uploadZone: { border: "2px dashed var(--border2)", borderRadius: "var(--radius)", padding: "48px 32px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" },
  uploadZoneHover: { borderColor: "var(--accent)", background: "var(--accent-glow)" },
  input: { background: "var(--bg)", border: "1px solid var(--border2)", borderRadius: 6, padding: "8px 12px", color: "var(--text)", fontSize: 13, width: "100%", outline: "none" },
};
