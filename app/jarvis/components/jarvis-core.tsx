import { useState } from "react";
import { StatusDot } from "./status-dot";
import VoiceAgent from "./voice-agent";
import type { JarvisVoiceState } from "./voice-agent";

function CoreOrb({ state }: { state: JarvisVoiceState }) {
  return (
    <div className="relative flex h-[280px] w-[280px] items-center justify-center sm:h-[390px] sm:w-[390px]">
      {/* Outer targeting rings */}
      <div className="absolute inset-0 rounded-full border border-amber-400/[0.08]" />
      <div className="absolute inset-[18px] rounded-full border border-amber-400/[0.12]" />
      <div className="absolute inset-[42px] rounded-full border border-amber-400/[0.08]" />

      {/* Crosshair */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-amber-400/[0.055]" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-amber-400/[0.055]" />

      {/* Rotating scanner */}
      <div className="absolute inset-[10px] animate-[spin_14s_linear_infinite] rounded-full border border-transparent border-t-amber-400/50 border-r-amber-400/10" />

      <div className="absolute inset-[32px] animate-[spin_22s_linear_infinite_reverse] rounded-full border border-transparent border-b-amber-300/35 border-l-amber-400/10" />

      {/* Scanner ticks */}
      <div className="absolute inset-[55px] rounded-full border border-dashed border-amber-400/[0.10]" />

      {/* Core glow */}
      <div className="absolute h-[150px] w-[150px] rounded-full bg-amber-400/[0.045] blur-3xl" />

      {/* Inner intelligence field */}
      <div className={`relative flex h-[112px] w-[112px] items-center justify-center rounded-full border border-amber-300/25 bg-[radial-gradient(circle,rgba(245,158,11,0.13),rgba(245,158,11,0.025)_45%,transparent_72%)] shadow-[0_0_70px_rgba(245,158,11,0.10),inset_0_0_40px_rgba(245,158,11,0.06)] ${state === "SPEAKING" ? "shadow-[0_0_100px_rgba(245,158,11,0.24)]" : state === "LISTENING" ? "shadow-[0_0_90px_rgba(245,158,11,0.18)]" : ""}`} >
        <div className="absolute h-2 w-2 animate-pulse rounded-full bg-amber-300 shadow-[0_0_25px_rgba(245,158,11,1)]" />
        <div className="absolute h-[46px] w-[46px] rounded-full border border-amber-300/20" />
        <div className="absolute h-[72px] w-[72px] rounded-full border border-amber-400/[0.08]" />
      </div>

      {/* Orbiting signal points */}
      <div className="absolute left-[19%] top-[24%] h-1 w-1 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
      <div className="absolute right-[18%] top-[30%] h-1.5 w-1.5 rounded-full bg-amber-400/70 shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
      <div className="absolute bottom-[22%] left-[25%] h-1 w-1 rounded-full bg-amber-400/60" />
      <div className="absolute bottom-[27%] right-[24%] h-1 w-1 rounded-full bg-amber-300/50" />

      {/* Target brackets */}
      <div className="absolute left-[8%] top-[18%] h-5 w-5 border-l border-t border-amber-400/35" />
      <div className="absolute right-[8%] top-[18%] h-5 w-5 border-r border-t border-amber-400/35" />
      <div className="absolute bottom-[18%] left-[8%] h-5 w-5 border-b border-l border-amber-400/35" />
      <div className="absolute bottom-[18%] right-[8%] h-5 w-5 border-b border-r border-amber-400/35" />
    </div>
  );
}

export default function JarvisCore() {
  const [voiceState, setVoiceState] = useState<JarvisVoiceState>("STANDBY");

  return (
    <section className="relative flex min-h-[470px] flex-col items-center justify-center overflow-hidden border border-amber-400/[0.09] bg-black/30 px-4 py-8 sm:min-h-[540px]">
      <div className="absolute left-4 top-4 font-mono text-[8px] uppercase tracking-[0.24em] text-white/20">
        CORE / 001
      </div>

      <div className="absolute right-4 top-4 font-mono text-[8px] uppercase tracking-[0.24em] text-amber-400/35">
        {voiceState}
      </div>

      <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.34em] text-amber-400/50">
        Central Intelligence
      </div>

      <CoreOrb state={voiceState} />

      <div className="mt-[-5px] text-center">
        <div className="text-sm font-medium uppercase tracking-[0.3em] text-white">
          J.A.R.V.I.S. Core
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-400/55">
          <StatusDot tone="amber" />
          {voiceState === "STANDBY" ? "Intelligence engine active" : "Voice channel / " + voiceState}
        </div>
      </div>

      <div className="mt-5 w-full max-w-[520px]">
        <VoiceAgent onStateChange={setVoiceState} />
      </div>

      <div className="mt-7 grid w-full max-w-[390px] grid-cols-3 border border-white/[0.05] bg-black/30">
        {[
          ["SIGNALS", "24"],
          ["AGENTS", "06"],
          ["ACTIONS", "08"],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={`px-3 py-3 text-center ${
              index > 0 ? "border-l border-white/[0.05]" : ""
            }`}
          >
            <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">
              {label}
            </div>
            <div className="mt-1 font-mono text-sm text-amber-400/75">
              {value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
