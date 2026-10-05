import { useCallback, useEffect, useRef, useState } from "react";
import logoIcon from "@/imports/PeopleConcerns_Icon_Transparent_500.png";
import { company } from "@/content/company";
import { SECTIONS, t, type ConcernStatus, type Lang, type ProjectType } from "@/content/site";
import { captchaToken, loadRecaptcha, recaptchaEnabled } from "@/lib/recaptcha";
import { Link } from "@/router";

/**
 * Landing page.
 *
 * Copy lives in `src/content/site.ts`; this file is layout and behaviour. The
 * audience is a business owner deciding whether to call, so the page avoids
 * developer signals — no build feeds, no version numbers, no stack names — and
 * every claim on it is one we can stand behind.
 *
 * Colours come from the tokens in index.css. Filled teal buttons take navy ink
 * (`--on-teal`): #4FB3A0 is light enough that white text on it fails WCAG AA.
 */

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconGlobe() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconMobile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
function IconPenTool() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
    </svg>
  );
}
function IconServer() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

/** Points along the reading direction — `.dir-arrow` mirrors it in RTL. */
function IconArrow() {
  return (
    <svg className="dir-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IconCheck({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Logo ───────────────────────────────────────────────────────────────────

function Wordmark({ size = 36 }: { size?: number }) {
  return (
    /* Latin lockup — stays LTR in Arabic. */
    <span className="flex flex-row items-center gap-2.5" dir="ltr">
      <img src={logoIcon} alt="" style={{ width: size, height: size, objectFit: "contain" }} />
      <span style={{ fontFamily: "'Nunito', sans-serif", lineHeight: 1.05 }}>
        <span className="block" style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>People</span>
        <span className="block" style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--teal)" }}>concerns</span>
      </span>
    </span>
  );
}

// ── Hero illustration ──────────────────────────────────────────────────────

/**
 * A phone beside a laptop, drawn as abstract blocks.
 *
 * Replaces the previous fake analytics dashboard, which invented metrics — 14,283
 * users, $284K revenue — that were not ours to claim. Nothing here reads as data,
 * so there is nothing to mistake for a result.
 */
function DeviceIllustration({ alt }: { alt: string }) {
  const line = (w: string, o = 0.18) => (
    <div style={{ height: 6, width: w, borderRadius: 3, background: `rgba(255,255,255,${o})` }} />
  );

  return (
    <div className="relative mx-auto w-full max-w-xl select-none" role="img" aria-label={alt}>
      <div
        className="glow-pulse pointer-events-none absolute -left-16 -top-12 h-64 w-64 rounded-full"
        style={{ background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)" }}
      />
      <div
        className="glow-pulse pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full"
        style={{ background: "radial-gradient(circle, var(--coral-dim) 0%, transparent 70%)", animationDelay: "1.5s" }}
      />

      {/* Laptop */}
      <div className="float-1 relative z-10" dir="ltr">
        <div
          className="overflow-hidden rounded-xl shadow-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-[1fr_1.4fr]">
            <div className="space-y-3">
              {line("70%", 0.22)}
              {line("100%")}
              {line("85%")}
              <div className="pt-2">
                <div className="h-8 w-28 rounded-lg" style={{ background: "var(--teal)", opacity: 0.85 }} />
              </div>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="mb-3">{line("45%", 0.22)}</div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded"
                    style={{
                      height: 26,
                      background: i % 4 === 0 ? "var(--teal-dim)" : "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Laptop base */}
        <div
          className="mx-auto h-2.5 rounded-b-xl"
          style={{ width: "72%", background: "rgba(255,255,255,0.10)", borderTop: "1px solid var(--border-subtle)" }}
        />
      </div>

      {/* Phone, overlapping the laptop's corner */}
      <div
        className="float-2 absolute z-20"
        style={{ width: 104, right: -8, bottom: -28 }}
        dir="ltr"
      >
        <div
          className="overflow-hidden rounded-[18px] p-2 shadow-xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-strong)" }}
        >
          <div className="mx-auto mb-2 h-1 w-6 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
          <div className="space-y-2 rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="h-8 rounded-lg" style={{ background: "var(--teal-dim)", border: "1px solid rgba(79,179,160,0.3)" }} />
            {line("100%", 0.14)}
            {line("75%", 0.14)}
            <div className="h-6 rounded-md" style={{ background: "var(--teal)", opacity: 0.85 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reveal-on-scroll ───────────────────────────────────────────────────────

/**
 * Fades a block in once when it scrolls into view. Used on the process steps so
 * 02–04 arrive at full weight instead of sitting permanently dimmed, which read
 * as "disabled" in the UX review.
 */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // Without IntersectionObserver the content simply starts visible.
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} data-revealed={shown}>
      {children}
    </div>
  );
}

// ── Shared bits ────────────────────────────────────────────────────────────

/** Filled teal button. Navy ink, because white on #4FB3A0 fails AA. */
function primaryButtonStyle(headingFont: string): React.CSSProperties {
  return {
    background: "var(--teal)",
    color: "var(--on-teal)",
    fontFamily: headingFont,
    boxShadow: "0 8px 24px rgba(79,179,160,0.22)",
  };
}

function outlineButtonStyle(headingFont: string): React.CSSProperties {
  return {
    border: "1px solid var(--border-strong)",
    color: "var(--text-primary)",
    background: "rgba(255,255,255,0.05)",
    fontFamily: headingFont,
  };
}

function SectionHeading({
  h2,
  sub,
  headingFont,
  isAr,
}: {
  h2: string;
  sub: string;
  headingFont: string;
  isAr: boolean;
}) {
  return (
    <div className="mb-14 text-center">
      <h2
        className="mb-3 text-3xl font-extrabold sm:text-4xl"
        style={{ letterSpacing: isAr ? "0" : "-0.02em", fontFamily: headingFont }}
      >
        {h2}
      </h2>
      <p className="mx-auto max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
        {sub}
      </p>
    </div>
  );
}

/** Google's required wording when the reCAPTCHA badge is hidden (see index.css). */
function RecaptchaNotice({ lang }: { lang: Lang }) {
  if (!recaptchaEnabled) return null;
  const [before, privacy, middle, terms, after] = t[lang].security.notice;
  const link = { color: "var(--text-secondary)" };
  return (
    <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
      {before}
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={link}>{privacy}</a>
      {middle}
      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline" style={link}>{terms}</a>
      {after}
    </p>
  );
}

// ── Track your concern ─────────────────────────────────────────────────────

const STATUS_ORDER: ConcernStatus[] = ["received", "in_review", "replied", "closed"];

/** Mirrors PublicConcern in api/_lib/concern-store.ts. */
type TrackedConcern = {
  reference: string;
  createdAt: string;
  updatedAt: string;
  status: ConcernStatus;
  note: string;
};

type TrackState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "found"; concern: TrackedConcern }
  | { kind: "error"; message: string };

function TrackSection({
  lang,
  headingFont,
  fieldStyle,
  prefillRef,
}: {
  lang: Lang;
  headingFont: string;
  fieldStyle: React.CSSProperties;
  /** Set when the contact form succeeds, so "Track your concern" lands pre-filled. */
  prefillRef: string | null;
}) {
  const tx = t[lang].track;
  const isAr = lang === "ar";
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<TrackState>({ kind: "idle" });

  const lookup = useCallback(
    async (body: { reference: string; token?: string; email?: string }) => {
      setState({ kind: "checking" });
      try {
        // Only the reference + email path is checked server-side; the emailed token stands on its own.
        const captcha = body.token ? undefined : await captchaToken("track");
        const response = await fetch("/api/concern-status", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...body, captchaToken: captcha }),
        });
        if (response.status === 404 || response.status === 400) return setState({ kind: "error", message: tx.notFound });
        if (response.status === 429) return setState({ kind: "error", message: t[lang].security.rateLimited });
        if (response.status === 403) return setState({ kind: "error", message: t[lang].security.captchaFailed });
        if (!response.ok) throw new Error(`status ${response.status}`);
        const data = (await response.json()) as { concern: TrackedConcern };
        setState({ kind: "found", concern: data.concern });
      } catch (error) {
        console.error("[track]", error);
        setState({ kind: "error", message: tx.error });
      }
    },
    [tx, lang],
  );

  // The confirmation email links to /?ref=…&t=…#track. Look it up once, then
  // drop the token from the address bar so it isn't shared by copy-paste.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    const token = params.get("t");
    if (!ref || !token) return;
    setReference(ref);
    void lookup({ reference: ref, token });
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.hash);
    // Runs once on landing; `lookup` changing with the language must not re-run it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!prefillRef) return;
    setReference(prefillRef);
    setState({ kind: "idle" });
  }, [prefillRef]);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(isAr ? "ar-SA-u-ca-gregory" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Riyadh",
    }).format(new Date(iso));

  const labelClass = "mb-1.5 block text-xs font-medium";
  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "var(--teal)"),
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "var(--border-subtle)"),
  };

  return (
    <section
      id={SECTIONS.track}
      className="py-24"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", scrollMarginTop: "4rem" }}
    >
      <div className="mx-auto max-w-2xl px-6">
        <SectionHeading h2={tx.h2} sub={tx.sub} headingFont={headingFont} isAr={isAr} />

        <div className="rounded-3xl p-6 md:p-10" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
          {state.kind === "found" ? (
            <div role="status">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-lg font-bold tracking-wide" style={{ color: "var(--teal)", fontFamily: headingFont }} dir="ltr">
                  {state.concern.reference}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {tx.submittedLabel}: {formatDate(state.concern.createdAt)}
                </span>
              </div>

              {/* Progress through the four statuses; everything up to the current one is done. */}
              <ol className="mb-6 grid grid-cols-4 gap-2">
                {STATUS_ORDER.map((s, i) => {
                  const reached = i <= STATUS_ORDER.indexOf(state.concern.status);
                  const current = s === state.concern.status;
                  return (
                    <li key={s} className="text-center" aria-current={current ? "step" : undefined}>
                      <div
                        className="mb-2 h-1.5 rounded-full"
                        style={{ background: reached ? "var(--teal)" : "var(--border-strong)" }}
                      />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: current ? "var(--text-primary)" : reached ? "var(--teal)" : "var(--text-muted)" }}
                      >
                        {tx.statuses[s].label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <p className="mb-1 text-base font-semibold" style={{ fontFamily: headingFont }}>
                {tx.statuses[state.concern.status].label}
              </p>
              <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                {tx.statuses[state.concern.status].desc}
              </p>

              {state.concern.note && (
                <div
                  className="mb-4 rounded-xl px-4 py-3 text-sm"
                  style={{ background: "var(--teal-dim)", border: "1px solid rgba(79,179,160,0.3)", color: "var(--text-secondary)" }}
                >
                  <span className="mb-1 block text-xs font-semibold" style={{ color: "var(--teal)" }}>{tx.noteLabel}</span>
                  <span style={{ whiteSpace: "pre-line" }}>{state.concern.note}</span>
                </div>
              )}

              <p className="mb-6 text-xs" style={{ color: "var(--text-muted)" }}>
                {tx.updatedLabel}: {formatDate(state.concern.updatedAt)}
              </p>

              <button
                type="button"
                onClick={() => setState({ kind: "idle" })}
                className="tap-target rounded-xl px-5 text-sm font-semibold"
                style={outlineButtonStyle(headingFont)}
              >
                {tx.another}
              </button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (state.kind === "checking") return;
                void lookup({ reference: reference.trim().toUpperCase(), email: email.trim() });
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="tr-ref" className={labelClass} style={{ color: "var(--text-muted)" }}>
                    {tx.refLabel}
                  </label>
                  <input
                    id="tr-ref"
                    type="text"
                    dir="ltr"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder={tx.refPlaceholder}
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="tap-target w-full rounded-xl px-4 py-3 text-sm uppercase outline-none transition-all duration-200"
                    style={{ ...fieldStyle, textAlign: "left" }}
                    {...focusHandlers}
                  />
                </div>
                <div>
                  <label htmlFor="tr-email" className={labelClass} style={{ color: "var(--text-muted)" }}>
                    {tx.emailLabel}
                  </label>
                  <input
                    id="tr-email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder={tx.emailPlaceholder}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="tap-target w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ ...fieldStyle, textAlign: "left" }}
                    {...focusHandlers}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={state.kind === "checking"}
                className="tap-target w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 disabled:cursor-wait disabled:opacity-60 enabled:hover:brightness-110"
                style={primaryButtonStyle(headingFont)}
              >
                {state.kind === "checking" ? tx.checking : tx.submit}
              </button>

              <RecaptchaNotice lang={lang} />

              {state.kind === "error" && (
                <div
                  role="alert"
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "var(--coral-dim)", border: "1px solid rgba(232,131,111,0.35)", color: "var(--text-secondary)" }}
                >
                  {state.message}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "sent" | "error";

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [formState, setFormState] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [trackPrefill, setTrackPrefill] = useState<string | null>(null);
  /** Which message the error box shows. */
  const [errorKind, setErrorKind] = useState<"generic" | "captcha" | "rate">("generic");
  /** Honeypot: hidden from people, so only bots fill it. */
  const [website, setWebsite] = useState("");

  const tx = t[lang];
  const isAr = lang === "ar";
  const headingFont = isAr ? "'Cairo', 'Plus Jakarta Sans', sans-serif" : "'Plus Jakarta Sans', sans-serif";
  const bodyFont = isAr ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  useEffect(() => {
    document.documentElement.dir = tx.dir;
    document.documentElement.lang = tx.htmlLang;
  }, [tx.dir, tx.htmlLang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Start reCAPTCHA early: v3 scores better when it has seen the visit, not just the submit.
  useEffect(() => {
    loadRecaptcha()?.catch((error) => console.error("[recaptcha]", error));
  }, []);

  const serviceIcons = [<IconGlobe />, <IconMobile />, <IconPenTool />, <IconServer />];

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "en" ? "ar" : "en"));
    setStatus("idle");
    setReference(null);
    setMenuOpen(false);
  }, []);

  /**
   * Posts the enquiry to /api/concern-received, which emails the sender a
   * confirmation and forwards the details to the team.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    setErrorKind("generic");
    try {
      const token = await captchaToken("contact");
      const response = await fetch("/api/concern-received", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formState, projectType, lang, website, captchaToken: token }),
      });
      if (!response.ok) {
        setErrorKind(response.status === 403 ? "captcha" : response.status === 429 ? "rate" : "generic");
        throw new Error(`status ${response.status}`);
      }

      const body = (await response.json()) as { reference?: string };
      setReference(body.reference ?? null);
      setStatus("sent");
      setFormState({ name: "", phone: "", email: "", message: "" });
      setProjectType(null);
    } catch (error) {
      console.error("[contact-form]", error);
      setStatus("error");
    }
  };

  const navLinks = [
    { href: `#${SECTIONS.whatWeBuild}`, label: tx.nav.whatWeBuild },
    { href: `#${SECTIONS.howItWorks}`, label: tx.nav.howItWorks },
    { href: `#${SECTIONS.contact}`, label: tx.nav.contact },
    { href: `#${SECTIONS.track}`, label: tx.nav.track },
  ];

  const fieldStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-primary)",
    textAlign: isAr ? "right" : "left",
  };

  return (
    <div
      style={{
        background: "var(--bg-deep)",
        color: "var(--text-primary)",
        overflowX: "hidden",
        fontFamily: bodyFont,
        direction: tx.dir,
      }}
    >
      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(8,20,34,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-subtle)" : "none",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#" className="tap-target flex items-center no-underline">
            <Wordmark size={36} />
          </a>

          <div className="hidden items-center md:flex" style={{ gap: "2.25rem" }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium no-underline transition-colors duration-200"
                style={{ color: "var(--text-secondary)" }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {/* Language switch — names the language you get, not a bare glyph. */}
            <button
              onClick={toggleLang}
              aria-label={tx.langSwitchAria}
              lang={isAr ? "en" : "ar"}
              className="tap-target flex items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all duration-200"
              style={{
                border: "1px solid var(--teal)",
                color: "var(--teal)",
                background: "var(--teal-dim)",
                fontFamily: headingFont,
                height: "2.625rem",
              }}
            >
              {tx.langSwitch}
            </button>
            <a
              href={`#${SECTIONS.contact}`}
              className="tap-target flex items-center rounded-xl px-5 text-sm font-semibold no-underline transition-all duration-200 hover:brightness-110"
              style={{ ...primaryButtonStyle(headingFont), height: "2.625rem" }}
            >
              {tx.hero.ctaPrimary}
            </a>
          </div>

          <button
            className="tap-target md:hidden"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? tx.menuClose : tx.menuOpen}
          >
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {menuOpen && (
          <div
            className="px-6 pb-6 pt-2 md:hidden"
            style={{ background: "rgba(8,20,34,0.98)", borderBottom: "1px solid var(--border-subtle)" }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="tap-target flex items-center text-sm font-medium no-underline"
                style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex gap-3">
              <button
                onClick={toggleLang}
                aria-label={tx.langSwitchAria}
                lang={isAr ? "en" : "ar"}
                className="tap-target flex-shrink-0 rounded-xl px-4 text-sm font-semibold"
                style={{ border: "1px solid var(--teal)", color: "var(--teal)", background: "var(--teal-dim)" }}
              >
                {tx.langSwitch}
              </button>
              <a
                href={`#${SECTIONS.contact}`}
                onClick={() => setMenuOpen(false)}
                className="tap-target flex flex-1 items-center justify-center rounded-xl text-sm font-semibold no-underline"
                style={primaryButtonStyle(headingFont)}
              >
                {tx.hero.ctaPrimary}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center overflow-hidden pb-24 pt-28 lg:min-h-screen lg:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--teal) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, var(--coral) 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <div
              className="mb-7 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{ background: "var(--teal-dim)", border: "1px solid rgba(79,179,160,0.3)", color: "var(--teal)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--teal)" }} />
              {tx.hero.badge}
            </div>

            <h1
              className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl xl:text-[3.4rem]"
              style={{ letterSpacing: isAr ? "0" : "-0.02em", fontFamily: headingFont }}
            >
              {tx.hero.h1}
            </h1>

            <p className="mb-9 max-w-lg text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {tx.hero.sub}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={`#${SECTIONS.contact}`}
                className="tap-target flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold no-underline transition-all duration-200 hover:brightness-110"
                style={primaryButtonStyle(headingFont)}
              >
                {tx.hero.ctaPrimary} <IconArrow />
              </a>
            </div>

            <div className="mt-12 grid gap-6 border-t pt-8 sm:grid-cols-3" style={{ borderColor: "var(--border-subtle)" }}>
              {tx.hero.stats.map((s) => (
                <div key={s.value}>
                  <div className="text-base font-bold" style={{ fontFamily: headingFont, color: "var(--text-primary)" }}>
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative px-4 py-10">
            <DeviceIllustration alt={tx.hero.illustrationAlt} />
          </div>
        </div>
      </section>

      {/* ── WHO WE HELP ─────────────────────────────────────────────────── */}
      <section className="py-20" style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl" style={{ fontFamily: headingFont, letterSpacing: isAr ? "0" : "-0.01em" }}>
              {tx.audience.h2}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{tx.audience.sub}</p>
          </div>
          <ul className="flex flex-wrap justify-center gap-3">
            {tx.audience.items.map((item) => (
              <li
                key={item}
                className="rounded-full px-4 py-2.5 text-sm font-medium"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── WHAT WE BUILD ───────────────────────────────────────────────── */}
      <section id={SECTIONS.whatWeBuild} className="py-24" style={{ scrollMarginTop: "4rem" }}>
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading h2={tx.services.h2} sub={tx.services.sub} headingFont={headingFont} isAr={isAr} />

          <div className="grid gap-5 sm:grid-cols-2">
            {tx.services.items.map((s, i) => (
              <div
                key={s.title}
                className="service-card relative overflow-hidden rounded-2xl p-7"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: "var(--teal-dim)", color: "var(--teal)", border: "1px solid rgba(79,179,160,0.22)" }}
                  >
                    {serviceIcons[i]}
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--text-muted)",
                      border: "1px solid var(--border-subtle)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {s.tag}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold" style={{ fontFamily: headingFont, color: "var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>{s.desc}</p>
                {/*
                  The old "Learn more" link went nowhere. Rather than invent case
                  study pages, each card points at the contact form — the one
                  place the reader can actually get an answer.
                */}
                <a
                  href={`#${SECTIONS.contact}`}
                  className="tap-target mt-5 inline-flex items-center gap-1.5 text-sm font-semibold no-underline"
                  style={{ color: "var(--teal)" }}
                >
                  {tx.hero.ctaPrimary} <IconArrow />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id={SECTIONS.howItWorks} className="py-24" style={{ background: "var(--bg-surface)", scrollMarginTop: "4rem" }}>
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading h2={tx.process.h2} sub={tx.process.sub} headingFont={headingFont} isAr={isAr} />

          <div className="grid gap-8 md:grid-cols-4 md:gap-6">
            {tx.process.steps.map((step) => (
              <Reveal key={step.num}>
                <div className="flex flex-col items-center text-center">
                  {/* Every step carries the same weight — none of them is "inactive". */}
                  <div
                    className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
                    style={{
                      background: "var(--teal-dim)",
                      border: "1px solid rgba(79,179,160,0.4)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="text-2xl font-extrabold"
                      style={{ fontFamily: headingFont, color: "var(--teal)", letterSpacing: isAr ? "0" : "-0.03em" }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-bold" style={{ fontFamily: headingFont }}>{step.label}</h3>
                  <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
                  <div
                    className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-start text-xs"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
                  >
                    <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--teal)" }}><IconCheck size={12} /></span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--text-muted)" }}>{tx.process.youGet}: </span>
                      {step.deliverable}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ──────────────────────────────────────────────── */}
      <section
        className="py-12"
        style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6">
          {tx.benefits.map((b) => (
            /* One colour across all four — the old strip used four, which read as
               four unrelated categories rather than one list of benefits. */
            <li key={b} className="flex items-center gap-2 text-base font-semibold" style={{ color: "var(--teal)", fontFamily: headingFont }}>
              <IconCheck size={12} />
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id={SECTIONS.contact} className="py-24" style={{ scrollMarginTop: "4rem" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div
            className="relative overflow-hidden rounded-3xl p-8 md:p-14"
            style={{ background: "var(--bg-card)", border: "1px solid rgba(79,179,160,0.25)" }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)", filter: "blur(40px)" }}
            />

            <div className="relative z-10 grid items-start gap-12 md:grid-cols-2">
              <div>
                <h2
                  className="mb-4 text-3xl font-extrabold sm:text-4xl"
                  style={{ letterSpacing: isAr ? "0" : "-0.02em", fontFamily: headingFont }}
                >
                  {tx.contact.h2}
                </h2>
                <p className="mb-8 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {tx.contact.sub}
                </p>
                <ul className="mb-8 space-y-3">
                  {tx.contact.perks.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: "var(--teal-dim)", border: "1px solid rgba(79,179,160,0.35)", color: "var(--teal)" }}
                      >
                        <IconCheck />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center" role="status">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: "var(--teal-dim)", border: "1px solid rgba(79,179,160,0.4)", color: "var(--teal)" }}
                  >
                    <IconCheck size={28} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold" style={{ fontFamily: headingFont }}>{tx.contact.successTitle}</h3>
                  <p style={{ color: "var(--text-secondary)" }}>{tx.contact.successSub}</p>
                  {reference && (
                    <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
                      {tx.contact.successRef}:{" "}
                      <span className="font-semibold tracking-wide" style={{ color: "var(--teal)" }} dir="ltr">
                        {reference}
                      </span>
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {reference && (
                      <a
                        href={`#${SECTIONS.track}`}
                        onClick={() => setTrackPrefill(reference)}
                        className="tap-target inline-flex items-center rounded-xl px-5 text-sm font-semibold no-underline"
                        style={primaryButtonStyle(headingFont)}
                      >
                        {tx.contact.successTrack}
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="tap-target rounded-xl px-5 text-sm font-semibold"
                      style={outlineButtonStyle(headingFont)}
                    >
                      {tx.contact.successAgain}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Chips — what they need, before they have to describe it. */}
                  <fieldset>
                    <legend className="mb-2 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {tx.contact.typeLabel}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {tx.contact.types.map((type) => {
                        const active = projectType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setProjectType(active ? null : type.id)}
                            className="tap-target rounded-full px-4 text-sm font-medium transition-all duration-150"
                            style={
                              active
                                ? { background: "var(--teal)", color: "var(--on-teal)", border: "1px solid var(--teal)" }
                                : {
                                    background: "rgba(255,255,255,0.05)",
                                    color: "var(--text-secondary)",
                                    border: "1px solid var(--border-subtle)",
                                  }
                            }
                          >
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Honeypot. Off-screen rather than display:none, which some bots skip. */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                    <label htmlFor="cf-website">Website</label>
                    <input
                      id="cf-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="cf-name" className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {tx.contact.fields.name.label}
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      autoComplete="name"
                      placeholder={tx.contact.fields.name.placeholder}
                      required
                      value={formState.name}
                      onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                      className="tap-target w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={fieldStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--teal)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    />
                  </div>

                  <div>
                    <label htmlFor="cf-phone" className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {tx.contact.fields.phone.label}
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      placeholder={tx.contact.fields.phone.placeholder}
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState((p) => ({ ...p, phone: e.target.value }))}
                      className="tap-target w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{ ...fieldStyle, textAlign: "left" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--teal)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    />
                    <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{tx.contact.fields.phone.hint}</p>
                  </div>

                  <div>
                    <label htmlFor="cf-email" className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {tx.contact.fields.email.label}
                    </label>
                    <input
                      id="cf-email"
                      type="email"
                      autoComplete="email"
                      dir="ltr"
                      placeholder={tx.contact.fields.email.placeholder}
                      required
                      value={formState.email}
                      onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                      className="tap-target w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{ ...fieldStyle, textAlign: "left" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--teal)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    />
                  </div>

                  <div>
                    <label htmlFor="cf-message" className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {tx.contact.fields.message.label}{" "}
                      <span style={{ opacity: 0.8 }}>({tx.contact.fields.message.optional})</span>
                    </label>
                    <textarea
                      id="cf-message"
                      rows={3}
                      placeholder={tx.contact.fields.message.placeholder}
                      value={formState.message}
                      onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                      className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={fieldStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--teal)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="tap-target w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 disabled:cursor-wait disabled:opacity-60 enabled:hover:brightness-110"
                    style={primaryButtonStyle(headingFont)}
                  >
                    {status === "sending" ? tx.contact.sending : tx.contact.submit}
                  </button>

                  <RecaptchaNotice lang={lang} />

                  {status === "error" && (
                    <div
                      role="alert"
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{ background: "var(--coral-dim)", border: "1px solid rgba(232,131,111,0.35)", color: "var(--text-secondary)" }}
                    >
                      <span className="font-semibold" style={{ color: "var(--coral)" }}>{tx.contact.errorTitle}.</span>{" "}
                      {errorKind === "captcha" ? (
                        tx.security.captchaFailed
                      ) : errorKind === "rate" ? (
                        tx.security.rateLimited
                      ) : (
                        <>
                          {tx.contact.errorRetry}{" "}
                          <a href={`mailto:${company.supportEmail}`} className="underline" style={{ color: "var(--text-primary)" }} dir="ltr">
                            {company.supportEmail}
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRACK YOUR CONCERN ──────────────────────────────────────────── */}
      <TrackSection lang={lang} headingFont={headingFont} fieldStyle={fieldStyle} prefillRef={trackPrefill} />

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Wordmark size={32} />
              </div>
              <p className="max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {tx.footer.tagline}
              </p>
            </div>

            <div>
              <div className="mb-4 text-sm font-semibold" style={{ fontFamily: headingFont, color: "var(--text-primary)" }}>
                {tx.footer.servicesTitle}
              </div>
              {tx.footer.services.map((l) => (
                <a
                  key={l}
                  href={`#${SECTIONS.whatWeBuild}`}
                  className="block py-1.5 text-sm no-underline transition-colors duration-200"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Real contact details, at readable contrast. */}
            <div>
              <div className="mb-4 text-sm font-semibold" style={{ fontFamily: headingFont, color: "var(--text-primary)" }}>
                {tx.footer.contactTitle}
              </div>
              <dl className="space-y-2.5 text-sm">
                <div>
                  <dt className="text-xs" style={{ color: "var(--text-muted)" }}>{tx.footer.addressLabel}</dt>
                  <dd style={{ color: "var(--text-secondary)" }}>{company.shortAddress}</dd>
                </div>
                <div>
                  <dt className="text-xs" style={{ color: "var(--text-muted)" }}>{tx.footer.emailLabel}</dt>
                  <dd>
                    <a href={`mailto:${company.supportEmail}`} dir="ltr" className="no-underline" style={{ color: "var(--text-secondary)" }}>
                      {company.supportEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs" style={{ color: "var(--text-muted)" }}>{tx.footer.crLabel}</dt>
                  <dd dir="ltr" style={{ color: "var(--text-secondary)", textAlign: isAr ? "right" : "left" }}>{company.crNumber}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{tx.footer.copy}</p>
            <div className="flex gap-6">
              {tx.footer.legal.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-xs no-underline transition-colors duration-200"
                  style={{ color: "var(--text-muted)" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
