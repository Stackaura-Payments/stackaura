import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ContactSalesLink from "../contact-sales-link";
import PaymentOrchestrationDemo from "./payment-orchestration-demo";

const rails = [
  { name: "Paystack", src: "/providers/paystack.svg", width: 28, height: 28 },
  { name: "Ozow", src: "/providers/ozow.png", width: 28, height: 28 },
  { name: "Yoco", src: "/providers/yoco.svg", width: 32, height: 28 },
] as const;

export function LandingHero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#0d1b20] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(121,159,151,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(121,159,151,.16)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(90deg,transparent_38%,black_100%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-5 px-4 pb-2 pt-4 sm:gap-8 sm:px-6 sm:pb-10 sm:pt-10 md:grid-cols-2 md:gap-6 md:py-10 lg:min-h-[605px] lg:grid-cols-[1.06fr_.94fr] lg:gap-12 lg:px-8 lg:py-14">
        <div className="min-w-0">
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#c5f273] sm:text-xs">
            <span className="h-0.5 w-6 shrink-0 bg-current" aria-hidden="true" /> Payment infrastructure · Africa
          </p>
          <h1 className="mt-3 max-w-[620px] font-semibold leading-[1.1] text-[32px] min-[380px]:text-[36px] sm:text-[50px] md:text-[38px] lg:mt-6 lg:text-[58px] xl:text-[64px]">
            One integration.<br /><span className="text-[#c5f273]">Every payment rail.</span>
          </h1>
          <p className="mt-3 max-w-[55ch] text-[13px] leading-[21px] text-[#c9d5d2] sm:mt-6 sm:text-lg sm:leading-8 md:text-sm md:leading-7 lg:text-lg lg:leading-8">
            Connect your checkout to multiple payment rails. Stackaura helps route transactions, recover from provider interruptions, and keep operations in view.
          </p>
          <div className="mt-4 flex flex-nowrap items-center gap-2 sm:mt-8 sm:flex-wrap sm:gap-6 md:gap-3">
            <Link href="/signup" className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[5px] bg-[#c5f273] px-4 py-2 text-xs font-bold text-[#0d1b20] transition hover:bg-[#dcfaa2] sm:min-h-12 sm:px-5 sm:text-sm">
              <span className="sm:hidden">Get started</span><span className="hidden sm:inline">Start integrating</span> <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/docs" className="inline-flex items-center gap-2 border-b border-[#dce9e2] pb-1 text-xs font-semibold text-[#dce9e2] transition hover:gap-3 sm:text-sm">
              <span className="sm:hidden">Docs</span><span className="hidden sm:inline">View documentation</span> <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 hidden items-center gap-2 text-xs text-[#9fb5ad] sm:flex lg:mt-12"><span className="size-2 rounded-full bg-[#c5f273]" aria-hidden="true" />One layer for routing, fallback, and payment visibility</p>
        </div>
        <PaymentOrchestrationDemo />
      </div>
    </section>
  );
}

export function TrustStrip() {
  return (
    <section className="border-b border-[#d9e4dc] bg-[#e9efe9] text-[#0d1b20]" aria-label="Example payment rails">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 py-5 sm:px-6 md:min-h-[105px] md:flex-row md:items-center md:justify-between md:gap-8 lg:px-8">
        <div className="shrink-0"><p className="text-sm font-bold">Built for a multi-rail world</p><p className="mt-1 text-xs text-[#59706c]">Illustrative routing view · availability depends on your configuration</p></div>
        <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-9">
          {rails.map((rail) => <div key={rail.name} className="flex items-center gap-2"><Image src={rail.src} alt="" width={rail.width} height={rail.height} className="size-6 object-contain sm:size-7" /><span className="text-xs font-bold sm:text-base">{rail.name}</span></div>)}
        </div>
        <Link href="/integrations" className="inline-flex items-center gap-1 self-start border-b border-[#217a64] pb-1 text-xs font-bold text-[#217a64] transition hover:gap-2 md:self-auto">Explore integrations <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}

const outcomes = [
  ["Protect the checkout moment", "Keep alternative routes ready when a provider slows down or becomes unavailable."],
  ["Reduce integration overhead", "Bring multiple payment paths behind one integration instead of maintaining each one separately."],
  ["See what happened", "Connect routing and payment activity to a shared view for support, product, and finance teams."],
] as const;

export function MerchantOutcomes() {
  return (
    <section id="outcomes" className="bg-[#e7f2ec] py-16 text-[#0d1b20] sm:py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-[#217a64]"><span className="h-0.5 w-6 bg-current" aria-hidden="true" />For merchants</p>
        <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight sm:text-[42px]">Better payment operations.<br /><span className="text-[#217a64]">Better room to grow.</span></h2>
        <p className="mt-5 max-w-[60ch] text-sm leading-7 text-[#506e60] sm:text-base">Give your team more control over how payments move, without adding another layer of work to every transaction.</p>
        <div className="mt-10 grid gap-8 sm:mt-16 md:grid-cols-3">
          {outcomes.map(([title, body], index) => <article key={title} className="border-t border-[#9fc2aa] pt-5"><span className="text-xs font-bold text-[#217a64]">0{index + 1} /</span><h3 className="mt-5 max-w-[14ch] text-xl font-semibold leading-snug sm:mt-8 sm:text-2xl">{title}</h3><p className="mt-3 max-w-[35ch] text-sm leading-7 text-[#506e60]">{body}</p></article>)}
        </div>
      </div>
    </section>
  );
}

const questions = [
  ["Does Stackaura replace my payment providers?", "No. Stackaura is an orchestration layer that works with connected payment providers. Those providers process and settle payments."],
  ["Can we start with our current gateway?", "Talk to the team about your current setup and the providers available for your integration. The right route depends on your payment flow."],
  ["How does fallback work?", "When a selected payment path cannot complete a transaction, configured fallback can select another available connected provider."],
] as const;

export function LandingFaq() {
  return (
    <section className="bg-[#f9fbf8] pb-16 text-[#0d1b20] sm:pb-24">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 sm:px-6 md:grid-cols-[.75fr_1.25fr] md:gap-16 lg:px-8">
        <div><p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-[#217a64]"><span className="h-0.5 w-6 bg-current" aria-hidden="true" />Common questions</p><h2 className="mt-5 text-3xl font-semibold sm:text-4xl">The essentials, upfront.</h2></div>
        <div className="border-t border-[#dbe3df]">
          {questions.map(([question, answer]) => <details key={question} className="group border-b border-[#dbe3df]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold marker:hidden sm:text-base [&::-webkit-details-marker]:hidden">{question}<span className="text-2xl font-normal text-[#217a64] transition group-open:rotate-45" aria-hidden="true">+</span></summary><p className="-mt-1 max-w-[60ch] pb-5 text-sm leading-7 text-[#59706c]">{answer}</p></details>)}
          <details className="group border-b border-[#dbe3df]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold marker:hidden sm:text-base [&::-webkit-details-marker]:hidden">Where can developers get started?<span className="text-2xl font-normal text-[#217a64] transition group-open:rotate-45" aria-hidden="true">+</span></summary><p className="-mt-1 max-w-[60ch] pb-5 text-sm leading-7 text-[#59706c]">Explore the <Link href="/docs" className="font-semibold text-[#217a64] underline">developer documentation</Link> for payment endpoints, hosted checkout, and webhook guidance.</p></details>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="bg-[#c5f273] text-[#0d1b20]">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-7 px-4 py-14 sm:px-6 sm:py-20 lg:flex-row lg:items-end lg:px-8">
        <div><p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-[#376b41]"><span className="h-0.5 w-6 bg-current" aria-hidden="true" />Let&apos;s build your payment flow</p><h2 className="mt-5 max-w-[750px] text-3xl font-semibold leading-tight sm:text-[42px]">Ready for a clearer way to move payments?</h2></div>
        <div className="flex flex-wrap gap-3"><Link href="/signup" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[5px] bg-[#0d1b20] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#254a45]">Start integrating <ArrowUpRight className="size-4" aria-hidden="true" /></Link><ContactSalesLink trackingParams={{ surface: "homepage_final_cta" }} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[5px] border border-[#0d1b20] px-5 py-3 text-sm font-bold transition hover:bg-white/40">Contact sales <ArrowUpRight className="size-4" aria-hidden="true" /></ContactSalesLink></div>
      </div>
    </section>
  );
}
