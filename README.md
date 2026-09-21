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

The hero dashboard's activity list is fed by real `PushEvent` / `ReleaseEvent`
data from a GitHub repository.

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
| `{"events":[]}` | Auth fine, but no qualifying events (see caveat below) |
| `{"error":"not_configured"}` | A variable is missing; the server log names which |
| `{"error":"bad_credentials"}` | Token rejected by GitHub |
| `{"error":"repo_not_found"}` | Wrong owner/repo, or outside the token's scope |
| `{"error":"rate_limited"}` | Quota exhausted; resets within the hour |

Reading the JSON tells you more than the UI does — the widget deliberately
hides every failure behind its static fallback, so a broken token and a quiet
repo look identical on the page.

> **Caveat.** GitHub only publishes `PushEvent`s for **public** repositories,
> the events feed retains roughly 90 days, and it lags a push by up to a minute.
> A repo that is private, newly made public, or simply quiet returns an empty
> list — which is why the widget falls back rather than rendering nothing.

### How it works

- **`api/github-activity.ts`** — the route handler. Reads the PAT from
  `process.env`, filters to `PushEvent`/`ReleaseEvent`, and returns the latest
  4 as `{ id, message, author, timestamp, isoTimestamp, kind }`. It lives
  **outside `src/`** on purpose: anything under `src/` is bundled into the
  client, which would ship the token reference to the browser. Errors are
  returned as generic codes, with detail logged server-side only.

  It is a Web-standard `Request`/`Response` handler, which is also the Next.js
  App Router route signature — the same file drops into a Next project at
  `app/api/github-activity/route.ts`, or onto Vercel/Netlify as a function.
  Only the dev path has been exercised in this repo.

- **`vite-plugin-github-activity.ts`** — dev-only middleware that mounts the
  handler at `/api/github-activity`, since Vite has no server runtime of its
  own. Secrets are loaded into `process.env`, never into `define`, so they
  cannot reach the bundle. **In production this plugin is not involved** —
  the route must be served by your host's function runtime.

- **`src/components/RecentActivity.tsx`** — fetches on mount, then polls every
  60s while the tab is visible. Any failure resolves to static fallback events.
  Relative timestamps are re-derived client-side from `isoTimestamp`, so they
  stay correct behind the 60s CDN cache and localise for Arabic via `Intl`.

## Layout

```
api/                        server-only route handler (never import from src/)
public/                     favicon, apple-touch-icon, manifest icons, og-image
src/
  App.tsx                   page + EN/AR translations
  components/
    RecentActivity.tsx      the live widget
  index.css                 design tokens and keyframes
vite-plugin-github-activity.ts
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
