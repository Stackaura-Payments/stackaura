export default function DataRow({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "good" | "warning";
}) {
  const valueClass = {
    default: "text-white",
    good: "text-emerald-300",
    warning: "text-amber-300",
  }[tone];

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5">
      <div className="min-w-0">
        <div className="truncate text-[11px] font-medium text-slate-400">
          {label}
        </div>

        {detail && (
          <div className="mt-0.5 truncate text-[9px] uppercase tracking-[0.12em] text-slate-700">
            {detail}
          </div>
        )}
      </div>

      <div className={`shrink-0 text-xs font-semibold ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}
