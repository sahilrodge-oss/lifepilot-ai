import { useState } from "react";
import { CheckCircle2, Plus, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { addUserCollectionItem, updateUserCollectionItem } from "../services/taskService.js";
import { useUserCollection } from "../hooks/useTasks.js";

export default function GoalsHabits() {
  const { user } = useAuth();
  const { items: goals } = useUserCollection("goals", user.uid);
  const { items: habits } = useUserCollection("habits", user.uid);
  const [goalTitle, setGoalTitle] = useState("");
  const [habitTitle, setHabitTitle] = useState("");

  async function addGoal(event) {
    event.preventDefault();
    if (!goalTitle.trim()) return;
    await addUserCollectionItem("goals", user.uid, {
      title: goalTitle.trim(),
      status: "active",
      targetDate: "",
    });
    setGoalTitle("");
  }

  async function addHabit(event) {
    event.preventDefault();
    if (!habitTitle.trim()) return;
    await addUserCollectionItem("habits", user.uid, {
      title: habitTitle.trim(),
      frequency: "Daily",
      streak: 0,
      status: "active",
    });
    setHabitTitle("");
  }

  return (
    <div className="grid gap-6">
      <header>
        <p className="text-sm font-black uppercase text-emerald-700">Goals and Habits</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Protect progress after the crisis.</h2>
        <p className="mt-3 max-w-2xl text-slate-600">Goals and habits give LifePilot extra context for productivity scoring and future rescheduling.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-700" />
            <h3 className="text-xl font-black text-slate-950">Goals</h3>
          </div>
          <form onSubmit={addGoal} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={goalTitle}
              onChange={(event) => setGoalTitle(event.target.value)}
              className="focus-ring min-h-11 flex-1 rounded-lg border border-slate-300 px-4"
              placeholder="Finish portfolio launch"
            />
            <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 font-black text-white sm:w-auto" type="submit">
              <Plus className="h-5 w-5" />
              Add
            </button>
          </form>
          <div className="mt-5 grid gap-3">
            {goals.map((goal) => (
              <article key={goal.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
                <span className={`font-bold ${goal.status === "completed" ? "text-slate-400 line-through" : "text-slate-950"}`}>{goal.title}</span>
                <button
                  type="button"
                  onClick={() => updateUserCollectionItem("goals", goal.id, { status: "completed" })}
                  className="focus-ring rounded-lg bg-emerald-50 p-2 text-emerald-700"
                  aria-label={`Complete ${goal.title}`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            <h3 className="text-xl font-black text-slate-950">Habits</h3>
          </div>
          <form onSubmit={addHabit} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={habitTitle}
              onChange={(event) => setHabitTitle(event.target.value)}
              className="focus-ring min-h-11 flex-1 rounded-lg border border-slate-300 px-4"
              placeholder="Daily deep work block"
            />
            <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 font-black text-white sm:w-auto" type="submit">
              <Plus className="h-5 w-5" />
              Add
            </button>
          </form>
          <div className="mt-5 grid gap-3">
            {habits.map((habit) => (
              <article key={habit.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-bold text-slate-950">{habit.title}</p>
                  <p className="text-sm text-slate-500">{habit.frequency} - streak {habit.streak || 0}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateUserCollectionItem("habits", habit.id, { streak: Number(habit.streak || 0) + 1 })}
                  className="focus-ring rounded-lg bg-blue-50 px-3 py-2 text-sm font-black text-blue-700"
                >
                  Done
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
