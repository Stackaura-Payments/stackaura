"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Save, Send, RotateCw } from "lucide-react";

const fields = [
  { key: "legalName", label: "Registered legal name", max: 200, autoComplete: "organization" },
  { key: "registrationNumber", label: "Company registration number", max: 80 },
  { key: "country", label: "Country code", max: 2 },
  { key: "representativeName", label: "Authorized representative", max: 200, autoComplete: "name" },
  { key: "businessAddress", label: "Registered business address", max: 500, autoComplete: "street-address" },
  { key: "businessActivity", label: "Business activity", max: 500 },
] as const;
type Profile = Record<(typeof fields)[number]["key"], string>;
const blank: Profile = { legalName: "", registrationNumber: "", country: "ZA", representativeName: "", businessAddress: "", businessActivity: "" };
const statuses: Record<string, string> = { DRAFT: "Draft", SUBMITTED: "Submitted - not yet verified", UNDER_REVIEW: "Under review", VERIFIED: "Verified", ACTION_REQUIRED: "Changes required" };

export default function BusinessProfileForm({ merchantId, canEdit }: { merchantId: string; canEdit: boolean }) {
  const [profile, setProfile] = useState<Profile>(blank);
  const [status, setStatus] = useState("DRAFT");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const path = `/api/proxy/v1/merchants/${encodeURIComponent(merchantId)}/business-verification`;
  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(path, { cache: "no-store", signal });
      const data = await res.json();
      if (!res.ok) throw new Error("Business profile is unavailable. Please try again.");
      if (signal?.aborted) return;
      setProfile(data.profile ? Object.fromEntries(fields.map(({ key }) => [key, data.profile[key] ?? ""])) as Profile : blank);
      setStatus(data.profile?.status ?? "DRAFT"); setReady(true); setError("");
    } catch (err) { if (!signal?.aborted) setError(err instanceof Error ? err.message : "Unable to load profile."); }
  }, [path]);
  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load]);
  const editable = ready && canEdit && ["DRAFT", "ACTION_REQUIRED"].includes(status);
  async function save(submit: boolean) {
    if (busy || !editable) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const res = await fetch(`${path}${submit ? "/submit" : ""}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.message === "string" ? data.message : "Unable to save profile.");
      setStatus(data.status); setMessage(submit ? "Business profile submitted. Your business has not been verified." : "Draft saved.");
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setBusy(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void save(true); }
  return <section className="console-panel p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Business details</h2><span className="console-status console-status-muted">{ready ? statuses[status] ?? "Status unavailable" : "Loading"}</span></div>
    <p className="console-muted mt-4 text-sm leading-6">Automated company and identity checks are not connected yet. Submitting this profile records your details only; it does not approve your business or replace payment-provider onboarding. Do not include identity numbers, bank details, or documents.</p>
    {!canEdit ? <p className="console-muted mt-3 text-sm">Only the workspace owner can edit this profile.</p> : null}
    <form onSubmit={submit} className="mt-6 space-y-5">
      <fieldset disabled={!editable || busy} className="grid min-w-0 gap-5 sm:grid-cols-2">
        {fields.map((field) => <label key={field.key} className={`min-w-0 ${["businessAddress", "businessActivity"].includes(field.key) ? "sm:col-span-2" : ""}`}><span className="mb-2 block text-sm font-medium">{field.label}</span><input required maxLength={field.max} autoComplete={"autoComplete" in field ? field.autoComplete : "off"} pattern={field.key === "country" ? "[A-Za-z]{2}" : undefined} value={profile[field.key]} onChange={(event) => setProfile({ ...profile, [field.key]: event.target.value })} className="console-input w-full min-w-0" /></label>)}
      </fieldset>
      {error ? <p role="alert" className="text-sm text-red-700 dark:text-rose-300">{error}</p> : null}
      {message ? <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p> : null}
      <div className="flex flex-wrap gap-3">
        {editable ? <><button type="button" disabled={busy} onClick={() => void save(false)} className="console-button console-button-secondary inline-flex items-center gap-2"><Save size={16} aria-hidden="true" />Save draft</button><button disabled={busy} className="console-button console-button-primary inline-flex items-center gap-2"><Send size={16} aria-hidden="true" />{busy ? "Saving..." : "Submit business profile"}</button></> : null}
        {!ready && error ? <button type="button" onClick={() => void load()} className="console-button console-button-secondary inline-flex items-center gap-2"><RotateCw size={16} aria-hidden="true" />Retry</button> : null}
      </div>
    </form>
  </section>;
}
