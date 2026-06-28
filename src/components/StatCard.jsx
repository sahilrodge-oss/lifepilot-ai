export default function StatCard({ icon: Icon, label, value, tone = "blue", helper }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    red: "border-red-100 bg-red-50 text-red-700",
    slate: "border-slate-200 bg-white text-slate-700",
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 app-shadow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">{value}</strong>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-lg border ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {helper ? <p className="mt-3 text-sm text-slate-500">{helper}</p> : null}
    </article>
  );
}
