import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FooterReveal from "./footer-reveal";

const sections = [
  { title: "Product", links: [["Pricing", "/pricing"], ["Docs", "/docs"], ["Integrations", "/integrations"], ["Dashboard", "/dashboard"]] },
  { title: "Solutions", links: [["Payment orchestration", "/integrations"], ["Smart routing", "/integrations"], ["Fallback flows", "/pricing"], ["Merchant infrastructure", "/signup"]] },
  { title: "Developers", links: [["API docs", "/docs"], ["Integration guides", "/integrations"], ["Hosted checkout", "/docs"], ["Webhooks", "/docs"]] },
  { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]] },
  { title: "Support", links: [["Support assistant", "/dashboard/support"], ["wesupport@stackaura.co.za", "mailto:wesupport@stackaura.co.za"], ["Support docs", "/docs"], ["Contact support", "/contact"]] },
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#37574e] bg-[#0d1b20] text-[#dce9e2]">
      <FooterReveal className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 border-b border-[#37574e] pb-12 lg:grid-cols-[1.2fr_1.8fr] lg:gap-20">
          <div className="max-w-md">
            <Link href="/" className="text-2xl font-bold text-white">Stackaura<span className="text-[#c5f273]">.</span></Link>
            <p className="mt-5 text-sm leading-7 text-[#b9cbc3]">Payment orchestration and infrastructure software for African commerce teams. One integration for routing, recovery, and payment visibility.</p>
            <div className="mt-7 border-t border-[#37574e] pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#c5f273]">Trust and compliance</p>
              <p className="mt-2 text-sm leading-6 text-[#b9cbc3]">Stackaura provides software infrastructure and orchestration tools. Licensed payment providers process and settle customer funds.</p>
            </div>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 border-b border-[#c5f273] pb-1 text-sm font-semibold text-[#c5f273]">Talk to our team <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#c5f273]">{section.title}</h3>
                <ul className="mt-5 space-y-3">
                  {section.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm leading-6 text-[#b9cbc3] transition hover:text-white">{label}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 pt-6 text-xs text-[#9fb5ad] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stackaura Payments (Pty) Ltd · South Africa</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <a href="https://www.instagram.com/stackaura/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            <a href="https://www.facebook.com/profile.php?id=61579471440722" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
            <a href="https://x.com/Stackaura_" target="_blank" rel="noopener noreferrer" className="hover:text-white">X</a>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
