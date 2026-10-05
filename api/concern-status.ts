/**
 * POST /api/concern-status
 *
 * Lets a member look up their concern from the "Track your concern" section.
 * Body is either `{ reference, token }` (the link in the confirmation email) or
 * `{ reference, email }` (typed in by hand). Every mismatch returns the same 404,
 * so the endpoint cannot be used to learn which references exist.
 *
 * Returns only status, dates and the team's note — never contact details.
 */

import { clientIp, fail, isReference, json } from "./_lib/http.js";
import { findByEmail, findByToken, storeConfigured, toPublic } from "./_lib/concern-store.js";
import { foreignOrigin, overLimit, tooLarge, verifyCaptcha } from "./_lib/guard.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "concern-status";
const IP_LIMIT = { max: 20, windowSeconds: 10 * 60 } as const;

export async function POST(request: Request): Promise<Response> {
  if (!storeConfigured()) return fail(ROUTE, 500, "not_configured", "KV_REST_API_URL / KV_REST_API_TOKEN unset");
  const ip = clientIp(request);
  if (foreignOrigin(request)) return fail(ROUTE, 403, "forbidden_origin", `origin=${request.headers.get("origin")}`);
  if (tooLarge(request, 8 * 1024)) return fail(ROUTE, 413, "too_large");
  if (await overLimit("track-ip", ip, IP_LIMIT.max, IP_LIMIT.windowSeconds)) return fail(ROUTE, 429, "rate_limited", `ip=${ip}`);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null) return fail(ROUTE, 400, "invalid_body");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(ROUTE, 400, "invalid_body");
  }

  const reference = typeof body.reference === "string" ? body.reference.trim().toUpperCase() : "";
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isReference(reference) || (!token && !email) || token.length > 100 || email.length > 254) {
    return fail(ROUTE, 400, "invalid_fields");
  }

  // The emailed token is unguessable on its own. A reference + email lookup is
  // what someone would script to probe for concerns, so that path needs a
  // passing reCAPTCHA as well.
  if (!token) {
    const captcha = await verifyCaptcha(body.captchaToken, "track", ip);
    if (!captcha.ok) return fail(ROUTE, 403, "captcha_failed", `ip=${ip} ${captcha.reason}`);
  }

  try {
    const record = token ? await findByToken(reference, token) : await findByEmail(reference, email);
    if (!record) return fail(ROUTE, 404, "not_found");
    return json({ concern: toPublic(record) }, 200);
  } catch (error) {
    return fail(ROUTE, 502, "store_error", error instanceof Error ? error.message : String(error));
  }
}

// No default export: Vercel would treat it as a legacy (req, res) handler and hang.
