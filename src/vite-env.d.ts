/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** reCAPTCHA v3 site key. Public by design; the secret key stays server-side. Unset = no reCAPTCHA. */
  readonly VITE_RECAPTCHA_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
