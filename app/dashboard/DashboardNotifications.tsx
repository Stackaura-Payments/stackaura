"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { cn, lightProductStatusPillClass } from "./console-ui";
import { Button } from "../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Separator } from "../../components/ui/separator";

type NotificationItem = {
  id: string;
  kind: "failed_payment" | "recovered_payment" | "support_escalation" | "gateway_issue";
  title: string;
  description: string;
  href: string;
  createdAt: string;
};

function storageKeyFor(userEmail: string) {
  return `stackaura_dashboard_notifications_read:${userEmail.toLowerCase()}`;
}

function kindBadge(kind: NotificationItem["kind"]) {
  if (kind === "failed_payment") return "Failed";
  if (kind === "recovered_payment") return "Recovered";
  if (kind === "support_escalation") return "Support";
  return "Gateway";
}

function kindTone(kind: NotificationItem["kind"]): "warning" | "success" | "violet" | "muted" {
  if (kind === "failed_payment") return "warning";
  if (kind === "recovered_payment") return "success";
  if (kind === "support_escalation") return "violet";
  return "muted";
}

export default function DashboardNotifications({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKeyFor(userEmail));
      if (!stored) return;
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed)) {
        setReadIds(parsed);
      }
    } catch {
      setReadIds([]);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadNotifications() {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/notifications", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setItems([]);
          return;
        }

        const payload = (await res.json()) as { items?: NotificationItem[] };
        if (!cancelled) {
          setItems(Array.isArray(payload.items) ? payload.items : []);
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [open]);

  function persistRead(nextIds: string[]) {
    setReadIds(nextIds);
    window.localStorage.setItem(storageKeyFor(userEmail), JSON.stringify(nextIds));
  }

  function markAsRead(id: string) {
    if (readIds.includes(id)) return;
    persistRead([...readIds, id]);
  }

  function markAllAsRead() {
    persistRead(items.map((item) => item.id));
  }

  const unreadCount = useMemo(
    () => items.filter((item) => !readIds.includes(item.id)).length,
    [items, readIds],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          title="Notifications"
          className="relative shrink-0"
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 ? (
            <span className="absolute right-2 top-2 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#635bff] px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="console-popover w-[min(360px,calc(100vw-24px))] p-0" align="end">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-[#6b7c93] dark:text-[#8ea5c0]">Notifications</div>
            <div className="mt-1 text-sm font-semibold text-[#0a2540] dark:text-white">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </div>
          </div>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-medium text-[#4f46e5] transition-opacity duration-150 ease-out hover:opacity-80 dark:text-[#8dd8ff]"
            >
              Mark all as read
            </button>
          ) : null}
        </div>

        <Separator />

        <div className="max-h-[min(65vh,28rem)] overflow-y-auto p-2">
          <div className="grid gap-2">
            {loading ? (
              <div className="rounded-2xl px-3 py-4 text-sm text-[#6b7c93] dark:text-[#8ea5c0]">Loading notifications…</div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl px-3 py-4 text-sm text-[#6b7c93] dark:text-[#8ea5c0]">
                No operational notifications right now.
              </div>
            ) : (
              items.map((item) => {
                const unread = !readIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-2xl border px-3 py-3 transition-all duration-200 ease-out",
                      unread
                        ? "border-slate-200/90 bg-slate-50 dark:border-white/10 dark:bg-white/[0.05]"
                        : "border-slate-200/60 bg-transparent dark:border-white/6 dark:bg-transparent",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        markAsRead(item.id);
                        setOpen(false);
                        router.push(item.href);
                      }}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-[#0a2540] dark:text-white">{item.title}</div>
                          <div className="mt-1 text-xs leading-5 text-[#6b7c93] dark:text-[#8ea5c0]">{item.description}</div>
                        </div>
                        <span className={lightProductStatusPillClass(kindTone(item.kind))}>
                          {kindBadge(item.kind)}
                        </span>
                      </div>
                    </button>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-[#6b7c93] dark:text-[#8ea5c0]">
                        {new Intl.DateTimeFormat("en-ZA", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(item.createdAt))}
                      </div>
                      {unread ? (
                        <button
                          type="button"
                          onClick={() => markAsRead(item.id)}
                          className="text-[11px] font-medium text-[#4f46e5] transition-opacity duration-150 ease-out hover:opacity-80 dark:text-[#8dd8ff]"
                        >
                          Mark read
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="text-xs text-[#6b7c93] dark:text-[#8ea5c0]">Real merchant console activity</div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/support");
            }}
            className="text-xs font-medium text-[#4f46e5] transition-opacity duration-150 ease-out hover:opacity-80 dark:text-[#8dd8ff]"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
