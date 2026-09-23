"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ActionStatus =
  | "PENDING_APPROVAL" | "APPROVED" | "EXECUTING" | "VERIFYING"
  | "SUCCEEDED" | "FAILED" | "RECOVERY_REQUIRED" | "RECOVERING"
  | "RECOVERED" | "DENIED" | "CANCELLED" | "EXPIRED";

type Action = {
  id: string;
  toolId: string;
  intent: string;
  arguments: unknown;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: ActionStatus;
  createdAt: string;
  approvedAt?: string | null;
  completedAt?: string | null;
  approval?: { id: string; expiresAt: string; status: string } | null;
  verification?: unknown;
  recovery?: unknown;
};

const ACTIVE: ActionStatus[] = ["APPROVED", "EXECUTING", "VERIFYING"];

function labelTool(toolId: string) {
  return toolId.replace(/^jarvis\.owner\./, "").replaceAll(".", " / ").toUpperCase();
}

function prettyJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2);
}

function ageText(iso?: string | null) {
  if (!iso) return "—";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "EXPIRED";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export default function ApprovalsPanel() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/jarvis/owner/actions?limit=25", { cache: "no-store" });
      if (!response.ok) throw new Error(`JARVIS API returned ${response.status}`);
      const data = await response.json();
      setActions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load JARVIS actions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const poll = window.setInterval(() => void load(), 2500);
    const clock = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => { window.clearInterval(poll); window.clearInterval(clock); };
  }, [load]);

  const pending = useMemo(() => actions.filter((action) => action.status === "PENDING_APPROVAL"), [actions]);

  async function transition(id: string, operation: "approve" | "deny" | "execute" | "resume" | "approve-recovery") {
    setBusy(`${id}:${operation}`);
    setError(null);
    try {
      const action = actions.find((item) => item.id === id);
      const recoveryApprovalId = operation === "approve-recovery" ? getRecoveryApprovalId(action?.recovery) : null;
      const endpoint = operation === "approve-recovery" && recoveryApprovalId
        ? `/api/jarvis/owner/approvals/${recoveryApprovalId}/approve`
        : `/api/jarvis/owner/actions/${id}/${operation}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: operation === "execute" ? undefined : "{}",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message || `Action ${operation} failed (${response.status})`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Action ${operation} failed.`);
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mt-3 border border-amber-400/[0.09] bg-black/45 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-amber-500/55">Governance / Live</p>
          <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/85">Authorization Queue</h2>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
          Pending <span className="text-amber-400">{String(pending.length).padStart(2, "0")}</span>
        </div>
      </div>

      {error && <div className="mb-3 border border-red-400/20 bg-red-950/20 px-3 py-2 font-mono text-[9px] text-red-300/80">{error}</div>}

      {loading ? (
        <QueueMessage text="Synchronizing owner action queue…" />
      ) : actions.length === 0 ? (
        <QueueMessage text="Authorization Queue Clear" detail="No owner actions are currently recorded." />
      ) : (
        <div className="space-y-3">
          {actions.map((action) => <ActionCard key={action.id} action={action} busy={busy} onTransition={transition} />)}
        </div>
      )}
    </section>
  );
}

function QueueMessage({ text, detail }: { text: string; detail?: string }) {
  return <div className="flex min-h-[110px] items-center justify-center border border-dashed border-white/[0.07] bg-black/30 text-center">
    <div><div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">{text}</div>{detail && <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/15">{detail}</div>}</div>
  </div>;
}

function getRecoveryApprovalId(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const id = (value as Record<string, unknown>).recoveryApprovalId;
  return typeof id === "string" && id ? id : null;
}

function getRecoveryApprovalStatus(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const status = (value as Record<string, unknown>).recoveryApprovalStatus;
  return typeof status === "string" ? status : null;
}

function ActionCard({ action, busy, onTransition }: { action: Action; busy: string | null; onTransition: (id: string, op: "approve" | "deny" | "execute" | "resume" | "approve-recovery") => void }) {
  const approvalBusy = busy?.startsWith(`${action.id}:`) ?? false;
  const live = ACTIVE.includes(action.status);
  const riskClass = action.riskLevel === "CRITICAL" || action.riskLevel === "HIGH" ? "text-red-300 border-red-400/20 bg-red-950/20" : "text-amber-300 border-amber-400/15 bg-amber-950/10";
  return <article className="border border-white/[0.07] bg-[#050504] p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em]">
          <span className={`border px-2 py-1 ${riskClass}`}>{action.riskLevel} RISK</span>
          <span className="border border-white/[0.07] px-2 py-1 text-white/45">{action.status.replaceAll("_", " ")}</span>
          {live && <span className="flex items-center gap-1.5 text-amber-400"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" /> LIVE</span>}
        </div>
        <h3 className="mt-3 break-all font-mono text-[11px] uppercase tracking-[0.12em] text-white/85">{labelTool(action.toolId)}</h3>
        <p className="mt-1 text-xs leading-5 text-white/55">{action.intent}</p>
      </div>
      {action.approval?.expiresAt && action.status === "PENDING_APPROVAL" && <div className="text-right font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">Expires<br /><span className="text-amber-400/70">{ageText(action.approval.expiresAt)}</span></div>}
    </div>

    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div className="min-w-0">
        <div className="mb-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">Exact Arguments</div>
        <pre className="max-h-56 overflow-auto border border-white/[0.05] bg-black/60 p-3 font-mono text-[9px] leading-4 text-amber-100/60">{prettyJson(action.arguments)}</pre>
      </div>
      <div className="space-y-2 font-mono text-[9px]">
        <Meta label="ACTION ID" value={action.id} />
        <Meta label="CREATED" value={new Date(action.createdAt).toLocaleString()} />
        <Meta label="APPROVAL" value={action.approval?.status ?? "—"} />
      </div>
    </div>

    <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-white/[0.05] pt-3">
      {action.status === "PENDING_APPROVAL" && <>
        <button disabled={approvalBusy} onClick={() => onTransition(action.id, "deny")} className="border border-white/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 transition hover:border-red-400/30 hover:text-red-300 disabled:opacity-40">{busy === `${action.id}:deny` ? "DENYING…" : "DENY"}</button>
        <button disabled={approvalBusy} onClick={() => onTransition(action.id, "approve")} className="border border-amber-400/30 bg-amber-400/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-400/15 disabled:opacity-40">{busy === `${action.id}:approve` ? "APPROVING…" : "APPROVE"}</button>
      </>}
      {action.status === "APPROVED" && <button disabled={approvalBusy} onClick={() => onTransition(action.id, "execute")} className="border border-amber-400/30 bg-amber-400/10 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-400/15 disabled:opacity-40">{busy === `${action.id}:execute` ? "EXECUTING…" : "EXECUTE APPROVED ACTION"}</button>}
      {live && <span className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-400/65">Provider lifecycle in progress…</span>}
      {action.status === "SUCCEEDED" && <span className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300">✓ Verified / SUCCEEDED</span>}
      {action.status === "RECOVERY_REQUIRED" && getRecoveryApprovalStatus(action.recovery) === "PENDING" && <button disabled={approvalBusy} onClick={() => onTransition(action.id, "approve-recovery")} className="border border-amber-400/30 bg-amber-400/10 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-400/15 disabled:opacity-40">{busy === `${action.id}:approve-recovery` ? "APPROVING RECOVERY…" : "APPROVE RECOVERY"}</button>}
      {action.status === "RECOVERY_REQUIRED" && getRecoveryApprovalStatus(action.recovery) === "APPROVED" && <button disabled={approvalBusy} onClick={() => onTransition(action.id, "resume")} className="border border-amber-400/30 bg-amber-400/10 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-400/15 disabled:opacity-40">{busy === `${action.id}:resume` ? "RESUMING…" : "RESUME APPROVED RECOVERY"}</button>}
      {action.status === "RECOVERY_REQUIRED" && getRecoveryApprovalStatus(action.recovery) === "RECOVERY_APPROVAL_REQUIRED" && <button disabled={approvalBusy} onClick={() => onTransition(action.id, "resume")} className="border border-amber-400/30 bg-amber-400/10 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-400/15 disabled:opacity-40">{busy === `${action.id}:resume` ? "REQUESTING…" : "REQUEST RECOVERY APPROVAL"}</button>}
    </div>
  </article>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-white/[0.04] pb-2"><div className="text-white/20">{label}</div><div className="mt-1 break-all text-white/50">{value}</div></div>;
}
