export function isSameOriginRequest(request: { headers: Headers; url: string }) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const parsed = new URL(origin);
    const protocol = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(/:$/, "");
    return origin === parsed.origin && parsed.host === host.toLowerCase() && ["http", "https"].includes(protocol) && parsed.protocol === `${protocol}:`;
  } catch { return false; }
}
