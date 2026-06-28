import { BrainCircuit, CalendarCheck, CheckCircle2, Lightbulb, Rocket, ShieldCheck, Sparkles, Users } from "lucide-react";

const targetUsers = ["Students", "Working Professionals", "Entrepreneurs", "Freelancers", "Content Creators", "General Users"];

const coreFeatures = [
  "Intelligent task prioritization",
  "AI-powered scheduling assistance",
  "Personalized productivity recommendations",
  "Context-aware reminders",
  "Goal and habit tracking",
  "Deadline risk prediction",
  "Emergency Mode",
  "Smart task breakdown",
  "Productivity score",
  "Google Calendar integration",
  "Voice-enabled assistance",
];

const googleTech = [
  "Google AI Studio",
  "Gemini API",
  "Firebase Authentication",
  "Firestore Database",
  "Firebase Hosting",
  "Google Calendar API",
];

export default function AboutProject() {
  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-lg border border-blue-100 bg-white app-shadow">
        <div className="grid gap-6 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:p-8">
          <div className="min-w-0">
            <p className="text-sm font-black uppercase text-blue-700">Project Name</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              LifePilot AI - Smart Deadline & Productivity Companion
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-bold text-slate-700">Plan Smart. Stay Ahead. Finish Strong.</p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              LifePilot AI is a deadline emergency assistant that uses Gemini AI and Firebase to help users plan,
              prioritize, recover from overload, and finish important work before deadlines.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Metric icon={BrainCircuit} label="Core AI" value="Gemini" />
            <Metric icon={ShieldCheck} label="Backend" value="Firebase" />
            <Metric icon={CalendarCheck} label="Bonus" value="Calendar" />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <InfoCard icon={Lightbulb} title="Problem Statement">
          People often miss deadlines because normal reminder apps only notify them but do not help them plan, prioritize,
          or recover from last-minute task overload.
        </InfoCard>

        <InfoCard icon={Rocket} title="Solution">
          LifePilot AI uses Gemini AI to analyze user tasks, predict deadline risks, prioritize urgent work, create smart
          schedules, break tasks into smaller steps, and guide users to complete work on time.
        </InfoCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl font-black text-slate-950">Target Users</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {targetUsers.map((user) => (
              <span key={user} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
                {user}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-black text-slate-950">Core Features</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {coreFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg border border-blue-100 bg-blue-50 p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl font-black text-blue-950">Google Technologies Used</h2>
          </div>
          <div className="grid gap-3">
            {googleTech.map((tech) => (
              <div key={tech} className="rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-black text-blue-900">
                {tech}
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-5">
          <InfoCard icon={BrainCircuit} title="Innovation">
            LifePilot AI is not just a to-do app. It acts like an AI decision-maker that tells users what to do first,
            what can wait, what is at risk, and how to recover from deadline overload.
          </InfoCard>

          <InfoCard icon={ShieldCheck} title="Why It Is Useful">
            It helps users reduce stress, avoid procrastination, manage urgent work, and complete important tasks before
            deadlines.
          </InfoCard>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-sm">
      <Icon className="h-5 w-5 text-blue-700" />
      <p className="mt-3 text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-700" />
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
      </div>
      <p className="leading-7 text-slate-600">{children}</p>
    </article>
  );
}
