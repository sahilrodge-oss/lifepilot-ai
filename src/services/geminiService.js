import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDeadlineRisk, getPriorityLabel, getPriorityScore, sortByDecisionPriority } from "../utils/scoring";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const primaryModelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash-lite";
const fallbackModelNames = (import.meta.env.VITE_GEMINI_FALLBACK_MODELS || "gemini-2.5-flash-lite,gemini-2.5-flash")
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);
const modelCandidates = [...new Set([primaryModelName, ...fallbackModelNames])];

export const isGeminiConfigured = Boolean(apiKey);

function buildFallbackPlan(tasks, profile) {
  const sorted = sortByDecisionPriority(tasks).filter((task) => task.status !== "completed");
  const priorities = sorted.map((task) => {
    const score = getPriorityScore(task);
    const risk = getDeadlineRisk(task);

    return {
      taskTitle: task.title,
      priority: getPriorityLabel(score),
      score,
      reason: `${task.importance} importance with ${risk.toLowerCase()} deadline risk.`,
      deadlineRisk: risk,
      smartReminder: risk === "Critical" || risk === "Overdue"
        ? `Start ${task.title} now. Delay lower priority work until the first milestone is done.`
        : `Block focused time for ${task.title} before the deadline pressure rises.`,
      breakdown: [
        "Clarify the expected final output.",
        "Finish the smallest useful version.",
        "Review, polish, and submit.",
      ],
    };
  });

  const todayPlan = sorted.slice(0, 5).map((task, index) => ({
    time: `${9 + index * 2}:00`,
    action: index === 0 ? `Start immediately: ${task.title}` : `Focus block: ${task.title}`,
    taskTitle: task.title,
    type: index === 0 ? "Immediate" : "Focus",
  }));

  return {
    generatedBy: "Local fallback",
    productivityScore: Math.max(38, 92 - priorities.filter((item) => ["Critical", "Overdue"].includes(item.deadlineRisk)).length * 12),
    summary: `${profile?.roleMode || "General"} mode: handle the riskiest deadline first, then protect one focused block for deep work.`,
    priorities,
    todayPlan,
    emergencyPlan: {
      startNow: priorities[0]?.taskTitle || "Add a task",
      delay: priorities.filter((item) => item.priority === "Low").map((item) => item.taskTitle),
      warnings: priorities.filter((item) => ["Critical", "Overdue"].includes(item.deadlineRisk)).map((item) => `${item.taskTitle} is in deadline danger.`),
      survivalPlan: [
        "Freeze new commitments for the next two hours.",
        "Finish the highest risk task milestone first.",
        "Move low-impact work to tomorrow.",
      ],
    },
    coachMessage: "Your next win is not doing everything. It is choosing the next task with the highest deadline risk and finishing one concrete milestone.",
  };
}

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Gemini did not return JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function generateAiPlan(tasks, profile, mode = "standard") {
  if (!isGeminiConfigured) {
    return buildFallbackPlan(tasks, profile);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
You are LifePilot AI, a deadline emergency decision-maker.
Use Google AI Studio Gemini reasoning to analyze task overload and produce a practical plan.

User profile:
${JSON.stringify(profile || {}, null, 2)}

Mode:
${mode}

Tasks:
${JSON.stringify(tasks, null, 2)}

Return valid JSON only with this exact shape:
{
  "generatedBy": "Gemini API",
  "productivityScore": 0,
  "summary": "short decision summary",
  "priorities": [
    {
      "taskTitle": "task name",
      "priority": "High | Medium | Low",
      "score": 0,
      "reason": "why this task comes here",
      "deadlineRisk": "Overdue | Critical | High | Medium | Low | Safe",
      "smartReminder": "one inside-app reminder message",
      "breakdown": ["step 1", "step 2", "step 3"]
    }
  ],
  "todayPlan": [
    {
      "time": "9:00 AM",
      "action": "what to do",
      "taskTitle": "task name",
      "type": "Immediate | Focus | Admin | Recovery"
    }
  ],
  "emergencyPlan": {
    "startNow": "single task to start immediately",
    "delay": ["low priority task to delay"],
    "warnings": ["deadline warning"],
    "survivalPlan": ["hour-by-hour or step-by-step action"]
  },
  "coachMessage": "supportive productivity coaching message"
}
`;

  let lastError = null;

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return {
        ...extractJson(result.response.text()),
        generatedBy: `Gemini API (${modelName})`,
      };
    } catch (error) {
      lastError = error;
    }
  }

  const fallback = buildFallbackPlan(tasks, profile);
  return {
    ...fallback,
    generatedBy: "Local fallback after Gemini issue",
    summary: `${fallback.summary} Gemini was temporarily unavailable, so LifePilot used its emergency fallback plan.`,
    debugReason: lastError?.message,
  };
}
