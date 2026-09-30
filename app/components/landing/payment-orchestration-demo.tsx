"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";

type PaymentType = "card" | "eft";

const examples = {
  card: {
    id: "ORDER-1042",
    amount: "R 1,250.00",
    primary: "Paystack",
    primaryLogo: "/providers/paystack.svg",
    fallback: "Yoco",
    fallbackLogo: "/providers/yoco.svg",
    message: "Paystack timed out. A card payment can move to Yoco when fallback is configured.",
  },
  eft: {
    id: "ORDER-1043",
    amount: "R 780.00",
    primary: "Ozow",
    primaryLogo: "/providers/ozow.png",
    fallback: "Configured route",
    fallbackLogo: null,
    message: "Ozow timed out. Another route can be selected when an eligible provider is configured.",
  },
} as const;

export default function PaymentOrchestrationDemo() {
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const [timedOut, setTimedOut] = useState(false);
  const example = examples[paymentType];
  const provider = timedOut ? example.fallback : example.primary;
  const logo = timedOut ? example.fallbackLogo : example.primaryLogo;

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-md border border-[#d4e4dc] bg-[#f6f8f6] text-[#0d1b20] shadow-[0_28px_76px_rgba(0,0,0,.26)]" aria-label="Interactive illustrative example of Stackaura payment routing">
        <div className="flex min-h-10 items-center justify-between gap-2 border-b border-[#e1e7e3] bg-white px-3 sm:min-h-12 sm:px-5">
          <div className="flex min-w-0 items-center gap-2 whitespace-nowrap text-[9px] font-bold sm:text-xs"><span className="text-sm text-[#217a64]" aria-hidden="true">◆</span> stackaura <span className="h-4 border-l border-[#cbd9d1]" aria-hidden="true" /> Routing view</div>
          <span className="shrink-0 rounded-sm border border-[#d9e4dd] px-1.5 py-1 text-[7px] font-bold tracking-[0.08em] text-[#557168] sm:text-[9px]">ILLUSTRATIVE DEMO</span>
        </div>
        <div className="p-3 sm:p-5">
          <div className="flex items-end justify-between gap-2"><div><span className="text-[9px] font-bold tracking-[0.12em] text-[#668077]">TRANSACTION PREVIEW</span><h2 className="mt-1 hidden text-base font-bold sm:block">See the route behind the payment.</h2></div><span className="shrink-0 font-mono text-[9px] text-[#789087] sm:text-[10px]">{example.id}</span></div>
          <div className="mt-2 flex gap-4 border-b border-[#dce5df] sm:mt-4" role="group" aria-label="Choose example payment type">
            {(["card", "eft"] as const).map((type) => <button key={type} type="button" aria-pressed={paymentType === type} onClick={() => { setPaymentType(type); setTimedOut(false); }} className={`border-b-2 pb-2 text-[10px] font-bold transition sm:text-xs ${paymentType === type ? "border-[#217a64] text-[#217a64]" : "border-transparent text-[#697f76] hover:text-[#0d1b20]"}`}>{type === "card" ? "Card payment" : "Instant EFT"}</button>)}
          </div>
          <div className="mt-3 flex items-end justify-between gap-2 sm:mt-5"><div><span className="text-[9px] font-bold tracking-[0.12em] text-[#668077]">PAYMENT AMOUNT</span><strong className="mt-1 block text-lg font-bold sm:text-2xl">{example.amount}</strong></div><div className="text-right"><span className="text-[9px] font-bold tracking-[0.12em] text-[#668077]">STATUS</span><span className={`mt-1 flex items-center gap-1 rounded-sm border px-1.5 py-1 text-[8px] font-bold sm:text-[10px] ${timedOut ? "border-[#eac9a9] bg-[#fff1e4] text-[#995b2b]" : "border-[#c8ded2] bg-[#e7f4eb] text-[#27835d]"}`}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{timedOut ? "Fallback selected" : "Ready to route"}</span></div></div>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] items-center gap-1 sm:mt-5 sm:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)] sm:gap-2" aria-label="Example route">
            <div className="flex h-[62px] min-w-0 items-center gap-2 rounded border border-[#d8e4dc] bg-white p-2 sm:h-[74px] sm:p-3"><span className="hidden size-7 shrink-0 place-items-center rounded bg-[#0d1b20] text-[9px] font-bold text-[#c5f273] min-[380px]:grid sm:size-8" aria-hidden="true">SA</span><div className="min-w-0"><span className="block truncate text-[7px] font-bold tracking-[0.08em] text-[#81958d] sm:text-[9px]">YOUR CHECKOUT</span><strong className="mt-1 block truncate text-[10px] sm:text-xs">One request</strong></div></div>
            <ArrowRight className="size-4 text-[#217a64] sm:size-5" aria-hidden="true" />
            <div className="flex h-[62px] min-w-0 items-center gap-2 rounded border border-[#d8e4dc] bg-white p-2 sm:h-[74px] sm:p-3"><span className="hidden size-7 shrink-0 place-items-center rounded bg-[#eff6f2] min-[380px]:grid sm:size-8" aria-hidden="true">{logo ? <Image src={logo} alt="" width={24} height={24} className="max-h-6 max-w-6 object-contain" /> : <ArrowUpRight className="size-4 text-[#217a64]" />}</span><div className="min-w-0"><span className="block truncate text-[7px] font-bold tracking-[0.08em] text-[#81958d] sm:text-[9px]">{timedOut ? "RECOVERY PATH" : "PRIMARY ROUTE"}</span><strong className="mt-1 block truncate text-[10px] sm:text-xs">{provider}</strong></div></div>
          </div>
          <div role="status" aria-live="polite" className={`mt-3 flex min-h-9 items-center gap-2 border-l-2 px-2 py-1.5 text-[9px] leading-4 sm:mt-4 sm:text-xs ${timedOut ? "border-[#d99259] bg-[#fff2e5] text-[#785139]" : "border-[#217a64] bg-[#eaf2ed] text-[#43665a]"}`}><span className={`grid size-4 shrink-0 place-items-center rounded-full text-white ${timedOut ? "bg-[#d99259]" : "bg-[#5ca784]"}`} aria-hidden="true">{timedOut ? <ArrowUpRight className="size-3" /> : <Check className="size-3" />}</span><span>{timedOut ? example.message : "Routing is ready. Try a provider timeout to see fallback."}</span></div>
          <div className="mt-2 flex items-center gap-4"><button type="button" onClick={() => setTimedOut(true)} disabled={timedOut} className="inline-flex items-center gap-1 text-[10px] font-bold text-[#186e5a] underline underline-offset-4 hover:text-[#0a4237] disabled:cursor-default disabled:opacity-50 sm:text-xs">Simulate provider timeout <ArrowUpRight className="size-3" aria-hidden="true" /></button>{timedOut ? <button type="button" onClick={() => setTimedOut(false)} className="inline-flex items-center gap-1 text-[10px] font-bold text-[#186e5a] underline underline-offset-4 sm:text-xs"><RotateCcw className="size-3" aria-hidden="true" />Reset</button> : null}</div>
        </div>
      </div>
      <p className="mt-2 hidden text-right text-xs text-[#91afa3] sm:block">Explore a sample payment journey</p>
    </div>
  );
}
