import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import CalendarStatus from "./CalendarStatus.jsx";

export default function Sidebar({ navItems, user, profile, onLogout }) {
  const roleMode = profile?.roleMode || "General";

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-800 bg-slate-950 text-white lg:flex lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-600 text-base font-black shadow-lg shadow-blue-950/30">
            LP
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black">LifePilot AI</h1>
            <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">Deadline Emergency Assistant</p>
          </div>
        </div>

        <nav className="mt-6 grid gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-black transition ${
                    isActive ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto grid gap-4 pt-6">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">User Mode</p>
            <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
              {roleMode}
            </span>
            <p className="mt-3 break-all text-xs leading-5 text-slate-400">{user?.email}</p>
          </div>

          <CalendarStatus />

          <button
            type="button"
            onClick={onLogout}
            className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-black text-slate-200 hover:bg-slate-900"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
