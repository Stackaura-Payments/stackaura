import Link from "next/link";
import ContactSalesLink from "../components/contact-sales-link";
import {
  cn,
  siteProductStatusPillClass,
  PublicBackground,
  PublicFooter,
  PublicHeader,
  publicInsetSurfaceClass,
  sitePrimaryButtonClass,
  siteSecondaryButtonClass,
  publicSectionLabelClass,
  publicSurfaceClass,
  siteSubtleSurfaceClass,
} from "../components/stackaura-ui";
import { buildPricingPagePlans, getServerPricing } from "../lib/pricing";

const comparisonRows = [
  {
    feature: "Hosted checkout",
    starter: "Included",
    growth: "Included",
    scale: "Included",
  },
  {
    feature: "Unified API",
    starter: "Included",
    growth: "Included",
    scale: "Included",
  },
  {
    feature: "Auto routing",
    starter: "Included",
    growth: "Included",
    scale: "Included",
  },
  {
    feature: "Manual gateway selection",
    starter: "Not included",
    growth: "Included",
    scale: "Included",
  },
  {
    feature: "Fallback",
    starter: "Not included",
    growth: "Included",
    scale: "Included",
  },
  {
    feature: "Merchant support level",
    starter: "Standard",
    growth: "Priority growth support",
    scale: "Custom / enterprise",
  },
  {
    feature: "Custom pricing availability",
    starter: "No",
    growth: "Volume review",
    scale: "Yes",
  },
] as const;

const whyChooseStackaura = [
  {
    title: "Higher payment success rates",
    description:
      "Route payments across multiple rails and reduce the impact of provider issues on conversion.",
  },
  {
    title: "Fewer failed checkouts",
    description:
      "Fallback logic helps recover transactions that would otherwise be lost when a provider fails.",
  },
  {
    title: "One integration for multiple providers",
    description:
      "Unify checkout, orchestration, and payment operations without stitching together separate systems.",
  },
] as const;

const faqs = [
  {
    question: "Do gateway or provider fees still apply?",
    answer:
      "Yes. Gateway fees are charged separately through the connected payment rail. Stackaura pricing covers orchestration, routing intelligence, and payment infrastructure on top of those provider relationships.",
  },
  {
    question: "What does Stackaura charge for?",
    answer:
      "Stackaura charges for the orchestration layer: unified checkout, routing logic, fallback, API access, payment recovery infrastructure, and the operational tools around those flows.",
  },
  {
    question: "When should I choose Growth?",
    answer:
      "Growth is the right fit when you want more than simple checkout and need manual gateway control, fallback routing, and multi-gateway orchestration as part of your core payment stack.",
  },
  {
    question: "Is Scale available for custom pricing?",
    answer:
      "Yes. Scale is positioned for custom commercial arrangements and higher-touch support for larger merchants or more complex payment programs.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. You can start with a simpler plan and move into Growth or Scale as your payment volume, routing needs, and operational complexity increase.",
  },
] as const;

function FeatureStatus({ value }: { value: string }) {
  if (value === "Included") {
    return (
      <span className={siteProductStatusPillClass("success")}>Included</span>
    );
  }

  if (value === "Not included" || value === "No") {
    return (
      <span className={siteProductStatusPillClass("muted")}>{value}</span>
    );
  }

  if (
    value === "Priority growth support" ||
    value === "Volume review" ||
    value === "Yes"
  ) {
    return <span className={siteProductStatusPillClass("violet")}>{value}</span>;
  }

  if (value === "Custom / enterprise") {
    return <span className={siteProductStatusPillClass("warning")}>{value}</span>;
  }

  return <span className="text-sm font-medium text-[#425466]">{value}</span>;
}

function PlanFeature({
  label,
  included,
}: {
  label: string;
  included: boolean | string;
}) {
  const statusClass =
    included === true
      ? "border-emerald-300/70 bg-emerald-50/80 text-emerald-700"
      : included === false
        ? "border-white/50 bg-white/50 text-[#6b7c93]"
        : "border-amber-300/70 bg-amber-50/82 text-amber-700";

  const statusLabel =
    included === true ? "Included" : included === false ? "Not included" : included;

  return (
    <div className={cn("flex items-start justify-between gap-3 px-4 py-3", publicInsetSurfaceClass)}>
      <span className="text-sm font-medium leading-6 text-[#425466]">{label}</span>
      <span
        className={cn(
          "shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
          statusClass
        )}
      >
        {statusLabel}
      </span>
    </div>
  );
}

export default async function PricingPage() {
  const pricing = await getServerPricing();
  const plans = buildPricingPagePlans(pricing);
  const plansByName = new Map(plans.map((plan) => [plan.name, plan] as const));
  const starterPlan = plansByName.get("Starter")!;
  const growthPlan = plansByName.get("Growth")!;
  const scalePlan = plansByName.get("Scale")!;
  const sectionClass = "mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8";

  return (
    <PublicBackground className="site-public-light bg-[#f9fbf8] text-[#0d1b20]">
      <PublicHeader />

      <div className="relative pb-20">
        <section className={cn(sectionClass, "pt-8 sm:pt-12")}>
          <div
            className={cn(
              "relative overflow-hidden rounded-[6px] border border-[#37574e] bg-[#0d1b20] px-5 pb-8 pt-8 text-white sm:px-8 sm:pb-10 lg:px-10 lg:py-12"
            )}
          >
            <div className="relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div className="relative z-10 max-w-3xl pr-0">
                <div className="border-l-2 border-[#c5f273] pl-3 text-xs font-bold uppercase tracking-[0.12em] text-[#c5f273]">
                  Pricing for orchestration, routing, and recovery
                </div>

                <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-[58px]">
                  Simple, transparent pricing for intelligent payments.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[#c9d5d2] sm:text-lg">
                  Choose the Stackaura plan that fits your business. Start with
                  unified checkout and grow into smart routing, fallback, and
                  payment recovery.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/signup" className="inline-flex min-h-12 items-center justify-center rounded-[5px] bg-[#c5f273] px-5 py-3 text-sm font-bold text-[#0d1b20] transition hover:bg-[#dcfaa2]">
                    Start accepting payments
                  </Link>
                  <ContactSalesLink
                    className="inline-flex min-h-12 items-center justify-center rounded-[5px] border border-[#b9cbc3] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#254a45]"
                    trackingParams={{ surface: "pricing_hero" }}
                  >
                    Contact sales
                  </ContactSalesLink>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="flex flex-col gap-3">
                  <div className="rounded-[6px] border border-[#d9e4dc] bg-white p-5 text-[#0d1b20]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7c93]">
                          Growth plan
                        </div>
                        <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0a2540]">
                          {growthPlan.price}
                        </div>
                        {growthPlan.priceSuffix ? (
                          <div className="mt-1 text-xs font-medium text-[#6b7c93]">
                            {growthPlan.priceSuffix}
                          </div>
                        ) : null}
                      </div>
                      <span className={siteProductStatusPillClass("violet")}>
                        Most popular
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-[#0a2540]">
                            Fallback routing
                          </div>
                          <div className="text-xs text-[#425466]">
                            Recover payments across multiple gateways
                          </div>
                        </div>
                        <span className={siteProductStatusPillClass("success")}>
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-[#0a2540]">
                            Manual gateway control
                          </div>
                          <div className="text-xs text-[#425466]">
                            Explicit rail selection when your flow needs it
                          </div>
                        </div>
                        <span className={siteProductStatusPillClass("violet")}>
                          Included
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-[#0a2540]">
                            Unified infrastructure
                          </div>
                          <div className="text-xs text-[#425466]">
                            Hosted checkout, API, and routing in one layer
                          </div>
                        </div>
                        <span className={siteProductStatusPillClass("success")}>
                          Included
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[6px] border border-[#d9e4dc] bg-white p-4 text-[#0d1b20]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7c93]">
                      Starter
                    </div>
                    <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#0a2540]">
                      {starterPlan.price}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#425466]">
                      {starterPlan.description}
                    </p>
                  </div>

                  <div className="rounded-[6px] border border-[#d9e4dc] bg-white p-4 text-[#0d1b20]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7c93]">
                      Scale
                    </div>
                    <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#0a2540]">
                      {scalePlan.price}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#425466]">
                      {scalePlan.priceSupportingLine ?? scalePlan.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={cn(sectionClass, "py-16 sm:py-20")}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <div className={publicSectionLabelClass}>Plans</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0a2540] sm:text-5xl">
                Pricing aligned to how your payment stack grows
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative overflow-hidden p-6 sm:p-7",
                  plan.featured
                    ? "rounded-[30px] border border-[#7a73ff]/28 bg-white shadow-[0_24px_46px_rgba(148,163,184,0.14)] xl:-translate-y-2"
                    : publicSurfaceClass
                )}
              >
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7c93]">
                        {plan.audience}
                      </div>
                      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0a2540]">
                        {plan.name}
                      </h3>
                    </div>
                    {plan.badge ? (
                      <span
                        className={
                          plan.featured
                            ? siteProductStatusPillClass("violet")
                            : siteProductStatusPillClass("muted")
                        }
                      >
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 flex items-end gap-2">
                    <div className="text-4xl font-semibold tracking-[-0.05em] text-[#0a2540] sm:text-5xl">
                      {plan.price}
                    </div>
                    {plan.priceSuffix ? (
                      <div className="pb-1 text-sm font-medium text-[#6b7c93]">
                        {plan.priceSuffix}
                      </div>
                    ) : null}
                  </div>
                  {plan.priceSupportingLine ? (
                    <div className="mt-2 text-sm font-medium text-[#516173]">
                      {plan.priceSupportingLine}
                    </div>
                  ) : null}

                  <p className="mt-4 text-base leading-7 text-[#425466]">
                    {plan.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <PlanFeature
                        key={feature.label}
                        label={feature.label}
                        included={feature.included}
                      />
                    ))}
                  </div>

                  <div className="mt-7">
                    {plan.ctaHref === "/contact" ? (
                      <ContactSalesLink
                        className={
                          plan.featured
                            ? sitePrimaryButtonClass
                            : siteSecondaryButtonClass
                        }
                        trackingParams={{ surface: "pricing_plan_card", plan: plan.name }}
                      >
                        {plan.ctaLabel}
                      </ContactSalesLink>
                    ) : (
                      <Link
                        href={plan.ctaHref}
                        className={
                          plan.featured
                            ? sitePrimaryButtonClass
                            : siteSecondaryButtonClass
                        }
                      >
                        {plan.ctaLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={cn(sectionClass, "py-16 sm:py-20")}>
          <div className={cn("overflow-hidden p-6 sm:p-8 lg:p-10", publicSurfaceClass)}>
            <div className="max-w-3xl">
              <div className={publicSectionLabelClass}>Feature comparison</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0a2540] sm:text-5xl">
                Compare the infrastructure included in each plan
              </h2>
            </div>

            <div className="mt-8 space-y-4">
              <div className="hidden md:grid md:grid-cols-[1.2fr_0.75fr_0.75fr_0.75fr] md:gap-4">
                <div className="px-4 text-sm font-semibold text-[#6b7c93]">
                  Feature
                </div>
                <div className="px-4 text-sm font-semibold text-[#6b7c93]">
                  Starter
                </div>
                <div className="px-4 text-sm font-semibold text-[#6b7c93]">
                  Growth
                </div>
                <div className="px-4 text-sm font-semibold text-[#6b7c93]">
                  Scale
                </div>
              </div>

              {comparisonRows.map((row) => (
                <div
                  key={row.feature}
                  className="grid gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/92 p-4 shadow-[0_10px_22px_rgba(148,163,184,0.08)] md:grid-cols-[1.2fr_0.75fr_0.75fr_0.75fr] md:items-center md:gap-4 md:p-5"
                >
                  <div className="text-base font-semibold text-[#0a2540]">
                    {row.feature}
                  </div>

                  <div className={cn("flex items-center justify-between gap-3 md:block", publicInsetSurfaceClass, "p-3 md:bg-transparent md:p-0 md:shadow-none md:border-0")}>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7c93] md:hidden">
                      Starter
                    </div>
                    <FeatureStatus value={row.starter} />
                  </div>

                  <div className={cn("flex items-center justify-between gap-3 md:block", publicInsetSurfaceClass, "p-3 md:bg-transparent md:p-0 md:shadow-none md:border-0")}>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7c93] md:hidden">
                      Growth
                    </div>
                    <FeatureStatus value={row.growth} />
                  </div>

                  <div className={cn("flex items-center justify-between gap-3 md:block", publicInsetSurfaceClass, "p-3 md:bg-transparent md:p-0 md:shadow-none md:border-0")}>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7c93] md:hidden">
                      Scale
                    </div>
                    <FeatureStatus value={row.scale} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn(sectionClass, "py-16 sm:py-20")}>
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className={cn("p-6 sm:p-8", publicSurfaceClass)}>
              <div className={publicSectionLabelClass}>Pricing explanation</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0a2540] sm:text-5xl">
                Pricing for orchestration, not payment processing itself
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#425466]">
                Stackaura sits above licensed payment providers and helps route,
                optimize, and recover payments across multiple rails through
                one integration layer.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  pricing.notes.gatewayFees,
                  "Stackaura charges for orchestration, routing intelligence, and payment recovery infrastructure.",
                  "One integration gives you access to multiple rails.",
                ].map((item) => (
                  <div key={item} className={cn("p-4", siteSubtleSurfaceClass)}>
                    <p className="text-sm leading-6 text-[#425466]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn("p-6 sm:p-8", publicSurfaceClass)}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7c93]">
                Trust clarification
              </div>
              <p className="mt-4 text-base leading-7 text-[#425466]">
                Stackaura is a software infrastructure and orchestration layer.
                Stackaura does not directly process, hold, or settle customer
                funds; licensed payment providers process and settle payments.
              </p>

              <div className={cn("mt-6 p-5", siteSubtleSurfaceClass)}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7c93]">
                  Stackaura role
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold text-[#0a2540] shadow-[0_10px_18px_rgba(148,163,184,0.08)]">
                    Merchant
                  </div>
                  <div className="hidden text-center text-xl text-[#635bff] sm:block">
                    →
                  </div>
                  <div className="rounded-2xl border border-[#b8b2ff]/70 bg-[#f4f2ff] px-4 py-4 text-center text-sm font-semibold text-[#0a2540] shadow-[0_10px_18px_rgba(148,163,184,0.08)]">
                    Stackaura
                  </div>
                  <div className="hidden text-center text-xl text-[#635bff] sm:block">
                    →
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold text-[#0a2540] shadow-[0_10px_18px_rgba(148,163,184,0.08)]">
                    Licensed Payment Providers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={cn(sectionClass, "py-16 sm:py-20")}>
          <div className="max-w-3xl">
            <div className={publicSectionLabelClass}>Why Stackaura</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0a2540] sm:text-5xl">
              Why businesses choose Stackaura
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {whyChooseStackaura.map((item) => (
              <div key={item.title} className={cn("p-6 sm:p-7", siteSubtleSurfaceClass)}>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#0a2540]">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-[#425466]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={cn(sectionClass, "py-16 sm:py-20")}>
          <div className={cn("p-6 sm:p-8 lg:p-10", publicSurfaceClass)}>
            <div className="max-w-3xl">
              <div className={publicSectionLabelClass}>FAQ</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0a2540] sm:text-5xl">
                Common pricing questions
              </h2>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {faqs.map((item) => (
                <div key={item.question} className={cn("p-5 sm:p-6", siteSubtleSurfaceClass)}>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#0a2540]">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#425466]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn(sectionClass, "pt-16 sm:pt-20")}>
          <div className={cn("p-6 sm:p-8 lg:p-10", publicSurfaceClass)}>
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className={publicSectionLabelClass}>Start building</div>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0a2540] sm:text-5xl">
                  Ready to route payments intelligently?
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#425466]">
                  Start with a plan built for checkout performance and grow into
                  deeper routing, fallback, and payment recovery with
                  Stackaura.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className={sitePrimaryButtonClass}>
                  Start accepting payments
                </Link>
                <ContactSalesLink
                  className={siteSecondaryButtonClass}
                  trackingParams={{ surface: "pricing_final_cta" }}
                >
                  Talk to sales
                </ContactSalesLink>
              </div>
            </div>
          </div>
        </section>
      </div>

      <PublicFooter />
    </PublicBackground>
  );
}
