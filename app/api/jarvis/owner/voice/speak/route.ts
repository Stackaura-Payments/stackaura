import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { fetchServerApi, isBackendUnavailableError } from "@/app/lib/server-api";

const FISH_TTS_URL = "https://api.fish.audio/v1/tts";
const DEFAULT_VOICE_ID = "686905bc7bca40829e6ccf0971948b5f";
const DEFAULT_MODEL = "s2.1-pro-free";
const MAX_TEXT_LENGTH = 6000;

async function requireJarvisOwner() {
  const cookieHeader = (await cookies()).toString();

  let response: Response;
  try {
    response = await fetchServerApi("/v1/jarvis/status", {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    if (isBackendUnavailableError(error)) {
      return { ok: false as const, status: 503, message: "JARVIS authorization service unavailable." };
    }

    return { ok: false as const, status: 503, message: "JARVIS authorization failed." };
  }

  if (response.status === 401) {
    return { ok: false as const, status: 401, message: "JARVIS authentication required." };
  }

  if (response.status === 403) {
    return { ok: false as const, status: 403, message: "JARVIS owner access required." };
  }

  if (!response.ok) {
    return { ok: false as const, status: 503, message: "JARVIS authorization service unavailable." };
  }

  const body = await response.json().catch(() => null);

  if (body?.authenticated !== true || body?.authorized !== true) {
    return { ok: false as const, status: 403, message: "JARVIS owner access required." };
  }

  return { ok: true as const };
}

export async function POST(req: NextRequest) {
  const authorization = await requireJarvisOwner();

  if (!authorization.ok) {
    return NextResponse.json(
      { message: authorization.message },
      { status: authorization.status },
    );
  }

  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json(
      { message: "Speech text is required." },
      { status: 400 },
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { message: "Speech text exceeds " + MAX_TEXT_LENGTH + "-character limit." },
      { status: 413 },
    );
  }

  const apiKey = process.env.FISH_AUDIO_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json(
      { message: "Fish Audio integration is not configured." },
      { status: 503 },
    );
  }

  const referenceId =
    process.env.JARVIS_FISH_VOICE_ID?.trim() || DEFAULT_VOICE_ID;
  const model =
    process.env.JARVIS_FISH_MODEL?.trim() || DEFAULT_MODEL;

  let fishResponse: Response;

  try {
    fishResponse = await fetch(FISH_TTS_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
        model,
      },
      body: JSON.stringify({
        text,
        reference_id: referenceId,
        format: "mp3",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "TimeoutError"
        ? "Fish Audio speech synthesis timed out."
        : "Fish Audio speech synthesis is unavailable.";

    return NextResponse.json({ message }, { status: 502 });
  }

  if (!fishResponse.ok) {
    const detail = await fishResponse.text().catch(() => "");
    return NextResponse.json(
      {
        message: "Fish Audio speech synthesis failed (" + fishResponse.status + ").",
        providerStatus: fishResponse.status,
        detail: detail.slice(0, 1000),
      },
      { status: 502 },
    );
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    fishResponse.headers.get("content-type") || "audio/mpeg",
  );
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  const contentLength = fishResponse.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(fishResponse.body, {
    status: 200,
    headers,
  });
}
