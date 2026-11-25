/**
 * Vercel Routing Middleware — password-protects the internal PCcalc app.
 *
 * Every request under /pccalc must carry HTTP Basic credentials whose password
 * matches ADMIN_PASSWORD, the same one the /admin page uses (any username is
 * accepted). The browser shows its own sign-in prompt and remembers the
 * credentials for the session. With the env var unset, /pccalc is closed to
 * everyone rather than left open.
 *
 * Returning nothing lets the request continue to the static files.
 */

export const config = {
  matcher: ["/pccalc", "/pccalc/:path*"],
};

const REALM = "PCcalc";

function deny(status: 401 | 503, message: string): Response {
  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  };
  if (status === 401) headers["WWW-Authenticate"] = `Basic realm="${REALM}", charset="UTF-8"`;
  return new Response(message, { status, headers });
}

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

/** Constant-time comparison: hash both sides so length never leaks. */
async function matches(supplied: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(supplied), sha256(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function suppliedPassword(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Basic\s+(.+)$/i.exec(header);
  if (!match) return "";
  try {
    const bytes = Uint8Array.from(atob(match[1]), (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const colon = decoded.indexOf(":");
    return colon === -1 ? "" : decoded.slice(colon + 1);
  } catch {
    return "";
  }
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return deny(503, "PCcalc is not configured.");

  if (await matches(suppliedPassword(request), password)) return undefined;
  return deny(401, "Password required.");
}
