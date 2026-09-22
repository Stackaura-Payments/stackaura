import { NextRequest, NextResponse } from "next/server";

import { fetchServerApi } from "@/app/lib/server-api";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "content-type",
  "x-request-id",
];

const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "cache-control",
];

async function proxyJarvisRequest(
  req: NextRequest,
  context: RouteContext,
) {
  const { path } = await context.params;

  if (!path?.length) {
    return NextResponse.json(
      { message: "JARVIS API path is required." },
      { status: 400 },
    );
  }

  const upstreamPath = `/v1/jarvis/${path.join("/")}`;

  const headers = new Headers();

  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers.get(name);

    if (value) {
      headers.set(name, value);
    }
  }

  // The browser's JARVIS session cookie belongs to the JARVIS host.
  // Forward it server-side to the backend; never expose it to the client.
  const cookie = req.headers.get("cookie");

  if (cookie) {
    headers.set("cookie", cookie);
  }

  let upstream: Response;

  try {
    upstream = await fetchServerApi(upstreamPath, {
      method: req.method,
      headers,
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : await req.arrayBuffer(),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "JARVIS backend unavailable. Please try again shortly.",
      },
      { status: 503 },
    );
  }

  const responseBody = await upstream.arrayBuffer();

  const response = new NextResponse(responseBody, {
    status: upstream.status,
  });

  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);

    if (value) {
      response.headers.set(name, value);
    }
  }

  return response;
}

export async function GET(
  req: NextRequest,
  context: RouteContext,
) {
  return proxyJarvisRequest(req, context);
}

export async function POST(
  req: NextRequest,
  context: RouteContext,
) {
  return proxyJarvisRequest(req, context);
}

export async function PUT(
  req: NextRequest,
  context: RouteContext,
) {
  return proxyJarvisRequest(req, context);
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  return proxyJarvisRequest(req, context);
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext,
) {
  return proxyJarvisRequest(req, context);
}
