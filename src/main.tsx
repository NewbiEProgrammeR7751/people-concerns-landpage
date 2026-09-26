import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import PrivacyPolicy, { ROUTE as PRIVACY_ROUTE } from './pages/PrivacyPolicy'
import TermsAndConditions, { ROUTE as TERMS_ROUTE } from './pages/TermsAndConditions'
import { useRoute } from './router'
import './index.css'

function Routes() {
  const route = useRoute()

  // A hash in the URL on first paint (e.g. /privacy-policy#s11) points at a
  // section that only exists once the page has rendered, so scroll after mount.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [route])

  switch (route) {
    case TERMS_ROUTE:
      return <TermsAndConditions />
    case PRIVACY_ROUTE:
      return <PrivacyPolicy />
    default:
      // The landing page doubles as the 404 target — unknown paths show it
      // rather than a dead end.
      return <App />
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
)
