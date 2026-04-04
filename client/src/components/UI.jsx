// ─── Button ───────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", disabled, onClick, style }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none", transition: "all 0.15s", opacity: disabled ? 0.45 : 1,
    fontWeight: 500,
    ...(size === "sm" ? { padding: "6px 14px", fontSize: 13 } :
        size === "lg" ? { padding: "13px 28px", fontSize: 15, fontWeight: 600 } :
        { padding: "10px 20px", fontSize: 14 }),
    ...(variant === "primary" ? { background: "var(--accent)", color: "white" } :
        variant === "secondary" ? { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border2)" } :
        variant === "danger" ? { background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(248,113,113,0.2)" } :
        variant === "ghost" ? { background: "transparent", color: "var(--text2)", padding: "8px 12px" } :
        {}),
    ...style,
  };
  return <button style={base} disabled={disabled} onClick={onClick}>{children}</button>;
}

// ─── Card ─────────────────────────────────────────────────
export function Card({ children, style }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: 24, ...style,
    }}>
      {children}
    </div>
  );
}

// ─── CardTitle ────────────────────────────────────────────
export function CardTitle({ children }) {
  return (
    <div style={{
      fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600,
      letterSpacing: "0.8px", color: "var(--text2)", textTransform: "uppercase",
      marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>{title}</h1>
        {subtitle && <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Tag ──────────────────────────────────────────────────
export function Tag({ children, color, bg }) {
  return (
    <span style={{
      fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 500,
      color: color || "var(--text2)", background: bg || "var(--surface2)",
    }}>
      {children}
    </span>
  );
}

// ─── Divider ──────────────────────────────────────────────
export function Divider({ margin = 20 }) {
  return <div style={{ height: 1, background: "var(--border)", margin: `${margin}px 0` }} />;
}

// ─── Spinner ──────────────────────────────────────────────
export function Spinner({ size = 40 }) {
  return (
    <div style={{
      width: size, height: size,
      border: "3px solid var(--border2)",
      borderTopColor: "var(--accent)",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
  );
}

// ─── EmptyState ───────────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>{icon}</div>
      <div style={{ fontSize: 14 }}>{message}</div>
    </div>
  );
}

// ─── ModeToggle ───────────────────────────────────────────
export function ModeToggle({ value, onChange }) {
  return (
    <div style={{
      display: "flex", background: "var(--surface2)", borderRadius: "var(--radius-sm)",
      padding: 4, gap: 2, border: "1px solid var(--border)",
      marginBottom: 28, width: "fit-content",
    }}>
      {[
        { id: "live", label: "🎙 Live Mode" },
        { id: "upload", label: "📁 Upload Mode" },
      ].map((m) => (
        <div
          key={m.id}
          onClick={() => onChange(m.id)}
          style={{
            padding: "8px 20px", borderRadius: 6, cursor: "pointer",
            fontSize: 13, fontWeight: 500, transition: "all 0.15s",
            color: value === m.id ? "var(--text)" : "var(--text2)",
            background: value === m.id ? "var(--surface)" : "transparent",
            boxShadow: value === m.id ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
}

// ─── Toast container ──────────────────────────────────────
export function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: "var(--surface2)", border: `1px solid ${t.type === "success" ? "rgba(52,211,153,0.3)" : t.type === "error" ? "rgba(248,113,113,0.3)" : "var(--border2)"}`,
          borderRadius: "var(--radius-sm)", padding: "12px 18px", fontSize: 13,
          color: "var(--text)", maxWidth: 320, animation: "toast-in 0.3s ease",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {t.type === "success" ? "✅" : t.type === "error" ? "⚠️" : "ℹ️"} {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────
export function ProgressBar({ value }) {
  return (
    <div style={{ height: 4, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: "linear-gradient(90deg, var(--accent), var(--accent2))",
        borderRadius: 2, transition: "width 0.4s ease",
      }} />
    </div>
  );
}

// ─── Audio visualizer ─────────────────────────────────────
export function AudioViz() {
  const bars = [8, 18, 12, 22, 10, 16, 8];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 3, height: h, background: "var(--accent)", borderRadius: 2,
          animation: `viz-anim 0.5s ${i * 0.05}s infinite`,
        }} />
      ))}
    </div>
  );
}
