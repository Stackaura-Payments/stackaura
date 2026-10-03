import { NextRequest, NextResponse } from "next/server";
import { fetchServerApi } from "@/app/lib/server-api";

type Context = { params: Promise<{ provider: string; action: string }> };
const cookiesFor = (provider: string) => `stackaura_oauth_${provider}`;

function failure(req: NextRequest, provider: string, reason = "failed") {
  const response = NextResponse.redirect(new URL(`/login?oauth_error=${reason}`, req.url), 303);
  response.cookies.set(cookiesFor(provider), "", { httpOnly: true, path: "/", maxAge: 0, secure: req.nextUrl.protocol === "https:", sameSite: provider === "apple" ? "none" : "lax" });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

async function handle(req: NextRequest, ctx: Context) {
  const { provider, action } = await ctx.params;
  if (!["google", "apple"].includes(provider)) return NextResponse.json({ message: "Not found" }, { status: 404 });
  try {
    if (action === "start" && req.method === "GET") {
      if (provider === "apple" && req.nextUrl.protocol !== "https:") return failure(req, provider, "unavailable");
      const response = await fetchServerApi(`/v1/auth/oauth/${provider}/start?next=${encodeURIComponent(req.nextUrl.searchParams.get("next") ?? "/dashboard")}`, { cache: "no-store" });
      if (!response.ok) return failure(req, provider, "unavailable");
      const data = await response.json();
      const destination = new URL(data.authorizationUrl);
      if (destination.protocol !== "https:" || destination.hostname !== (provider === "google" ? "accounts.google.com" : "appleid.apple.com") || typeof data.bindingToken !== "string") return failure(req, provider);
      const out = NextResponse.redirect(destination);
      out.cookies.set(cookiesFor(provider), data.bindingToken, { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: provider === "apple" ? "none" : "lax", maxAge: 600, path: "/" });
      out.headers.set("Cache-Control", "no-store");
      out.headers.set("Referrer-Policy", "no-referrer");
      return out;
    }
    if (action !== "callback" || req.method !== (provider === "apple" ? "POST" : "GET")) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const params = req.method === "POST" ? await req.formData() : req.nextUrl.searchParams;
    if (params.get("error")) return failure(req, provider, "cancelled");
    const bindingToken = req.cookies.get(cookiesFor(provider))?.value;
    if (!bindingToken) return failure(req, provider);
    const response = await fetchServerApi(`/v1/auth/oauth/${provider}/callback`, { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: params.get("code"), state: params.get("state"), bindingToken }) });
    if (!response.ok) return failure(req, provider, response.status === 409 ? "existing_account" : "failed");
    const data = await response.json();
    const next = typeof data.nextPath === "string" && (data.nextPath === "/onboarding" || /^\/dashboard(?:\/[A-Za-z0-9_-]+)*\/?$/.test(data.nextPath)) ? data.nextPath : "/dashboard";
    const out = NextResponse.redirect(new URL(next, req.url), 303);
    for (const cookie of response.headers.getSetCookie()) out.headers.append("Set-Cookie", cookie);
    out.cookies.set(cookiesFor(provider), "", { httpOnly: true, path: "/", maxAge: 0, secure: req.nextUrl.protocol === "https:", sameSite: provider === "apple" ? "none" : "lax" });
    out.headers.set("Cache-Control", "no-store");
    out.headers.set("Referrer-Policy", "no-referrer");
    return out;
  } catch { return failure(req, provider); }
}
export const GET = handle;
export const POST = handle;
