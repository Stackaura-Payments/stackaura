import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_PERSISTED_QUERY_KEYS = ["host", "shop", "id_token", "session"] as const;
const JARVIS_HOST = "jarvis.stackaura.co.za";

function isEmbeddedShopifyEntry(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  return (
    params.get("embedded") === "1" ||
    params.has("host") ||
    params.has("id_token") ||
    params.has("session")
  );
}

function createShopifyEmbeddedQueryString(searchParams: URLSearchParams) {
  const normalizedParams = new URLSearchParams();

  for (const key of SHOPIFY_PERSISTED_QUERY_KEYS) {
    const value = searchParams.get(key)?.trim();

    if (value) {
      normalizedParams.set(key, value);
    }
  }

  const serialized = normalizedParams.toString();

  return serialized ? `?${serialized}` : "";
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const hostname = request.nextUrl.hostname.toLowerCase();

  // Private JARVIS hostname:
  // https://jarvis.stackaura.co.za/
  // internally renders the dedicated /jarvis application.
  if (hostname === JARVIS_HOST) {
    const jarvisUrl = request.nextUrl.clone();
    jarvisUrl.pathname = "/jarvis";
    return NextResponse.rewrite(jarvisUrl);
  }

  // Preserve the existing Shopify embedded app entry behavior.
  if (!isEmbeddedShopifyEntry(request)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/shopify";
  redirectUrl.search = createShopifyEmbeddedQueryString(
    request.nextUrl.searchParams,
  );

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/"],
};
