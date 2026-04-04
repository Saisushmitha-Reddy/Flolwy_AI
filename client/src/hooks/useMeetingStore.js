import { useState, useCallback } from "react";

// Simple in-memory store with React state
// In production, replace with Zustand / Redux / localStorage persistence

let _state = {
  pendingTasks: [],
  dashboard: [],
  currentMeeting: null,
  meetingHistory: [],
};

const listeners = new Set();

function setState(updater) {
  _state = typeof updater === "function" ? updater(_state) : { ..._state, ...updater };
  listeners.forEach((fn) => fn(_state));
}

export function useMeetingStore() {
  const [, forceRender] = useState(0);

  const subscribe = useCallback(() => {
    const fn = () => forceRender((n) => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return {
    state: _state,

    setCurrentMeeting: (meeting) => {
      const tasks = (meeting.tasks || []).map((t, i) => ({
        id: Date.now() + i,
        description: t.description,
        priority: t.priority || "medium",
        due_date: t.due_date || "",
        assignee: t.assignee || "",
        source: meeting.title,
        mode: meeting.mode,
        status: "pending",
        accepted: true,
      }));
      setState({ currentMeeting: meeting, pendingTasks: tasks });
    },

    setPendingTaskAccepted: (id, accepted) => {
      setState((s) => ({
        ...s,
        pendingTasks: s.pendingTasks.map((t) => (t.id === id ? { ...t, accepted } : t)),
      }));
    },

    setPendingTaskDescription: (id, description) => {
      setState((s) => ({
        ...s,
        pendingTasks: s.pendingTasks.map((t) => (t.id === id ? { ...t, description } : t)),
      }));
    },

    bulkAccept: (accepted) => {
      setState((s) => ({
        ...s,
        pendingTasks: s.pendingTasks.map((t) => ({ ...t, accepted })),
      }));
    },

    confirmTasks: () => {
      setState((s) => {
        const confirmed = s.pendingTasks.filter((t) => t.accepted !== false);
        const meeting = s.currentMeeting
          ? { ...s.currentMeeting, taskCount: confirmed.length }
          : null;
        return {
          ...s,
          dashboard: [...s.dashboard, ...confirmed],
          pendingTasks: [],
          currentMeeting: null,
          meetingHistory: meeting
            ? [{ ...meeting, id: Date.now() }, ...s.meetingHistory]
            : s.meetingHistory,
        };
      });
      return _state.pendingTasks.filter((t) => t.accepted !== false).length;
    },

    updateTaskStatus: (id, status) => {
      setState((s) => ({
        ...s,
        dashboard: s.dashboard.map((t) => (t.id === id ? { ...t, status } : t)),
      }));
    },

    removeTask: (id) => {
      setState((s) => ({
        ...s,
        dashboard: s.dashboard.filter((t) => t.id !== id),
      }));
    },

    clearPending: () => setState((s) => ({ ...s, pendingTasks: [], currentMeeting: null })),
  };
}
