import { Panel } from "./panel";
import DataRow from "./data-row";
import { StatusDot } from "./status-dot";

export default function RecoveryAgentsPanel() {
  return (
    <Panel eyebrow="Automation" title="Recovery & Agents" status="attention">
      <div className="space-y-1">
        <DataRow
          label="Recovery Engine"
          value="Active"
          tone="good"
        />
        <DataRow
          label="Automations"
          value="04 running"
        />
        <DataRow
          label="Recovered Payments"
          value="14"
          tone="good"
        />
        <DataRow
          label="Requires Review"
          value="02"
          tone="warning"
        />
      </div>

      <div className="mt-4 rounded-xl border border-amber-400/10 bg-amber-400/[0.035] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <StatusDot tone="amber" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
            Attention Queue
          </span>
        </div>

        <p className="mt-2 text-[11px] leading-5 text-slate-500">
          2 operational items are waiting for review.
        </p>
      </div>
    </Panel>
  );
}
