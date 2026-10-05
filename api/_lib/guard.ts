/**
 * Anti-abuse checks shared by the public routes:
 *
 *  - rate limits kept in Redis, so they hold across serverless instances and
 *    cold starts (falls back to per-instance memory if Redis is unavailable)
 *  - reCAPTCHA v3 verification
 *  - an Origin check, so other sites cannot post to our forms from a browser
 *  - a request size cap
 */

import { createHash } from "node:crypto";
import { company } from "../../src/content/company.js";
import { pipeline, storeConfigured } from "./redis.js";

// ── Rate limiting ──────────────────────────────────────────────────────────

/** Per-instance fallback for when Redis is not configured or not reachable. */
const memory = new Map<string, { window: number; count: number }>();

/**
 * Fixed-window counter. Returns true once `key` has been counted more than
 * `max` times in the current `windowSeconds` window for this `bucket`.
 *
 * With `increment: false` it only reads the count — used to lock out an IP
 * before checking a password, so a correct guess cannot slip through a lockout.
 *
 * Keys are hashed before storage, so raw IPs and email addresses never land in
 * Redis.
 */
export async function overLimit(
  bucket: string,
  key: string,
  max: number,
  windowSeconds: number,
  { increment = true }: { increment?: boolean } = {},
): Promise<boolean> {
  const hashed = createHash("sha256").update(`${bucket}:${key.toLowerCase()}`).digest("hex").slice(0, 32);
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const redisKey = `rl:${bucket}:${hashed}:${window}`;

  if (storeConfigured()) {
    try {
      const [count] = await pipeline(
        increment
          ? [
              ["INCR", redisKey],
              ["EXPIRE", redisKey, windowSeconds],
            ]
          : [["GET", redisKey]],
      );
      return Number(count ?? 0) > max - (increment ? 0 : 1);
    } catch (error) {
      console.error(`[guard] rate limit store failed, using memory: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const entry = memory.get(redisKey) ?? { window, count: 0 };
  if (increment) entry.count++;
  memory.set(redisKey, entry);
  if (memory.size > 5_000) {
    for (const [k, v] of memory) if (v.window !== window) memory.delete(k);
  }
  return entry.count > max - (increment ? 0 : 1);
}

// ── Origin and size ────────────────────────────────────────────────────────

/** The site's own hosts: the configured origin, its www / bare twin, and local dev. */
function allowedHosts(): Set<string> {
  const hosts = new Set(["localhost", "127.0.0.1"]);
  try {
    const host = new URL(process.env.PUBLIC_SITE_URL?.trim() || company.websiteUrl).hostname;
    const bare = host.replace(/^www\./, "");
    hosts.add(bare);
    hosts.add(`www.${bare}`);
  } catch {
    // An invalid PUBLIC_SITE_URL is reported by the route that needs it.
  }
  return hosts;
}

/**
 * Browsers always send Origin on a POST/PATCH from `fetch`. A foreign Origin
 * means another site is trying to use our form; reject it. A missing Origin
 * (curl, server-to-server) is left to reCAPTCHA and the rate limits.
 */
export function foreignOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return !allowedHosts().has(new URL(origin).hostname);
  } catch {
    return true;
  }
}

/** True when the declared body is larger than `maxBytes`. */
export function tooLarge(request: Request, maxBytes: number): boolean {
  const length = Number(request.headers.get("content-length") ?? 0);
  return Number.isFinite(length) && length > maxBytes;
}

// ── reCAPTCHA v3 ───────────────────────────────────────────────────────────

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const VERIFY_TIMEOUT_MS = 5_000;
const DEFAULT_MIN_SCORE = 0.5;

/** `reason` is set when `ok` is false; `score` is null when verification was skipped. */
export type CaptchaResult = { ok: boolean; score?: number | null; reason?: string };

type VerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

/**
 * Verifies a reCAPTCHA v3 token for `expectedAction`.
 *
 * With RECAPTCHA_SECRET_KEY unset this passes everything, so the site keeps
 * working until the keys are configured. If Google itself is unreachable it
 * also passes (logged): losing a real enquiry is worse than letting one
 * request through on the rate limits alone.
 */
export async function verifyCaptcha(token: unknown, expectedAction: string, ip: string): Promise<CaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) return { ok: true, score: null };

  if (typeof token !== "string" || !token || token.length > 4_000) return { ok: false, reason: "missing_token" };

  let result: VerifyResponse;
  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(ip !== "unknown" ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`siteverify status ${response.status}`);
    result = (await response.json()) as VerifyResponse;
  } catch (error) {
    console.error(`[guard] captcha verify unavailable, allowing: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: true, score: null };
  }

  if (!result.success) return { ok: false, reason: `rejected:${(result["error-codes"] ?? []).join(",")}` };
  if (result.action !== expectedAction) return { ok: false, reason: `action:${result.action}` };
  if (result.hostname && !allowedHosts().has(result.hostname)) return { ok: false, reason: `hostname:${result.hostname}` };

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE) || DEFAULT_MIN_SCORE;
  const score = typeof result.score === "number" ? result.score : 0;
  if (score < minScore) return { ok: false, reason: `score:${score}` };

  return { ok: true, score };
}
