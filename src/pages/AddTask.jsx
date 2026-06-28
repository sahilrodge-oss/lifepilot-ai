import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mic, MicOff, Save, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { addTask } from "../services/taskService.js";
import {
  extractTaskDetailsFromVoice,
  isVoiceInputSupported,
  listenForVoiceCommand,
  speakTaskSaved,
} from "../services/voiceAssistant.js";

const initialTask = {
  title: "",
  description: "",
  deadline: "",
  estimatedTime: 1,
  importance: "Medium",
  category: "Work",
  status: "pending",
};

export default function AddTask() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(initialTask);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [voiceDraft, setVoiceDraft] = useState("");
  const [smartReminder, setSmartReminder] = useState("");

  function updateField(field, value) {
    setTask((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await addTask(user.uid, {
        ...task,
        smartReminder,
      });
      if (transcript) speakTaskSaved();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function parseVoiceTranscript(nextTranscript) {
    const cleanTranscript = nextTranscript.trim();

    if (!cleanTranscript) {
      setVoiceError("Type or say a task first.");
      return;
    }

    setVoiceLoading(true);
    setVoiceError("");

    try {
      const parsed = await extractTaskDetailsFromVoice(cleanTranscript);
      setTask((prev) => ({
        ...prev,
        title: parsed.title || prev.title,
        description: parsed.description || prev.description,
        deadline: parsed.deadline ? parsed.deadline.slice(0, 16) : prev.deadline,
        estimatedTime: parsed.estimatedHours || prev.estimatedTime,
        importance: parsed.importance || prev.importance,
        category: parsed.category || prev.category,
      }));
      setSmartReminder(parsed.smartReminder || "");
    } catch (err) {
      setVoiceError(err.message);
    } finally {
      setVoiceLoading(false);
    }
  }

  function handleTypedVoiceCommand() {
    const nextTranscript = voiceDraft.trim();
    setTranscript(nextTranscript);
    parseVoiceTranscript(nextTranscript);
  }

  function handleVoiceInput() {
    setVoiceError("");

    if (!isVoiceInputSupported()) {
      setVoiceError("Voice input is not supported in this browser. Please type your task manually.");
      return;
    }

    listenForVoiceCommand({
      onStart: () => setListening(true),
      onEnd: () => setListening(false),
      onError: (message) => {
        setListening(false);
        setVoiceError(message);
      },
      onTranscript: (nextTranscript) => {
        setTranscript(nextTranscript);
        setVoiceDraft(nextTranscript);
        parseVoiceTranscript(nextTranscript);
      },
    });
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <header>
        <p className="text-sm font-black uppercase text-blue-700">Task System</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Add a deadline task.</h2>
        <p className="mt-3 max-w-2xl text-slate-600">Gemini uses this task data to rank priority, predict risk, create reminders, and build your plan.</p>
      </header>

      {error ? <p className="rounded-lg bg-red-50 p-4 font-bold text-red-700">{error}</p> : null}

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-blue-700">Voice-Enabled Assistance</p>
            <h3 className="mt-1 text-xl font-black text-blue-950">Speak a task and let Gemini structure it.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-900">
              Example: Remind me to submit my project report tomorrow at 6 PM. It will take 3 hours and it is very important.
            </p>
          </div>
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={listening || voiceLoading}
            className="focus-ring relative inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700 md:w-auto"
          >
            {listening ? (
              <>
                <span className="absolute -inset-1 rounded-lg bg-blue-400 opacity-30 animate-ping" />
                <MicOff className="relative h-5 w-5" />
                <span className="relative">Listening...</span>
              </>
            ) : voiceLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                Start voice input
              </>
            )}
          </button>
        </div>

        <div className="mt-4 grid gap-3 rounded-lg border border-blue-200 bg-white p-4">
          <label htmlFor="voice-command-text" className="grid gap-2 text-sm font-black text-blue-900">
            Voice command text
            <textarea
              id="voice-command-text"
              value={voiceDraft}
              onChange={(event) => setVoiceDraft(event.target.value)}
              rows="3"
              className="focus-ring rounded-lg border border-blue-200 px-4 py-3 font-medium text-slate-800"
              placeholder="Remind me to submit my project report tomorrow at 6 PM. It will take 3 hours and it is very important."
            />
          </label>
          <button
            type="button"
            onClick={handleTypedVoiceCommand}
            disabled={voiceLoading || !voiceDraft.trim()}
            className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 font-black text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
          >
            {voiceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Parse with Gemini
          </button>
        </div>

        {transcript ? (
          <div className="mt-4 rounded-lg border border-blue-200 bg-white p-4">
            <p className="flex items-center gap-2 text-sm font-black text-blue-800">
              <Sparkles className="h-4 w-4" />
              Transcript preview
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{transcript}</p>
          </div>
        ) : null}

        {smartReminder ? (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <strong>Gemini smart reminder:</strong> {smartReminder}
          </div>
        ) : null}

        {voiceError ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{voiceError}</p>
        ) : null}
      </section>

      <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-4 app-shadow sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label htmlFor="task-title" className="grid gap-2 text-sm font-black text-slate-700 md:col-span-2">
            Task title
            <input
              id="task-title"
              value={task.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4 font-medium"
              placeholder="Deliver freelance project"
            />
          </label>

          <label htmlFor="task-description" className="grid gap-2 text-sm font-black text-slate-700 md:col-span-2">
            Description
            <textarea
              id="task-description"
              value={task.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows="4"
              className="focus-ring rounded-lg border border-slate-300 px-4 py-3 font-medium"
              placeholder="What needs to be finished?"
            />
          </label>

          <label htmlFor="task-deadline" className="grid gap-2 text-sm font-black text-slate-700">
            Deadline
            <input
              id="task-deadline"
              type="text"
              value={task.deadline}
              onChange={(event) => updateField("deadline", event.target.value)}
              required
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4 font-medium"
              placeholder="2026-06-24T20:00"
            />
          </label>

          <label htmlFor="task-estimated-time" className="grid gap-2 text-sm font-black text-slate-700">
            Estimated time
            <input
              id="task-estimated-time"
              type="number"
              step="0.25"
              min="0.25"
              value={task.estimatedTime}
              onChange={(event) => updateField("estimatedTime", event.target.value)}
              required
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4 font-medium"
            />
          </label>

          <label htmlFor="task-importance" className="grid gap-2 text-sm font-black text-slate-700">
            Importance
            <select
              id="task-importance"
              value={task.importance}
              onChange={(event) => updateField("importance", event.target.value)}
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4 font-medium"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>

          <label htmlFor="task-category" className="grid gap-2 text-sm font-black text-slate-700">
            Category
            <select
              id="task-category"
              value={task.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4 font-medium"
            >
              <option>Study</option>
              <option>Work</option>
              <option>Client</option>
              <option>Freelance</option>
              <option>Business</option>
              <option>Personal</option>
              <option>Creator</option>
            </select>
          </label>

          <label htmlFor="task-status" className="grid gap-2 text-sm font-black text-slate-700">
            Status
            <select
              id="task-status"
              value={task.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4 font-medium"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700 md:w-auto"
        >
          <Save className="h-5 w-5" />
          Save task
        </button>
      </form>
    </div>
  );
}
