import { Calculator, Languages, LayoutDashboard, LifeBuoy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'

const VIEWS = [
  { id: 'calculator', key: 'nav.calculator', icon: Calculator },
  { id: 'maintenance', key: 'nav.maintenance', icon: LifeBuoy },
  { id: 'admin', key: 'nav.admin', icon: LayoutDashboard },
]

export default function NavBar({ view, onViewChange, language, onLanguageChange }) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-extrabold tracking-tight text-white shadow-lg shadow-indigo-500/30">
            PC
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-slate-100">
              PCcalc
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              {t('brand.tagline')}
            </p>
          </div>
        </div>

        <nav className="order-last flex w-full items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 sm:order-none sm:ms-6 sm:w-auto">
          {VIEWS.map(({ id, key, icon: Icon }) => {
            const active = view === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onViewChange(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out sm:flex-none ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(key)}
              </button>
            )
          })}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <div
            role="group"
            aria-label={t('nav.language')}
            className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1"
          >
            <Languages className="ms-1.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
            {LANGUAGES.map(({ code, label, name }) => (
              <button
                key={code}
                type="button"
                lang={code}
                title={name}
                aria-pressed={language === code}
                onClick={() => onLanguageChange(code)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ease-in-out ${
                  language === code
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 lg:flex">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t('nav.currency')}
            </span>
            <span className="text-xs font-semibold text-indigo-300">SAR</span>
          </div>
        </div>
      </div>
    </header>
  )
}
