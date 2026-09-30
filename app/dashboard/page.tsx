import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "../components/stackaura-ui";
import ApiKeyWelcome from "./api-key-welcome";
import { getSelectedMerchantWorkspace, getWorkspaceAnalytics } from "./console-data";
import {
  formatCurrencyFromCents,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatPlanLabel,
  paymentStatusTone,
  resolveMerchantPlanSummary,
  timelineStageTone,
} from "./console-utils";
import MerchantSwitcher from "./merchant-switcher";

function statusDot(tone: "success" | "warning" | "muted" | "violet") {
  return cn(
    "inline-block h-2 w-2 rounded-full",
    tone === "success" && "bg-emerald-500",
    tone === "warning" && "bg-amber-500",
    tone === "violet" && "bg-indigo-500",
    tone === "muted" && "bg-slate-400",
  );
}

function Status({ tone, children }: { tone: "success" | "warning" | "muted" | "violet"; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
      <span className={statusDot(tone)} />
      {children}
    </span>
  );
}

function Metric({
  label,
  value,
  detail,
  tone = "muted",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "success" | "warning" | "muted";
}) {
  return (
    <div className="border-l border-slate-200 pl-5 first:border-l-0 first:pl-0 dark:border-white/10">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className={statusDot(tone)} />
        {detail}
      </div>
    </div>
  );
}

export default async function DashboardOverviewPage() {
  const workspace = await getSelectedMerchantWorkspace();
  if (!workspace) redirect("/login");

  const analytics = await getWorkspaceAnalytics(workspace.selectedMerchantId);
  const hasPayments = analytics.totalPayments > 0;
  const selectedPlan = resolveMerchantPlanSummary(workspace.selectedMembership?.merchant);
  const recoveryRate =
    analytics.totalPayments > 0 ? analytics.recoveredPayments / analytics.totalPayments : 0;

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="border-b border-slate-200 pb-7 dark:border-white/10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#217a64] dark:text-[#8dd8ff]">
              Merchant overview
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl">
              {workspace.selectedMerchantName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span>{workspace.selectedMerchantEmail}</span>
              <Status tone={workspace.isMerchantActive ? "success" : "warning"}>
                {workspace.isMerchantActive ? "Active merchant" : "Merchant inactive"}
              </Status>
              <span>{formatPlanLabel(selectedPlan.code)} plan</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <MerchantSwitcher
              memberships={workspace.memberships}
              selectedMerchantId={workspace.selectedMerchantId}
            />
            <Link
              href="/dashboard/payments"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#0d1b20] px-5 text-sm font-semibold text-white transition hover:bg-[#254a45] dark:bg-[#c5f273] dark:text-[#0d1b20] dark:hover:bg-[#d5ff8d]"
            >
              View payments
            </Link>
          </div>
        </div>
      </section>

      <ApiKeyWelcome
        merchantId={workspace.selectedMerchantId}
        merchantName={workspace.selectedMembership?.merchant.name || null}
        merchantIsActive={workspace.selectedMembership?.merchant.isActive ?? false}
      />

      <section className="border-b border-slate-200 py-7 dark:border-white/10">
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Total volume"
            value={formatCurrencyFromCents(analytics.totalVolumeCents)}
            detail={`${formatNumber(analytics.totalPayments)} payments recorded`}
            tone={hasPayments ? "success" : "muted"}
          />
          <Metric
            label="Successful payments"
            value={formatNumber(analytics.successfulPayments)}
            detail={formatPercent(analytics.successRate)}
            tone={analytics.successRate >= 0.9 ? "success" : analytics.successfulPayments ? "warning" : "muted"}
          />
          <Metric
            label="Failed payments"
            value={formatNumber(analytics.failedPayments)}
            detail="Terminal failures or cancellations"
            tone={analytics.failedPayments ? "warning" : "success"}
          />
          <Metric
            label="Recovery rate"
            value={formatPercent(recoveryRate)}
            detail={`${formatNumber(analytics.recoveredPayments)} recovered`}
            tone={analytics.recoveredPayments ? "success" : "muted"}
          />
        </div>
      </section>

      <section className="grid gap-6 border-b border-slate-200 py-7 dark:border-white/10 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
        <div className="min-w-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#217a64] dark:text-[#8dd8ff]">
                Payment activity
              </div>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Recent transactions
              </h2>
            </div>
            <Link href="/dashboard/payments" className="text-sm font-semibold text-[#217a64] hover:underline dark:text-[#8dd8ff]">
              View all
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b111b]">
            {analytics.recentPayments.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {analytics.recentPayments.slice(0, 6).map((payment) => (
                  <div key={payment.reference} className="grid gap-3 px-5 py-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-950 dark:text-white">{payment.reference}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {payment.gatewayLabel} · {formatDateTime(payment.createdAt)}
                      </div>
                    </div>
                    <Status tone={paymentStatusTone(payment.status) as "success" | "warning" | "muted" | "violet"}>
                      {payment.status}
                    </Status>
                    <div className="text-sm font-semibold text-slate-950 dark:text-white sm:text-right">
                      {formatCurrencyFromCents(payment.amountCents)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10">
                <div className="text-sm font-semibold text-slate-950 dark:text-white">No payments yet</div>
                <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                  Payment activity will appear here as soon as this merchant processes a transaction.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#217a64] dark:text-[#8dd8ff]">
                Routing
              </div>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Latest routing events
              </h2>
            </div>
            <Link href="/dashboard/routing" className="text-sm font-semibold text-[#217a64] hover:underline dark:text-[#8dd8ff]">
              Open
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b111b]">
            {analytics.recentRoutingHistory.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {analytics.recentRoutingHistory.slice(0, 4).map((item) => (
                  <div key={item.reference} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-950 dark:text-white">{item.reference}</div>
                        <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{item.routeSummary}</div>
                      </div>
                      <Status tone={paymentStatusTone(item.status) as "success" | "warning" | "muted" | "violet"}>
                        {item.status}
                      </Status>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {item.timelineStages.map((stage, index) => (
                        <span key={`${item.reference}-${stage}`} className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          <span className={cn(
                            "rounded border px-2 py-1",
                            timelineStageTone(stage) === "success"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]"
                          )}>{stage}</span>
                          {index < item.timelineStages.length - 1 ? "→" : null}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-sm text-slate-500 dark:text-slate-400">No routing events recorded yet.</div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-7 lg:grid-cols-3">
        <div className="border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0b111b]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Quick action</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Payment operations</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Search, filter and inspect the merchant payment ledger.</p>
          <Link href="/dashboard/payments" className="mt-5 inline-flex text-sm font-semibold text-[#217a64] hover:underline dark:text-[#8dd8ff]">Open payments →</Link>
        </div>
        <div className="border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0b111b]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Quick action</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Gateway connections</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Review connected providers and payment routing configuration.</p>
          <Link href="/dashboard/gateways" className="mt-5 inline-flex text-sm font-semibold text-[#217a64] hover:underline dark:text-[#8dd8ff]">Open gateways →</Link>
        </div>
        <div className="border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0b111b]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Workspace</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{formatPlanLabel(selectedPlan.code)} plan</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 dark:border-white/5"><span className="text-slate-500 dark:text-slate-400">Manual gateway</span><span className="font-medium text-slate-950 dark:text-white">{selectedPlan.manualGatewaySelection ? "Enabled" : "Not enabled"}</span></div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 dark:border-white/5"><span className="text-slate-500 dark:text-slate-400">Auto routing</span><span className="font-medium text-slate-950 dark:text-white">{selectedPlan.autoRouting ? "Enabled" : "Not enabled"}</span></div>
            <div className="flex justify-between gap-4"><span className="text-slate-500 dark:text-slate-400">Fallback recovery</span><span className="font-medium text-slate-950 dark:text-white">{selectedPlan.fallback ? "Enabled" : "Not enabled"}</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
