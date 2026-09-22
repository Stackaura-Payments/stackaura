export default function SystemLog() {
  const events = [
    ["20:41:32", "PAYMENTS", "Paystack connection validated successfully"],
    ["20:40:58", "GATEWAY", "Yoco transaction stream synchronized"],
    ["20:40:21", "WEBHOOK", "Webhook delivery monitor operational"],
    ["20:39:47", "REVIEW", "2 payment recovery events require review"],
  ];

  return (
    <section className="mt-3 border border-white/[0.06] bg-black/40 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-amber-500/45">
            Operations
          </p>
          <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/80">
            System Activity
          </h2>
        </div>

        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-amber-400/45">
          LIVE
        </span>
      </div>

      <div className="space-y-px">
        {events.map(([time, category, message]) => (
          <div
            key={time}
            className="grid gap-2 border-b border-white/[0.035] py-2.5 font-mono text-[9px] sm:grid-cols-[80px_90px_1fr]"
          >
            <span className="text-white/20">{time}</span>
            <span className="text-amber-500/55">{category}</span>
            <span className="text-white/45">{message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
