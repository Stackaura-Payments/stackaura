import { Panel } from "./panel";

export default function SystemStatusPanel() {
  const systems = [
    ["CORE ENGINE", "OPERATIONAL"],
    ["API LAYER", "CONNECTED"],
    ["DATABASE", "HEALTHY"],
    ["WEBHOOKS", "MONITORING"],
  ];

  return (
    <Panel eyebrow="01 / System" title="System Status" status="online">
      <div className="space-y-1">
        {systems.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-white/[0.035] py-2 last:border-0"
          >
            <span className="font-mono text-[9px] tracking-[0.12em] text-white/35">
              {label}
            </span>
            <span className="font-mono text-[9px] text-amber-400/65">
              {value}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
