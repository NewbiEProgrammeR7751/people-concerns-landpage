/**
 * GET /api/github-activity
 *
 * Server-only proxy for the GitHub Events API. The PAT lives in
 * `process.env.GITHUB_TOKEN` and never crosses the network to the browser —
 * this module must never be imported from anything under `src/`, or Vite will
 * bundle it (and the token reference) into the client build.
 *
 * This is a Web-standard `Request`/`Response` handler, so the same file works
 * unmodified as a Next.js App Router route (`app/api/github-activity/route.ts`),
 * a Vercel/Netlify function, or behind the dev middleware in
 * `vite-plugin-github-activity.ts`.
 */

// Next.js App Router hints — inert in other runtimes.
export const runtime = "nodejs";
export const revalidate = 60;

const GITHUB_API = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

/** How many events to return to the client. */
const RESULT_LIMIT = 4;
/** Events to pull upstream: most are non-Push/Release, so over-fetch to fill the list. */
const UPSTREAM_PER_PAGE = 30;
/** Give up on GitHub rather than hold the hero section hostage. */
const UPSTREAM_TIMEOUT_MS = 5_000;
/** Cache at the CDN: relative timestamps drift by at most this long. */
const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

const MAX_MESSAGE_LENGTH = 96;

export type ActivityEvent = {
  id: string;
  message: string;
  author: string;
  /** Relative time, e.g. "2m ago". */
  timestamp: string;
  /** Original ISO-8601 instant, so clients can re-derive or localize the label. */
  isoTimestamp: string;
  kind: "push" | "release";
};

// ── Upstream shapes (only the fields we actually read) ──────────────────────

type GitHubActor = { login?: string; display_login?: string };

type GitHubEvent = {
  id?: string;
  type?: string;
  created_at?: string;
  actor?: GitHubActor;
  payload?: {
    commits?: Array<{ message?: string }>;
    release?: { name?: string | null; tag_name?: string | null };
  };
};

// ── Formatting ─────────────────────────────────────────────────────────────

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/** "just now" / "2m ago" / "1h ago" / "3d ago" — compact enough for the widget. */
export function toRelativeTime(iso: string, now: number = Date.now()): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "recently";

  const seconds = Math.max(0, Math.round((now - then) / 1000));
  if (seconds < 45) return "just now";
  if (seconds < HOUR) return `${Math.round(seconds / MINUTE)}m ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
  if (seconds < WEEK) return `${Math.floor(seconds / DAY)}d ago`;
  if (seconds < MONTH) return `${Math.floor(seconds / WEEK)}w ago`;
  if (seconds < YEAR) return `${Math.floor(seconds / MONTH)}mo ago`;
  return `${Math.floor(seconds / YEAR)}y ago`;
}

/** First line only, collapsed and clipped — commit bodies would blow out the row. */
function summarize(raw: string): string {
  const firstLine = raw.split("\n", 1)[0].trim().replace(/\s+/g, " ");
  if (firstLine.length <= MAX_MESSAGE_LENGTH) return firstLine;
  return `${firstLine.slice(0, MAX_MESSAGE_LENGTH - 1).trimEnd()}…`;
}

/** Returns null for events we can't render (empty pushes, malformed payloads). */
function normalize(event: GitHubEvent, now: number): ActivityEvent | null {
  const { id, type, created_at: createdAt, actor, payload } = event;
  if (!id || !createdAt) return null;

  const author = actor?.display_login || actor?.login;
  if (!author) return null;

  let message: string | undefined;
  let kind: ActivityEvent["kind"];

  if (type === "PushEvent") {
    // GitHub lists commits oldest-first; the tip commit is the interesting one.
    // Branch creates/deletes arrive as pushes with no commits — skip those.
    const commits = payload?.commits;
    const tip = commits?.[commits.length - 1]?.message;
    if (!tip?.trim()) return null;
    message = summarize(tip);
    kind = "push";
  } else if (type === "ReleaseEvent") {
    const release = payload?.release;
    const label = release?.tag_name || release?.name;
    if (!label?.trim()) return null;
    message = summarize(`Released ${label}`);
    kind = "release";
  } else {
    return null;
  }

  if (!message) return null;

  return {
    id,
    message,
    author,
    timestamp: toRelativeTime(createdAt, now),
    isoTimestamp: new Date(createdAt).toISOString(),
    kind,
  };
}

// ── Responses ──────────────────────────────────────────────────────────────

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

/**
 * Client-facing errors are deliberately generic: upstream bodies and env values
 * never reach the browser. Detail goes to the server log only.
 */
function fail(status: number, code: string, logDetail?: string): Response {
  if (logDetail) console.error(`[github-activity] ${code}: ${logDetail}`);
  return json({ error: code }, status, { "cache-control": "no-store" });
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function GET(_request?: Request): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    const missing = [
      !token && "GITHUB_TOKEN",
      !owner && "GITHUB_OWNER",
      !repo && "GITHUB_REPO",
    ].filter(Boolean);
    return fail(500, "not_configured", `missing env: ${missing.join(", ")}`);
  }

  const url =
    `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}` +
    `/events?per_page=${UPSTREAM_PER_PAGE}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": GITHUB_API_VERSION,
        "user-agent": "people-concerns-activity-widget",
      },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "TimeoutError";
    return fail(
      aborted ? 504 : 502,
      aborted ? "upstream_timeout" : "upstream_unreachable",
      error instanceof Error ? error.message : String(error),
    );
  }

  if (!upstream.ok) {
    // 403 with no remaining quota is the rate limit; 403 otherwise is a scope problem.
    const remaining = upstream.headers.get("x-ratelimit-remaining");
    const rateLimited =
      upstream.status === 429 || (upstream.status === 403 && remaining === "0");

    if (rateLimited) return fail(429, "rate_limited", `reset=${upstream.headers.get("x-ratelimit-reset")}`);
    if (upstream.status === 401) return fail(502, "bad_credentials", "GITHUB_TOKEN rejected by GitHub");
    if (upstream.status === 404) return fail(502, "repo_not_found", `${owner}/${repo} not visible to this token`);
    return fail(502, "upstream_error", `status ${upstream.status}`);
  }

  let events: unknown;
  try {
    events = await upstream.json();
  } catch (error) {
    return fail(502, "invalid_upstream_body", error instanceof Error ? error.message : String(error));
  }

  if (!Array.isArray(events)) {
    return fail(502, "invalid_upstream_body", "expected an array of events");
  }

  const now = Date.now();
  const activity: ActivityEvent[] = [];
  for (const event of events as GitHubEvent[]) {
    const normalized = normalize(event, now);
    if (normalized) activity.push(normalized);
    if (activity.length === RESULT_LIMIT) break;
  }

  return json({ events: activity }, 200, { "cache-control": CACHE_CONTROL });
}

// Vercel/Netlify function default export (Web handler signature).
export default GET;
