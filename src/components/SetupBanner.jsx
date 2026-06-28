import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { isFirebaseConfigured } from "../config/firebase";
import { isGeminiConfigured } from "../services/geminiService";

export default function SetupBanner() {
  if (isFirebaseConfigured && isGeminiConfigured) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        Google stack connected: Firebase Auth, Firestore, Firebase Hosting config, and Gemini API.
      </div>
    );
  }

  const missing = [
    !isFirebaseConfigured ? "Firebase environment variables" : null,
    !isGeminiConfigured ? "Gemini API key" : null,
  ].filter(Boolean);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-bold">Demo preview is active.</p>
        <p>Add {missing.join(" and ")} in `.env` to enable real Google AI Studio Gemini calls and Firebase services.</p>
      </div>
    </div>
  );
}
