import { useNavigate } from "react-router-dom";
import { PageHeader, Card, CardTitle, Button, Divider, Tag } from "../components/UI.jsx";
import { useMeetingStore } from "../hooks/useMeetingStore.js";
import { priorityLabel, priorityColor, priorityBg, formatDate } from "../utils/helpers.js";

export default function SummaryPage() {
  const navigate = useNavigate();
  const { state } = useMeetingStore();
  const m = state.currentMeeting;

  if (!m) {
    return (
      <div>
        <PageHeader title="Meeting Summary" />
        <Card style={{ textAlign: "center", padding: 64 }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>📋</div>
          <div style={{ color: "var(--text2)", marginBottom: 20 }}>No meeting processed yet.</div>
          <Button variant="primary" onClick={() => navigate("/")}>Process a Meeting →</Button>
        </Card>
      </div>
    );
  }

  const toList = (arr) =>
    arr && arr.length ? (
      <ul style={{ paddingLeft: 18, lineHeight: 1.8 }}>
        {arr.map((x, i) => <li key={i} style={{ marginBottom: 4, color: "var(--text2)", fontSize: 14 }}>{x}</li>)}
      </ul>
    ) : (
      <span style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 13 }}>Nothing noted</span>
    );

  return (
    <div>
      <PageHeader
        title={m.title || "Meeting Summary"}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => navigate("/")}>↻ New Meeting</Button>
            <Button variant="primary" size="sm" onClick={() => navigate("/review")}>Review Tasks →</Button>
          </div>
        }
      />

      {/* Meeting meta chips */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        <Tag>📅 {m.date ? formatDate(m.date) : "Just now"}</Tag>
        <Tag
          color={m.mode === "live" ? "var(--red)" : "var(--accent2)"}
          bg={m.mode === "live" ? "rgba(239,68,68,0.12)" : "rgba(108,99,255,0.12)"}
        >
          {m.mode === "live" ? "🎙 Live Mode" : "📁 Upload Mode"}
        </Tag>
        <Tag>{state.pendingTasks.length} tasks extracted</Tag>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        {/* Summary card */}
        <Card>
          <SummarySection label="🗣 Key Discussion Points" content={toList(m.discussion_points)} />
          <Divider />
          <SummarySection label="✅ Decisions Made" content={toList(m.decisions)} />
          <Divider />
          <SummarySection label="❓ Open Questions" content={toList(m.open_questions)} />
        </Card>

        {/* Task preview card */}
        <Card>
          <CardTitle>Extracted Action Items</CardTitle>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {state.pendingTasks.slice(0, 5).map((t) => (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", background: "var(--bg)",
                border: "1px solid var(--border)", borderRadius: 8,
              }}>
                <span style={{ fontSize: 12 }}>{t.priority === "high" ? "🔴" : t.priority === "low" ? "🟢" : "🟡"}</span>
                <span style={{ fontSize: 13, flex: 1, color: "var(--text)" }}>{t.description}</span>
                {t.due_date && <Tag>{t.due_date}</Tag>}
              </div>
            ))}
            {state.pendingTasks.length > 5 && (
              <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", padding: 6 }}>
                +{state.pendingTasks.length - 5} more tasks
              </div>
            )}
          </div>

          <div style={{
            background: "var(--surface2)", border: "1px solid var(--border2)",
            borderRadius: "var(--radius)", padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 20,
          }}>
            <div>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>{state.pendingTasks.length} task{state.pendingTasks.length !== 1 ? "s" : ""}</span>
              <span style={{ color: "var(--text2)", fontSize: 13 }}> ready for review</span>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate("/review")}>Review & Confirm →</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummarySection({ label, content }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--text3)", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 14 }}>
        {content}
      </div>
    </div>
  );
}
