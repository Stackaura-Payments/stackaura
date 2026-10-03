import assert from "node:assert/strict";
import test from "node:test";
import { isSameOriginRequest } from "./request-origin.ts";

test("accepts actual browser host even when Next normalizes its internal URL", () => {
  assert.equal(isSameOriginRequest({ url: "http://localhost:4181/api/proxy/v1/auth/workspace", headers: new Headers({ origin: "http://127.0.0.1:4181", host: "127.0.0.1:4181" }) }), true);
});
test("accepts HTTPS through the deployment proxy", () => {
  assert.equal(isSameOriginRequest({ url: "http://internal/api/proxy", headers: new Headers({ origin: "https://stackaura.co.za", host: "stackaura.co.za", "x-forwarded-proto": "https" }) }), true);
});
test("rejects cross-site, missing, null, malformed and cross-protocol origins", () => {
  for (const origin of [undefined, "null", "https://evil.example", "http://stackaura.co.za", "https://stackaura.co.za/path", "https://user@stackaura.co.za", "https://stackaura.co.za:444"]) {
    const headers = new Headers({ host: "stackaura.co.za", "x-forwarded-proto": "https" });
    if (origin) headers.set("origin", origin);
    assert.equal(isSameOriginRequest({ url: "http://internal/api/proxy", headers }), false);
  }
});
