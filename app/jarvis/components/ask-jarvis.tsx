"use client";

import { FormEvent, useEffect, useState } from "react";
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

function StatusField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-[#030302] px-2.5 py-2">
      <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </div>
      <div className="mt-1 truncate font-mono text-[9px] text-amber-400/70">
        {value}
      </div>
    </div>
  );
}

type RepairStatus =
  | "PENDING_APPROVAL" | "APPROVED" | "BRANCHING" | "APPLYING_FIX"
  | "VERIFYING_CI" | "READY_TO_DEPLOY" | "DEPLOYING"
  | "VERIFYING_DEPLOYMENT" | "SUCCEEDED" | "FAILED"
  | "RECOVERY_REQUIRED" | "DENIED";

type Repair = {
  id: string;
  status: RepairStatus;
  branchName?: string | null;
  currentCommitSha?: string | null;
  progress?: { phase?: string; message?: string; updatedAt?: string } | null;
  error?: string | null;
  updatedAt?: string;
};

function repairStatusLabel(status: RepairStatus) {
  return status.replaceAll("_", " ");
}

function RepairLifecyclePanel() {
  const [repair, setRepair] = useState<Repair | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch("/api/jarvis/owner/engineering/repairs?limit=1", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        const latest = Array.isArray(data) ? data[0] : null;
        if (!cancelled) setRepair(latest && typeof latest.id === "string" ? latest : null);
      } catch {
        // The command interface should remain usable if lifecycle polling is unavailable.
      }
    };
    void load();
    const poll = window.setInterval(() => void load(), 2500);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, []);

  if (!repair || ["SUCCEEDED", "FAILED", "DENIED"].includes(repair.status)) {
    return null;
  }

  const message = repair.progress?.message
    ?? (repair.status === "APPROVED" ? "Owner approval received. Waiting for execution." : "Repair lifecycle is active.");

  return (
    <div className="mt-3 border border-amber-400/[0.12] bg-amber-400/[0.025] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-amber-400/65">
          Live Repair Lifecycle
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300">
          {repairStatusLabel(repair.status)}
        </span>
      </div>
      <div className="mt-3 grid gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-3">
        <StatusField label="Phase" value={String(repair.progress?.phase ?? repair.status)} />
        <StatusField label="Branch" value={String(repair.branchName ?? "—")} />
        <StatusField label="Commit" value={String(repair.currentCommitSha ?? "—")} />
      </div>
      <div className="mt-px border border-white/[0.05] bg-[#030302] p-3">
        <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">Current Operation</div>
        <p className="mt-1 font-mono text-[9px] leading-5 text-amber-300/70">{message}</p>
      </div>
      {repair.error && (
        <div className="mt-px border border-red-400/[0.08] bg-red-400/[0.025] p-3 font-mono text-[9px] text-red-300/65">
          {repair.error}
        </div>
      )}
    </div>
  );
}

function VercelDeploymentStatus({ result }: { result: unknown }) {
  if (!result || typeof result !== "object" || !("deployment" in result)) {
    return null;
  }

  const snapshot = result as {
    deployment?: {
      id?: unknown;
      projectId?: unknown;
      url?: unknown;
      state?: unknown;
      target?: unknown;
      createdAt?: unknown;
      commitSha?: unknown;
      commitMessage?: unknown;
      branch?: unknown;
    };
    provider?: unknown;
    mutationsEnabled?: unknown;
  };

  if (!snapshot.deployment || typeof snapshot.deployment !== "object") {
    return null;
  }

  const deployment = snapshot.deployment;

  return (
    <div className="mt-3">
      <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
        Vercel Deployment Status
      </div>
      <div className="grid grid-cols-2 gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-4">
        <StatusField label="Project ID" value={String(deployment.projectId ?? "—")} />
        <StatusField label="Deployment" value={String(deployment.id ?? "—")} />
        <StatusField label="State" value={String(deployment.state ?? "—")} />
        <StatusField label="Target" value={String(deployment.target ?? "—")} />
        <StatusField label="Branch" value={String(deployment.branch ?? "—")} />
        <StatusField label="Commit" value={String(deployment.commitSha ?? "—")} />
        <StatusField label="Provider" value={String(snapshot.provider ?? "—")} />
        <StatusField
          label="Mutations"
          value={snapshot.mutationsEnabled ? "ENABLED" : "DISABLED"}
        />
      </div>
      <div className="mt-px grid gap-px border-x border-b border-white/[0.05] bg-white/[0.05] sm:grid-cols-2">
        <StatusField label="Commit Message" value={String(deployment.commitMessage ?? "—")} />
        <StatusField label="Deployment URL" value={String(deployment.url ?? "—")} />
      </div>
    </div>
  );
}

type PaymentActionState = "idle" | "creating" | "created" | "error";

function PaymentDiagnosisPanel({ result }: { result: unknown }) {
  if (!result || typeof result !== "object" || !("diagnosis" in result) || !("proposedActions" in result) || !("totalFailures" in result)) {
    return null;
  }

  const diagnosis = result as {
    merchantId?: string;
    window?: { minutes?: number; since?: string };
    totalFailures?: number;
    diagnosis?: { confidence?: string; category?: string; summary?: string };
    dominantFailure?: { gateway?: string | null; signature?: string; count?: number; shareOfFailures?: number; firstSeenAt?: string | null; lastSeenAt?: string | null } | null;
    gatewayComparison?: Array<{ gateway?: string; failures?: number; attempts?: number; failureRate?: number }>;
    routingIntelligence?: { recommendedGateway?: string | null; rankedGateways?: string[]; explanation?: string; evidence?: string[] };
    evidence?: string[];
    recentFailures?: Array<{ reference?: string; gateway?: string | null; signature?: string; createdAt?: string }>;
    proposedActions?: Array<{ toolId?: string; intent?: string; riskLevel?: string; arguments?: { merchantId?: string; reference?: string }; reason?: string }>;
  };

  const [actionState, setActionState] = useState<PaymentActionState>("idle");
  const [actionId, setActionId] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [verification, setVerification] = useState<Record<string, unknown> | null>(null);
  const [recovery, setRecovery] = useState<Record<string, unknown> | null>(null);
  const [executing, setExecuting] = useState(false);

  const proposal = diagnosis.proposedActions?.find((action) => action.toolId === "jarvis.owner.payments.failover");

  useEffect(() => {
    if (!actionId) return;
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`/api/jarvis/owner/actions/${encodeURIComponent(actionId)}`, { cache: "no-store", credentials: "include" });
        if (!response.ok) return;
        const body = await response.json();
        const action = body?.action ?? body;
        if (!cancelled) {
          setActionStatus(typeof action?.status === "string" ? action.status : null);
          setApprovalStatus(typeof action?.approval?.status === "string" ? action.approval.status : typeof body?.approval?.status === "string" ? body.approval.status : null);
          setVerification(action?.verification && typeof action.verification === "object" ? action.verification : null);
          setRecovery(action?.recovery && typeof action.recovery === "object" ? action.recovery : null);
        }
      } catch {
        // Keep the diagnosis usable if lifecycle polling is temporarily unavailable.
      }
    };

    void load();
    const poll = window.setInterval(() => void load(), 2500);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [actionId]);

  async function requestFailoverApproval() {
    if (!proposal || actionState === "creating" || actionState === "created") return;
    setActionState("creating");
    setActionMessage(null);

    try {
      const actionIndex = diagnosis.proposedActions?.indexOf(proposal) ?? 0;
      const response = await fetch("/api/jarvis/owner/payments/actions/from-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ diagnosis: result, actionIndex }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message || `Failover approval request failed (${response.status}).`);

      const createdAction = body?.action ?? body;
      const createdActionId = createdAction?.id;
      setActionState("created");
      setActionId(typeof createdActionId === "string" ? createdActionId : null);
      setApprovalStatus(typeof body?.approval?.status === "string" ? body.approval.status : "PENDING");
      setActionStatus(typeof createdAction?.status === "string" ? createdAction.status : "PENDING_APPROVAL");
      setActionMessage(typeof createdActionId === "string" ? `Failover action ${createdActionId} is awaiting owner approval.` : "Failover action is awaiting owner approval.");
    } catch (error) {
      setActionState("error");
      setActionMessage(error instanceof Error ? error.message : "Failover approval request failed.");
    }
  }

  const confidence = diagnosis.diagnosis?.confidence ?? "unknown";
  const dominant = diagnosis.dominantFailure;
  const latestFailure = diagnosis.recentFailures?.[0];
  const terminalAction = actionStatus === "SUCCEEDED" || actionStatus === "FAILED" || actionStatus === "DENIED";

  async function requestRecoveryApproval() {
    if (!actionId || actionStatus !== 'RECOVERY_REQUIRED') return;
    setActionMessage(null);
    try {
      const response = await fetch(`/api/jarvis/owner/actions/${encodeURIComponent(actionId)}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: '{}',
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message || `Recovery approval request failed (${response.status}).`);
      setActionStatus(typeof body?.status === 'string' ? body.status : 'RECOVERY_REQUIRED');
      setRecovery(body?.recovery && typeof body.recovery === 'object' ? body.recovery : recovery);
      setActionMessage('Payment recovery is now governed by a fresh owner approval.');
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : 'Recovery approval request failed.');
    }
  }

  async function executeApprovedAction() {
    if (!actionId || actionStatus !== "APPROVED" || executing) return;
    setExecuting(true);
    setActionMessage(null);
    try {
      const response = await fetch(`/api/jarvis/owner/actions/${encodeURIComponent(actionId)}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message || `Execution failed (${response.status}).`);
      setActionStatus(typeof body?.status === "string" ? body.status : "VERIFYING");
      setVerification(body?.verification && typeof body.verification === "object" ? body.verification : null);
      setRecovery(body?.recovery && typeof body.recovery === "object" ? body.recovery : null);
      setActionMessage("Approved payment action submitted. JARVIS is verifying the gateway result.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Execution failed.");
    } finally {
      setExecuting(false);
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="border border-amber-400/[0.10] bg-amber-400/[0.025] p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-amber-400/65">Payment Diagnosis</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300/75">{confidence} confidence</span>
        </div>
        <div className="grid gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-4">
          <StatusField label="Failures" value={String(diagnosis.totalFailures ?? 0)} />
          <StatusField label="Window" value={`${String(diagnosis.window?.minutes ?? "—")} MIN`} />
          <StatusField label="Category" value={String(diagnosis.diagnosis?.category ?? "—")} />
          <StatusField label="Gateway" value={String(dominant?.gateway ?? "—")} />
        </div>
        <div className="mt-px border border-white/[0.05] bg-[#030302] p-3">
          <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">Assessment</div>
          <p className="mt-1 font-mono text-[9px] leading-5 text-white/65">{String(diagnosis.diagnosis?.summary ?? "—")}</p>
        </div>
      </div>

      {dominant && (
        <div className="border border-white/[0.07] bg-black/30 p-3">
          <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">Dominant Failure</div>
          <div className="grid gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-4">
            <StatusField label="Signature" value={String(dominant.signature ?? "—")} />
            <StatusField label="Occurrences" value={String(dominant.count ?? 0)} />
            <StatusField label="Share" value={`${String(dominant.shareOfFailures ?? 0)}%`} />
            <StatusField label="Gateway" value={String(dominant.gateway ?? "—")} />
          </div>
        </div>
      )}

      {Array.isArray(diagnosis.gatewayComparison) && diagnosis.gatewayComparison.length > 0 && (
        <div className="border border-white/[0.07] bg-black/30 p-3">
          <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">Gateway Comparison</div>
          <div className="space-y-1">
            {diagnosis.gatewayComparison.map((gateway) => (
              <div key={String(gateway.gateway)} className="grid grid-cols-4 gap-2 border-b border-white/[0.03] py-1.5 font-mono text-[8px]">
                <span className="text-white/55">{String(gateway.gateway ?? "—")}</span>
                <span className="text-white/35">{String(gateway.failures ?? 0)} failures</span>
                <span className="text-white/35">{String(gateway.attempts ?? 0)} attempts</span>
                <span className="text-amber-400/55">{String(gateway.failureRate ?? 0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {diagnosis.routingIntelligence && (
        <div className="border border-amber-400/[0.10] bg-amber-400/[0.025] p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-amber-400/65">Routing Memory</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300/75">
              NEXT: {String(diagnosis.routingIntelligence.recommendedGateway ?? "CONFIGURED PRIORITY")}
            </span>
          </div>
          <p className="font-mono text-[9px] leading-5 text-white/60">{String(diagnosis.routingIntelligence.explanation ?? "Historical gateway performance was considered.")}</p>
          {Array.isArray(diagnosis.routingIntelligence.rankedGateways) && diagnosis.routingIntelligence.rankedGateways.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {diagnosis.routingIntelligence.rankedGateways.map((gateway) => (
                <span key={String(gateway)} className="border border-white/[0.07] px-2 py-1 font-mono text-[7px] uppercase tracking-[0.12em] text-white/40">
                  {String(gateway)}
                </span>
              ))}
            </div>
          )}
          {Array.isArray(diagnosis.routingIntelligence.evidence) && diagnosis.routingIntelligence.evidence.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-white/[0.04] pt-3">
              {diagnosis.routingIntelligence.evidence.slice(0, 3).map((fact, index) => (
                <div key={String(fact) + "-" + index} className="border-l border-amber-400/15 pl-2 font-mono text-[8px] leading-4 text-white/40">{String(fact)}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="border border-white/[0.07] bg-black/30 p-3">
        <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">Evidence</div>
        <div className="space-y-2">
          {(diagnosis.evidence ?? []).map((fact, index) => (
            <div key={`${fact}-${index}`} className="border-l border-amber-400/15 pl-2 font-mono text-[9px] leading-4 text-white/50">{fact}</div>
          ))}
        </div>
      </div>

      {proposal && (
        <div className="border border-amber-400/[0.10] bg-black/40 p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-amber-400/55">Proposed Action</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300">{String(proposal.riskLevel ?? "HIGH")} RISK</span>
          </div>
          <div className="grid gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-2">
            <StatusField label="Operation" value="Gateway Failover" />
            <StatusField label="Payment" value={String(proposal.arguments?.reference ?? latestFailure?.reference ?? "—")} />
            <StatusField label="Gateway" value={String(latestFailure?.gateway ?? dominant?.gateway ?? "—")} />
            <StatusField label="Tool" value={String(proposal.toolId ?? "—")} />
          </div>
          <p className="mt-3 font-mono text-[9px] leading-5 text-white/50">{String(proposal.reason ?? "A governed gateway failover has been proposed.")}</p>

          {actionState !== "created" && (
            <button type="button" onClick={requestFailoverApproval} disabled={actionState === "creating"} className="mt-4 border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-400/[0.09] disabled:cursor-not-allowed disabled:opacity-50">
              {actionState === "creating" ? "REQUESTING APPROVAL…" : "REQUEST FAILOVER APPROVAL"}
            </button>
          )}

          {actionMessage && <div className={`mt-3 border-t border-white/[0.04] pt-3 font-mono text-[8px] ${actionState === "error" ? "text-red-300/70" : "text-white/45"}`}>{actionMessage}</div>}

          {actionId && (
            <div className="mt-3 grid gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-3">
              <StatusField label="Action ID" value={actionId} />
              <StatusField label="Action Status" value={String(actionStatus ?? "—")} />
              <StatusField label="Approval" value={String(approvalStatus ?? "—")} />
            </div>
          )}

          {actionId && actionStatus === "APPROVED" && (
            <button
              type="button"
              onClick={executeApprovedAction}
              disabled={executing}
              className="mt-4 border border-amber-400/30 bg-amber-400/10 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {executing ? "EXECUTING…" : "EXECUTE APPROVED ACTION"}
            </button>
          )}

          {actionId && actionStatus === "APPROVED" && (
            <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-amber-400/50">
              Owner approval received. Payment mutation is ready for execution.
            </div>
          )}

          {actionStatus === "EXECUTING" || actionStatus === "VERIFYING" ? (
            <div className="mt-3 border-t border-white/[0.04] pt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300/65">
              {actionStatus === "EXECUTING" ? "Gateway failover executing…" : "Gateway operation complete. Independently verifying payment state…"}
            </div>
          ) : null}

          {actionStatus === "SUCCEEDED" && verification && (
            <div className="mt-3 border border-amber-400/15 bg-amber-400/[0.025] p-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-amber-300">✓ Payment Verification</div>
              <div className="mt-3 grid gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-3">
                <StatusField label="Verified" value={String(verification.verified ?? false).toUpperCase()} />
                <StatusField label="Payment State" value={String(verification.status ?? "—")} />
                <StatusField label="Gateway" value={String(verification.gateway ?? "—")} />
              </div>
              <div className="mt-2 font-mono text-[8px] text-white/35">
                {String(verification.mode ?? "payment-state-and-gateway-attempt")} · {String(verification.checkedAt ?? "—")}
              </div>
            </div>
          )}

          {actionStatus === "RECOVERY_REQUIRED" && recovery && (
            <div className="mt-3 border border-red-400/15 bg-red-950/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-red-300/75">Recovery Required</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300/70">{String(recovery.recoveryApprovalStatus ?? 'NOT REQUESTED')}</div>
              </div>
              <p className="mt-2 font-mono text-[9px] leading-4 text-red-200/55">{String(recovery.reason ?? "Payment action requires governed recovery.")}</p>
              {Boolean(recovery.plan) && typeof recovery.plan === 'object' && (
                <div className="mt-3 border-t border-white/[0.04] pt-3">
                  <div className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">Recovery Action</div>
                  <p className="mt-1 font-mono text-[9px] leading-4 text-white/50">{String((recovery.plan as Record<string, unknown>).reason ?? 'Retry payment failover through the next eligible gateway.')}</p>
                </div>
              )}
              {!recovery.recoveryApprovalId && (
                <button type="button" onClick={requestRecoveryApproval} className="mt-4 border border-amber-400/25 bg-amber-400/[0.06] px-4 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-400/[0.10]">
                  REQUEST RECOVERY APPROVAL
                </button>
              )}
              {recovery.recoveryApprovalStatus === 'PENDING' && (
                <div className="mt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300/65">Recovery approval pending — approve it in Governance / Live.</div>
              )}
              {recovery.recoveryApprovalStatus === 'APPROVED' && (
                <button type="button" onClick={requestRecoveryApproval} className="mt-4 border border-amber-400/30 bg-amber-400/10 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-400/15">
                  RESUME APPROVED RECOVERY
                </button>
              )}
            </div>
          )}

          {actionId && !terminalAction && actionStatus !== "APPROVED" && (
            <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-amber-400/50">
              Governance lifecycle active — execution remains owner-approved.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DiagnosticPanel({ result }: { result: unknown }) {
  if (!result || typeof result !== "object" || !("diagnosis" in result) || !("evidence" in result) || !("sourceAnalysis" in result)) return null;
  const d = result as any;
  const diagnosis = d.diagnosis;
  const source = d.sourceAnalysis;
  const evidence = Array.isArray(d.evidence) ? d.evidence : [];
  const remediation = d.remediation;
  const [repairState, setRepairState] = useState<"idle" | "creating" | "created" | "error">("idle");
  const [repairMessage, setRepairMessage] = useState<string | null>(null);
  const canCreateRepair = diagnosis?.confidence === "high"
    && Array.isArray(remediation?.actions)
    && remediation.actions.some((action: any) => action.toolId === "jarvis.owner.github.update-file")
    && Boolean(source?.repository)
    && Boolean(d?.deployment?.commitSha);

  async function createRepair() {
    if (!canCreateRepair || repairState === "creating") return;
    setRepairState("creating");
    setRepairMessage(null);
    try {
      const res = await fetch("/api/jarvis/owner/engineering/repairs/from-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ diagnosis: d }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || `Repair proposal failed (${res.status}).`);
      setRepairState("created");
      setRepairMessage(`Repair ${String(body?.repairId ?? "created")} is awaiting owner approval.`);
    } catch (error) {
      setRepairState("error");
      setRepairMessage(error instanceof Error ? error.message : "Repair proposal failed.");
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="border border-amber-400/[0.10] bg-amber-400/[0.025] p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-amber-400/65">Engineering Diagnosis</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300/75">{String(diagnosis?.confidence ?? "unknown")} confidence</span>
        </div>
        <div className="grid gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-2">
          <StatusField label="Category" value={String(diagnosis?.category ?? "—")} />
          <StatusField label="Baseline" value={String(source?.previousKnownGoodCommit ?? "—")} />
        </div>
        <div className="mt-px border border-white/[0.05] bg-[#030302] p-3">
          <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">Likely Cause</div>
          <p className="mt-1 font-mono text-[9px] leading-5 text-white/65">{String(diagnosis?.rootCause ?? "—")}</p>
        </div>
      </div>

      <div className="border border-white/[0.07] bg-black/30 p-3">
        <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">Source Correlation</div>
        <div className="space-y-2 font-mono text-[9px]">
          <div><span className="text-white/25">REPOSITORY </span><span className="text-white/60">{String(source?.repository ?? "—")}</span></div>
          <div><span className="text-white/25">CHANGED </span><span className="text-amber-400/65">{Array.isArray(source?.changedFiles) && source.changedFiles.length ? source.changedFiles.join(", ") : "—"}</span></div>
          <div><span className="text-white/25">RELEVANT </span><span className="text-white/55">{Array.isArray(source?.relevantFiles) && source.relevantFiles.length ? source.relevantFiles.join(", ") : "—"}</span></div>
        </div>
        {Array.isArray(source?.fileComparisons) && source.fileComparisons.length > 0 && (
          <div className="mt-3 space-y-1 border-t border-white/[0.04] pt-3">
            {source.fileComparisons.map((file: any) => <div key={String(file.path)} className="flex gap-2 font-mono text-[8px]"><span className={file.changed ? "text-amber-400/65" : "text-white/25"}>{file.changed ? "CHANGED" : "UNCHANGED"}</span><span className="text-white/50">{String(file.path)}</span><span className="text-white/20">{String(file.changeSummary ?? "")}</span></div>)}
          </div>
        )}
      </div>

      <div className="border border-white/[0.07] bg-black/30 p-3">
        <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">Evidence Chain</div>
        <div className="space-y-2">{evidence.map((item: any, index: number) => <div key={`${String(item.source)}-${index}`} className="border-l border-amber-400/15 pl-2"><div className="font-mono text-[8px] text-amber-400/55">{String(item.source)} · {String(item.confidence)}</div><div className="mt-0.5 font-mono text-[9px] leading-4 text-white/50">{String(item.fact)}</div></div>)}</div>
      </div>

      <div className="border border-amber-400/[0.10] bg-black/40 p-3">
        <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-400/55">Exact Fix</div>
        <p className="font-mono text-[9px] leading-5 text-white/65">{String(remediation?.exactFix ?? "—")}</p>
        {Array.isArray(remediation?.actions) && remediation.actions.length > 0 && <div className="mt-3 space-y-1 border-t border-white/[0.04] pt-3">{remediation.actions.map((action: any, index: number) => <div key={`${String(action.toolId)}-${index}`} className="flex flex-wrap items-center gap-2 font-mono text-[8px]"><span className="text-amber-400/65">{String(action.toolId)}</span><span className="text-white/35">{String(action.intent)}</span>{action.requiresApproval && <span className="text-amber-300">OWNER APPROVAL REQUIRED</span>}</div>)}</div>}
        {canCreateRepair && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-amber-400/[0.08] pt-3">
            <button type="button" onClick={createRepair} disabled={repairState === "creating" || repairState === "created"} className="border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-400/[0.09] disabled:cursor-not-allowed disabled:opacity-50">
              {repairState === "creating" ? "CREATING REPAIR…" : repairState === "created" ? "REPAIR PROPOSED" : "CREATE REPAIR"}
            </button>
            {repairMessage && <span className={`font-mono text-[8px] ${repairState === "error" ? "text-red-300/70" : "text-white/45"}`}>{repairMessage}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function RepositoryStatus({ result }: { result: unknown }) {
  if (!result || typeof result !== "object" || !("repository" in result)) {
    return null;
  }

  const snapshot = result as {
    repository?: {
      fullName?: unknown;
      visibility?: unknown;
      defaultBranch?: unknown;
      archived?: unknown;
      id?: unknown;
      sizeKb?: unknown;
    };
    provider?: unknown;
    mutationsEnabled?: unknown;
  };

  if (!snapshot.repository || typeof snapshot.repository !== "object") {
    return null;
  }

  const repository = snapshot.repository;

  return (
    <div className="mt-3">
      <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
        Repository Status
      </div>
      <div className="grid grid-cols-2 gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-4">
        <StatusField label="Repository" value={String(repository.fullName ?? "—")} />
        <StatusField label="Visibility" value={String(repository.visibility ?? "—")} />
        <StatusField label="Default Branch" value={String(repository.defaultBranch ?? "—")} />
        <StatusField label="Archived" value={repository.archived ? "YES" : "NO"} />
        <StatusField label="Repository ID" value={String(repository.id ?? "—")} />
        <StatusField label="Size" value={String(repository.sizeKb ?? "—") + " KB"} />
        <StatusField label="Provider" value={String(snapshot.provider ?? "—")} />
        <StatusField
          label="Mutations"
          value={snapshot.mutationsEnabled ? "ENABLED" : "DISABLED"}
        />
      </div>
    </div>
  );
}

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

      <RepairLifecyclePanel />

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

              {item.succeeded && (
                <>
                  <VercelDeploymentStatus result={item.result} />
                  <PaymentDiagnosisPanel result={item.result} />
                  <DiagnosticPanel result={item.result} />
                  <RepositoryStatus result={item.result} />
                </>
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
