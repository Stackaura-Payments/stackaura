export default function AgentsPanel() {
  const agents = [
    ["EN", "ENGINEERING", "CODE / INFRASTRUCTURE", "ACTIVE"],
    ["PY", "PAYMENTS", "GATEWAY OPERATIONS", "ACTIVE"],
    ["MK", "MARKETING", "GROWTH / CONTENT", "MONITOR"],
    ["SP", "SUPPORT", "CUSTOMER OPERATIONS", "ACTIVE"],
    ["FN", "FINANCE", "REVENUE / RECONCILIATION", "MONITOR"],
    ["RS", "RESEARCH", "INTELLIGENCE / ANALYSIS", "MONITOR"],
  ];

  return (
    <section className="mt-3 border border-white/[0.06] bg-black/40 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-amber-500/45">
            Intelligence Network
          </p>
          <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/80">
            Autonomous Agents
          </h2>
        </div>

        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-amber-400/45">
          06 REGISTERED
        </span>
      </div>

      <div className="grid gap-px border border-white/[0.04] bg-white/[0.04] sm:grid-cols-2 xl:grid-cols-3">
        {agents.map(([code, name, role, status]) => (
          <div
            key={name}
            className="bg-[#050504] p-4 transition-colors hover:bg-amber-400/[0.025]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-amber-400/[0.12] font-mono text-[9px] text-amber-400/65">
                  {code}
                </span>

                <div>
                  <div className="font-mono text-[9px] tracking-[0.14em] text-white/65">
                    {name}
                  </div>
                  <div className="mt-1 font-mono text-[7px] tracking-[0.1em] text-white/20">
                    {role}
                  </div>
                </div>
              </div>

              <span className="h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_7px_rgba(245,158,11,0.7)]" />
            </div>

            <div className="mt-4 flex justify-between font-mono text-[7px] uppercase tracking-[0.16em]">
              <span className="text-white/20">STATUS</span>
              <span className="text-amber-400/55">{status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
