import { Check, Clock, Link2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ToggleSwitch from './ToggleSwitch'
import { useFormat } from '../lib/useFormat'

export default function FeatureCard({
  feature,
  selected,
  parentName,
  autoIncluded,
  onToggle,
}) {
  const { t } = useTranslation()
  const fmt = useFormat()

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`group w-full rounded-xl border p-4 text-start transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        selected
          ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/20'
          : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`truncate text-sm font-semibold transition-colors duration-200 ${
                selected ? 'text-indigo-200' : 'text-slate-100'
              }`}
            >
              {fmt.name(feature)}
            </h3>
            {selected && (
              <Check className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            )}
          </div>

          {parentName && (
            <p
              className={`mt-1.5 flex items-center gap-1.5 text-[11px] ${
                autoIncluded ? 'text-amber-400/90' : 'text-slate-500'
              }`}
            >
              <Link2 className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {t(
                  autoIncluded ? 'calculator.addedWith' : 'calculator.requires',
                  { name: parentName },
                )}
              </span>
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <span
              className={`tabular text-sm font-bold transition-colors duration-200 ${
                selected ? 'text-indigo-300' : 'text-slate-300'
              }`}
            >
              {fmt.sar(feature.cost)}
            </span>
            <span className="tabular flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Clock className="h-3 w-3" />
              {fmt.weeks(feature.weeks)}
            </span>
          </div>
        </div>
        <ToggleSwitch checked={selected} />
      </div>
    </button>
  )
}
