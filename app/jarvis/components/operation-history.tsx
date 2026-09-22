"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";

type Operation = {
  id: string;
  agent: string;
  toolId: string;
  intent: string;
  permission: string;
  scope: "OWNER";
  mode: "READ ONLY";
  approved: boolean;
  status: "STARTED" | "SUCCEEDED" | "FAILED" | "DENIED";
  startedAt: string;
  completedAt?: string | null;
  createdAt: string;
  error?: string | null;
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function shortTool(toolId: string) {
  return toolId.replace(/^jarvis\.owner\.?/, "").replace(/^owner-operations\./, "");
}

function Status({ status }: { status: Operation["status"] }) {
  const failed = status === "FAILED" || status === "DENIED";
  const active = status === "STARTED";
  return (
    <span className={failed ? "text-red-300/65" : active ? "text-white/45" : "text-amber-400/70"}>
      {status}
    </span>
  );
}

function Metadata({ operation }: { operation: Operation }) {
  return (
    <div className="grid grid-cols-2 gap-px border border-white/[0.05] bg-white/[0.04] sm:grid-cols-4">
      <Field label="Agent" value={operation.agent} />
      <Field label="Tool" value={shortTool(operation.toolId)} />
      <Field label="Scope" value={operation.scope} />
      <Field label="Permission" value={operation.permission} />
      <Field label="Mode" value={operation.mode} />
      <Field label="Approved" value={operation.approved ? "YES" : "NO"} />
      <Field label="Started" value={formatTime(operation.startedAt)} />
      <Field label="Completed" value={operation.completedAt ? formatTime(operation.completedAt) : "—"} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#030302] px-2.5 py-2">
      <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">{label}</div>
      <div className="mt-1 truncate font-mono text-[8px] text-amber-400/65">{value}</div>
    </div>
  );
}

export default function OperationHistory() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/jarvis/owner/operations?limit=25", {
        credentials: "include",
        cache: "no-store",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message || "History request failed.");
      setOperations(Array.isArray(body) ? body : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "History request failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <section className="mt-3 border border-white/[0.06] bg-black/40 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-amber-500/55">Audit</p>
          <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/75">Operational History</h2>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} aria-label="Refresh operation history"
          className="flex h-7 w-7 items-center justify-center border border-white/[0.06] text-white/30 hover:border-amber-400/20 hover:text-amber-400/60 disabled:opacity-30">
          <RefreshCw className={loading ? "h-3 w-3 animate-spin" : "h-3 w-3"} strokeWidth={1.5} />
        </button>
      </div>

      {error && <div className="border border-red-400/10 bg-red-400/[0.02] px-3 py-2 font-mono text-[8px] text-red-300/60">{error}</div>}
      {!loading && !error && operations.length === 0 && <div className="py-6 text-center font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">No owner operations recorded</div>}

      <div className="space-y-px bg-white/[0.035]">
        {operations.map((operation) => {
          const isOpen = expanded === operation.id;
          return (
            <div key={operation.id} className="bg-[#040403]">
              <button type="button" onClick={() => setExpanded(isOpen ? null : operation.id)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-white/[0.015]">
                <span className="w-16 shrink-0 font-mono text-[8px] text-white/25">{formatTime(operation.createdAt)}</span>
                <span className="min-w-0 flex-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/45">{operation.agent}</span>
                <span className="hidden max-w-[45%] truncate font-mono text-[8px] text-white/25 sm:block">{shortTool(operation.toolId)}</span>
                <Status status={operation.status} />
                <ChevronDown className={isOpen ? "h-3 w-3 rotate-180 text-amber-400/50" : "h-3 w-3 text-white/20"} strokeWidth={1.5} />
              </button>
              {isOpen && <div className="border-t border-white/[0.04] p-3"><Metadata operation={operation} />{operation.error && <p className="mt-2 font-mono text-[8px] text-red-300/55">{operation.error}</p>}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
