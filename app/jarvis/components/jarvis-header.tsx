import { StatusDot } from "./status-dot";

export default function JarvisHeader() {
  return (
    <header className="border-b border-amber-400/[0.10] pb-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.28em]">
            <span className="text-amber-400/75">STACKAURA</span>
            <span className="h-px w-5 bg-amber-400/20" />
            <span className="text-white/25">PRIVATE OPERATIONS</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <h1 className="text-xl font-medium tracking-[0.18em] text-white sm:text-2xl">
              J.A.R.V.I.S.
            </h1>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400/45">
              Core
            </span>
          </div>

          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
            Autonomous operations intelligence
          </p>
        </div>

        <div className="flex items-center gap-3 border border-amber-400/[0.12] bg-amber-400/[0.025] px-3 py-2">
          <StatusDot tone="amber" />
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-400/70">
            System Online
          </div>
          <div className="h-3 w-px bg-white/[0.08]" />
          <div className="font-mono text-[9px] text-white/25">SECURE</div>
        </div>
      </div>
    </header>
  );
}
