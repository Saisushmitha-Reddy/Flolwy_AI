const BASE = "/api";

export async function processMeeting({ transcript, title, mode }) {
  const res = await fetch(`${BASE}/process-meeting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, title, mode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to process meeting");
  return data.data;
}

export async function getLiveActions(transcript) {
  const res = await fetch(`${BASE}/live-actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
  const data = await res.json();
  return data.tasks || [];
}

export async function uploadAudio(file, title, mode) {
  const fd = new FormData();
  fd.append("audio", file);
  fd.append("title", title);
  fd.append("mode", mode);
  const res = await fetch(`${BASE}/upload-audio`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data;
}

export async function checkHealth() {
  const res = await fetch(`${BASE}/health`);
  return res.ok;
}
