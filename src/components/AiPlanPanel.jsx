import { Bolt, BrainCircuit, Clock, Siren } from "lucide-react";

function getSafeSummary(plan) {
  const summary = plan?.summary || "";

  if (summary.includes("GoogleGenerativeAI Error") || summary.includes("generativelanguage.googleapis.com")) {
    return "Gemini was temporarily unavailable, so LifePilot used its emergency fallback plan.";
  }

  return summary;
}

export default function AiPlanPanel({ plan }) {
  if (!plan) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        Run the AI planner to generate priority ranking, risk warnings, task breakdowns, and a survival plan.
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-blue-700">AI decision summary</p>
            <h3 className="mt-2 break-words text-2xl font-black text-slate-950">{getSafeSummary(plan)}</h3>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-4 text-center">
            <p className="text-xs font-black uppercase text-emerald-700">Productivity score</p>
            <strong className="text-3xl font-black text-emerald-800">{plan.productivityScore}</strong>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-blue-700" />
            <h3 className="text-lg font-black text-slate-950">Priority Ranking</h3>
          </div>
          <div className="grid gap-3">
            {plan.priorities?.map((item) => (
              <div key={item.taskTitle} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-slate-950">{item.taskTitle}</strong>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                    {item.priority} - {item.score}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
                <p className="mt-2 text-sm font-bold text-amber-700">Risk: {item.deadlineRisk}</p>
                <p className="mt-2 text-sm text-slate-700">{item.smartReminder}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-700" />
            <h3 className="text-lg font-black text-slate-950">Today Plan</h3>
          </div>
          <ol className="grid gap-3">
            {plan.todayPlan?.map((slot, index) => (
              <li key={`${slot.time}-${index}`} className="flex gap-3 rounded-lg bg-slate-50 p-4">
                <span className="shrink-0 text-sm font-black text-blue-700">{slot.time}</span>
                <div>
                  <p className="font-bold text-slate-950">{slot.action}</p>
                  <p className="text-sm text-slate-500">{slot.type}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-red-100 bg-red-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Siren className="h-5 w-5 text-red-700" />
            <h3 className="text-lg font-black text-red-950">Emergency Plan</h3>
          </div>
          <p className="font-bold text-red-900">Start now: {plan.emergencyPlan?.startNow}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-red-900">
            {plan.emergencyPlan?.survivalPlan?.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="rounded-lg border border-blue-100 bg-blue-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Bolt className="h-5 w-5 text-blue-700" />
            <h3 className="text-lg font-black text-blue-950">Productivity Coach</h3>
          </div>
          <p className="leading-7 text-blue-950">{plan.coachMessage}</p>
        </article>
      </section>
    </div>
  );
}
