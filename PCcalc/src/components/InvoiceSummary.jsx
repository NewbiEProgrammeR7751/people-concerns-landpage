import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  CalendarClock,
  Check,
  Download,
  EyeOff,
  FileText,
  Loader2,
  Receipt,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFormat } from '../lib/useFormat'
import { PARALLEL_FACTOR, VAT_RATE } from '../lib/pricing'
import { exportQuotePdf } from '../lib/exportQuote'

function Row({ label, value, muted, strong }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={`text-xs ${muted ? 'text-slate-500' : 'text-slate-400'} ${
          strong ? 'font-semibold text-slate-300' : ''
        }`}
      >
        {label}
      </span>
      <span
        className={`tabular text-sm ${
          strong ? 'font-bold text-slate-100' : 'font-semibold text-slate-300'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export default function InvoiceSummary({
  selectedFeatures,
  quote,
  profitMargin,
  clientName,
  onMarginChange,
  onClientNameChange,
  onRemove,
  onClear,
}) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleExport = async () => {
    if (status === 'working') return
    clearTimeout(timerRef.current)
    setError(null)
    setStatus('working')
    try {
      await exportQuotePdf({ features: selectedFeatures, quote, clientName })
      setStatus('done')
    } catch (cause) {
      console.error('Quote export failed', cause)
      setError(cause instanceof Error ? cause.message : t('quote.exportFailed'))
      setStatus('error')
    }
    timerRef.current = setTimeout(() => setStatus('idle'), 2600)
  }

  const empty = selectedFeatures.length === 0
  const disabled = empty || status === 'working'

  const buttonTone =
    disabled && status !== 'working'
      ? 'cursor-not-allowed bg-slate-800 text-slate-600'
      : status === 'done'
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
        : status === 'error'
          ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
          : status === 'working'
            ? 'cursor-wait bg-indigo-600/70 text-white'
            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500'

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Receipt className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-semibold tracking-tight text-slate-100">
            {t('quote.title')}
          </h2>
        </div>
        <span className="tabular rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
          {fmt.modules(quote.count)}
        </span>
      </div>

      <div className="border-b border-slate-800 px-5 py-4">
        <label
          className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
          htmlFor="client-name"
        >
          <User className="h-3 w-3" />
          {t('quote.preparedFor')}
        </label>
        <input
          id="client-name"
          value={clientName}
          onChange={(event) => onClientNameChange(event.target.value)}
          maxLength={60}
          placeholder={t('quote.clientPlaceholder')}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 transition-all duration-200 ease-in-out focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      <div className="scrollbar-slim max-h-[32vh] overflow-y-auto px-5 py-4">
        {empty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
              <FileText className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">
                {t('quote.emptyTitle')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {t('quote.emptyBody')}
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-1">
            {selectedFeatures.map((feature) => (
              <li
                key={feature.id}
                className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-all duration-200 ease-in-out hover:bg-slate-800/70"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {fmt.name(feature)}
                  </p>
                  <p className="tabular truncate text-[11px] text-slate-500">
                    {fmt.category(feature.category)} · {fmt.weeks(feature.weeks)}
                  </p>
                </div>
                <span className="tabular text-sm font-semibold text-slate-300">
                  {fmt.sar(feature.cost)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(feature.id)}
                  aria-label={t('quote.remove', { name: fmt.name(feature) })}
                  className="rounded-md p-1 text-slate-600 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100 hover:bg-slate-700 hover:text-red-400 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Internal controls — deliberately excluded from the exported PDF. */}
      <div className="border-y border-dashed border-slate-700/60 bg-slate-950/40 px-5 py-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400/80">
            <EyeOff className="h-3 w-3" />
            {t('quote.internalOnly')}
          </span>
          <span className="tabular text-xs font-bold text-slate-200">
            {t('quote.marginLabel', { value: profitMargin })}
          </span>
        </div>
        <label className="sr-only" htmlFor="profit-margin">
          {t('quote.marginSlider')}
        </label>
        <input
          id="profit-margin"
          type="range"
          min="0"
          max="90"
          step="1"
          value={profitMargin}
          onChange={(event) => onMarginChange(event.target.value)}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-indigo-500"
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span className="tabular">
            {t('quote.baseCost', { value: fmt.sar(quote.baseCost) })}
          </span>
          <span className="tabular">
            {t('quote.markup', { value: fmt.sar(quote.marginAmount) })}
          </span>
        </div>
      </div>

      <div className="border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <CalendarClock className="h-3 w-3" />
          {t('quote.deliveryTimeline')}
        </div>
        <div className="mt-2.5 flex items-end justify-between">
          <div className="text-xs text-slate-500">
            <p className="tabular">
              {t('quote.effort', { weeks: fmt.weeks(quote.totalWeeks) })}
            </p>
            <p className="tabular mt-0.5">
              {t('quote.parallelFactor', { factor: PARALLEL_FACTOR })}
            </p>
          </div>
          <p className="tabular text-xl font-bold text-slate-100">
            {fmt.weeks(quote.deliveryWeeks)}
          </p>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="space-y-2">
          <Row label={t('quote.subtotal')} value={fmt.sar(quote.subtotal)} />
          <Row
            label={t('quote.vat', { rate: Math.round(VAT_RATE * 100) })}
            value={fmt.sar(quote.vat)}
            muted
          />
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-slate-800 pt-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {t('quote.finalQuote')}
          </p>
          <p className="tabular text-3xl font-extrabold tracking-tight text-indigo-400">
            {fmt.sar(quote.total)}
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={disabled}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${buttonTone}`}
          >
            {status === 'working' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('quote.generating')}
              </>
            )}
            {status === 'done' && (
              <>
                <Check className="h-4 w-4" />
                {t('quote.downloaded')}
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="h-4 w-4" />
                {t('quote.exportFailed')}
              </>
            )}
            {status === 'idle' && (
              <>
                <Download className="h-4 w-4" />
                {t('quote.export')}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={empty && !clientName}
            aria-label={t('quote.clear')}
            title={t('quote.clear')}
            className={`rounded-xl border px-3 py-2.5 transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              empty && !clientName
                ? 'cursor-not-allowed border-slate-800 text-slate-700'
                : 'border-slate-700 text-slate-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400'
            }`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-2 text-[11px] text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
