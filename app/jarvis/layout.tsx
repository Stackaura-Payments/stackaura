import type { ReactNode } from "react";
import { redirect, notFound } from "next/navigation";
import { cookies, headers } from "next/headers";

import { getServerMe } from "../lib/auth";

export const metadata = {
  title: "J.A.R.V.I.S. — Stackaura",
  description: "Private Stackaura owner operations cockpit.",
};

async function getSameOriginUrl(path: string) {
  const requestHeaders = await headers();

  const forwardedProto =
    requestHeaders.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "development" ? "http" : "https");

  const forwardedHost =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host");

  if (!forwardedHost) {
    throw new Error("JARVIS request host is unavailable");
  }

  return `${forwardedProto}://${forwardedHost}${path}`;
}

async function verifyJarvisAccess() {
  const cookieHeader = (await cookies()).toString();
  const url = await getSameOriginUrl("/api/jarvis/status");

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      return "unauthenticated" as const;
    }

    if (res.status === 403) {
      return "forbidden" as const;
    }

    if (!res.ok) {
      throw new Error(`JARVIS authorization failed: ${res.status}`);
    }

    const body = await res.json();

    if (body?.authenticated === true && body?.authorized === true) {
      return "authorized" as const;
    }

    return "forbidden" as const;
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.name === "AbortError" ||
        error.name === "TimeoutError" ||
        /fetch failed/i.test(error.message) ||
        /econnrefused/i.test(error.message) ||
        /enotfound/i.test(error.message)
      )
    ) {
      throw new Error("JARVIS authorization service unavailable");
    }

    throw error;
  }
}

export default async function JarvisLayout({
  children,
}: {
  children: ReactNode;
}) {
  const me = await getServerMe();

  if (!me) {
    redirect("/login?next=/jarvis");
  }

  const access = await verifyJarvisAccess();

  if (access === "unauthenticated") {
    redirect("/login?next=/jarvis");
  }

  if (access === "forbidden") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      {children}
    </main>
  );
}
