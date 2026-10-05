import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ConcernStatus } from '@/content/site'
import { t } from '@/content/site'
import { company } from '@/content/company'

/**
 * /admin — where the team moves each concern through its statuses and leaves a
 * note the member sees on the "Track your concern" section.
 *
 * Internal and English-only. The password is checked server-side on every
 * request by api/admin-concerns.ts; it is kept in sessionStorage so a refresh
 * does not sign you out, and is gone when the tab closes.
 */

const STATUSES: ConcernStatus[] = ['received', 'in_review', 'replied', 'closed']
const STATUS_LABEL = Object.fromEntries(STATUSES.map((s) => [s, t.en.track.statuses[s].label])) as Record<ConcernStatus, string>
const PASSWORD_KEY = 'pc-admin-password'

/** Mirrors ConcernRecord in api/_lib/concern-store.ts, minus the token hash. */
type AdminConcern = {
  reference: string
  createdAt: string
  updatedAt: string
  status: ConcernStatus
  note: string
  history: { status: ConcernStatus; at: string }[]
  name: string
  email: string
  phone: string
  projectType: string | null
  message: string
  lang: 'en' | 'ar'
}

function readStoredPassword(): string {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) ?? ''
  } catch {
    return ''
  }
}

function storePassword(value: string | null) {
  try {
    if (value) sessionStorage.setItem(PASSWORD_KEY, value)
    else sessionStorage.removeItem(PASSWORD_KEY)
  } catch {
    // Storage unavailable (private mode): you stay signed in until a refresh.
  }
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' }).format(new Date(iso))

const fieldStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
}

const primaryButton: React.CSSProperties = { background: 'var(--teal)', color: 'var(--on-teal)' }

export default function AdminPage() {
  const [password, setPassword] = useState(readStoredPassword)
  const [draftPassword, setDraftPassword] = useState('')
  const [concerns, setConcerns] = useState<AdminConcern[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<ConcernStatus | 'all' | 'open'>('open')

  useEffect(() => {
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
    document.title = `Concerns admin · ${company.name}`
    // Keep the page out of search results.
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const request = useCallback(
    async (init?: RequestInit, pass = password) => {
      const response = await fetch('/api/admin-concerns', {
        ...init,
        headers: { authorization: `Bearer ${pass}`, 'content-type': 'application/json', ...init?.headers },
      })
      if (response.status === 401) throw new Error('unauthorised')
      if (response.status === 429) throw new Error('Too many wrong passwords. Wait 15 minutes and try again.')
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error === 'not_configured' ? 'Admin is not configured on the server (ADMIN_PASSWORD or the database is missing).' : `Request failed (${response.status}).`)
      }
      return response.json()
    },
    [password],
  )

  const load = useCallback(
    async (pass = password) => {
      if (!pass) return
      setLoading(true)
      setError(null)
      try {
        const data = (await request(undefined, pass)) as { concerns: AdminConcern[] }
        setConcerns(data.concerns)
        setPassword(pass)
        storePassword(pass)
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (message === 'unauthorised') {
          setPassword('')
          storePassword(null)
          setConcerns(null)
          setError('Wrong password.')
        } else {
          setError(message)
        }
      } finally {
        setLoading(false)
      }
    },
    [password, request],
  )

  useEffect(() => {
    if (password) void load(password)
    // Only on first mount, with whatever password the session already had.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = useCallback(
    async (reference: string, change: { status: ConcernStatus; note: string }) => {
      const data = (await request({ method: 'PATCH', body: JSON.stringify({ reference, ...change }) })) as { concern: AdminConcern }
      setConcerns((list) => list?.map((c) => (c.reference === reference ? data.concern : c)) ?? null)
    },
    [request],
  )

  const visible = useMemo(() => {
    if (!concerns) return []
    if (filter === 'all') return concerns
    if (filter === 'open') return concerns.filter((c) => c.status !== 'closed')
    return concerns.filter((c) => c.status === filter)
  }, [concerns, filter])

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: concerns?.length ?? 0, open: 0 }
    for (const c of concerns ?? []) {
      result[c.status] = (result[c.status] ?? 0) + 1
      if (c.status !== 'closed') result.open++
    }
    return result
  }, [concerns])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
      <header className="sticky top-0 z-10" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <a href="/" className="text-sm font-bold no-underline" style={{ color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {company.name} · Concerns
          </a>
          {password && concerns && (
            <div className="flex gap-2">
              <button type="button" onClick={() => void load()} className="tap-target rounded-lg px-3 text-xs font-semibold" style={fieldStyle} disabled={loading}>
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPassword('')
                  storePassword(null)
                  setConcerns(null)
                }}
                className="tap-target rounded-lg px-3 text-xs font-semibold"
                style={fieldStyle}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!concerns ? (
          <form
            className="mx-auto mt-16 max-w-sm space-y-4 rounded-2xl p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            onSubmit={(e) => {
              e.preventDefault()
              void load(draftPassword)
            }}
          >
            <h1 className="text-lg font-bold">Sign in</h1>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Admin password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={draftPassword}
                onChange={(e) => setDraftPassword(e.target.value)}
                className="tap-target w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={fieldStyle}
              />
            </div>
            <button type="submit" disabled={loading} className="tap-target w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60" style={primaryButton}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            {error && <p role="alert" className="text-sm" style={{ color: 'var(--coral)' }}>{error}</p>}
          </form>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
              {(['open', ...STATUSES, 'all'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className="tap-target rounded-full px-4 text-xs font-semibold"
                  style={filter === f ? primaryButton : fieldStyle}
                >
                  {f === 'open' ? 'Open' : f === 'all' ? 'All' : STATUS_LABEL[f]} ({counts[f] ?? 0})
                </button>
              ))}
            </div>

            {error && <p role="alert" className="mb-4 text-sm" style={{ color: 'var(--coral)' }}>{error}</p>}

            {visible.length === 0 ? (
              <p className="py-16 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No concerns here.</p>
            ) : (
              <ul className="space-y-4">
                {visible.map((c) => (
                  <ConcernCard key={`${c.reference}-${c.updatedAt}`} concern={c} onSave={save} />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function ConcernCard({
  concern,
  onSave,
}: {
  concern: AdminConcern
  onSave: (reference: string, change: { status: ConcernStatus; note: string }) => Promise<void>
}) {
  const [status, setStatus] = useState(concern.status)
  const [note, setNote] = useState(concern.note)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const dirty = status !== concern.status || note.trim() !== concern.note

  return (
    <li className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-bold tracking-wide" style={{ color: 'var(--teal)' }}>{concern.reference}</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {formatDate(concern.createdAt)} · {concern.lang === 'ar' ? 'Arabic' : 'English'}
          {concern.projectType ? ` · ${concern.projectType}` : ''}
        </span>
      </div>

      <dl className="mb-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs" style={{ color: 'var(--text-muted)' }}>Name</dt>
          <dd>{concern.name}</dd>
        </div>
        <div>
          <dt className="text-xs" style={{ color: 'var(--text-muted)' }}>Phone</dt>
          <dd><a href={`tel:${concern.phone}`} style={{ color: 'var(--text-secondary)' }}>{concern.phone}</a></dd>
        </div>
        <div>
          <dt className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</dt>
          <dd className="break-all"><a href={`mailto:${concern.email}?subject=${encodeURIComponent(`Re: ${concern.reference}`)}`} style={{ color: 'var(--text-secondary)' }}>{concern.email}</a></dd>
        </div>
      </dl>

      <p className="mb-4 whitespace-pre-line rounded-xl px-4 py-3 text-sm" dir="auto" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
        {concern.message || <em style={{ color: 'var(--text-muted)' }}>No message.</em>}
      </p>

      <form
        className="grid gap-3 sm:grid-cols-[12rem_1fr_auto] sm:items-end"
        onSubmit={async (e) => {
          e.preventDefault()
          setSaving(true)
          setSaveError(null)
          try {
            await onSave(concern.reference, { status, note: note.trim() })
          } catch (err) {
            setSaveError(err instanceof Error ? err.message : String(err))
            setSaving(false)
          }
        }}
      >
        <div>
          <label htmlFor={`st-${concern.reference}`} className="mb-1 block text-xs" style={{ color: 'var(--text-muted)' }}>Status</label>
          <select
            id={`st-${concern.reference}`}
            value={status}
            onChange={(e) => setStatus(e.target.value as ConcernStatus)}
            className="tap-target w-full rounded-xl px-3 text-sm"
            style={fieldStyle}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} style={{ background: 'var(--bg-card)' }}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`nt-${concern.reference}`} className="mb-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
            Note shown to the client (optional)
          </label>
          <textarea
            id={`nt-${concern.reference}`}
            rows={1}
            maxLength={1000}
            dir="auto"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm"
            style={fieldStyle}
          />
        </div>
        <button type="submit" disabled={!dirty || saving} className="tap-target rounded-xl px-5 text-sm font-semibold disabled:opacity-40" style={primaryButton}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
      {saveError && <p role="alert" className="mt-2 text-sm" style={{ color: 'var(--coral)' }}>{saveError}</p>}

      <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        {concern.history.map((h) => `${STATUS_LABEL[h.status]} ${formatDate(h.at)}`).join('  →  ')}
      </p>
    </li>
  )
}
