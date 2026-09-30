import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import ContactSalesLink from "./contact-sales-link";

export type HomepagePricingTier = {
  name: string;
  audience: string;
  price: string;
  priceSuffix: string;
  priceSupportingLine?: string | null;
  bullets: readonly string[];
  featured: boolean;
  badge?: string | null;
  ctaHref: string;
  ctaLabel: string;
};

export default function PricingSection({ tiers, className }: { tiers: readonly HomepagePricingTier[]; className?: string }) {
  return (
    <section className={className} aria-labelledby="pricing-title">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[700px]">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-[#217a64]"><span className="h-0.5 w-6 bg-current" aria-hidden="true" />Pricing</p>
          <h2 id="pricing-title" className="mt-5 text-3xl font-semibold leading-tight sm:text-[42px]">A plan for the way you process payments.</h2>
          <p className="mt-5 max-w-[60ch] text-sm leading-7 text-[#59706c] sm:text-base">Choose the orchestration capabilities your team needs. Gateway fees are charged separately through connected payment providers.</p>
        </div>
        <Link href="/pricing" className="inline-flex shrink-0 items-center gap-2 self-start border-b border-[#217a64] pb-1 text-sm font-bold text-[#217a64] transition hover:gap-3 sm:self-auto">View full pricing <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article key={tier.name} className={`flex min-w-0 flex-col rounded-[6px] border p-5 sm:p-7 ${tier.featured ? "border-[#65a77c] bg-[#e7f2ec]" : "border-[#dbe3df] bg-white"}`}>
            <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#217a64]">{tier.audience}</p><h3 className="mt-4 text-2xl font-semibold">{tier.name}</h3></div>{tier.badge ? <span className="shrink-0 rounded-sm border border-[#b9d8c0] px-2 py-1 text-[10px] font-bold text-[#217a64]">{tier.badge}</span> : null}</div>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1"><strong className="break-words text-3xl font-semibold sm:text-4xl">{tier.price}</strong>{tier.priceSuffix ? <span className="text-xs text-[#59706c]">{tier.priceSuffix}</span> : null}</div>
            {tier.priceSupportingLine ? <p className="mt-2 text-xs text-[#59706c]">{tier.priceSupportingLine}</p> : null}
            <div className="mt-6 space-y-0 border-t border-[#cbdcd1]">{tier.bullets.map((bullet) => <div key={bullet} className="flex items-start gap-3 border-b border-[#dbe6dd] py-3 text-sm text-[#405e50]"><Check className="mt-0.5 size-4 shrink-0 text-[#217a64]" aria-hidden="true" />{bullet}</div>)}</div>
            <div className="mt-auto pt-7">{tier.ctaHref === "/contact" ? <ContactSalesLink trackingParams={{ surface: "homepage_pricing_card", plan: tier.name }} className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-[5px] border border-[#0d1b20] px-4 py-2 text-sm font-bold text-[#0d1b20] transition hover:bg-[#f2f8f2]">{tier.ctaLabel}<ArrowUpRight className="size-4" aria-hidden="true" /></ContactSalesLink> : <Link href={tier.ctaHref} className={`inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-[5px] px-4 py-2 text-sm font-bold transition ${tier.featured ? "bg-[#0d1b20] text-white hover:bg-[#254a45]" : "border border-[#0d1b20] text-[#0d1b20] hover:bg-[#f2f8f2]"}`}>{tier.ctaLabel}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>}</div>
          </article>
        ))}
      </div>

      <p className="mt-6 max-w-[95ch] text-xs leading-6 text-[#59706c]">Stackaura provides software infrastructure and orchestration tools. Stackaura does not directly process, hold, or settle customer funds. Licensed payment providers handle payment processing and settlement.</p>
    </section>
  );
}
