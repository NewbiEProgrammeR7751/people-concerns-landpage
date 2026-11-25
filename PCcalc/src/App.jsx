import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NavBar from './components/NavBar'
import CalculatorView from './components/CalculatorView'
import MaintenanceView from './components/MaintenanceView'
import AdminView from './components/AdminView'
import { usePricingStore } from './store/usePricingStore'
import { dirFor } from './i18n'

const VIEW_COMPONENTS = {
  calculator: CalculatorView,
  maintenance: MaintenanceView,
  admin: AdminView,
}

export default function App() {
  const [view, setView] = useState('calculator')
  const { t, i18n } = useTranslation()
  const language = usePricingStore((state) => state.language)
  const setLanguage = usePricingStore((state) => state.setLanguage)

  // The store is the source of truth (it persists); i18next and the document
  // follow it. Setting dir/lang on <html> is what drives Tailwind's rtl:
  // variants and the browser's own bidi handling.
  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language)
    const root = document.documentElement
    root.setAttribute('dir', dirFor(language))
    root.setAttribute('lang', language)
  }, [language, i18n])

  const Current = VIEW_COMPONENTS[view] ?? CalculatorView

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Ambient wash behind the content so the dark surface is not flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(79,70,229,0.16),transparent_70%)]"
      />

      <NavBar
        view={view}
        onViewChange={setView}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <Current />
      </main>

      <footer className="relative border-t border-slate-800/60 py-6">
        <p className="mx-auto max-w-[1400px] px-4 text-xs text-slate-600 sm:px-6 lg:px-8">
          {t('footer')}
        </p>
      </footer>
    </div>
  )
}
