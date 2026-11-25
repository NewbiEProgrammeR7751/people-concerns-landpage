import { useMemo } from 'react'
import { Building2, Layers, ScrollText, ShieldCheck, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import FeatureCard from './FeatureCard'
import InvoiceSummary from './InvoiceSummary'
import { usePricingStore } from '../store/usePricingStore'
import { computeQuote } from '../lib/pricing'
import { useFormat } from '../lib/useFormat'

const CATEGORY_ICONS = {
  'Core HR': Layers,
  Payroll: Wallet,
  Compliance: ShieldCheck,
  'Facility Management': Building2,
}

export default function CalculatorView() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const catalog = usePricingStore((state) => state.catalog)
  const selectedIds = usePricingStore((state) => state.selectedIds)
  const profitMargin = usePricingStore((state) => state.profitMargin)
  const clientName = usePricingStore((state) => state.clientName)
  const toggleFeature = usePricingStore((state) => state.toggleFeature)
  const setProfitMargin = usePricingStore((state) => state.setProfitMargin)
  const setClientName = usePricingStore((state) => state.setClientName)
  const resetSelection = usePricingStore((state) => state.resetSelection)

  const nameById = useMemo(
    () => new Map(catalog.map((feature) => [feature.id, fmt.name(feature)])),
    [catalog, fmt],
  )

  const grouped = useMemo(() => {
    const byCategory = new Map()
    for (const feature of catalog) {
      const key = feature.category || 'Uncategorised'
      if (!byCategory.has(key)) byCategory.set(key, [])
      byCategory.get(key).push(feature)
    }
    return [...byCategory.entries()]
  }, [catalog])

  const selectedFeatures = useMemo(
    () =>
      selectedIds
        .map((id) => catalog.find((feature) => feature.id === id))
        .filter(Boolean),
    [catalog, selectedIds],
  )

  const quote = useMemo(
    () => computeQuote(selectedFeatures, profitMargin),
    [selectedFeatures, profitMargin],
  )

  const selected = useMemo(() => new Set(selectedIds), [selectedIds])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            {t('calculator.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t('calculator.subtitle')}
          </p>
        </div>

        {catalog.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center">
            <Layers className="mx-auto h-6 w-6 text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-300">
              {t('calculator.emptyTitle')}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {t('calculator.emptyBody')}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([category, features]) => {
              const Icon = CATEGORY_ICONS[category] ?? ScrollText
              return (
                <div key={category}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
                      <Icon className="h-3.5 w-3.5 text-indigo-400" />
                    </div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {fmt.category(category)}
                    </h2>
                    <span className="tabular text-[11px] font-medium text-slate-600">
                      {features.length}
                    </span>
                    <div className="ms-1 h-px flex-1 bg-slate-800" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {features.map((feature) => {
                      const isSelected = selected.has(feature.id)
                      const parentSelected =
                        feature.requiredParentId &&
                        selected.has(feature.requiredParentId)
                      return (
                        <FeatureCard
                          key={feature.id}
                          feature={feature}
                          selected={isSelected}
                          parentName={
                            feature.requiredParentId
                              ? nameById.get(feature.requiredParentId)
                              : null
                          }
                          autoIncluded={isSelected && parentSelected}
                          onToggle={() => toggleFeature(feature.id)}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <InvoiceSummary
          selectedFeatures={selectedFeatures}
          quote={quote}
          profitMargin={profitMargin}
          clientName={clientName}
          onMarginChange={setProfitMargin}
          onClientNameChange={setClientName}
          onRemove={toggleFeature}
          onClear={resetSelection}
        />
      </aside>
    </div>
  )
}
