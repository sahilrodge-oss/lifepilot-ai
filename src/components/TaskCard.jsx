import { AlertCircle, CalendarClock, CalendarPlus, CheckCircle2, Clock3, Loader2 } from "lucide-react";
import { formatDeadline, getDeadlineRisk, getPriorityLabel, getPriorityScore } from "../utils/scoring";

const riskTone = {
  Overdue: "bg-red-100 text-red-700",
  Critical: "bg-red-100 text-red-700",
  High: "bg-amber-100 text-amber-800",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-emerald-100 text-emerald-700",
  Safe: "bg-emerald-100 text-emerald-700",
};

export default function TaskCard({ task, onComplete, onAddToCalendar, calendarBusy = false, compact = false }) {
  const score = getPriorityScore(task);
  const risk = getDeadlineRisk(task);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-black ${riskTone[risk]}`}>
              {risk}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              {getPriorityLabel(score)} priority
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
              {task.category}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-950">{task.title}</h3>
          {!compact && task.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          {score}/100
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <span className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-slate-400" />
          {formatDeadline(task.deadline)}
        </span>
        <span className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-slate-400" />
          {task.estimatedTime}h estimate
        </span>
        <span className="flex items-center gap-2 capitalize">
          <CheckCircle2 className="h-4 w-4 text-slate-400" />
          {task.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
        {task.status !== "completed" && onComplete ? (
          <button
            type="button"
            onClick={() => onComplete(task.id)}
            className="focus-ring inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-black text-emerald-700 hover:bg-emerald-100 sm:w-auto"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark complete
          </button>
        ) : null}

        {onAddToCalendar ? (
          <button
            type="button"
            disabled={calendarBusy}
            onClick={() => onAddToCalendar(task)}
            className="focus-ring inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-black text-blue-700 hover:bg-blue-100 sm:w-auto"
          >
            {calendarBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}
            Add to Google Calendar
          </button>
        ) : null}
      </div>
    </article>
  );
}
