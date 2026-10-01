"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowDownToLine, ChevronLeft, ChevronRight, CreditCard, LayoutDashboard,
  LifeBuoy, Link2, Network, Plug, RotateCcw, Settings, SquareCode, Users, X,
} from "lucide-react";
import { cn, lightProductNavItemClass } from "./console-ui";
import { dashboardNavItems, type DashboardNavIcon } from "./dashboard-nav";

const icons = {
  overview: LayoutDashboard, payments: CreditCard, payment_links: Link2,
  payouts: ArrowDownToLine, customers: Users, routing: Network,
  recovery: RotateCcw, api: SquareCode, gateways: Plug, settings: Settings,
} satisfies Record<DashboardNavIcon, typeof LayoutDashboard>;

const groups = [
  { label: "Workspace", icons: ["overview", "payments", "payment_links", "payouts", "customers"] },
  { label: "Operations", icons: ["routing", "recovery", "gateways"] },
  { label: "Manage", icons: ["api", "settings"] },
];

export default function Sidebar({ collapsed, mobileOpen, onCollapseToggle, onCloseMobile }: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapseToggle: () => void;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  useEffect(() => {
    if (!mobileOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseMobile();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen, onCloseMobile]);

  return <>
    {mobileOpen ? <button type="button" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onCloseMobile} aria-label="Close navigation" /> : null}
    <aside className={cn(
      "console-sidebar fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col p-3 transition-transform duration-200",
      collapsed ? "lg:w-[72px]" : "lg:w-[232px]",
      mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
    )}>
      <div className="flex min-h-16 items-center justify-between gap-2 px-2">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3" title="StackAura Merchant Console">
          <Image src="/stackaura-logo.png" alt="StackAura" width={28} height={28} className="shrink-0" priority />
          <span className={cn("min-w-0", collapsed && "lg:hidden")}>
            <span className="block text-base font-semibold">StackAura<span className="console-muted">.</span></span>
            <span className="console-muted block text-[11px]">Merchant Console</span>
          </span>
        </Link>
        <button type="button" onClick={onCloseMobile} className="console-button inline-flex h-9 w-9 shrink-0 px-0 lg:hidden" aria-label="Close navigation"><X className="size-4" /></button>
      </div>
      <nav aria-label="Merchant Console" className="mt-4 min-h-0 flex-1 space-y-6 overflow-y-auto">
        {groups.map(group => <div key={group.label}>
          <p className={cn("console-muted mb-2 px-3 text-[10px] font-semibold uppercase", collapsed && "lg:sr-only")}>{group.label}</p>
          <div className="space-y-1">{dashboardNavItems.filter(item => group.icons.includes(item.icon)).map(item => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
            const Icon = icons[item.icon];
            return <Link key={item.href} href={item.href} onClick={onCloseMobile} aria-current={active ? "page" : undefined} title={item.label} className={cn(lightProductNavItemClass(active), collapsed && "lg:justify-center lg:px-0")}>
              <Icon className="size-[18px] shrink-0" aria-hidden="true" />
              <span className={cn("truncate", collapsed && "lg:sr-only")}>{item.shortLabel}</span>
            </Link>;
          })}</div>
        </div>)}
      </nav>
      <div className="mt-4 space-y-2 border-t border-[var(--console-border)] pt-3">
        <Link href="/dashboard/support" onClick={onCloseMobile} title="Support" aria-current={pathname.startsWith("/dashboard/support") ? "page" : undefined} className={cn(lightProductNavItemClass(pathname.startsWith("/dashboard/support")), collapsed && "lg:justify-center lg:px-0")}><LifeBuoy className="size-[18px] shrink-0" aria-hidden="true" /><span className={cn(collapsed && "lg:sr-only")}>Support</span></Link>
        <button type="button" onClick={onCollapseToggle} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className={cn("console-nav-item hidden w-full lg:flex", collapsed && "justify-center px-0")}>
          {collapsed ? <ChevronRight className="size-[18px]" /> : <><ChevronLeft className="size-[18px]" /><span>Collapse sidebar</span></>}
        </button>
      </div>
    </aside>
  </>;
}
