import { useNavigate } from "react-router-dom";
import { PageHeader, Card, Button, Tag, EmptyState } from "../components/UI.jsx";
import { useMeetingStore } from "../hooks/useMeetingStore.js";
import { formatDate } from "../utils/helpers.js";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { state } = useMeetingStore();
  const history = state.meetingHistory || [];

  return (
    <div>
      <PageHeader
        title="Meeting History"
        subtitle="All processed meetings and their outcomes."
        action={<Button variant="primary" size="sm" onClick={() => navigate("/")}>+ New Meeting</Button>}
      />

      {history.length === 0 ? (
        <Card>
          <EmptyState icon="🕐" message="No meetings processed yet." />
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <Button variant="primary" onClick={() => navigate("/")}>Process a Meeting →</Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map((m) => (
            <Card key={m.id} style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{m.title}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Tag>📅 {m.date ? formatDate(m.date) : "—"}</Tag>
                    <Tag
                      color={m.mode === "live" ? "var(--red)" : "var(--accent2)"}
                      bg={m.mode === "live" ? "rgba(239,68,68,0.1)" : "rgba(108,99,255,0.1)"}
                    >
                      {m.mode === "live" ? "🎙 Live" : "📁 Upload"}
                    </Tag>
                    <Tag color="var(--green)" bg="var(--green-dim)">{m.taskCount || 0} tasks</Tag>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {m.discussion_points && (
                    <div style={{ fontSize: 12, color: "var(--text3)", maxWidth: 320 }}>
                      {m.discussion_points[0]}...
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
