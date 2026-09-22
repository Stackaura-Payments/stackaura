import { Panel } from "./panel";

export default function PaymentNetworkPanel() {
  const gateways = [
    ["PAYSTACK", "ACTIVE", "92%"],
    ["YOCO", "ACTIVE", "84%"],
    ["OZOW", "ACTIVE", "76%"],
    ["PAYFAST", "READY", "61%"],
  ];

  return (
    <Panel eyebrow="02 / Payments" title="Payment Network" status="monitoring">
      <div className="space-y-3">
        {gateways.map(([name, state, width]) => (
          <div key={name}>
            <div className="mb-1 flex justify-between font-mono text-[8px] uppercase tracking-[0.12em]">
              <span className="text-white/40">{name}</span>
              <span className="text-amber-400/55">{state}</span>
            </div>

            <div className="h-px bg-white/[0.07]">
              <div
                className="h-px bg-amber-400/65 shadow-[0_0_6px_rgba(245,158,11,0.35)]"
                style={{ width }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 border border-white/[0.05]">
        <div className="p-2.5">
          <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
            Success
          </div>
          <div className="mt-1 font-mono text-sm text-amber-400/75">
            98.7%
          </div>
        </div>

        <div className="border-l border-white/[0.05] p-2.5">
          <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
            Recovery
          </div>
          <div className="mt-1 font-mono text-sm text-amber-400/75">
            14
          </div>
        </div>
      </div>
    </Panel>
  );
}
