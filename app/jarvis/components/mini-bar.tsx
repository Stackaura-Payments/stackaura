export default function MiniBar({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-[10px] font-medium text-slate-400">
          {label}
        </span>

        <span className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.045]">
        <div
          className="h-full rounded-full bg-cyan-400/70 transition-all"
          style={{ width }}
        />
      </div>
    </div>
  );
}
