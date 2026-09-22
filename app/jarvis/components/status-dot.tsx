"use client";

export function StatusDot({
  tone = "amber",
}: {
  tone?:
    | "emerald"
    | "cyan"
    | "amber"
    | "online"
    | "monitoring"
    | "attention";
}) {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.75)]" />
    </span>
  );
}
