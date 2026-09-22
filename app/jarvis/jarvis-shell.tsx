"use client";

import JarvisHeader from "./components/jarvis-header";
import SystemStatusPanel from "./components/system-status-panel";
import PaymentNetworkPanel from "./components/payment-network-panel";
import JarvisCore from "./components/jarvis-core";
import SystemLog from "./components/system-log";
import AgentsPanel from "./components/agents-panel";
import ApprovalsPanel from "./components/approvals-panel";
import AskJarvis from "./components/ask-jarvis";
import OperationHistory from "./components/operation-history";

export default function JarvisShell() {
  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#020201] px-3 py-3 text-white sm:px-5 sm:py-5 lg:px-7">
      <div className="mx-auto w-full max-w-[1800px]">
        <section className="relative isolate overflow-hidden border border-amber-400/[0.10] bg-[#050504] shadow-[0_0_120px_rgba(0,0,0,0.65)]">
          {/* Cinematic atmosphere */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(245,158,11,0.055),transparent_25%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.025),transparent_38%)]" />

          {/* Technical grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(245,158,11,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.055) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "linear-gradient(to bottom, black, transparent 85%)",
            }}
          />

          {/* Scanline texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.15) 4px)",
            }}
          />

          <div className="relative px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            <JarvisHeader />

            <div className="grid gap-3 py-5 xl:grid-cols-[250px_minmax(500px,1fr)_250px]">
              {/* LEFT TELEMETRY */}
              <div className="order-2 flex flex-col gap-3 xl:order-1">
                <SystemStatusPanel />
                <PaymentNetworkPanel />
              </div>

              {/* CORE */}
              <div className="order-1 xl:order-2">
                <JarvisCore />
              </div>

              {/* RIGHT TELEMETRY */}
              <div className="order-3 flex flex-col gap-3">
                <section className="border border-amber-400/[0.08] bg-black/40 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-amber-500/55">
                        Runtime
                      </p>
                      <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
                        Core Telemetry
                      </h2>
                    </div>
                    <span className="font-mono text-[9px] text-amber-500/50">
                      01
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-white/[0.04] pb-2">
                      <span className="text-white/30">RUNTIME</span>
                      <span className="text-amber-400/75">READY</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.04] pb-2">
                      <span className="text-white/30">MEMORY</span>
                      <span className="text-white/55">PERSISTENT</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.04] pb-2">
                      <span className="text-white/30">POLICY</span>
                      <span className="text-amber-400/75">ENFORCED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">AUDIT</span>
                      <span className="text-white/55">ACTIVE</span>
                    </div>
                  </div>
                </section>

                <section className="border border-white/[0.06] bg-black/40 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25">
                        Network
                      </p>
                      <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/75">
                        External Systems
                      </h2>
                    </div>
                    <span className="font-mono text-[9px] text-white/20">
                      04
                    </span>
                  </div>

                  <div className="space-y-2">
                    {["GITHUB", "VERCEL", "SUPABASE", "SHOPIFY"].map(
                      (system) => (
                        <div
                          key={system}
                          className="flex items-center justify-between border-b border-white/[0.035] py-2 last:border-0"
                        >
                          <span className="font-mono text-[9px] tracking-[0.16em] text-white/40">
                            {system}
                          </span>
                          <span className="flex items-center gap-2 font-mono text-[9px] text-amber-400/65">
                            <span className="h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                            READY
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              </div>
            </div>

            <SystemLog />
            <OperationHistory />
            <AgentsPanel />
            <ApprovalsPanel />
            <AskJarvis />

            <div className="mt-5 flex flex-col gap-2 border-t border-amber-400/[0.07] pt-4 font-mono text-[8px] uppercase tracking-[0.2em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
              <span>J.A.R.V.I.S. / PRIVATE OPERATIONS INTERFACE</span>
              <span className="text-amber-500/35">
                Simulation Layer / Awaiting Runtime Data
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
