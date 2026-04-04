import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Card, Button, Tag, EmptyState, ToastContainer } from "../components/UI.jsx";
import { useMeetingStore } from "../hooks/useMeetingStore.js";
import { useToast } from "../hooks/useToast.js";
import { priorityLabel, priorityColor, priorityBg } from "../utils/helpers.js";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { state, setPendingTaskAccepted, setPendingTaskDescription, bulkAccept, confirmTasks } = useMeetingStore();
  const { toasts, showToast } = useToast();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const tasks = state.pendingTasks;
  const accepted = tasks.filter((t) => t.accepted !== false);
  const rejected = tasks.filter((t) => t.accepted === false);

  const handleConfirm = () => {
    if (!accepted.length) { showToast("No tasks accepted to add", "error"); return; }
    const count = confirmTasks();
    showToast(`✅ ${count} tasks added to dashboard`, "success");
    setTimeout(() => navigate("/dashboard"), 800);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.description);
  };

  const saveEdit = (id) => {
    if (editText.trim()) setPendingTaskDescription(id, editText.trim());
    setEditingId(null);
  };

  if (!tasks.length) {
    return (
      <div>
        <PageHeader title="Review & Confirm Tasks" />
        <Card><EmptyState icon="📭" message="No pending tasks. Process a meeting first." /></Card>
        <Button variant="primary" style={{ marginTop: 16 }} onClick={() => navigate("/")}>Go to Capture →</Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Review & Confirm Tasks"
        subtitle="The AI proposes — you decide. No task is added without your confirmation."
      />

      {/* Bulk actions bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "var(--text2)" }}>{tasks.length} task{tasks.length !== 1 ? "s" : ""} proposed</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" size="sm" onClick={() => bulkAccept(false)}>✕ Reject All</Button>
          <Button variant="primary" size="sm" onClick={() => bulkAccept(true)}>✓ Accept All</Button>
        </div>
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {tasks.map((task) => {
          const isAccepted = task.accepted !== false;
          const isEditing = editingId === task.id;

          return (
            <div
              key={task.id}
              style={{
                background: isAccepted ? "var(--green-dim)" : "var(--bg)",
                border: `1px solid ${isAccepted ? "rgba(52,211,153,0.3)" : "var(--border)"}`,
                borderRadius: "var(--radius-sm)", padding: 16,
                display: "flex", alignItems: "flex-start", gap: 14,
                transition: "all 0.2s",
                opacity: isAccepted ? 1 : 0.4,
              }}
            >
              {/* Checkbox */}
              <div
                onClick={() => setPendingTaskAccepted(task.id, !isAccepted)}
                style={{
                  width: 20, height: 20, borderRadius: 5,
                  border: `1.5px solid ${isAccepted ? "var(--green)" : "var(--border2)"}`,
                  background: isAccepted ? "var(--green)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, marginTop: 2,
                  color: "white", fontSize: 11, fontWeight: 700,
                  transition: "all 0.15s",
                }}
              >
                {isAccepted ? "✓" : ""}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                {isEditing ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && saveEdit(task.id)}
                    autoFocus
                    rows={2}
                    style={{
                      background: "var(--surface2)", border: "1px solid var(--accent)",
                      borderRadius: 6, color: "var(--text)", fontSize: 14,
                      padding: "6px 10px", width: "100%", resize: "none",
                      outline: "none", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5, marginBottom: 8 }}>
                    {task.description}
                  </div>
                )}

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Tag color={priorityColor(task.priority)} bg={priorityBg(task.priority)}>
                    {priorityLabel(task.priority)}
                  </Tag>
                  {task.due_date && <Tag>📅 {task.due_date}</Tag>}
                  {task.assignee && <Tag>👤 {task.assignee}</Tag>}
                  <Tag
                    color={task.mode === "live" ? "var(--red)" : "var(--accent2)"}
                    bg={task.mode === "live" ? "rgba(239,68,68,0.1)" : "rgba(108,99,255,0.1)"}
                  >
                    {task.source}
                  </Tag>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <IconBtn title="Edit" onClick={() => startEdit(task)} hoverColor="var(--accent2)">✏️</IconBtn>
                <IconBtn title="Accept" onClick={() => setPendingTaskAccepted(task.id, true)} hoverColor="var(--green)">✓</IconBtn>
                <IconBtn title="Reject" onClick={() => setPendingTaskAccepted(task.id, false)} hoverColor="var(--red)">✕</IconBtn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm bar */}
      <div style={{
        background: "var(--surface2)", border: "1px solid var(--border2)",
        borderRadius: "var(--radius)", padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <div style={{ fontSize: 14 }}>
          <span style={{ color: "var(--green)", fontWeight: 600 }}>{accepted.length} accepted</span>
          <span style={{ color: "var(--text3)", margin: "0 8px" }}>·</span>
          <span style={{ color: "var(--red)", fontWeight: 600 }}>{rejected.length} rejected</span>
        </div>
        <Button variant="primary" onClick={handleConfirm} disabled={!accepted.length}>
          Add {accepted.length} Task{accepted.length !== 1 ? "s" : ""} to Dashboard →
        </Button>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

function IconBtn({ children, title, onClick, hoverColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30, height: 30, borderRadius: 6, border: "none",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, transition: "all 0.15s",
        background: hovered ? `color-mix(in srgb, ${hoverColor} 15%, transparent)` : "transparent",
        color: hovered ? hoverColor : "var(--text3)",
      }}
    >
      {children}
    </button>
  );
}
