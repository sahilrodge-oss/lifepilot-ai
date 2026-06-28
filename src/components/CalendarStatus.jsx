import { CalendarCheck, CalendarPlus, Loader2, XCircle } from "lucide-react";
import { useCalendar } from "../context/CalendarContext.jsx";

export default function CalendarStatus() {
  const { connected, configured, busy, connect, disconnect } = useCalendar();

  return (
    <div className="grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-slate-400">Google Calendar</p>
          <span className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
            connected ? "bg-emerald-100 text-emerald-800" : "bg-slate-800 text-slate-300"
          }`}>
            {connected ? <CalendarCheck className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {connected ? "Connected" : "Not Connected"}
          </span>
        </div>
      </div>

      {!configured ? (
        <p className="text-xs leading-5 text-amber-200">Add `VITE_GOOGLE_CLIENT_ID` to `.env` to enable Calendar.</p>
      ) : null}

      <button
        type="button"
        disabled={busy || !configured}
        onClick={connected ? disconnect : connect}
        className="focus-ring inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 text-center text-sm font-black text-slate-100 hover:bg-slate-800"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}
        {connected ? "Disconnect" : "Connect Google Calendar"}
      </button>
    </div>
  );
}
