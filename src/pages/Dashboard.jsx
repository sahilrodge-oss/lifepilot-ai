import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ClipboardList, Flame, Gauge, Plus, Siren } from "lucide-react";
import AiPlanPanel from "../components/AiPlanPanel.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StatCard from "../components/StatCard.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCalendar } from "../context/CalendarContext.jsx";
import { updateTask } from "../services/taskService.js";
import { useLatestAiPlan, useTasks } from "../hooks/useTasks.js";
import { getDeadlineRisk, getTaskInsights, sortByDecisionPriority } from "../utils/scoring.js";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { addTaskToCalendar, busyTaskId } = useCalendar();
  const { tasks, loading, error } = useTasks(user.uid);
  const latestPlan = useLatestAiPlan(user.uid);
  const insights = getTaskInsights(tasks);
  const urgentTasks = sortByDecisionPriority(tasks)
    .filter((task) => task.status !== "completed")
    .slice(0, 4);
  const dangerAlerts = tasks.filter((task) => ["Overdue", "Critical", "High"].includes(getDeadlineRisk(task)));

  async function handleComplete(taskId) {
    await updateTask(user.uid, taskId, { status: "completed" });
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-blue-700">Dashboard</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">What should you do next?</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            LifePilot watches urgency, effort, status, and deadline risk so your next move is clear.
          </p>
        </div>
        <Link
          to="/add-task"
          className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700 sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Add task
        </Link>
      </header>

      {error ? <p className="rounded-lg bg-red-50 p-4 font-bold text-red-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={ClipboardList} label="Total tasks" value={insights.total} tone="blue" helper={`${insights.totalEstimated}h active load`} />
        <StatCard icon={CheckCircle2} label="Completed" value={insights.completed} tone="green" helper="Marked finished" />
        <StatCard icon={Flame} label="Pending" value={insights.pending} tone="amber" helper="Still active" />
        <StatCard icon={AlertTriangle} label="High risk" value={insights.highRisk} tone="red" helper="Needs attention" />
        <StatCard icon={Gauge} label="Productivity" value={insights.productivityScore} tone="slate" helper="Score from task health" />
      </section>

      {loading ? <p className="rounded-lg bg-white p-5 text-slate-600">Loading tasks...</p> : null}
      {!loading && tasks.length === 0 ? <EmptyState /> : null}

      {dangerAlerts.length > 0 ? (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-3">
            <Siren className="h-6 w-6 text-red-700" />
            <div>
              <h3 className="font-black text-red-950">Emergency alerts</h3>
              <p className="text-sm text-red-800">{dangerAlerts.length} task needs urgent decision support.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {dangerAlerts.slice(0, 4).map((task) => (
              <div key={task.id} className="rounded-lg bg-white p-4 text-sm font-bold text-red-900">
                {task.title} is {getDeadlineRisk(task).toLowerCase()} risk.
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-slate-950">Decision Queue</h3>
            <Link to="/ai-planner" className="shrink-0 font-black text-blue-700">Open AI Planner</Link>
          </div>
          <div className="grid gap-4">
            {urgentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onAddToCalendar={addTaskToCalendar}
                calendarBusy={busyTaskId === task.id}
                compact
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <p className="text-sm font-black uppercase text-emerald-700">Today AI Plan</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{profile?.roleMode || "General"} mode guidance</h3>
          </div>
          <AiPlanPanel plan={latestPlan?.plan} />
        </div>
      </section>
    </div>
  );
}
