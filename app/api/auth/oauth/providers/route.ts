import { NextResponse } from "next/server";
import { fetchServerApi } from "@/app/lib/server-api";

export async function GET() {
  try {
    const response = await fetchServerApi("/v1/auth/oauth/providers", { cache: "no-store" });
    if (!response.ok) throw new Error("Providers unavailable");
    const data = await response.json();
    return NextResponse.json({ google: data.google === true, apple: data.apple === true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ google: false, apple: false }, { headers: { "Cache-Control": "no-store" } });
  }
}
