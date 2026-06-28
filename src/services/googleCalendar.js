const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const TOKEN_STORAGE_KEY = "lifepilot-google-calendar-token";
const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";
const CALENDAR_CONNECT_TIMEOUT_MS = 45_000;

let tokenClient = null;
let scriptPromise = null;

export function isGoogleCalendarConfigured() {
  return Boolean(GOOGLE_CLIENT_ID);
}

export function getStoredCalendarToken() {
  try {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;

    const token = JSON.parse(stored);
    if (!token.access_token || token.expires_at <= Date.now()) {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }

    return token;
  } catch {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
}

export function clearStoredCalendarToken() {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

function saveCalendarToken(tokenResponse) {
  const expiresInMs = Number(tokenResponse.expires_in || 3600) * 1000;
  const token = {
    access_token: tokenResponse.access_token,
    scope: tokenResponse.scope,
    expires_at: Date.now() + expiresInMs - 60_000,
  };

  sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
  return token;
}

function getCurrentOrigin() {
  return window.location.origin;
}

function getCalendarAuthErrorMessage(error) {
  const message = String(error?.message || error || "");
  const lowerMessage = message.toLowerCase();
  const currentOrigin = getCurrentOrigin();

  if (lowerMessage.includes("origin_mismatch") || lowerMessage.includes("invalid_client")) {
    return `Google Calendar OAuth origin mismatch. Add ${currentOrigin} in Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client ID > Authorized JavaScript origins.`;
  }

  if (lowerMessage.includes("popup_failed_to_open")) {
    return "Google Calendar popup was blocked. Allow popups for this site and try again.";
  }

  if (lowerMessage.includes("popup_closed")) {
    return "Google Calendar connection was closed before permission was granted. Try Connect Google Calendar again.";
  }

  return message || "Could not connect Google Calendar.";
}

export function loadGoogleIdentityScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Could not load Google Identity Services."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function connectGoogleCalendar() {
  if (!isGoogleCalendarConfigured()) {
    throw new Error("Missing VITE_GOOGLE_CLIENT_ID. Add your Google OAuth client ID to .env.");
  }

  await loadGoogleIdentityScript();

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (handler, value) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      handler(value);
    };

    const timeoutId = window.setTimeout(() => {
      finish(
        reject,
        new Error(`Google Calendar connection did not finish. If the popup shows origin_mismatch, add ${getCurrentOrigin()} as an Authorized JavaScript origin in Google Cloud Console.`),
      );
    }, CALENDAR_CONNECT_TIMEOUT_MS);

    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: CALENDAR_SCOPE,
      prompt: "consent",
      callback: (response) => {
        if (response?.error) {
          finish(reject, new Error(getCalendarAuthErrorMessage(response.error_description || response.error)));
          return;
        }

        if (!response?.access_token) {
          finish(reject, new Error("Google Calendar did not return an access token."));
          return;
        }

        finish(resolve, saveCalendarToken(response));
      },
      error_callback: (error) => {
        finish(reject, new Error(getCalendarAuthErrorMessage(error?.message || error?.type || "Google Calendar popup failed.")));
      },
    });

    tokenClient.requestAccessToken();
  });
}

function getDeadlineDate(task) {
  const rawDeadline = task.deadline || task.dueDate;
  if (!rawDeadline) return null;

  const deadline = new Date(rawDeadline);
  return Number.isNaN(deadline.getTime()) ? null : deadline;
}

export function buildCalendarEventFromTask(task) {
  const deadline = getDeadlineDate(task);
  if (!deadline) {
    throw new Error("Task deadline is missing or invalid.");
  }

  const estimatedHours = Number(task.estimatedTime || task.estimatedHours || 1);
  const durationMs = Math.max(0.25, estimatedHours || 1) * 60 * 60 * 1000;
  const start = new Date(deadline.getTime() - durationMs);
  const priority = task.importance || task.priority || "Medium";

  return {
    summary: task.title,
    description: [
      task.description || "LifePilot AI task",
      "",
      `Priority: ${priority}`,
      `Estimated time: ${Math.max(0.25, estimatedHours || 1)} hour(s)`,
      task.smartReminder ? `Smart reminder: ${task.smartReminder}` : "",
    ].filter(Boolean).join("\n"),
    start: {
      dateTime: start.toISOString(),
    },
    end: {
      dateTime: deadline.toISOString(),
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 30 },
        { method: "popup", minutes: 1440 },
      ],
    },
  };
}

export async function createCalendarEvent(task, token = getStoredCalendarToken()) {
  if (!token?.access_token) {
    throw new Error("Connect Google Calendar first.");
  }

  const event = buildCalendarEventFromTask(task);
  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error?.message || "Could not create Google Calendar event.");
  }

  return payload;
}
