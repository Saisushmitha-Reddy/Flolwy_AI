import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Card, Button, Tag, EmptyState } from "../components/UI.jsx";
import { useMeetingStore } from "../hooks/useMeetingStore.js";
import { priorityLabel, priorityColor, priorityBg } from "../utils/helpers.js";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "high", label: "🔴 High Priority" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { state, updateTaskStatus, removeTask } = useMeetingStore();
  const [filter, setFilter] = useState("all");

  const tasks = state.dashboard;
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProg = tasks.filter((t) => t.status === "in-progress").length;
  const done = tasks.filter((t) => t.status === "completed").length;

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "high") return t.priority === "high";
    return t.status === filter;
  });

  const stats = [
    { label: "Total Tasks", val: total, color: "var(--accent2)" },
    { label: "Pending", val: pending, color: "var(--amber)" },
    { label: "In Progress", val: inProg, color: "var(--accent2)" },
    { label: "Completed", val: done, color: "var(--green)" },
  ];

  return (
    <div>
      <PageHeader
        title="Task Dashboard"
        subtitle="All confirmed tasks from your meetings."
        action={<Button variant="primary" size="sm" onClick={() => navigate("/")}>+ New Meeting</Button>}
      />

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {stats.map((s) => (
          <Card key={s.label} style={{ padding: "18px 20px" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 4 }}>
              {s.val}
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 13,
              cursor: "pointer", border: "1px solid var(--border)",
              color: filter === f.id ? "var(--accent2)" : "var(--text2)",
              background: filter === f.id ? "var(--accent-glow)" : "transparent",
              borderColor: filter === f.id ? "var(--accent)" : "var(--border)",
              transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={total === 0 ? "🎯" : "🔍"}
            message={total === 0 ? "No tasks yet — process a meeting to get started." : "No tasks match this filter."}
          />
          {total === 0 && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Button variant="primary" onClick={() => navigate("/")}>Process a Meeting →</Button>
            </div>
          )}
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((task) => (
            <TaskRow key={task.id} task={task} onStatusChange={updateTaskStatus} onRemove={removeTask} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onStatusChange, onRemove }) {
  const dotColor = task.status === "completed" ? "var(--green)" : task.status === "in-progress" ? "var(--accent)" : "var(--amber)";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)", padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 14,
      opacity: task.status === "completed" ? 0.55 : 1,
      transition: "all 0.15s",
    }}>
      {/* Status dot */}
      <div style={{
        width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0,
        animation: task.status === "in-progress" ? "pulse-dot 2s infinite" : "none",
      }} />

      {/* Description */}
      <div style={{
        flex: 1, fontSize: 14,
        textDecoration: task.status === "completed" ? "line-through" : "none",
        color: task.status === "completed" ? "var(--text3)" : "var(--text)",
      }}>
        {task.description}
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
        <Tag color={priorityColor(task.priority)} bg={priorityBg(task.priority)}>
          {priorityLabel(task.priority)}
        </Tag>
        {task.due_date && <Tag>📅 {task.due_date}</Tag>}
        {task.assignee && <Tag>👤 {task.assignee}</Tag>}

        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          style={{
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--text2)", borderRadius: 6, padding: "4px 8px",
            fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            outline: "none",
          }}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => onRemove(task.id)}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text3)", fontSize: 13, padding: "4px 6px", borderRadius: 4,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
