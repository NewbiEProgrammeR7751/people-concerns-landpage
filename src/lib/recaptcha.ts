/**
 * reCAPTCHA v3 on the client. Invisible: no checkbox, Google scores each
 * request and api/_lib/guard.ts rejects low scores server-side.
 *
 * With VITE_RECAPTCHA_SITE_KEY unset every call resolves to undefined and the
 * server (without RECAPTCHA_SECRET_KEY) does not ask for a token.
 */

type Grecaptcha = {
  ready(callback: () => void): void
  execute(siteKey: string, options: { action: string }): Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim()
const TOKEN_TIMEOUT_MS = 8_000

let loading: Promise<Grecaptcha> | null = null

/**
 * Injects Google's script once. Called on landing-page mount as well as before
 * each submit, because v3 scores better when it has watched the visit.
 */
export function loadRecaptcha(): Promise<Grecaptcha> | null {
  if (!SITE_KEY) return null
  loading ??= new Promise<Grecaptcha>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(SITE_KEY)}`
    script.async = true
    script.onload = () => window.grecaptcha?.ready(() => resolve(window.grecaptcha!))
    script.onerror = () => {
      loading = null
      reject(new Error('recaptcha script failed to load'))
    }
    document.head.appendChild(script)
  })
  return loading
}

/** A fresh token for `action`, or undefined when reCAPTCHA is off or unreachable. */
export async function captchaToken(action: string): Promise<string | undefined> {
  const pending = loadRecaptcha()
  if (!pending) return undefined
  try {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('recaptcha timeout')), TOKEN_TIMEOUT_MS))
    const grecaptcha = await Promise.race([pending, timeout])
    return await Promise.race([grecaptcha.execute(SITE_KEY!, { action }), timeout])
  } catch (error) {
    // The server decides: with a secret key set it will reject the request.
    console.error('[recaptcha]', error)
    return undefined
  }
}

export const recaptchaEnabled = Boolean(SITE_KEY)
