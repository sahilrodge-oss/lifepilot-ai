import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const primaryModelName = import.meta.env.VITE_GEMINI_VOICE_MODEL || "gemini-2.5-flash-lite";
const fallbackModelNames = (import.meta.env.VITE_GEMINI_VOICE_FALLBACK_MODELS || "gemini-2.5-flash-lite")
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);
const modelCandidates = [...new Set([primaryModelName, ...fallbackModelNames])];
const retryDelayMs = 900;

export function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function isVoiceInputSupported() {
  return Boolean(getSpeechRecognition());
}

function getVoiceInputErrorMessage(errorCode) {
  const messages = {
    "no-speech": "I could not hear anything. Check your microphone, speak right after clicking Start voice input, or type the command below.",
    "audio-capture": "No microphone was found. Connect or enable your microphone, or type the command below.",
    "not-allowed": "Microphone permission was blocked. Allow microphone access in the browser, or type the command below.",
    "service-not-allowed": "This browser blocked speech recognition. Use Chrome or Edge, or type the command below.",
    network: "Speech recognition had a network issue. Try again, or type the command below.",
    aborted: "Voice input stopped before a task was captured. Try again, or type the command below.",
    "language-not-supported": "This browser does not support the selected speech language. Try Chrome or Edge, or type the command below.",
  };

  return messages[errorCode] || "Voice input failed. Please try again or type the command below.";
}

export function listenForVoiceCommand({ onStart, onTranscript, onError, onEnd }) {
  const SpeechRecognition = getSpeechRecognition();

  if (!SpeechRecognition) {
    onError?.("Voice input is not supported in this browser. Please type your task manually.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => onStart?.();
  recognition.onend = () => onEnd?.();
  recognition.onerror = (event) => {
    onError?.(getVoiceInputErrorMessage(event.error));
  };
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join(" ")
      .trim();

    onTranscript?.(transcript);
  };

  recognition.start();
  return recognition;
}

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Gemini did not return valid task JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

function normalizeTaskDetails(details) {
  return {
    title: details.title || "",
    description: details.description || "",
    deadline: details.deadline || "",
    estimatedHours: Number(details.estimatedHours || details.estimatedTime || 1),
    importance: ["High", "Medium", "Low"].includes(details.importance) ? details.importance : "Medium",
    category: details.category || "Work",
    smartReminder: details.smartReminder || "",
  };
}

function formatLocalDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getNextWeekdayDate(weekdayName) {
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const targetDay = weekdays.indexOf(weekdayName.toLowerCase());
  const date = new Date();

  if (targetDay === -1) return date;

  const daysUntilTarget = (targetDay - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilTarget);
  return date;
}

function applyTimeFromTranscript(date, transcript) {
  const timeMatch = transcript.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  const tonight = /\btonight\b/i.test(transcript);

  if (!timeMatch) {
    date.setHours(tonight ? 21 : 18, 0, 0, 0);
    return date;
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2] || 0);
  const meridiem = timeMatch[3]?.toLowerCase();

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  date.setHours(hours, minutes, 0, 0);
  return date;
}

function inferDeadline(transcript) {
  const text = transcript.toLowerCase();
  let date = new Date();

  const inDaysMatch = text.match(/\bin\s+(\d+)\s+days?\b/);
  const weekdayMatch = text.match(/\bby\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);

  if (inDaysMatch) {
    date.setDate(date.getDate() + Number(inDaysMatch[1]));
  } else if (weekdayMatch) {
    date = getNextWeekdayDate(weekdayMatch[1]);
  } else if (text.includes("tomorrow")) {
    date.setDate(date.getDate() + 1);
  }

  return formatLocalDateTime(applyTimeFromTranscript(date, transcript));
}

function inferImportance(transcript) {
  const text = transcript.toLowerCase();

  if (/\b(very important|urgent|critical|high priority|asap)\b/.test(text)) return "High";
  if (/\b(low priority|not important|whenever)\b/.test(text)) return "Low";

  return "Medium";
}

function inferCategory(transcript) {
  const text = transcript.toLowerCase();

  if (/\b(assignment|exam|study|college|school)\b/.test(text)) return "Study";
  if (/\b(client|follow up)\b/.test(text)) return "Client";
  if (/\b(freelance|deliver project)\b/.test(text)) return "Freelance";
  if (/\b(business|startup|pitch|entrepreneur)\b/.test(text)) return "Business";
  if (/\b(video|content|creator|post)\b/.test(text)) return "Creator";
  if (/\b(bill|electricity|personal|home)\b/.test(text)) return "Personal";

  return "Work";
}

function inferTitle(transcript) {
  const cleaned = transcript
    .replace(/^(please\s+)?(remind me to|i need to|i have to|create a task to)\s+/i, "")
    .split(/\b(tomorrow|today|tonight|by\s+\w+|in\s+\d+\s+days?|at\s+\d{1,2}|it will take|and it is|this is)\b/i)[0]
    .replace(/[.!?]+$/g, "")
    .trim();

  if (!cleaned) return "New deadline task";

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function buildLocalVoiceDraft(transcript) {
  const estimatedMatch = transcript.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)\b/i);
  const estimatedValue = Number(estimatedMatch?.[1] || 1);
  const estimatedUnit = estimatedMatch?.[2]?.toLowerCase() || "hour";
  const estimatedHours = estimatedUnit.startsWith("min") ? Math.max(0.25, estimatedValue / 60) : estimatedValue;
  const title = inferTitle(transcript);
  const deadline = inferDeadline(transcript);

  return normalizeTaskDetails({
    title,
    description: transcript,
    deadline,
    estimatedHours,
    importance: inferImportance(transcript),
    category: inferCategory(transcript),
    smartReminder: `Gemini is temporarily busy, so LifePilot created a quick draft. Review ${title} and try Gemini again later for a smarter reminder.`,
  });
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function isTemporaryGeminiIssue(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return message.includes("503") || message.includes("high demand") || message.includes("overloaded") || message.includes("unavailable");
}

function getGeminiVoiceErrorMessage(error) {
  if (isTemporaryGeminiIssue(error)) {
    return "Gemini is temporarily busy. LifePilot created a quick draft from your command; review it before saving.";
  }

  return error?.message || "Gemini could not parse this voice task.";
}

export async function extractTaskDetailsFromVoice(transcript) {
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Add your Gemini key to .env.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = `Extract task details from this user voice command and return only valid JSON with these fields:
title, description, deadline, estimatedHours, importance, category, smartReminder.
Voice command: ${transcript}

Current local date/time: ${new Date().toISOString()}
Use ISO datetime format for deadline.`;

  let lastError = null;

  for (const modelName of modelCandidates) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return normalizeTaskDetails(extractJson(result.response.text()));
      } catch (error) {
        lastError = error;

        if (!isTemporaryGeminiIssue(error) || attempt === 2) {
          break;
        }

        await wait(retryDelayMs);
      }
    }
  }

  if (isTemporaryGeminiIssue(lastError)) {
    return buildLocalVoiceDraft(transcript);
  }

  throw new Error(getGeminiVoiceErrorMessage(lastError));
}

export function speakTaskSaved() {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance("Task added successfully. I will help you complete it on time.");
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}
