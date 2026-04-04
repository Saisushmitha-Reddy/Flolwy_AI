import { useState } from "react";
import { PageHeader, Card, CardTitle, Divider } from "../components/UI.jsx";

export default function SettingsPage() {
  const [prefs, setPrefs] = useState({
    eodSummary: true,
    taskReminders: true,
    silenceDetect: false,
    autoArchive: true,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const settings = [
    { key: "eodSummary", label: "End-of-day summary", sub: "Get a daily recap at 5:00 PM with tasks completed and pending." },
    { key: "taskReminders", label: "Task reminders", sub: "Notify 24 hours before a task's due date." },
    { key: "silenceDetect", label: "Auto-detect silence", sub: "Prompt to end Live session after 3 minutes of silence." },
    { key: "autoArchive", label: "Auto-archive completed tasks", sub: "Hide completed tasks from dashboard after 30 days." },
  ];

  return (
    <div>
      <PageHeader title="Settings" subtitle="Customize your Flowly experience." />

      <div style={{ maxWidth: 540 }}>
        <Card style={{ marginBottom: 20 }}>
          <CardTitle>Preferences</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {settings.map((s, i) => (
              <div key={s.key}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>{s.sub}</div>
                  </div>
                  <Toggle value={prefs[s.key]} onChange={() => toggle(s.key)} />
                </div>
                {i < settings.length - 1 && <Divider margin={0} />}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>About</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--text2)" }}>
            <Row label="Version" value="1.0.0" />
            <Row label="Model" value="Claude claude-sonnet-4-20250514" />
            <Row label="Built with" value="React + Express + Anthropic SDK" />
            <Row label="PRD" value="Flowly v1.1 — Sai Sushmitha Ancha" />
          </div>
          <div style={{ marginTop: 16 }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: "var(--accent2)", textDecoration: "none" }}
            >
              ⭐ View on GitHub →
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: "pointer",
        background: value ? "var(--accent)" : "var(--surface2)",
        border: value ? "none" : "1px solid var(--border2)",
        position: "relative", transition: "all 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: value ? 3 : 2, left: value ? 21 : 2,
        width: 18, height: 18, borderRadius: "50%", background: "white",
        transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
      <span style={{ color: "var(--text3)" }}>{label}</span>
      <span style={{ color: "var(--text2)" }}>{value}</span>
    </div>
  );
}
