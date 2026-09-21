import { loadEnv, type Plugin, type ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

const ROUTE = '/api/github-activity'
const HANDLER_MODULE = '/api/github-activity.ts'

/**
 * Serves the `api/` route handler during `vite dev` / `vite preview`, so the
 * widget hits a real endpoint locally instead of falling back to its static
 * events. In production this route is served by the host's function runtime
 * (Vercel, Netlify, Next.js) and this plugin is not involved.
 *
 * Secrets are read from `.env` into `process.env` for the dev server process
 * only — they are never passed to `define`, so nothing reaches the client bundle.
 */
export function githubActivityDevApi(): Plugin {
  return {
    name: 'github-activity-dev-api',
    apply: 'serve',

    config(_config, { mode }) {
      // Prefix '' loads every key, including the unprefixed secrets. This runs in
      // the Node config process; returning nothing keeps them out of the bundle.
      const env = loadEnv(mode, process.cwd(), '')
      for (const key of ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO']) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }
    },

    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        if ((req.url || '').split('?')[0] !== ROUTE) return next()

        try {
          // ssrLoadModule picks up edits to the handler without a server restart.
          const mod = await server.ssrLoadModule(HANDLER_MODULE)
          const handler: (request: Request) => Promise<Response> = mod.GET ?? mod.default

          const origin = `http://${req.headers.host ?? 'localhost'}`
          const response = await handler(new Request(new URL(req.url!, origin), { method: 'GET' }))

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.ssrFixStacktrace(error as Error)
          console.error(`[github-activity-dev-api] ${(error as Error).message}`)
          res.statusCode = 500
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'dev_handler_failed' }))
        }
      })
    },
  }
}
