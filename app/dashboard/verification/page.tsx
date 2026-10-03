import { redirect } from "next/navigation";
import { getSelectedMerchantWorkspace } from "../console-data";
import BusinessProfileForm from "./profile-form";

export default async function VerificationPage() {
  const workspace = await getSelectedMerchantWorkspace();
  if (!workspace) redirect("/login");
  if (!workspace.selectedMerchantId) redirect("/onboarding");
  return <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
    <div className="mb-6"><p className="console-eyebrow">Business verification</p><h1 className="mt-2 text-2xl font-semibold">Registered business profile</h1><p className="console-muted mt-3 text-sm leading-6">{workspace.selectedMerchantName}</p></div>
    <BusinessProfileForm key={workspace.selectedMerchantId} merchantId={workspace.selectedMerchantId} canEdit={workspace.selectedMembership?.role === "OWNER"} />
  </div>;
}
