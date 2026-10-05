/**
 * POST /api/concern-received
 *
 * Handles a submission from the "Start a Project" / contact form on the landing
 * page: assigns a reference, renders `emails/concern-received.{html,txt}`, and
 * sends the pair as multipart/alternative to the person who wrote in. The
 * submission itself is also forwarded to the team (CONCERNS_INBOX_EMAIL, or
 * company.contactEmail by default), so nothing is lost after the confirmation
 * goes out.
 *
 * Secrets live in `process.env` (see `.env.example`) and never reach the
 * browser — this module must never be imported from anything under `src/`, or
 * Vite will bundle it into the client build.
 *
 * This is a Web-standard `Request`/`Response` handler, so the same file works
 * unmodified as a Next.js App Router route (`app/api/concern-received/route.ts`),
 * a Vercel/Netlify function, or behind the dev middleware in
 * `vite-plugin-dev-api.ts`.
 */

import { readFile } from "node:fs/promises";
// The `.js` extension is required: package.json sets "type": "module", and
// Node's ESM loader on Vercel does not resolve extensionless relative imports.
import { company } from "../src/content/company.js";

// Next.js App Router hints — inert in other runtimes.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
/** Give up on the mail provider rather than hold the form hostage. */
const UPSTREAM_TIMEOUT_MS = 10_000;

/** Field limits — generous for a person, tight enough to bound the payload. */
const LIMITS = { name: 120, email: 254, phone: 40, message: 5_000 } as const;

/** The chips on the contact form. Anything else is ignored rather than rejected. */
const PROJECT_TYPES = ["app", "website", "system", "unsure"] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

/** How each chip reads in the subject line and the team notification. */
const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  app: "App",
  website: "Website",
  system: "System",
  unsure: "Not sure yet",
};

/** Best-effort abuse brake, per IP. See `rateLimited()`. */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;

// ── Types ──────────────────────────────────────────────────────────────────

/** Mirrors the landing page form in `src/App.tsx`. */
type Submission = {
  name: string;
  email: string;
  /** Phone number — the channel the sender asked to be reached on. */
  phone: string;
  /** Which chip was selected, if any. */
  projectType: ProjectType | null;
  /** Optional: the form does not require a description. */
  message: string;
  /** Which language the form was filled in. */
  lang: "en" | "ar";
};

type Template = { html: string; text: string };

// ── Helpers ────────────────────────────────────────────────────────────────

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

/**
 * Client-facing errors are deliberately generic: provider bodies and env values
 * never reach the browser. Detail goes to the server log only.
 */
function fail(status: number, code: string, logDetail?: string): Response {
  if (logDetail) console.error(`[concern-received] ${code}: ${logDetail}`);
  return json({ error: code }, status);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Replaces every `{{tag}}` in a template. Unknown tags are left untouched. */
function render(template: string, values: Record<string, string>, escape: boolean): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = values[key];
    if (value === undefined) return match;
    return escape ? escapeHtml(value) : value;
  });
}

/**
 * Reference the member quotes back to us, e.g. `PC-260926-4821`. Random rather
 * than sequential because there is no shared counter yet; swap this for the
 * platform's ticket id once concerns are persisted.
 */
function makeReference(now: Date): string {
  const stamp = now
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, "");
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `PC-${stamp}-${suffix}`;
}

/** Date and time as the member would read it locally, in Kingdom time. */
function formatSubmittedAt(now: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Riyadh",
  }).format(now) + " (AST)";
}

/** First word of the name, which is what the greeting expects. */
function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name.trim();
}

function isEmail(value: string): boolean {
  // Deliberately permissive: the provider is the real authority on
  // deliverability, and an over-strict pattern rejects valid addresses.
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value);
}

function requireString(source: Record<string, unknown>, key: keyof typeof LIMITS, optional = false): string | null {
  const raw = source[key];
  if (raw === undefined || raw === null) return optional ? "" : null;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return optional ? "" : null;
  if (trimmed.length > LIMITS[key]) return null;
  return trimmed;
}

// ── Rate limiting ──────────────────────────────────────────────────────────

const hits = new Map<string, number[]>();

/**
 * Best-effort brake on a public endpoint that sends mail. State is per process,
 * so it resets on cold start and is not shared across instances — put a real
 * limiter (provider WAF, Upstash, Vercel Firewall) in front for production
 * traffic. This only blunts a single client hammering one instance.
 */
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT.max;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// ── Template loading ───────────────────────────────────────────────────────

let cached: Promise<Template> | null = null;

/**
 * Reads the templates from `emails/`, resolved relative to this module so it
 * works regardless of the process working directory. Bundled function runtimes
 * need these two files included in the deployment — see the note in README.md.
 *
 * Read once and cached for the life of the instance: the files never change at
 * runtime, and re-reading them on every submission would be pure I/O.
 */
function loadTemplate(): Promise<Template> {
  cached ??= Promise.all([
    readFile(new URL("../emails/concern-received.html", import.meta.url), "utf8"),
    readFile(new URL("../emails/concern-received.txt", import.meta.url), "utf8"),
  ]).then(([html, text]) => ({ html: stripAuthoringComment(html), text }));

  return cached;
}

/**
 * Drops the merge-tag documentation comment between <!DOCTYPE html> and <html>.
 * It is for whoever edits the template, not for the recipient: leaving it in
 * ships ~2KB of internal notes in every send and counts against the ~102KB at
 * which Gmail starts clipping the message.
 */
function stripAuthoringComment(html: string): string {
  return html.replace(/^(<!DOCTYPE html>\s*)<!--[\s\S]*?-->\s*/i, "$1");
}

// ── Configuration ──────────────────────────────────────────────────────────

type Config = {
  apiKey: string;
  from: string;
  siteUrl: string;
  inbox: string | null;
  trackingTemplate: string | null;
};

/** Reads and validates the environment once per request. */
function readConfig(): Config | { error: string; detail: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { error: "not_configured", detail: "RESEND_API_KEY is unset" };

  const rawSiteUrl = process.env.PUBLIC_SITE_URL?.trim() || company.websiteUrl;
  let siteUrl: string;
  try {
    // Mail clients cannot resolve relative paths, so every URL in the email
    // must be absolute. Normalising here fails loudly rather than shipping a
    // broken logo.
    siteUrl = new URL(rawSiteUrl).origin;
  } catch {
    return { error: "not_configured", detail: `PUBLIC_SITE_URL is not an absolute URL: ${rawSiteUrl}` };
  }

  return {
    apiKey,
    from: process.env.CONCERN_FROM_EMAIL?.trim() || `${company.name} <${company.noReplyEmail}>`,
    siteUrl,
    inbox: process.env.CONCERNS_INBOX_EMAIL?.trim() || company.contactEmail,
    trackingTemplate: process.env.CONCERN_TRACKING_URL?.trim() || null,
  };
}

// ── Mail provider ──────────────────────────────────────────────────────────

type OutgoingEmail = {
  to: string;
  subject: string;
  html?: string;
  text: string;
  replyTo?: string;
};

/**
 * Sends through Resend's REST API over `fetch`, so there is no SDK dependency.
 * Swapping providers means rewriting this one function: SendGrid and Postmark
 * take the same three inputs under different key names, and Nodemailer would
 * take an SMTP transport here instead.
 */
async function sendEmail(config: Config, email: OutgoingEmail): Promise<{ id: string }> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [email.to],
      subject: email.subject,
      // Sending both parts makes it multipart/alternative, which is what the
      // template pack is designed for.
      ...(email.html ? { html: email.html } : {}),
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`provider status ${response.status}: ${body.slice(0, 300)}`);
  }

  const body = (await response.json().catch(() => ({}))) as { id?: string };
  return { id: body.id ?? "unknown" };
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const config = readConfig();
  if ("error" in config) return fail(500, config.error, config.detail);

  if (rateLimited(clientIp(request))) {
    return fail(429, "rate_limited", `ip=${clientIp(request)}`);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_body");
  }
  if (typeof body !== "object" || body === null) return fail(400, "invalid_body");

  const source = body as Record<string, unknown>;
  const name = requireString(source, "name");
  const email = requireString(source, "email");
  const phone = requireString(source, "phone");
  // Optional: a business owner who picks a chip has already said enough.
  const message = requireString(source, "message", true);

  if (name === null || email === null || phone === null || message === null) {
    return fail(400, "invalid_fields");
  }
  if (!isEmail(email)) return fail(400, "invalid_email");

  const projectType = PROJECT_TYPES.includes(source.projectType as ProjectType)
    ? (source.projectType as ProjectType)
    : null;
  const lang = source.lang === "ar" ? "ar" : "en";

  const now = new Date();
  const reference = makeReference(now);
  // The form has no subject field, so the selected chip stands in as the short
  // title the template shows.
  const subject = projectType
    ? `New enquiry — ${PROJECT_TYPE_LABEL[projectType]}`
    : "New enquiry";

  const concernUrl = config.trackingTemplate
    ? config.trackingTemplate.replace("{reference}", encodeURIComponent(reference))
    : `${config.siteUrl}/#contact`;

  const submission: Submission = { name, email, phone, projectType, message, lang };

  const values: Record<string, string> = {
    member_name: firstName(name),
    concern_reference: reference,
    concern_subject: subject,
    submitted_at: formatSubmittedAt(now),
    concern_url: concernUrl,
    privacy_url: `${config.siteUrl}/privacy-policy`,
    terms_url: `${config.siteUrl}/terms-and-conditions`,
    // Absolute, because mail clients cannot resolve a relative src.
    logo_url: `${config.siteUrl}/email-assets/pc-logo-horizontal-ondark@2x.png`,
    website: company.website,
    website_url: config.siteUrl,
    support_email: company.supportEmail,
    support_phone: company.phone,
    support_phone_href: company.phoneHref,
    office_address: company.shortAddress,
    office_hours: company.officeHours,
    noreply_email: company.noReplyEmail,
    company_name: company.name,
    year: String(now.getUTCFullYear()),
  };

  let template: Template;
  try {
    template = await loadTemplate();
  } catch (error) {
    return fail(500, "template_unavailable", error instanceof Error ? error.message : String(error));
  }

  try {
    await sendEmail(config, {
      to: email,
      subject: `We've received your concern (${reference})`,
      html: render(template.html, values, true),
      text: render(template.text, values, false),
      replyTo: company.supportEmail,
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "TimeoutError";
    return fail(
      aborted ? 504 : 502,
      aborted ? "provider_timeout" : "provider_error",
      error instanceof Error ? error.message : String(error),
    );
  }

  // The confirmation is what the member is waiting on, so it is sent first and
  // its failure fails the request. The internal copy is best-effort: losing it
  // should not tell the member their message bounced.
  if (config.inbox) {
    try {
      await sendEmail(config, {
        to: config.inbox,
        subject: `[${reference}] ${subject}`,
        text: internalNotification(submission, reference, values.submitted_at),
        replyTo: email,
      });
    } catch (error) {
      console.error(
        `[concern-received] internal_copy_failed: ${reference}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  return json({ reference }, 202);
}

/** Plain-text hand-off to the team; no template, so it stays readable anywhere. */
function internalNotification(submission: Submission, reference: string, submittedAt: string): string {
  return [
    `Reference: ${reference}`,
    `Submitted: ${submittedAt}`,
    "",
    `Name:    ${submission.name}`,
    `Phone:   ${submission.phone}`,
    `Email:   ${submission.email}`,
    `Wants:   ${submission.projectType ? PROJECT_TYPE_LABEL[submission.projectType] : "—"}`,
    `Form in: ${submission.lang === "ar" ? "Arabic" : "English"}`,
    "",
    "Message:",
    submission.message || "(none given — the message field is optional)",
    "",
    `Reply to this email to answer ${submission.name} directly.`,
  ].join("\n");
}

// Vercel/Netlify function default export (Web handler signature).
export default POST;
