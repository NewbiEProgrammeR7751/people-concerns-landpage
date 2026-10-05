/** Small helpers shared by the concern tracking and admin routes. */

export function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

/** Generic code to the client; detail to the server log only. */
export function fail(route: string, status: number, code: string, logDetail?: string): Response {
  if (logDetail) console.error(`[${route}] ${code}: ${logDetail}`);
  return json({ error: code }, status);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Per-process, best-effort limiter: resets on cold start and is not shared
 * across instances. It only blunts one client hammering one instance.
 */
export function rateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  return function limited(key: string): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);

    if (hits.size > 5_000) {
      for (const [k, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
    }

    return recent.length > max;
  };
}

/** Same reference format `makeReference` produces in concern-received.ts. */
export function isReference(value: unknown): value is string {
  return typeof value === "string" && /^PC-\d{6}-\d{4}$/.test(value);
}
