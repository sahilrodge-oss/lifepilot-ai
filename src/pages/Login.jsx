import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getFriendlyAuthError } from "../utils/firebaseErrors.js";

export default function Login() {
  const { user, login, loginWithGoogle, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError("");

    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-7 app-shadow">
          <div className="mb-7">
            <p className="text-sm font-black uppercase text-blue-700">LifePilot AI</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Sign in to your deadline cockpit.</h1>
            <p className="mt-3 text-slate-600">Real Firebase Auth supports email/password and Google Sign-In.</p>
          </div>

          {!isFirebaseConfigured ? (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Firebase is not configured yet, so the app opens in demo preview after setup files are added.
            </div>
          ) : null}

          {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
                className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4 font-medium"
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
                className="focus-ring min-h-12 rounded-lg border border-slate-300 px-4 font-medium"
                placeholder="Minimum 6 characters"
              />
            </label>

            <button
              type="submit"
              disabled={busy || !isFirebaseConfigured}
              className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700"
            >
              <LogIn className="h-5 w-5" />
              Login
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy || !isFirebaseConfigured}
            className="focus-ring mt-3 min-h-12 w-full rounded-lg border border-slate-300 px-5 font-black text-slate-800 hover:bg-slate-50"
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            New here? <Link to="/signup" className="font-black text-blue-700">Create account</Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <img
          src="/assets/lifepilot-workspace.png"
          alt="AI productivity workspace"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-x-8 bottom-8 rounded-lg bg-white/90 p-6">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-7 w-7 text-blue-700" />
            <p className="font-black text-slate-950">Gemini-powered decisions for deadline overload.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
