import { PublicBackground, PublicFooter, PublicHeader } from "./components/stackaura-ui";
import PricingSection from "./components/pricing-section";
import { buildHomepagePricingTiers, getServerPricing } from "./lib/pricing";
import { DeveloperIntegration, PlatformOverview } from "./components/landing/landing-interactions";
import { FinalCta, LandingFaq, LandingHero, MerchantOutcomes, TrustStrip } from "./components/landing/landing-static";

export default async function Home() {
  const pricing = await getServerPricing();
  const pricingTiers = buildHomepagePricingTiers(pricing);
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stackaura Payments (Pty) Ltd",
    alternateName: "Stackaura",
    url: "https://stackaura.co.za",
    logo: "https://stackaura.co.za/stackaura-logo.png",
    email: "admin@stackaura.co.za",
    sameAs: ["https://www.linkedin.com/company/stackaura"],
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stackaura",
    url: "https://stackaura.co.za",
  };
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Stackaura",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: "Payment orchestration infrastructure for merchants and developers.",
    url: "https://stackaura.co.za",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <PublicBackground className="site-public-light bg-[#f9fbf8]">
        <PublicHeader />
        <LandingHero />
        <TrustStrip />
        <PlatformOverview />
        <MerchantOutcomes />
        <DeveloperIntegration />
        <div id="pricing" className="bg-[#f9fbf8] text-[#0d1b20]">
          <PricingSection tiers={pricingTiers} className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8" />
        </div>
        <LandingFaq />
        <FinalCta />
        <PublicFooter />
      </PublicBackground>
    </>
  );
}
