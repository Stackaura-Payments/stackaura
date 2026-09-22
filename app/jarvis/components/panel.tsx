import { StatusDot } from "./status-dot";

export function Panel({
  eyebrow,
  title,
  status,
  children,
}: {
  eyebrow: string;
  title: string;
  status?: "online" | "monitoring" | "attention";
  children: React.ReactNode;
}) {
  const labels = {
    online: "ONLINE",
    monitoring: "MONITORING",
    attention: "ATTENTION",
  };

  return (
    <section className="border border-white/[0.06] bg-black/40 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-[0.28em] text-amber-500/45">
            {eyebrow}
          </div>
          <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/80">
            {title}
          </h2>
        </div>

        {status && (
          <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-amber-400/55">
            <StatusDot tone="amber" />
            {labels[status]}
          </div>
        )}
      </div>

      {children}
    </section>
  );
}
