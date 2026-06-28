import { LogOut, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import CalendarStatus from "./CalendarStatus.jsx";

export default function MobileNavbar({ navItems, user, profile, open, onOpen, onClose, onLogout }) {
  const roleMode = profile?.roleMode || "General";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-600 text-sm font-black text-white">LP</span>
            <div className="min-w-0">
              <p className="truncate text-base font-black text-slate-950">LifePilot AI</p>
              <p className="truncate text-xs font-bold text-slate-500">Deadline Emergency Assistant</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-800"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <button
          type="button"
          onClick={onClose}
          className={`absolute inset-0 bg-slate-950/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          aria-label="Close menu overlay"
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col overflow-y-auto bg-slate-950 p-5 text-white shadow-2xl transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-600 font-black">LP</span>
              <div className="min-w-0">
                <p className="truncate text-lg font-black">LifePilot AI</p>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Deadline Emergency</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-700 text-slate-200"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-5 grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `focus-ring flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-black ${
                      isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 grid gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Mode</p>
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
        </aside>
      </div>
    </>
  );
}
