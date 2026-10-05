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

/** Same reference format `makeReference` produces in concern-received.ts. */
export function isReference(value: unknown): value is string {
  return typeof value === "string" && /^PC-\d{6}-\d{4}$/.test(value);
}
