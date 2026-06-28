import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useCalendar } from "../context/CalendarContext.jsx";

const toastTone = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

const toastIcon = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export default function Toast() {
  const { toast, dismissToast } = useCalendar();

  if (!toast) return null;

  const Icon = toastIcon[toast.type] || Info;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div className={`flex items-start gap-3 rounded-lg border p-4 shadow-xl ${toastTone[toast.type] || toastTone.info}`}>
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="min-w-0 flex-1 text-sm font-bold leading-6">{toast.message}</p>
        <button
          type="button"
          onClick={dismissToast}
          className="focus-ring rounded-md p-1 hover:bg-white/70"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
