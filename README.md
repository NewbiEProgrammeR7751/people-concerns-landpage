# People Concerns — Landing Page

Bilingual (EN/AR, RTL-aware) marketing site for People Concerns, with a live
GitHub activity feed in the hero dashboard.

Vite 8 · React 19 · Tailwind 4 · TypeScript

## Quick start

```bash
npm install
npm run dev          # http://localhost:8443
```

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server with HMR, and the `/api` route mounted (see below) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output |
| `npx tsc --noEmit` | Typecheck |

The port is `8443` by default; override with `PORT`.

## Recent Activity widget

The hero dashboard's activity list is fed by the latest commits and releases
from a GitHub repository.

### Configure

Copy the template and fill it in:

```bash
cp .env.example .env
```

```bash
GITHUB_TOKEN=github_pat_...   # fine-grained PAT, read-only
GITHUB_OWNER=your-org
GITHUB_REPO=your-repo
```

Create the token at
[github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new):

- **Public repo** — `Metadata: Read-only` is enough. Authenticating still lifts
  the rate limit from 60 to 5,000 requests/hour, which is why the token is
  required rather than optional.
- **Private repo** — add `Contents: Read-only`.

Never grant write scopes; this endpoint only reads. A fine-grained PAT only
reaches repositories explicitly selected when it was created — a repo outside
that list returns `404`, not `403`.

`.env` is git-ignored. Only `.env.example` is committed.

### Verify

```bash
curl -s http://localhost:8443/api/github-activity
```

| Response | Meaning |
| --- | --- |
| `{"events":[...]}` | Working — the widget shows a pulsing teal **live** badge |
| `{"events":[]}` | Auth fine, but the repo has no commits or releases |
| `{"error":"not_configured"}` | A variable is missing; the server log names which |
| `{"error":"bad_credentials"}` | Token rejected by GitHub |
| `{"error":"repo_not_found"}` | Wrong owner/repo, or outside the token's scope |
| `{"error":"rate_limited"}` | Quota exhausted; resets within the hour |

Reading the JSON tells you more than the UI does — the widget deliberately
hides every failure behind its static fallback, so a broken token and a quiet
repo look identical on the page.

> **Why `/commits`, not `/events`.** The obvious source is the Events API
> filtered to `PushEvent`/`ReleaseEvent`, and this started there. But that API
> is an eventually-consistent firehose with no delivery SLA: it publishes
> nothing for private repositories, retains roughly 90 days, and on a freshly
> created repo it can stay empty for hours even after `pushed_at` shows the
> push landed. `/commits` reflects repository state immediately and works while
> private. The tradeoff: one push of five commits renders as five rows rather
> than one.

### How it works

- **`api/github-activity.ts`** — the route handler. Reads the PAT from
  `process.env`, merges `/commits` and `/releases` newest-first, and returns the
  latest 4 as `{ id, message, author, timestamp, isoTimestamp, kind }`. Releases
  are best-effort: a repo with none, or a token that cannot read them, still
  yields a commit feed rather than an empty one. It lives
  **outside `src/`** on purpose: anything under `src/` is bundled into the
  client, which would ship the token reference to the browser. Errors are
  returned as generic codes, with detail logged server-side only.

  It is a Web-standard `Request`/`Response` handler, which is also the Next.js
  App Router route signature — the same file drops into a Next project at
  `app/api/github-activity/route.ts`, or onto Vercel/Netlify as a function.
  Only the dev path has been exercised in this repo.

- **`vite-plugin-dev-api.ts`** — dev-only middleware that mounts every `api/`
  handler (`/api/github-activity`, `/api/concern-received`), since Vite has no
  server runtime of its own. It bridges the Node request onto the Web-standard
  `Request` the handlers expect, including the POST body. Secrets are loaded into
  `process.env`, never into `define`, so they cannot reach the bundle. **In
  production this plugin is not involved** — the routes must be served by your
  host's function runtime.

- **`src/components/RecentActivity.tsx`** — fetches on mount, then polls every
  60s while the tab is visible. Any failure resolves to static fallback events.
  Relative timestamps are re-derived client-side from `isoTimestamp`, so they
  stay correct behind the 60s CDN cache and localise for Arabic via `Intl`.

## Legal pages

`/terms-and-conditions` and `/privacy-policy` are React pages converted from the
supplied HTML documents. The source stylesheet was light-on-white; it is
re-expressed with the site's dark tokens so a visitor coming from the footer
doesn't flash from dark to white. Layout, sticky table of contents, tables and
the print stylesheet all carry over.

Routing is `src/router.tsx` — a ~50-line history router, no dependency. Vite's
dev and preview servers already fall back to `index.html`, so deep links work
locally. **On a static host, add the same SPA rewrite** (`/*` → `/index.html`),
or those two URLs 404 on a hard refresh. Unknown paths render the landing page.

### Filling in the legal values

Every value the source marked `<mark class="fill">` now lives in
`src/content/company.ts`. Edit it there once and both documents update — the
confirmation email reads its contact details from the same file, so the two
cannot drift apart.

Filled from the Commercial Registration and the National Address certificate:

| Field | Value |
| --- | --- |
| `name`, `legalName` | People Concerns |
| `crNumber` | 7055132117 |
| `nationalAddress` | Building 4384, Additional No. 7247, Al Narjis Dist., Riyadh 13343 |
| `city`, `courtCity` | Riyadh |
| `phone` | 0555578897 (displayed as-is; `phoneE164` backs the `tel:` link) |
| `officeHours` | Sunday to Thursday, 9:00 AM to 5:00 PM |
| `dpoName` | Rawad Medhir |
| `liabilityCap` | SAR 500 |
| `retention.closedConcern` / `.technicalLogs` | 3 years / 12 months |
| `hostingStatement` | primary hosting in the Kingdom |

One value is still open, flagged `TODO(legal)`:

| Field | Needs |
| --- | --- |
| `retention.closedAccount` | how long account data is kept after closure — left at 12 months to match the technical-log period |

Both documents were drafted for the PDPL and its Implementing Regulations. Have
a Saudi-licensed lawyer review them before publishing.

## Contact form email

Submitting the "Start a Project" form posts to `POST /api/concern-received`,
which assigns a reference (`PC-260926-1438`), renders
`emails/concern-received.{html,txt}` and sends both parts to the person who
wrote in. The form shows the reference on success.

### Configure

Copy the block from `.env.example` into `.env` and fill in:

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | **yes** | Resend key. Without it the route returns 500 `not_configured`. |
| `PUBLIC_SITE_URL` | **yes** | Absolute origin. Every URL in the email is built from it, including the logo. |
| `CONCERN_FROM_EMAIL` | no | Envelope sender; defaults to `People Concerns <NoReply@peopleconcerns.com>`. |
| `CONCERNS_INBOX_EMAIL` | recommended | Where the submission itself is forwarded. Unset means the enquiry reaches nobody but the sender. |
| `CONCERN_TRACKING_URL` | no | Template for the "Track your concern" button; `{reference}` is substituted. |

The sending domain must be verified in Resend before mail to external addresses
is delivered. To use a different provider, rewrite `sendEmail()` in
`api/concern-received.ts` — it is the only function that touches the provider.

### The logo must be publicly reachable

Mail clients cannot resolve relative paths, so the header logo is referenced as
`${PUBLIC_SITE_URL}/email-assets/pc-logo-horizontal-ondark@2x.png`. That file
ships in `public/email-assets/`, so it is served automatically — but the URL only
resolves once the site is deployed at `PUBLIC_SITE_URL`. Until then the email
sends with a broken image.

### Verify

```bash
npm run dev
curl -s -X POST http://localhost:8443/api/concern-received   -H 'content-type: application/json'   -d '{"name":"Test","email":"you@example.com","company":"Acme","message":"Hello"}'
```

`{"reference":"PC-…"}` with HTTP 202 means it sent. Error codes: `not_configured`
(missing key), `invalid_fields` / `invalid_email` (validation), `rate_limited`
(more than 5 posts from one IP in 10 minutes), `provider_error` (Resend rejected
it — the reason is in the server log, never in the response).

### Deploying the templates

The route reads the two template files from `emails/` at runtime. Bundled
function runtimes prune files they cannot see statically, so include them
explicitly — on Vercel:

```json
{ "functions": { "api/concern-received.*": { "includeFiles": "emails/**" } } }
```

Otherwise the route returns 500 `template_unavailable`.

### Rate limiting

The in-process limiter in the handler is a brake, not a guarantee: state resets
on cold start and is not shared between instances. Put a real limiter in front
before the form sees meaningful traffic.

## Layout

```
api/                        server-only route handlers (never import from src/)
  github-activity.ts        GET  — feeds the Recent Activity widget
  concern-received.ts       POST — sends the contact-form confirmation email
emails/
  concern-received.html     transactional email, merge tags only
  concern-received.txt      plain-text part (multipart/alternative)
public/                     favicon, apple-touch-icon, manifest icons, og-image
  email-assets/             logo referenced by the email at an absolute URL
src/
  App.tsx                   landing page + EN/AR translations
  router.tsx                dependency-free history router (3 routes)
  components/
    RecentActivity.tsx      the live widget
  content/
    company.ts              legal + contact data for the Terms/Privacy pages
  pages/
    LegalLayout.tsx         shared shell and content primitives
    TermsAndConditions.tsx  /terms-and-conditions
    PrivacyPolicy.tsx       /privacy-policy
  index.css                 design tokens, keyframes, legal print styles
vite-plugin-dev-api.ts      serves api/ handlers during dev and preview
.figma/make/site.json       title, description, icons, social meta
```

Brand tokens (`--teal`, `--coral`, `--bg-deep`, …) are defined once in
`src/index.css` and referenced everywhere else.

## Icons and social metadata

`.figma/make/site.json` drives the document head — title, description, favicon,
and Open Graph tags — which `vite.config.ts` injects at build time.

| File | Purpose |
| --- | --- |
| `public/favicon.png` | 192×192 browser tab |
| `public/apple-touch-icon.png` | 180×180 iOS home screen |
| `public/icon-192.png`, `icon-512.png` | manifest icons |
| `public/icon-maskable-512.png` | Android adaptive icon |
| `public/og-image.png` | 1200×630 social preview card |
| `public/site.webmanifest` | Android install |

Manifest paths are **relative** so they resolve under any `base`. `og:url` and
`og:image` are pinned to an absolute origin, because social scrapers cannot
resolve a root-relative URL — update both in `site.json` if the domain changes.

## Note on generated files

`vite.config.ts` and `.figma/make/site.json` are Figma Make output. They carry
hand-made changes — the dev API plugin registration, `import.meta.dirname`, the
JSON import attribute, and all icon/social config. **Regenerating from Figma
will overwrite them.**
