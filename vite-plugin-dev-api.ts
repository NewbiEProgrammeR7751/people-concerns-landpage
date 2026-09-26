import { loadEnv, type Plugin, type ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Serves the `api/` route handlers during `vite dev` / `vite preview`, so the
 * app hits real endpoints locally. In production these routes are served by the
 * host's function runtime (Vercel, Netlify, Next.js) and this plugin is not
 * involved.
 *
 * Secrets are read from `.env` into `process.env` for the dev server process
 * only — they are never passed to `define`, so nothing reaches the client bundle.
 */

type DevApiRoute = {
  /** Request path, e.g. `/api/github-activity`. */
  path: string
  /** Handler module, relative to the project root. */
  module: string
  /** Methods the handler accepts. Anything else gets a 405. */
  methods: readonly string[]
}

const ROUTES: readonly DevApiRoute[] = [
  { path: '/api/github-activity', module: '/api/github-activity.ts', methods: ['GET'] },
  { path: '/api/concern-received', module: '/api/concern-received.ts', methods: ['POST'] },
]

/**
 * Server-only variables the handlers read from `process.env`. Listed explicitly
 * so a typo in `.env` fails loudly rather than silently leaking a new key.
 */
const SERVER_ENV_KEYS = [
  'GITHUB_TOKEN',
  'GITHUB_OWNER',
  'GITHUB_REPO',
  'RESEND_API_KEY',
  'CONCERN_FROM_EMAIL',
  'CONCERNS_INBOX_EMAIL',
  'CONCERN_TRACKING_URL',
  'PUBLIC_SITE_URL',
] as const

/**
 * Collects the request body, which Vite's connect middleware does not do.
 * Returned as an ArrayBuffer: it is binary-safe and is one of the types
 * `Request` accepts as BodyInit, which a Node Buffer is not.
 */
function readBody(req: IncomingMessage): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks)).buffer))
    req.on('error', reject)
  })
}

/** Bridges a Node request onto the Web-standard `Request` the handlers expect. */
async function toWebRequest(req: IncomingMessage): Promise<Request> {
  const origin = `http://${req.headers.host ?? 'localhost'}`
  const method = req.method ?? 'GET'
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue
    for (const item of Array.isArray(value) ? value : [value]) headers.append(key, item)
  }

  const hasBody = method !== 'GET' && method !== 'HEAD'
  return new Request(new URL(req.url!, origin), {
    method,
    headers,
    ...(hasBody ? { body: await readBody(req) } : {}),
  })
}

export function devApiRoutes(): Plugin {
  return {
    name: 'dev-api-routes',
    apply: 'serve',

    config(_config, { mode }) {
      // Prefix '' loads every key, including the unprefixed secrets. This runs in
      // the Node config process; returning nothing keeps them out of the bundle.
      const env = loadEnv(mode, process.cwd(), '')
      for (const key of SERVER_ENV_KEYS) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }
    },

    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const pathname = (req.url || '').split('?')[0]
        const route = ROUTES.find((r) => r.path === pathname)
        if (!route) return next()

        const method = req.method ?? 'GET'
        if (!route.methods.includes(method)) {
          res.statusCode = 405
          res.setHeader('allow', route.methods.join(', '))
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'method_not_allowed' }))
          return
        }

        try {
          // ssrLoadModule picks up edits to the handler without a server restart.
          const mod = await server.ssrLoadModule(route.module)
          const handler: (request: Request) => Promise<Response> = mod[method] ?? mod.default

          const response = await handler(await toWebRequest(req))

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.ssrFixStacktrace(error as Error)
          console.error(`[dev-api-routes] ${route.path}: ${(error as Error).message}`)
          res.statusCode = 500
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'dev_handler_failed' }))
        }
      })
    },
  }
}
