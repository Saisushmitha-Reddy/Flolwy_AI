import { NavLink } from "react-router-dom";
import { useMeetingStore } from "../hooks/useMeetingStore.js";

const nav = [
  { to: "/", icon: "🎙", label: "New Meeting", section: "Capture" },
  { to: "/summary", icon: "📋", label: "Summary", section: "Review", badge: "summary" },
  { to: "/review", icon: "✅", label: "Review Tasks", section: null, badge: "pending" },
  { to: "/dashboard", icon: "📊", label: "Dashboard", section: "Manage", badge: "dashboard" },
  { to: "/history", icon: "🕐", label: "History", section: null },
];

export default function Sidebar() {
  const { state } = useMeetingStore();
  const pendingCount = state.pendingTasks.filter((t) => t.accepted !== false).length;
  const dashCount = state.dashboard.filter((t) => t.status !== "completed").length;
  const hasSummary = !!state.currentMeeting;

  const badges = {
    summary: hasSummary ? 1 : 0,
    pending: pendingCount,
    dashboard: dashCount,
  };

  let lastSection = null;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>⚡</div>
        Flowly
      </div>

      {nav.map((item) => {
        const showSection = item.section && item.section !== lastSection;
        if (item.section) lastSection = item.section;
        const badge = item.badge ? badges[item.badge] : 0;

        return (
          <div key={item.to}>
            {showSection && <div style={styles.navLabel}>{item.section}</div>}
            <NavLink
              to={item.to}
              end={item.to === "/"}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
              {badge > 0 && <span style={styles.badge}>{badge}</span>}
            </NavLink>
          </div>
        );
      })}

      <div style={{ marginTop: "auto" }}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            ...styles.navItem,
            ...(isActive ? styles.navItemActive : {}),
          })}
        >
          <span style={styles.navIcon}>⚙️</span> Settings
        </NavLink>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    overflowY: "auto",
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "4px 8px 20px",
    borderBottom: "1px solid var(--border)",
    marginBottom: 20,
    color: "var(--text)",
    textDecoration: "none",
  },
  logoIcon: {
    width: 32,
    height: 32,
    background: "linear-gradient(135deg, var(--accent), #a78bfa)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "1.5px",
    color: "var(--text3)",
    textTransform: "uppercase",
    padding: "12px 8px 6px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    color: "var(--text2)",
    fontSize: 14,
    fontWeight: 400,
    textDecoration: "none",
    transition: "all 0.15s",
    marginBottom: 2,
  },
  navItemActive: {
    background: "var(--accent-glow)",
    color: "var(--accent2)",
    fontWeight: 500,
  },
  navIcon: { width: 16, textAlign: "center", fontSize: 15 },
  badge: {
    marginLeft: "auto",
    background: "var(--accent)",
    color: "white",
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 20,
    minWidth: 18,
    textAlign: "center",
  },
};
