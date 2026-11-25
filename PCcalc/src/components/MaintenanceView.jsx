import { useMemo } from 'react'
import { Check, Sparkles, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePricingStore } from '../store/usePricingStore'
import { computeQuote, maintenancePlan, MAINTENANCE_TIERS, VAT_RATE } from '../lib/pricing'
import { useFormat } from '../lib/useFormat'

const VAT_PERCENT = Math.round(VAT_RATE * 100)

function PackageCard({ tier, plan, featured }) {
  const { t } = useTranslation()
  const fmt = useFormat()
  // Perk lists come back as arrays via i18next's returnObjects.
  const perks = t(`tiers.${tier.id}.perks`, { returnObjects: true })

  return (
    <div
      className={`flex flex-col rounded-2xl border p-5 transition-all duration-200 ease-in-out ${
        featured
          ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/20'
          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-100">
            {t(`tiers.${tier.id}.name`)}
          </h3>
          <p className="tabular mt-0.5 text-[11px] font-medium text-slate-500">
            {t('maintenance.percentOfProject', {
              percent: Math.round(tier.rate * 100),
            })}
          </p>
        </div>
        {featured && (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
            <Sparkles className="h-2.5 w-2.5" />
            {t('maintenance.popular')}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        {t(`tiers.${tier.id}.summary`)}
      </p>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {t('maintenance.annualTotalInclVat')}
        </p>
        <p className="tabular mt-1 text-2xl font-extrabold tracking-tight text-indigo-400">
          {fmt.sar(plan.annualTotal)}
        </p>
        <p className="tabular mt-1 text-xs text-slate-500">
          {t('maintenance.monthlyEquivalent', { value: fmt.sar(plan.monthly) })}
        </p>
      </div>

      <dl className="mt-4 space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[11px] text-slate-500">
            {t('maintenance.annualCost')}
          </dt>
          <dd className="tabular text-xs font-semibold text-slate-300">
            {fmt.sar(plan.annual)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[11px] text-slate-500">
            {t('maintenance.vat', { rate: VAT_PERCENT })}
          </dt>
          <dd className="tabular text-xs font-semibold text-slate-300">
            {fmt.sar(plan.vat)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-1.5">
          <dt className="text-[11px] font-semibold text-slate-400">
            {t('maintenance.annualTotal')}
          </dt>
          <dd className="tabular text-xs font-bold text-slate-100">
            {fmt.sar(plan.annualTotal)}
          </dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-2">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2 text-xs text-slate-400">
            <Check
              className={`mt-0.5 h-3 w-3 shrink-0 ${
                featured ? 'text-indigo-400' : 'text-slate-600'
              }`}
            />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function MaintenanceView() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const catalog = usePricingStore((state) => state.catalog)
  const selectedIds = usePricingStore((state) => state.selectedIds)
  const profitMargin = usePricingStore((state) => state.profitMargin)

  const quote = useMemo(() => {
    const features = selectedIds
      .map((id) => catalog.find((feature) => feature.id === id))
      .filter(Boolean)
    return computeQuote(features, profitMargin)
  }, [catalog, selectedIds, profitMargin])

  const empty = quote.count === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          {t('maintenance.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {t('maintenance.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
            <Wrench className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t('maintenance.projectValue')}
            </p>
            <p className="tabular text-xl font-bold tracking-tight text-slate-100">
              {fmt.sar(quote.subtotal)}
            </p>
          </div>
        </div>
        <p className="tabular text-xs text-slate-500">
          {t('maintenance.basedOn', { modules: fmt.modules(quote.count) })}
        </p>
      </div>

      {empty ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center">
          <Wrench className="mx-auto h-6 w-6 text-slate-600" />
          <p className="mt-3 text-sm font-medium text-slate-300">
            {t('maintenance.emptyTitle')}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {t('maintenance.emptyBody')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MAINTENANCE_TIERS.map((tier) => (
            <PackageCard
              key={tier.id}
              tier={tier}
              plan={maintenancePlan(quote.subtotal, tier.rate)}
              featured={tier.id === 'premium'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
