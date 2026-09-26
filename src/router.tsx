import { useCallback, useEffect, useState } from 'react'

/**
 * Minimal history router. The site has three routes, so a dependency-free
 * ~50-line router is preferred over pulling in react-router. Vite's dev and
 * preview servers already fall back to index.html for unknown paths, so deep
 * links to /terms-and-conditions work without extra config.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Strips the deploy base so routes can be written as plain absolute paths. */
function toRoute(pathname: string): string {
  const path = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname
  return path.replace(/\/+$/, '') || '/'
}

/** Prefixes a route with the deploy base for use in href / pushState. */
export function href(route: string): string {
  return `${BASE}${route}` || '/'
}

export function navigate(route: string, hash = '') {
  window.history.pushState({}, '', href(route) + hash)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/** Current route, kept in sync with back/forward navigation. */
export function useRoute(): string {
  const [route, setRoute] = useState(() => toRoute(window.location.pathname))

  useEffect(() => {
    const onPop = () => setRoute(toRoute(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return route
}

type LinkProps = Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> & {
  /** In-app route, e.g. "/privacy-policy". */
  to: string
  /** Optional fragment appended to the route, e.g. "#s5". */
  hash?: string
}

/**
 * Anchor that routes client-side but stays a real <a href> so it can be
 * middle-clicked, opened in a new tab and crawled.
 */
export function Link({ to, hash = '', onClick, ...rest }: LinkProps) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      // Let the browser handle modified clicks and anything but the left button.
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
      event.preventDefault()
      navigate(to, hash)
      if (!hash) window.scrollTo({ top: 0 })
    },
    [to, hash, onClick],
  )

  return <a href={href(to) + hash} onClick={handleClick} {...rest} />
}
