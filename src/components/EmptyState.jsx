import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function EmptyState({ title = "No tasks yet", message = "Add your first deadline task to unlock LifePilot decisions." }) {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-slate-600">{message}</p>
      <Link
        to="/add-task"
        className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700 sm:w-auto"
      >
        <Plus className="h-5 w-5" />
        Add task
      </Link>
    </section>
  );
}
