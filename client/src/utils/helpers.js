export const escHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const priorityColor = (p) => {
  if (p === "high") return "var(--red)";
  if (p === "low") return "var(--green)";
  return "var(--amber)";
};

export const priorityLabel = (p) => {
  if (p === "high") return "🔴 High";
  if (p === "low") return "🟢 Low";
  return "🟡 Medium";
};

export const priorityBg = (p) => {
  if (p === "high") return "rgba(248,113,113,0.15)";
  if (p === "low") return "rgba(52,211,153,0.12)";
  return "rgba(251,191,36,0.12)";
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const demoTranscript = () =>
  `Alright team, let's kick off the product sync. Sarah, where are we on the onboarding flow redesign?
We finished the wireframes last week. Dev needs to start implementation by Thursday.
Marcus, can you assign that to the frontend team and track it in Jira today?
Yes, I'll handle that. We also need to finalize the welcome email copy — it's blocking the flow.
Let's get the copy done by end of week. Can someone loop in Jamie from content?
I'll send Jamie the brief tomorrow morning.
One more thing — the Q2 investor deck. We need updated metrics from the analytics dashboard by Friday.
I can pull those numbers — I'll have them ready Friday EOD.
Perfect. Let's review the deck Monday at 2 PM. I'll send the calendar invite today.
Also, we need to set up the staging environment for QA before the sprint ends.
Dev team is on it — should be ready by Wednesday.`;
