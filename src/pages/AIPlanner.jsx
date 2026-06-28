import { useState } from "react";
import { BrainCircuit, Siren } from "lucide-react";
import AiPlanPanel from "../components/AiPlanPanel.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { generateAiPlan } from "../services/geminiService.js";
import { saveAiPlan } from "../services/taskService.js";
import { useLatestAiPlan, useTasks } from "../hooks/useTasks.js";

export default function AIPlanner() {
  const { user, profile } = useAuth();
  const { tasks } = useTasks(user.uid);
  const latestPlan = useLatestAiPlan(user.uid);
  const [plan, setPlan] = useState(latestPlan?.plan || null);
  const [mode, setMode] = useState("standard");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setBusy(true);
    setError("");

    try {
      const nextPlan = await generateAiPlan(tasks, profile, mode);
      setPlan(nextPlan);
      await saveAiPlan(user.uid, nextPlan);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const visiblePlan = plan || latestPlan?.plan;

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-blue-700">Gemini AI Planner</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Ask AI what to do first.</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Gemini analyzes deadlines, estimated time, importance, role mode, and task status to create a priority list, risk prediction, breakdown, schedule, smart reminder, and coach message.
          </p>
        </div>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <button
            type="button"
            onClick={() => setMode("standard")}
            className={`focus-ring min-h-11 rounded-lg px-4 font-black ${
              mode === "standard" ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-800"
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => setMode("emergency")}
            className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-black ${
              mode === "emergency" ? "bg-red-600 text-white" : "border border-red-200 bg-white text-red-700"
            }`}
          >
            <Siren className="h-5 w-5" />
            Emergency
          </button>
        </div>
      </header>

      {error ? <p className="rounded-lg bg-red-50 p-4 font-bold text-red-700">{error}</p> : null}
      {tasks.length === 0 ? <EmptyState title="Add tasks before planning" message="LifePilot needs at least one deadline task before Gemini can reason about priorities." /> : null}

      {tasks.length > 0 ? (
        <section className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">{mode === "emergency" ? "Emergency Mode" : "Standard Planning"}</h3>
            <p className="mt-1 text-slate-600">
              {mode === "emergency"
                ? "Creates an hour-by-hour survival plan and delays low-priority work."
                : "Creates a balanced plan for all active tasks."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={busy}
          className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700 md:w-auto"
          >
            <BrainCircuit className="h-5 w-5" />
            {busy ? "Generating..." : "Generate AI Plan"}
          </button>
        </section>
      ) : null}

      <AiPlanPanel plan={visiblePlan} />
    </div>
  );
}
