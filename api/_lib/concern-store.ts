/**
 * Persistence for concerns submitted through the contact form, so a member can
 * follow its status and the team can update it from /admin.
 *
 * Backed by Upstash Redis over its REST API, called with `fetch` so there is no
 * SDK dependency. Vercel's Upstash integration sets KV_REST_API_URL and
 * KV_REST_API_TOKEN; the UPSTASH_REDIS_REST_* names are accepted too.
 *
 * The leading underscore keeps Vercel from deploying this folder as a route.
 * Server-only: never import it from anything under `src/`.
 *
 * Layout:
 *   concern:<reference>  JSON ConcernRecord
 *   concerns:index       sorted set of references, scored by submission time
 */

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { pipeline, storeConfigured } from "./redis.js";

export { storeConfigured };

export const CONCERN_STATUSES = ["received", "in_review", "replied", "closed"] as const;
export type ConcernStatus = (typeof CONCERN_STATUSES)[number];

export type ConcernRecord = {
  reference: string;
  /** SHA-256 of the tracking token emailed to the member; the token itself is never stored. */
  tokenHash: string;
  createdAt: string;
  updatedAt: string;
  status: ConcernStatus;
  /** Shown to the member on the tracking section. Empty when there is nothing to say. */
  note: string;
  history: { status: ConcernStatus; at: string }[];
  name: string;
  email: string;
  phone: string;
  projectType: string | null;
  message: string;
  lang: "en" | "ar";
};

/** What the member may see. No contact details: the reference alone must not reveal who wrote in. */
export type PublicConcern = Pick<
  ConcernRecord,
  "reference" | "createdAt" | "updatedAt" | "status" | "note" | "history" | "projectType"
>;

const INDEX_KEY = "concerns:index";

const recordKey = (reference: string) => `concern:${reference}`;
function parseRecord(raw: unknown): ConcernRecord | null {
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as ConcernRecord;
  } catch {
    return null;
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Constant-time comparison of two equal-format hex digests. */
function sameHash(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function toPublic(record: ConcernRecord): PublicConcern {
  const { reference, createdAt, updatedAt, status, note, history, projectType } = record;
  return { reference, createdAt, updatedAt, status, note, history, projectType };
}

/**
 * Saves a new concern under the first reference `makeReference` yields that is
 * not already taken, and returns it with the one-time tracking token for the email.
 */
export async function createConcern(
  fields: Pick<ConcernRecord, "name" | "email" | "phone" | "projectType" | "message" | "lang">,
  now: Date,
  makeReference: (now: Date) => string,
): Promise<{ reference: string; token: string }> {
  const token = randomBytes(18).toString("base64url");
  const at = now.toISOString();

  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = makeReference(now);
    const record: ConcernRecord = {
      reference,
      tokenHash: hashToken(token),
      createdAt: at,
      updatedAt: at,
      status: "received",
      note: "",
      history: [{ status: "received", at }],
      ...fields,
    };

    // NX: a clash on the random suffix retries with a new reference rather than
    // overwriting someone else's concern.
    const [set] = await pipeline([["SET", recordKey(reference), JSON.stringify(record), "NX"]]);
    if (set !== "OK") continue;

    await pipeline([["ZADD", INDEX_KEY, now.getTime(), reference]]);
    return { reference, token };
  }

  throw new Error("could not allocate a unique reference");
}

/** Best-effort undo for a concern whose confirmation email never went out. */
export async function deleteConcern(reference: string): Promise<void> {
  await pipeline([
    ["DEL", recordKey(reference)],
    ["ZREM", INDEX_KEY, reference],
  ]);
}

export async function getConcern(reference: string): Promise<ConcernRecord | null> {
  const [raw] = await pipeline([["GET", recordKey(reference)]]);
  return parseRecord(raw);
}

/** Finds a concern by the token from the email link. Null on any mismatch. */
export async function findByToken(reference: string, token: string): Promise<ConcernRecord | null> {
  const record = await getConcern(reference);
  if (!record || !sameHash(record.tokenHash, hashToken(token))) return null;
  return record;
}

/** Finds a concern by reference plus the email it was submitted with. Null on any mismatch. */
export async function findByEmail(reference: string, email: string): Promise<ConcernRecord | null> {
  const record = await getConcern(reference);
  if (!record || record.email.trim().toLowerCase() !== email.trim().toLowerCase()) return null;
  return record;
}

/** Newest first. */
export async function listConcerns(limit: number): Promise<ConcernRecord[]> {
  const [references] = await pipeline([["ZRANGE", INDEX_KEY, 0, limit - 1, "REV"]]);
  if (!Array.isArray(references) || references.length === 0) return [];

  const [raws] = await pipeline([["MGET", ...references.map((ref) => recordKey(String(ref)))]]);
  return (Array.isArray(raws) ? raws : []).map(parseRecord).filter((r): r is ConcernRecord => r !== null);
}

/** Applies a status and/or note change. A status change is appended to the history. */
export async function updateConcern(
  reference: string,
  change: { status?: ConcernStatus; note?: string },
  now: Date,
): Promise<ConcernRecord | null> {
  const record = await getConcern(reference);
  if (!record) return null;

  const at = now.toISOString();
  if (change.status && change.status !== record.status) {
    record.status = change.status;
    record.history.push({ status: change.status, at });
  }
  if (change.note !== undefined) record.note = change.note;
  record.updatedAt = at;

  await pipeline([["SET", recordKey(reference), JSON.stringify(record), "XX"]]);
  return record;
}
