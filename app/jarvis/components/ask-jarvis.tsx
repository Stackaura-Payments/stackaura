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

function DiagnosticPanel({ result }: { result: unknown }) {
  if (!result || typeof result !== "object" || !("diagnosis" in result) || !("evidence" in result)) return null;
  const d = result as any;
  const diagnosis = d.diagnosis;
  const source = d.sourceAnalysis;
  const evidence = Array.isArray(d.evidence) ? d.evidence : [];
  const remediation = d.remediation;
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
