import { redirect } from "next/navigation";

import { getServerMeSafe } from "../lib/auth";
import LoginClient from "./login-client";

type LoginSearchParams = Promise<{
  created?: string | string[];
  email?: string | string[];
  next?: string | string[];
}>;

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function resolveSafeNextPath(value: string | undefined) {
  if (!value) {
    return null;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: LoginSearchParams;
}) {
  const resolvedSearchParams = await searchParams;

  const created = getSearchValue(resolvedSearchParams.created) === "1";
  const email = getSearchValue(resolvedSearchParams.email) || "";
  const next = resolveSafeNextPath(
    getSearchValue(resolvedSearchParams.next),
  );

  const me = await getServerMeSafe();

  if (me) {
    redirect(next || "/dashboard");
  }

  return (
    <LoginClient
      accountCreated={created}
      createdEmail={email}
      nextPath={next || undefined}
    />
  );
}
