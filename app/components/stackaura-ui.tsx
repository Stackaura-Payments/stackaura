import StackauraLogo from "./stackaura-logo";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import PublicHeaderNav from "./public-header-nav";
import SiteFooter from "./site-footer";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cn(publicSubtleSurfaceClass, className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export const publicSurfaceClass =
  "rounded-[6px] border border-[#d9e4dc] bg-white shadow-none transition-colors duration-200 dark:border-[#d9e4dc] dark:bg-white";

export const siteSubtleSurfaceClass =
  "rounded-[6px] border border-[#d9e4dc] bg-[#f1f6f1] shadow-none transition-colors duration-200 hover:border-[#88b89a] dark:border-[#d9e4dc] dark:bg-[#f1f6f1]";

export const sitePrimaryButtonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[5px] border border-[#0d1b20] bg-[#0d1b20] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#254a45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#217a64] disabled:cursor-not-allowed disabled:opacity-60";

export const siteSecondaryButtonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[5px] border border-[#0d1b20] bg-transparent px-5 py-3 text-sm font-bold text-[#0d1b20] transition-colors hover:bg-[#e7f2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#217a64]";

export const publicSubtleSurfaceClass =
  "rounded-[26px] border border-slate-200/80 bg-slate-50/92 shadow-[0_12px_28px_rgba(148,163,184,0.09)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none dark:border-white/10 dark:bg-[#0d1829] dark:shadow-[0_10px_20px_rgba(0,0,0,0.12)]";

export const publicInsetSurfaceClass =
  "rounded-[5px] border border-[#d9e4dc] bg-[#f9fbf8] shadow-none dark:border-[#d9e4dc] dark:bg-[#f9fbf8]";

export const publicFormSurfaceClass =
  "relative isolate overflow-hidden rounded-[6px] border border-[#37574e] bg-[#13282b] shadow-none";

export const publicInputClass =
  "min-h-12 w-full rounded-[5px] border border-[#527269] bg-[#0d1b20] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#9fb5ad] focus:border-[#c5f273] focus:ring-2 focus:ring-[#c5f273]/25 disabled:cursor-not-allowed disabled:opacity-70";

export const publicFieldLabelClass =
  "text-xs font-bold uppercase tracking-[0.1em] text-[#c5f273]";

export const publicPrimaryButtonClass =
  "inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[#4f46e5] bg-[#4f46e5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(79,70,229,0.22)] transition-all duration-200 ease-out hover:bg-[#4338ca] hover:brightness-[1.03] active:scale-[0.99] motion-reduce:transition-none dark:border-[#4f46e5] dark:bg-[#4f46e5] dark:shadow-[0_16px_28px_rgba(0,0,0,0.22)] dark:hover:bg-[#5b54ee]";

export const publicSecondaryButtonClass =
  "inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#0a2540] shadow-[0_10px_20px_rgba(148,163,184,0.08)] transition-all duration-200 ease-out hover:border-slate-400 hover:bg-slate-50 hover:brightness-[0.99] active:scale-[0.99] motion-reduce:transition-none dark:border-white/14 dark:bg-[#0d1829] dark:text-[#e2ebf8] dark:shadow-none dark:hover:border-white/22 dark:hover:bg-[#122033]";

export const publicPillClass =
  "inline-flex items-center gap-2 border-l-2 border-[#217a64] pl-3 text-xs font-bold uppercase tracking-[0.1em] text-[#217a64]";

export const publicSectionLabelClass =
  "text-xs font-bold uppercase tracking-[0.12em] text-[#217a64]";

export const publicTextPrimaryClass =
  "text-[#0a2540] dark:text-[#f8fafc]";

export const publicTextSecondaryClass =
  "text-[#425466] dark:text-[#e2e9f5]";

export const publicTextMutedClass =
  "text-[#536477] dark:text-[#c2cfdf]";

export const publicBorderSubtleClass =
  "border-slate-200 dark:border-white/16";

export const publicBadgeClass =
  "inline-flex items-center rounded-[4px] border border-[#9fc2aa] bg-[#e7f2ec] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#217a64]";

export const publicMinimalSecondaryButtonClass =
  "inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#0a2540] transition-all duration-200 ease-out hover:border-slate-400 hover:bg-slate-50 hover:brightness-[0.99] active:scale-[0.99] motion-reduce:transition-none dark:border-white/14 dark:bg-[#0d1829] dark:text-[#f8fafc] dark:hover:border-white/24 dark:hover:bg-[#122033]";

export const publicHeaderSecondaryButtonClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0a2540] transition-all duration-200 ease-out hover:border-slate-400 hover:bg-slate-50 hover:brightness-[0.99] active:scale-[0.99] motion-reduce:transition-none dark:border-white/14 dark:bg-[#0d1829] dark:text-[#f8fafc] dark:hover:border-white/24 dark:hover:bg-[#122033]";

export const publicHeaderMobileButtonClass =
  "inline-flex min-h-[46px] w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#0a2540] transition-all duration-200 ease-out hover:border-slate-400 hover:bg-slate-50 hover:brightness-[0.99] active:scale-[0.99] motion-reduce:transition-none dark:border-white/14 dark:bg-[#0d1829] dark:text-[#f8fafc] dark:hover:border-white/24 dark:hover:bg-[#122033]";

export const publicCodePanelClass =
  "rounded-[6px] border border-[#37574e] bg-[#0d1b20] p-6 text-white shadow-none";

export const brandGlassContainerClass =
  "border border-[#c8d7cc] bg-[#e7f2ec] shadow-none";

export const lightProductHeroClass =
  "relative isolate rounded-[32px] border border-slate-200/80 bg-white/96 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-[box-shadow,border-color,background-color] duration-200 ease-out motion-reduce:transition-none dark:border-white/10 dark:bg-[#0d1220] dark:shadow-[0_18px_40px_rgba(0,0,0,0.32)]";

export const siteProductHeroClass =
  "relative isolate rounded-[6px] border border-[#d9e4dc] bg-white shadow-none";

export const siteProductPanelClass =
  "relative isolate rounded-[6px] border border-[#d9e4dc] bg-white shadow-none";

export const siteProductInsetPanelClass =
  "relative isolate rounded-[5px] border border-[#d9e4dc] bg-[#f1f6f1] shadow-none";

export const siteProductInputClass =
  "min-h-12 w-full rounded-[5px] border border-[#afc5b5] bg-white px-4 py-3 text-sm text-[#0d1b20] outline-none placeholder:text-[#678076] focus:border-[#217a64] focus:ring-2 focus:ring-[#217a64]/20 disabled:cursor-not-allowed disabled:opacity-70";

export const siteProductMutedTextClass = "text-sm leading-6 text-[#506e60]";
export const siteProductSectionEyebrowClass = "text-xs font-bold uppercase tracking-[0.12em] text-[#217a64]";
export const siteProductCompactGhostButtonClass = "inline-flex min-h-10 items-center justify-center rounded-[5px] border border-[#9fc2aa] bg-white px-4 py-2 text-sm font-semibold text-[#0d1b20] transition hover:bg-[#e7f2ec]";

export function siteProductStatusPillClass(tone: "success" | "violet" | "muted" | "warning") {
  if (tone === "success") return "inline-flex items-center rounded-[4px] border border-[#9fc2aa] bg-[#e7f2ec] px-3 py-1 text-xs font-semibold text-[#217a64]";
  if (tone === "warning") return "inline-flex items-center rounded-[4px] border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800";
  return "inline-flex items-center rounded-[4px] border border-[#d9e4dc] bg-[#f9fbf8] px-3 py-1 text-xs font-semibold text-[#506e60]";
}

export const lightProductPanelClass =
  "relative isolate rounded-[28px] border border-slate-200/75 bg-white/94 shadow-[0_14px_30px_rgba(15,23,42,0.06)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none dark:border-white/10 dark:bg-[#0f1727] dark:shadow-[0_14px_32px_rgba(0,0,0,0.24)]";

export const lightProductInsetPanelClass =
  "relative isolate rounded-[24px] border border-slate-200/70 bg-slate-50/92 shadow-[0_10px_20px_rgba(15,23,42,0.05)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none dark:border-white/10 dark:bg-[#111b2d] dark:shadow-none";

export const lightProductGhostButtonClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-[0_10px_20px_rgba(15,23,42,0.06)] transition-all duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 hover:brightness-[0.99] active:scale-[0.99] motion-reduce:transition-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-none dark:hover:border-white/16 dark:hover:bg-white/[0.06]";

export const lightProductCompactGhostButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition-all duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 hover:brightness-[0.99] active:scale-[0.99] motion-reduce:transition-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-none dark:hover:border-white/16 dark:hover:bg-white/[0.06]";

export const lightProductCompactPrimaryButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-indigo-500/70 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(79,70,229,0.22)] transition-all duration-200 ease-out hover:brightness-105 active:scale-[0.99] dark:border-indigo-400/70 dark:shadow-[0_14px_30px_rgba(0,0,0,0.24)]";

export const lightProductInputClass =
  "min-h-[48px] w-full rounded-[20px] border border-slate-200/80 bg-white/92 px-4 py-3 text-sm text-[#0f172a] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-out placeholder:text-[#64748b] focus:border-[#4f46e5]/50 focus:ring-1 focus:ring-[#4f46e5]/16 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/50 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] dark:focus:border-indigo-500/60 dark:focus:ring-indigo-500/30";

export const lightProductSectionEyebrowClass =
  "text-xs uppercase tracking-[0.24em] text-[#635bff] dark:text-[#8dd8ff]";

export const lightProductMutedTextClass = "text-sm leading-6 text-[#475569] dark:text-[#d0dbea]";

export function lightProductNavItemClass(active: boolean) {
  return cn(
    "inline-flex min-h-[46px] items-center justify-center rounded-2xl border px-4 py-2 text-center text-sm font-semibold transition-all duration-200 ease-out",
    active
      ? "border-indigo-200 bg-indigo-50 text-[#0f172a] shadow-[0_10px_20px_rgba(79,70,229,0.10)] dark:border-indigo-500/35 dark:bg-indigo-500/10 dark:text-white dark:shadow-none"
      : "border-slate-200/80 bg-white/90 text-[#475569] hover:border-slate-300 hover:bg-slate-50 hover:text-[#0f172a] dark:border-white/10 dark:bg-white/[0.03] dark:text-[#c9d5e5] dark:hover:border-white/16 dark:hover:bg-white/[0.05] dark:hover:text-white"
  );
}

export function lightProductStatusPillClass(tone: "success" | "violet" | "muted" | "warning") {
  if (tone === "success") {
    return "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-400/18 dark:bg-emerald-400/10 dark:text-emerald-200";
  }

  if (tone === "violet") {
    return "inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-700 dark:border-indigo-400/18 dark:bg-indigo-400/10 dark:text-indigo-200";
  }

  if (tone === "warning") {
    return "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-amber-700 dark:border-amber-400/18 dark:bg-amber-400/10 dark:text-amber-200";
  }

  return "inline-flex items-center rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#475569] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#c9d5e5]";
}

export const darkSurfaceClass =
  "rounded-[28px] border border-white/10 bg-[#08152f]/60 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl";

export const darkPanelClass =
  "rounded-[6px] border border-[#37574e] bg-[#13282b] shadow-none";

export const darkSubtleSurfaceClass =
  "rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none";

export const darkHeroSurfaceClass =
  "rounded-[6px] border border-[#37574e] bg-[#0d1b20] shadow-none";

export const siteDarkInsetSurfaceClass =
  "rounded-[5px] border border-[#37574e] bg-[#193232] shadow-none";

export const darkRichPanelClass =
  "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,24,52,0.90)_0%,rgba(6,14,34,0.76)_100%)] shadow-[0_18px_56px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl";

export const darkInsetPanelClass =
  "rounded-[24px] border border-white/[0.08] bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none";

export const darkGhostButtonClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-200 ease-out hover:border-[#20BCED]/35 hover:bg-white/10 hover:brightness-105 active:scale-[0.99] motion-reduce:transition-none";

export const darkPrimaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-[5px] bg-[#c5f273] px-5 py-3 text-sm font-bold text-[#0d1b20] transition-colors hover:bg-[#dcfaa2]";

export const darkSecondaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-[5px] border border-[#b9cbc3] bg-transparent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#254a45]";

export const darkCompactGhostButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-200 ease-out hover:border-[#20BCED]/35 hover:bg-white/10 hover:brightness-105 active:scale-[0.99] motion-reduce:transition-none";

export const darkCompactPrimaryButtonClass =
  "inline-flex items-center justify-center rounded-xl bg-[#A0E9FF] px-4 py-2 text-sm font-semibold text-[#02142b] transition-all duration-200 ease-out hover:brightness-105 active:scale-[0.99] motion-reduce:transition-none";

export const darkInputClass =
  "min-h-[48px] w-full rounded-[20px] border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-out placeholder:text-white/50 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30";

export const darkPillClass =
  "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200";

export const darkSectionEyebrowClass =
  "text-xs font-bold uppercase tracking-[0.12em] text-[#c5f273]";

export const darkMutedTextClass = "text-sm leading-6 text-[#d4deea]";

export function darkNavItemClass(active: boolean) {
  return cn(
    "inline-flex min-h-[46px] items-center justify-center rounded-2xl border px-4 py-2 text-center text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition",
    active
      ? "border-[#86dfff]/30 bg-[linear-gradient(180deg,rgba(130,226,255,0.16)_0%,rgba(76,109,255,0.18)_100%)] text-white shadow-[0_12px_32px_rgba(34,89,170,0.24)]"
      : "border-white/10 bg-white/5 text-zinc-200 hover:border-[#20BCED]/35 hover:bg-white/10"
  );
}

export function darkStatusPillClass(tone: "default" | "success" | "violet" | "muted") {
  if (tone === "success") {
    return "inline-flex items-center rounded-full border border-emerald-400/18 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-200";
  }

  if (tone === "violet") {
    return "inline-flex items-center rounded-full border border-[#9288ff]/22 bg-[#7b72ff]/12 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#d8d5ff]";
  }

  if (tone === "muted") {
    return "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-300";
  }

  return darkPillClass;
}

const navItems = [
  { href: "/signup", label: "Products" },
  { href: "/integrations", label: "Integrations" },
  { href: "/docs", label: "Developers" },
  { href: "/dashboard", label: "Merchant Console" },
  { href: "/pricing", label: "Pricing" },
];

export function BrandLockup({
  compact = false,
  showTagline = true,
  inverse = false,
}: {
  compact?: boolean;
  showTagline?: boolean;
  inverse?: boolean;
}) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <div
        className={cn(
          "flex shrink-0 items-center justify-center",
          compact ? "h-10 w-10" : "h-11 w-11"
        )}
      >
        <StackauraLogo size={compact ? 40 : 44} className="object-contain" />
      </div>

      <div className="min-w-0">
        <div
          className={cn(
            inverse ? "truncate font-semibold text-white" : "truncate font-semibold text-[#0d1b20]",
            compact ? "text-lg" : "text-xl"
          )}
        >
          Stackaura
        </div>
        {showTagline ? (
          <div className={cn("text-xs font-bold uppercase tracking-[0.1em]", inverse ? "text-[#c5f273]" : "text-[#217a64]")}>
            Financial infrastructure
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export function PublicBackground({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "min-h-screen overflow-x-clip bg-[#f8fafc] text-[#0a2540] dark:bg-[#020817] dark:text-white",
        className
      )}
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-slate-200 dark:bg-white/10" />
        {children}
      </div>
    </main>
  );
}

export function SoftProductBackground({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <PublicBackground className={cn("bg-[#f8fafc] dark:bg-[#05070F]", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.06),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_24%)]" />
      <div className="relative">{children}</div>
    </PublicBackground>
  );
}

export function PublicHeader() {
  return (
    <header className="public-header-shell public-header-dark relative z-20 border-b border-[#37574e] bg-[#0d1b20] px-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 py-4 lg:relative lg:gap-6">
        <div className="public-header-block min-w-0 flex items-center gap-10">
          <div className="min-w-0 xl:hidden">
            <BrandLockup compact showTagline={false} />
          </div>
          <div className="hidden xl:block">
            <BrandLockup />
          </div>

          <PublicHeaderNav
            items={navItems}
            className="public-header-block public-header-block-delay-1 xl:absolute xl:left-1/2 xl:top-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2"
          />
        </div>

        <div className="public-header-block public-header-block-delay-2 hidden items-center gap-3 xl:flex">
          <Link href="/login" className={siteSecondaryButtonClass}>
            Sign in
          </Link>
          <Link
            href="/signup"
            className={sitePrimaryButtonClass}
          >
            Start integrating
          </Link>
        </div>

        <details className="public-header-block public-header-block-delay-1 relative xl:hidden">
          <summary className="group flex min-h-[44px] list-none items-center justify-center gap-2 rounded-[5px] border border-[#9fc2aa] bg-transparent px-4 py-2 text-sm font-semibold text-[#0d1b20] transition hover:bg-[#e7f2ec] [&::-webkit-details-marker]:hidden">
            <span>Menu</span>
            <span className="flex flex-col gap-1">
              <span className="block h-[2px] w-4 bg-[#217a64]" />
              <span className="block h-[2px] w-4 bg-[#217a64]" />
              <span className="block h-[2px] w-4 bg-[#217a64]" />
            </span>
          </summary>

          <div className="absolute right-0 top-[calc(100%+12px)] z-30 w-[min(320px,calc(100vw-2rem))] rounded-[6px] border border-[#d9e4dc] bg-[#f9fbf8] p-4 shadow-[0_18px_38px_rgba(13,27,32,0.12)]">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[5px] border border-[#d9e4dc] bg-white px-4 py-3 text-sm font-medium text-[#0d1b20] transition hover:bg-[#e7f2ec]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 grid gap-2">
              <Link href="/login" className={siteSecondaryButtonClass}>
                Sign in
              </Link>
              <Link
                href="/signup"
                className={sitePrimaryButtonClass}
              >
                Start integrating
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return <SiteFooter />;
}

export function PublicPageShell({
  eyebrow,
  title,
  description,
  actions,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <PublicBackground className="site-public-light bg-[#f9fbf8] text-[#0d1b20] dark:bg-[#f9fbf8] dark:text-[#0d1b20]">
      <PublicHeader />

      <div className="relative mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <section
          className={cn(
            "gap-8 lg:gap-12",
            aside ? "grid min-w-0 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start" : "max-w-4xl"
          )}
        >
          <div className={cn("min-w-0 max-w-3xl", !aside && "max-w-4xl")}>
            <div className={publicPillClass}>{eyebrow}</div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.1] text-[#0d1b20] sm:text-5xl lg:text-[58px]">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#506e60] sm:text-lg sm:leading-8">
              {description}
            </p>

            {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
          </div>

          {aside ? <div className="min-w-0 lg:pt-2">{aside}</div> : null}
        </section>

        {children ? <div className="mt-10 space-y-6">{children}</div> : null}
      </div>

      <PublicFooter />
    </PublicBackground>
  );
}

export function DarkBackground({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("relative min-h-screen overflow-hidden bg-[#020817] text-white", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(32,188,237,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(17,106,248,0.20),transparent_30%),linear-gradient(135deg,#061229_0%,#020817_48%,#04174a_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_18%)]" />
      {children}
    </main>
  );
}
