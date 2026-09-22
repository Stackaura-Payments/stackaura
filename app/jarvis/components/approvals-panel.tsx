export default function ApprovalsPanel() {
  return (
    <section className="mt-3 border border-white/[0.06] bg-black/40 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-amber-500/45">
            Governance
          </p>
          <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/80">
            Authorization Queue
          </h2>
        </div>

        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
          Pending <span className="text-amber-400/65">00</span>
        </div>
      </div>

      <div className="flex min-h-[110px] items-center justify-center border border-dashed border-white/[0.06] bg-black/30">
        <div className="text-center">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
            Authorization Queue Clear
          </div>
          <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/15">
            Actions requiring owner approval will appear here
          </div>
        </div>
      </div>
    </section>
  );
}
