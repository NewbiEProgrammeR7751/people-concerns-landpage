import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import LegalDocumentPage from './pages/LegalDocumentPage'
import AdminPage from './pages/AdminPage'
import { matchLegalRoute } from './content/legal'
import { useRoute } from './router'
import './index.css'

function Routes() {
  const route = useRoute()
  const legal = matchLegalRoute(route)

  // A hash in the URL on first paint (e.g. /privacy-policy#s11) points at a
  // section that only exists once the page has rendered, so scroll after mount.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [route])

  if (route === '/admin') return <AdminPage />

  if (legal) {
    // Keyed so switching language remounts rather than reusing the open/closed
    // state of the previous language's table of contents.
    return <LegalDocumentPage key={`${legal.id}-${legal.lang}`} id={legal.id} lang={legal.lang} />
  }

  // The landing page doubles as the 404 target — unknown paths show it rather
  // than a dead end.
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
)
