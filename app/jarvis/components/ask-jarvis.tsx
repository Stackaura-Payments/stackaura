"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, Loader2, Terminal } from "lucide-react";

type JarvisResponse = {
  message: string;
  agent: string;
  intent: string;
  actions: string[];
  requiresApproval: boolean;
  data: Array<{
    toolId: string;
    intent: string;
    succeeded: boolean;
    result?: unknown;
    error?: string;
  }>;
};

export default function AskJarvis() {
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState<JarvisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = command.trim();

    if (!message || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/jarvis/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          body?.message || `JARVIS request failed (${res.status}).`,
        );
      }

      setResponse(body);
      setCommand("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "JARVIS request failed.",
      );
    } finally {
      setLoading(false);
    }
  }

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

      <form onSubmit={submit} className="flex items-center gap-3 border border-white/[0.07] bg-[#020201] px-3 py-2">
        <span className="font-mono text-xs text-amber-400/55">&gt;</span>

        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          disabled={loading}
          aria-label="Command JARVIS"
          placeholder="Enter command..."
          className="min-w-0 flex-1 bg-transparent font-mono text-[10px] text-white outline-none placeholder:text-white/25 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading || !command.trim()}
          aria-label="Send command to JARVIS"
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-amber-400/[0.12] bg-amber-400/[0.025] text-amber-400/65 transition hover:border-amber-400/30 hover:bg-amber-400/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
          ) : (
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 border border-red-400/15 bg-red-400/[0.03] px-3 py-2 font-mono text-[9px] text-red-300/70">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-3 border border-amber-400/[0.08] bg-black/30 p-3">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
            <span className="text-amber-400/65">{response.agent}</span>
            <span>{response.intent}</span>
            {response.requiresApproval && (
              <span className="text-amber-300">APPROVAL REQUIRED</span>
            )}
          </div>
          <p className="mt-2 font-mono text-[10px] leading-5 text-white/65">
            {response.message}
          </p>

          {response.data?.map((item) => (
            <div key={`${item.toolId}-${item.intent}`} className="mt-3 border-t border-white/[0.04] pt-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/25">
                {item.toolId}
                <span className={`ml-3 ${item.succeeded ? "text-amber-400/65" : "text-red-300/60"}`}>
                  {item.succeeded ? "SUCCEEDED" : "FAILED"}
                </span>
              </div>
              {item.error && (
                <p className="mt-1 font-mono text-[9px] text-red-300/60">{item.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/20">
        <button type="button" onClick={() => setCommand("Check the status of Stackaura-Payments/stackaura-checkout-api")} className="hover:text-amber-400/55">CHECK GITHUB REPOSITORY</button>
        <button type="button" onClick={() => setCommand("Check payment health")} className="hover:text-amber-400/55">CHECK PAYMENT HEALTH</button>
        <button type="button" onClick={() => setCommand("Check deployments")} className="hover:text-amber-400/55">CHECK DEPLOYMENTS</button>
      </div>
    </section>
  );
}
