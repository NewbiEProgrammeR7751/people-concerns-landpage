import { useCallback, useEffect, useRef, useState } from "react";

/** Mirrors the payload from `api/github-activity.ts`. */
export type ActivityEvent = {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  isoTimestamp?: string;
  kind?: "push" | "release";
};

type Lang = "en" | "ar";
type Status = "loading" | "live" | "fallback";

const ENDPOINT = "/api/github-activity";
const POLL_INTERVAL_MS = 60_000;
/** Re-render relative labels on this cadence so "just now" ages without a refetch. */
const TICK_INTERVAL_MS = 30_000;
const REQUEST_TIMEOUT_MS = 6_000;

// ── Fallback ───────────────────────────────────────────────────────────────

/**
 * Shown whenever the API is unreachable, unconfigured, or rate-limited. Offsets
 * are relative to render time so the timestamps stay plausible instead of
 * freezing at a hard-coded value.
 */
const FALLBACK: Array<Omit<ActivityEvent, "timestamp" | "isoTimestamp"> & {
  minutesAgo: number;
  message_ar: string;
  author_ar: string;
}> = [
  { id: "fb-1", kind: "release", minutesAgo: 2, author: "lena-k", author_ar: "ليلى م.", message: "Released v3.2.1", message_ar: "نشر الإصدار v3.2.1" },
  { id: "fb-2", kind: "push", minutesAgo: 18, author: "marcus-t", author_ar: "خالد ر.", message: "feat: rotate API keys on schedule", message_ar: "ميزة: تدوير مفاتيح API دورياً" },
  { id: "fb-3", kind: "push", minutesAgo: 64, author: "aisha-r", author_ar: "نورة ع.", message: "fix: enterprise signup validation", message_ar: "إصلاح: التحقق من الاشتراك المؤسسي" },
  { id: "fb-4", kind: "push", minutesAgo: 185, author: "dev-ops", author_ar: "فريق التشغيل", message: "chore: bump edge runtime to 20.x", message_ar: "صيانة: ترقية بيئة التشغيل إلى 20.x" },
];

function buildFallback(lang: Lang, now: number): ActivityEvent[] {
  return FALLBACK.map((item) => {
    const iso = new Date(now - item.minutesAgo * 60_000).toISOString();
    return {
      id: item.id,
      kind: item.kind,
      author: lang === "ar" ? item.author_ar : item.author,
      message: lang === "ar" ? item.message_ar : item.message,
      isoTimestamp: iso,
      timestamp: formatRelative(iso, lang, now) ?? "",
    };
  });
}

// ── Relative time ──────────────────────────────────────────────────────────

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();
function rtf(locale: string): Intl.RelativeTimeFormat {
  let formatter = rtfCache.get(locale);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "narrow" });
    rtfCache.set(locale, formatter);
  }
  return formatter;
}

/**
 * English uses the compact dashboard voice ("2m ago"); other locales go through
 * Intl so Arabic reads correctly right-to-left. Returns null on an unparseable
 * instant, letting the caller keep the server-rendered label.
 */
function formatRelative(iso: string | undefined, lang: Lang, now: number): string | null {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return null;

  const seconds = Math.max(0, Math.round((now - then) / 1000));

  if (lang === "en") {
    if (seconds < 45) return "just now";
    if (seconds < HOUR) return `${Math.round(seconds / MINUTE)}m ago`;
    if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
    return `${Math.floor(seconds / DAY)}d ago`;
  }

  if (seconds < 45) return rtf(lang).format(0, "second");
  if (seconds < HOUR) return rtf(lang).format(-Math.round(seconds / MINUTE), "minute");
  if (seconds < DAY) return rtf(lang).format(-Math.floor(seconds / HOUR), "hour");
  return rtf(lang).format(-Math.floor(seconds / DAY), "day");
}

// ── Data hook ──────────────────────────────────────────────────────────────

function isActivityEvent(value: unknown): value is ActivityEvent {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.id === "string" &&
    typeof event.message === "string" &&
    typeof event.author === "string" &&
    typeof event.timestamp === "string"
  );
}

/**
 * Fetches on mount, then polls while the tab is visible. Any failure — network,
 * non-2xx, malformed body, empty list — resolves to the static fallback rather
 * than surfacing an error, because this widget sits in the hero section.
 */
function useGitHubActivity(lang: Lang) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const langRef = useRef(lang);
  langRef.current = lang;

  const load = useCallback(async (signal: AbortSignal) => {
    try {
      const response = await fetch(ENDPOINT, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
        headers: { accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const body: unknown = await response.json();
      const list = (body as { events?: unknown })?.events;
      const parsed = Array.isArray(list) ? list.filter(isActivityEvent) : [];
      if (parsed.length === 0) throw new Error("no renderable events");

      if (signal.aborted) return;
      setEvents(parsed);
      setStatus("live");
    } catch {
      // An abort is teardown (StrictMode remount, unmount, lang change), not a failure.
      if (signal.aborted) return;
      setEvents(buildFallback(langRef.current, Date.now()));
      setStatus("fallback");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);

    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(controller.signal);
    }, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      window.clearInterval(poll);
    };
  }, [load]);

  const statusRef = useRef(status);
  statusRef.current = status;

  // Re-localize the fallback copy when the language toggles; live rows are
  // relabelled from isoTimestamp at render time and need no refetch.
  useEffect(() => {
    if (statusRef.current === "fallback") setEvents(buildFallback(lang, Date.now()));
  }, [lang]);

  return { events, status };
}

/** Drives relative-label re-renders without refetching. */
function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const tick = window.setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS);
    return () => window.clearInterval(tick);
  }, [active]);
  return now;
}

// ── View ───────────────────────────────────────────────────────────────────

const COPY = {
  en: { title: "Recent Activity", live: "live", cached: "cached", loading: "Syncing activity…" },
  ar: { title: "النشاط الأخير", live: "مباشر", cached: "مخزّن", loading: "...جارٍ المزامنة" },
} as const;

export default function RecentActivity({ lang }: { lang: Lang }) {
  const { events, status } = useGitHubActivity(lang);
  const now = useNow(status !== "loading");
  const copy = COPY[lang];
  const isLive = status === "live";

  return (
    <div
      className="col-span-3 rounded-xl p-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: "#7a9cbd" }}>
          {copy.title}
        </span>
        {status !== "loading" && (
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: isLive ? "var(--teal)" : "#4d6280", fontSize: 10 }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full${isLive ? " activity-live-dot" : ""}`}
              style={{ background: isLive ? "var(--teal)" : "#4d6280" }}
            />
            {isLive ? copy.live : copy.cached}
          </span>
        )}
      </div>

      {status === "loading" ? (
        <div className="py-1.5 text-xs" style={{ color: "#4d6280" }}>
          {copy.loading}
        </div>
      ) : (
        <ul className="list-none m-0 p-0">
          {events.map((event, i) => (
            <li
              key={event.id}
              className="activity-row flex items-center justify-between gap-3 py-1.5"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                // Staggered entry so the list reads like a feed filling in.
                animationDelay: `${i * 90}ms`,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: event.kind === "release" ? "var(--coral)" : "var(--teal)",
                    boxShadow: event.kind === "release" ? "none" : "0 0 6px rgba(42,184,168,0.7)",
                  }}
                />
                <span className="text-xs font-medium flex-shrink-0" style={{ color: "var(--teal)" }}>
                  {event.author}
                </span>
                <span className="text-xs truncate" style={{ color: "#7a9cbd" }} title={event.message}>
                  {event.message}
                </span>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "#7a9cbd" }}>
                {formatRelative(event.isoTimestamp, lang, now) ?? event.timestamp}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
