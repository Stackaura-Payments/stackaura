"use client";

import { useEffect, useState } from "react";

const messages: Record<string, string> = {
  failed: "Social sign-in could not be completed. Please try again or use email and password.",
  cancelled: "Social sign-in was cancelled.",
  unavailable: "This sign-in provider is not available yet. Use email and password.",
  existing_account: "An account already uses this email. Sign in with your existing method. Accounts are not linked automatically.",
};

export default function SocialSignIn({ nextPath = "/dashboard", errorCode }: { nextPath?: string; errorCode?: string }) {
  const [providers, setProviders] = useState({ google: false, apple: false });
  const error = messages[errorCode ?? ""] ?? "";
  useEffect(() => {
    let active = true;
    fetch("/api/auth/oauth/providers", { cache: "no-store" }).then((res) => res.json()).then((data) => { if (active) setProviders({ google: data.google === true, apple: data.apple === true && window.location.protocol === "https:" }); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return <div className="my-6 space-y-3">
    <div className="grid gap-3 sm:grid-cols-2">
      {(["google", "apple"] as const).map((provider) => providers[provider] ? <a key={provider} href={`/api/auth/oauth/${provider}/start?next=${encodeURIComponent(nextPath)}`} className="inline-flex min-h-12 items-center justify-center rounded border border-[#4d7167] px-3 py-2 text-center text-sm font-semibold text-[#edf6ef] hover:bg-[#25413d] focus-visible:outline-2 focus-visible:outline-[#c7f572]">Continue with {provider === "google" ? "Google" : "Apple"}</a> : <button key={provider} disabled title="Provider setup is pending" className="min-h-12 rounded border border-[#4d7167] px-3 py-2 text-sm text-[#a4b8af] disabled:cursor-not-allowed">{provider === "google" ? "Google" : "Apple"} unavailable</button>)}
    </div>
    {error ? <p role="alert" className="text-sm text-rose-300">{error}</p> : null}
    <div className="flex items-center gap-3 text-sm text-[#b1c5bb]"><span className="h-px flex-1 bg-[#35564e]" />Or continue with email<span className="h-px flex-1 bg-[#35564e]" /></div>
  </div>;
}
