/**
 * GET /api/github-activity
 *
 * Server-only proxy for recent GitHub activity. The PAT lives in
 * `process.env.GITHUB_TOKEN` and never crosses the network to the browser —
 * this module must never be imported from anything under `src/`, or Vite will
 * bundle it (and the token reference) into the client build.
 *
 * Reads /commits and /releases rather than /events. The Events API is an
 * eventually-consistent firehose with no delivery SLA: it publishes nothing for
 * private repositories, retains roughly 90 days, and can stay empty for hours
 * on a freshly created repo even after a push is registered. /commits reflects
 * the repository state immediately and works while private.
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

type GitHubCommit = {
  sha?: string;
  /** The linked GitHub account — null for commits from an unmatched email. */
  author?: { login?: string } | null;
  commit?: {
    message?: string;
    author?: { name?: string; date?: string } | null;
    committer?: { date?: string } | null;
  };
};

type GitHubRelease = {
  id?: number;
  draft?: boolean;
  tag_name?: string | null;
  name?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  author?: { login?: string } | null;
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

/** Returns null for commits we can't render. */
function normalizeCommit(commit: GitHubCommit): Omit<ActivityEvent, "timestamp"> | null {
  const sha = commit.sha;
  const message = commit.commit?.message;
  if (!sha || !message?.trim()) return null;

  // Prefer the GitHub handle; fall back to the git author name when the commit
  // email isn't linked to an account.
  const author = commit.author?.login || commit.commit?.author?.name;
  if (!author) return null;

  const date = commit.commit?.author?.date || commit.commit?.committer?.date;
  if (!date || Number.isNaN(Date.parse(date))) return null;

  return {
    id: sha,
    message: summarize(message),
    author,
    isoTimestamp: new Date(date).toISOString(),
    kind: "push",
  };
}

/** Returns null for drafts and malformed releases. */
function normalizeRelease(release: GitHubRelease): Omit<ActivityEvent, "timestamp"> | null {
  if (release.draft) return null;

  const label = release.tag_name || release.name;
  const author = release.author?.login;
  const date = release.published_at || release.created_at;
  if (!label?.trim() || !author || !date || Number.isNaN(Date.parse(date))) return null;

  return {
    id: `release-${release.id ?? label}`,
    message: summarize(`Released ${label}`),
    author,
    isoTimestamp: new Date(date).toISOString(),
    kind: "release",
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

/** Maps an upstream failure onto our generic codes. */
function classify(response: Response, owner: string, repo: string): Response {
  const remaining = response.headers.get("x-ratelimit-remaining");
  const rateLimited =
    response.status === 429 || (response.status === 403 && remaining === "0");

  if (rateLimited) return fail(429, "rate_limited", `reset=${response.headers.get("x-ratelimit-reset")}`);
  if (response.status === 401) return fail(502, "bad_credentials", "GITHUB_TOKEN rejected by GitHub");
  if (response.status === 404) return fail(502, "repo_not_found", `${owner}/${repo} not visible to this token`);
  return fail(502, "upstream_error", `status ${response.status}`);
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

  const base = `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const init: RequestInit = {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": GITHUB_API_VERSION,
      "user-agent": "people-concerns-activity-widget",
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    cache: "no-store",
  };

  // Only RESULT_LIMIT of each can survive the merge, so fetch no more than that.
  let commitsRes: Response;
  let releasesRes: PromiseSettledResult<Response>;
  try {
    const [c, r] = await Promise.all([
      fetch(`${base}/commits?per_page=${RESULT_LIMIT}`, init),
      Promise.allSettled([fetch(`${base}/releases?per_page=${RESULT_LIMIT}`, init)]).then((s) => s[0]),
    ]);
    commitsRes = c;
    releasesRes = r;
  } catch (error) {
    const aborted = error instanceof Error && error.name === "TimeoutError";
    return fail(
      aborted ? 504 : 502,
      aborted ? "upstream_timeout" : "upstream_unreachable",
      error instanceof Error ? error.message : String(error),
    );
  }

  // Commits are the primary source; a failure there is a real failure.
  if (!commitsRes.ok) return classify(commitsRes, owner, repo);

  let commitsBody: unknown;
  try {
    commitsBody = await commitsRes.json();
  } catch (error) {
    return fail(502, "invalid_upstream_body", error instanceof Error ? error.message : String(error));
  }
  if (!Array.isArray(commitsBody)) {
    return fail(502, "invalid_upstream_body", "expected an array of commits");
  }

  const activity: Array<Omit<ActivityEvent, "timestamp">> = [];
  for (const commit of commitsBody as GitHubCommit[]) {
    const normalized = normalizeCommit(commit);
    if (normalized) activity.push(normalized);
  }

  // Releases are a bonus: a repo may have none, and the token may not cover
  // them. Never let that failure empty the feed.
  if (releasesRes.status === "fulfilled" && releasesRes.value.ok) {
    try {
      const body: unknown = await releasesRes.value.json();
      if (Array.isArray(body)) {
        for (const release of body as GitHubRelease[]) {
          const normalized = normalizeRelease(release);
          if (normalized) activity.push(normalized);
        }
      }
    } catch {
      // Ignore: commits alone still make a valid feed.
    }
  }

  const now = Date.now();
  const events: ActivityEvent[] = activity
    .sort((a, b) => Date.parse(b.isoTimestamp) - Date.parse(a.isoTimestamp))
    .slice(0, RESULT_LIMIT)
    .map((event) => ({ ...event, timestamp: toRelativeTime(event.isoTimestamp, now) }));

  return json({ events }, 200, { "cache-control": CACHE_CONTROL });
}

// Vercel/Netlify function default export (Web handler signature).
export default GET;
