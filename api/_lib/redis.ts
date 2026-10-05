/**
 * Minimal Upstash Redis REST client over `fetch`, shared by the concern store
 * and the rate limiter. Vercel's Upstash integration sets KV_REST_API_URL and
 * KV_REST_API_TOKEN; the UPSTASH_REDIS_REST_* names are accepted too.
 */

const STORE_TIMEOUT_MS = 8_000;

type StoreConfig = { url: string; token: string };

function storeConfig(): StoreConfig | null {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)?.trim();
  const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

export function storeConfigured(): boolean {
  return storeConfig() !== null;
}

/** Runs one or more Redis commands in a single round trip and returns their results in order. */
export async function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const config = storeConfig();
  if (!config) throw new Error("store not configured");

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: { authorization: `Bearer ${config.token}`, "content-type": "application/json" },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(STORE_TIMEOUT_MS),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`store status ${response.status}: ${body.slice(0, 200)}`);
  }

  const results = (await response.json()) as { result?: unknown; error?: string }[];
  return results.map((item) => {
    if (item.error) throw new Error(`store error: ${item.error}`);
    return item.result;
  });
}
