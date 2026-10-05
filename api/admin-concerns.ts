/**
 * GET   /api/admin-concerns  → newest concerns, with contact details
 * PATCH /api/admin-concerns  → { reference, status?, note? } updates one
 *
 * Used by the /admin page. Every request carries `Authorization: Bearer
 * <ADMIN_PASSWORD>`; without that env var set the route refuses everything.
 */

import { timingSafeEqual, createHash } from "node:crypto";
import { clientIp, fail, isReference, json } from "./_lib/http.js";
import { foreignOrigin, overLimit, tooLarge } from "./_lib/guard.js";
import {
  CONCERN_STATUSES,
  listConcerns,
  storeConfigured,
  updateConcern,
  type ConcernStatus,
} from "./_lib/concern-store.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "admin-concerns";
const LIST_LIMIT = 200;
const NOTE_LIMIT = 1_000;

/** Failed sign-ins allowed per IP before it is locked out. Only failures count. */
const FAILED_AUTH = { max: 10, windowSeconds: 15 * 60 } as const;

/** Null when authorised, otherwise the response to return. */
async function authorise(request: Request): Promise<Response | null> {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return fail(ROUTE, 500, "not_configured", "ADMIN_PASSWORD unset");
  if (!storeConfigured()) return fail(ROUTE, 500, "not_configured", "KV_REST_API_URL / KV_REST_API_TOKEN unset");

  const ip = clientIp(request);
  if (foreignOrigin(request)) return fail(ROUTE, 403, "forbidden_origin", `origin=${request.headers.get("origin")}`);
  if (tooLarge(request, 8 * 1024)) return fail(ROUTE, 413, "too_large");
  // Checked before the password, so a correct guess cannot get through a lockout.
  if (await overLimit("admin-fail", ip, FAILED_AUTH.max, FAILED_AUTH.windowSeconds, { increment: false })) {
    return fail(ROUTE, 429, "rate_limited", `locked ip=${ip}`);
  }

  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  // Hash both sides so the comparison is constant-time regardless of length.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (timingSafeEqual(digest(supplied), digest(password))) return null;

  await overLimit("admin-fail", ip, FAILED_AUTH.max, FAILED_AUTH.windowSeconds);
  return fail(ROUTE, 401, "unauthorised", `ip=${ip}`);
}

export async function GET(request: Request): Promise<Response> {
  const denied = await authorise(request);
  if (denied) return denied;

  try {
    const concerns = (await listConcerns(LIST_LIMIT)).map(({ tokenHash: _tokenHash, ...rest }) => rest);
    return json({ concerns }, 200);
  } catch (error) {
    return fail(ROUTE, 502, "store_error", error instanceof Error ? error.message : String(error));
  }
}

export async function PATCH(request: Request): Promise<Response> {
  const denied = await authorise(request);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null) return fail(ROUTE, 400, "invalid_body");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(ROUTE, 400, "invalid_body");
  }

  if (!isReference(body.reference)) return fail(ROUTE, 400, "invalid_fields");
  const status = body.status === undefined ? undefined : body.status;
  if (status !== undefined && !CONCERN_STATUSES.includes(status as ConcernStatus)) {
    return fail(ROUTE, 400, "invalid_fields");
  }
  const note = body.note === undefined ? undefined : body.note;
  if (note !== undefined && (typeof note !== "string" || note.length > NOTE_LIMIT)) {
    return fail(ROUTE, 400, "invalid_fields");
  }

  try {
    const record = await updateConcern(
      body.reference,
      { status: status as ConcernStatus | undefined, note: (note as string | undefined)?.trim() },
      new Date(),
    );
    if (!record) return fail(ROUTE, 404, "not_found");
    const { tokenHash: _tokenHash, ...rest } = record;
    return json({ concern: rest }, 200);
  } catch (error) {
    return fail(ROUTE, 502, "store_error", error instanceof Error ? error.message : String(error));
  }
}

// No default export: Vercel would treat it as a legacy (req, res) handler and hang.
