import { createContext, useContext, useMemo, useState } from "react";
import {
  clearStoredCalendarToken,
  connectGoogleCalendar,
  createCalendarEvent,
  getStoredCalendarToken,
  isGoogleCalendarConfigured,
} from "../services/googleCalendar";

const CalendarContext = createContext(null);

export function CalendarProvider({ children }) {
  const [token, setToken] = useState(() => getStoredCalendarToken());
  const [busy, setBusy] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type, id: Date.now() });
    window.setTimeout(() => setToast((current) => (current?.message === message ? null : current)), 4200);
  }

  function dismissToast() {
    setToast(null);
  }

  async function connect() {
    setBusy(true);

    try {
      const nextToken = await connectGoogleCalendar();
      setToken(nextToken);
      showToast("Google Calendar connected.", "success");
      return nextToken;
    } catch (error) {
      showToast(error.message, "error");
      throw error;
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    clearStoredCalendarToken();
    setToken(null);
    showToast("Google Calendar disconnected for this session.", "info");
  }

  async function addTaskToCalendar(task) {
    const activeToken = token || getStoredCalendarToken();

    if (!activeToken) {
      showToast("Connect Google Calendar first.", "error");
      return null;
    }

    setBusyTaskId(task.id);

    try {
      const event = await createCalendarEvent(task, activeToken);
      showToast("Task added to Google Calendar.", "success");
      return event;
    } catch (error) {
      if (error.message.toLowerCase().includes("invalid credentials") || error.message.toLowerCase().includes("auth")) {
        clearStoredCalendarToken();
        setToken(null);
      }

      showToast(error.message, "error");
      return null;
    } finally {
      setBusyTaskId(null);
    }
  }

  const value = useMemo(
    () => ({
      connected: Boolean(token),
      configured: isGoogleCalendarConfigured(),
      busy,
      busyTaskId,
      toast,
      connect,
      disconnect,
      addTaskToCalendar,
      showToast,
      dismissToast,
    }),
    [busy, busyTaskId, toast, token],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }

  return context;
}
