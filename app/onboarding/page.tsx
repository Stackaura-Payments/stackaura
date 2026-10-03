import { redirect } from "next/navigation";
import { getServerMe } from "../lib/auth";
import { AuthFormFrame, AuthShell } from "../components/stackaura-auth";
import WorkspaceForm from "./workspace-form";

export default async function OnboardingPage() {
  const me = await getServerMe();
  if (!me) redirect("/login");
  if (me.memberships.length) redirect("/dashboard");
  return <AuthShell eyebrow="Merchant onboarding" title="Set up your business workspace." description="Your sign-in is complete. Add your business details to begin merchant onboarding." features={[]}>
    <AuthFormFrame eyebrow="Business details" title="Create a workspace" description="Business verification and payment-provider approval are separate from account sign-in." status="Setup required" statusTone="muted">
      <WorkspaceForm email={me.user.email} />
    </AuthFormFrame>
  </AuthShell>;
}
