import { ArrowUp, Terminal } from "lucide-react";

export default function AskJarvis() {
  return (
    <section className="mt-3 border border-amber-400/[0.12] bg-black/50 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-amber-400/55" strokeWidth={1.5} />
          <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-amber-400/65">
            Command Interface
          </span>
        </div>

        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/15">
          JARVIS INPUT
        </span>
      </div>

      <div className="flex items-center gap-3 border border-white/[0.07] bg-[#020201] px-3 py-2">
        <span className="font-mono text-xs text-amber-400/55">&gt;</span>

        <div className="min-w-0 flex-1 font-mono text-[10px] text-white/25">
          Awaiting command...
        </div>

        <button
          type="button"
          disabled
          aria-label="Send command to JARVIS"
          className="flex h-8 w-8 items-center justify-center border border-amber-400/[0.12] bg-amber-400/[0.025] text-amber-400/40"
        >
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/20">
        <span>CHECK PAYMENT HEALTH</span>
        <span>REVIEW ALERTS</span>
        <span>CHECK DEPLOYMENTS</span>
      </div>
    </section>
  );
}
