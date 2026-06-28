import { useEffect, useState } from "react";
import { CalendarPlus, Cloud, Database, KeyRound, Save, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserProfile, updateUserProfile } from "../services/userService.js";

const roleModes = ["General", "Student", "Professional", "Entrepreneur", "Freelancer", "Creator"];

export default function Profile() {
  const { user, profile, setProfile } = useAuth();
  const [form, setForm] = useState(profile || {});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const loaded = await getUserProfile(user.uid);
      setForm(loaded);
    }

    loadProfile();
  }, [user.uid]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const savedProfile = await updateUserProfile(user.uid, form);
    setProfile(savedProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="grid gap-6">
      <header>
        <p className="text-sm font-black uppercase text-blue-700">Profile</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Tune LifePilot to your work style.</h2>
        <p className="mt-3 max-w-2xl text-slate-600">Role mode changes how the AI planner explains priorities and recovery plans.</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-4 app-shadow sm:p-6">
          <label className="grid gap-2 text-sm font-black text-slate-700">
            Display name
            <input
              value={form.displayName || ""}
              onChange={(event) => updateField("displayName", event.target.value)}
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4"
            />
          </label>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Role-Based Mode
            <select
              value={form.roleMode || "General"}
              onChange={(event) => updateField("roleMode", event.target.value)}
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4"
            >
              {roleModes.map((mode) => <option key={mode}>{mode}</option>)}
            </select>
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Daily focus hours
              <input
                type="number"
                min="1"
                max="14"
                value={form.dailyFocusHours || 6}
                onChange={(event) => updateField("dailyFocusHours", Number(event.target.value))}
                className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4"
              />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Stress level
              <select
                value={form.stressLevel || "Medium"}
                onChange={(event) => updateField("stressLevel", event.target.value)}
                className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Preferred work window
            <input
              value={form.workWindow || ""}
              onChange={(event) => updateField("workWindow", event.target.value)}
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4"
              placeholder="9:00 AM - 8:00 PM"
            />
          </label>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Main goal
            <textarea
              rows="4"
              value={form.goal || ""}
              onChange={(event) => updateField("goal", event.target.value)}
              className="focus-ring rounded-lg border border-slate-300 px-4 py-3"
            />
          </label>

          <button
            type="submit"
            className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700 sm:w-auto"
          >
            <Save className="h-5 w-5" />
            {saved ? "Saved" : "Save profile"}
          </button>
        </form>

        <section className="grid gap-4">
          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-xl font-black text-slate-950">Google technologies used</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Tech icon={Sparkles} title="Google AI Studio" text="Create the Gemini API key for core AI features." />
              <Tech icon={KeyRound} title="Gemini API" text="Priority, deadline risk, smart reminders, breakdowns, and coaching." />
              <Tech icon={Cloud} title="Firebase Auth" text="Email/password login and Google Sign-In." />
              <Tech icon={Database} title="Firestore" text="users, tasks, goals, habits, and aiPlans collections." />
              <Tech icon={Cloud} title="Firebase Hosting" text="Deploys the Vite build publicly." />
              <Tech icon={CalendarPlus} title="Calendar API" text="Creates Google Calendar events from saved deadline tasks." />
            </div>
          </article>

          <article className="rounded-lg border border-blue-100 bg-blue-50 p-5">
            <h3 className="font-black text-blue-950">Hackathon demo flow</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-blue-950">
              <li>User signs up with Firebase Auth.</li>
              <li>User adds five mixed deadline tasks.</li>
              <li>Gemini generates priority, risk, breakdown, and daily plan.</li>
              <li>User completes a task.</li>
              <li>Dashboard updates productivity score and emergency alerts.</li>
            </ol>
          </article>
        </section>
      </section>
    </div>
  );
}

function Tech({ icon: Icon, title, text }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <Icon className="h-5 w-5 text-blue-700" />
      <p className="mt-3 font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
