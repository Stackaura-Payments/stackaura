"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { publicFieldLabelClass, publicInputClass } from "../components/stackaura-ui";

export default function WorkspaceForm({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/proxy/v1/auth/workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessName: name }) });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.message === "string" ? data.message : "Workspace could not be created.");
      window.location.assign("/dashboard/verification");
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); setBusy(false); }
  }
  return <form onSubmit={submit} className="mt-6 space-y-5">
    <p className="break-all text-sm text-[#b9cbc3]">Signed in as {email}</p>
    <label className="block"><span className={publicFieldLabelClass}>Business name</span><input className={`${publicInputClass} mt-2`} autoComplete="organization" required minLength={2} maxLength={200} value={name} onChange={(event) => setName(event.target.value)} disabled={busy} /></label>
    {error ? <p role="alert" className="text-sm text-rose-300">{error}</p> : null}
    <button disabled={busy} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#c7f572] px-4 py-3 font-semibold text-[#0d1b20] disabled:opacity-60">{busy ? "Creating workspace..." : "Create workspace"}<ArrowRight size={18} aria-hidden="true" /></button>
    <p className="text-sm leading-6 text-[#b9cbc3]">Your workspace starts inactive. This step does not approve your business or enable live payments.</p>
  </form>;
}
