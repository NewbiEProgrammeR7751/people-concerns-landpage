import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Link2,
  Pencil,
  RotateCcw,
  Tag,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import FeatureForm from './FeatureForm'
import { usePricingStore } from '../store/usePricingStore'
import { useFormat } from '../lib/useFormat'

const COLUMNS = [
  'admin.colFeature',
  'admin.colCategory',
  'admin.colRequires',
  'admin.colWeeks',
  'admin.colCost',
  'admin.colActions',
]

/** Refuse anything implausibly large rather than freezing the tab on it. */
const MAX_CSV_BYTES = 2 * 1024 * 1024

const readTextFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    // Rejected with an i18n key; the caller turns it into a message.
    reader.onerror = () => reject(new Error('unreadable'))
    reader.readAsText(file)
  })

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="tabular mt-2 text-2xl font-bold tracking-tight text-slate-100">
        {value}
      </p>
    </div>
  )
}

function ImportResult({ result, onDismiss }) {
  const { t } = useTranslation()
  const { added, errors, name } = result
  const tone = added === 0 ? 'error' : errors.length > 0 ? 'warn' : 'ok'
  const Icon = tone === 'ok' ? CheckCircle2 : AlertTriangle
  const styles = {
    ok: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    warn: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300',
  }[tone]

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${styles}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {added > 0
            ? t('import.success', { count: added })
            : t('import.nothing')}
        </p>
        <p className="mt-0.5 truncate text-xs opacity-80">{name}</p>
        {errors.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-xs opacity-90">
            {errors.slice(0, 4).map((issue) => (
              <li key={`${issue.row}-${issue.key}`}>
                {issue.row > 0 ? t('import.rowPrefix', { row: issue.row }) : ''}
                {t(`import.${issue.key}`, {
                  value: issue.value ? `"${issue.value}"` : t('import.blank'),
                })}
              </li>
            ))}
            {errors.length > 4 && (
              <li className="opacity-70">
                {t('import.andMore', { count: errors.length - 4 })}
              </li>
            )}
          </ul>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t('import.dismiss')}
        className="rounded-md p-1 opacity-70 transition-opacity duration-200 hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default function AdminView() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const catalog = usePricingStore((state) => state.catalog)
  const selectedIds = usePricingStore((state) => state.selectedIds)
  const addFeature = usePricingStore((state) => state.addFeature)
  const updateFeature = usePricingStore((state) => state.updateFeature)
  const deleteFeature = usePricingStore((state) => state.deleteFeature)
  const importCSV = usePricingStore((state) => state.importCSV)
  const resetCatalog = usePricingStore((state) => state.resetCatalog)

  const [editingId, setEditingId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  const editing = catalog.find((feature) => feature.id === editingId) ?? null

  const nameById = useMemo(
    () => new Map(catalog.map((feature) => [feature.id, fmt.name(feature)])),
    [catalog, fmt],
  )

  const stats = useMemo(() => {
    const categories = new Set(catalog.map((feature) => feature.category))
    const cost = catalog.reduce((sum, feature) => sum + feature.cost, 0)
    const weeks = catalog.reduce((sum, feature) => sum + feature.weeks, 0)
    return { count: catalog.length, categories: categories.size, cost, weeks }
  }, [catalog])

  const handleSubmit = (values) => {
    if (editing) {
      updateFeature(editing.id, values)
      setEditingId(null)
    } else {
      addFeature(values)
    }
  }

  // Two-step delete: the first click arms the button, the second commits.
  const handleDelete = (id) => {
    if (pendingDeleteId !== id) {
      setPendingDeleteId(id)
      return
    }
    deleteFeature(id)
    setPendingDeleteId(null)
    if (editingId === id) setEditingId(null)
  }

  const handleImportFile = async (file) => {
    setImportResult(null)
    setImporting(true)
    try {
      if (file.size > MAX_CSV_BYTES) throw new Error('tooLarge')
      const text = await readTextFile(file)
      const { added, errors } = importCSV(text)
      setImportResult({ added, errors, name: file.name })
    } catch (cause) {
      console.error('CSV import failed', cause)
      const known = ['tooLarge', 'unreadable'].includes(cause.message)
      setImportResult({
        added: 0,
        errors: [{ row: 0, key: known ? cause.message : 'failed' }],
        name: file.name,
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            {t('admin.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{t('admin.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={resetCatalog}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 transition-all duration-200 ease-in-out hover:border-slate-700 hover:text-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t('admin.reset')}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Database}
          label={t('admin.statFeatures')}
          value={stats.count}
        />
        <StatCard
          icon={Tag}
          label={t('admin.statCategories')}
          value={stats.categories}
        />
        <StatCard
          icon={Clock}
          label={t('admin.statEffort')}
          value={fmt.weeks(stats.weeks)}
        />
        <StatCard
          icon={Wallet}
          label={t('admin.statValue')}
          value={fmt.sar(stats.cost)}
        />
      </div>

      <FeatureForm
        key={editing?.id ?? 'new'}
        editing={editing}
        catalog={catalog}
        importing={importing}
        onSubmit={handleSubmit}
        onCancel={() => setEditingId(null)}
        onImportFile={handleImportFile}
      />

      {importResult && (
        <ImportResult
          result={importResult}
          onDismiss={() => setImportResult(null)}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-start">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                {COLUMNS.map((key, index) => (
                  <th
                    key={key}
                    className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ${
                      index >= 3 ? 'text-end' : 'text-start'
                    }`}
                  >
                    {index === COLUMNS.length - 1 ? (
                      <span className="sr-only">{t(key)}</span>
                    ) : (
                      t(key)
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catalog.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-5 py-14 text-center text-sm text-slate-500"
                  >
                    {t('admin.emptyTable')}
                  </td>
                </tr>
              ) : (
                catalog.map((feature) => {
                  const isEditing = editingId === feature.id
                  const confirming = pendingDeleteId === feature.id
                  return (
                    <tr
                      key={feature.id}
                      className={`border-b border-slate-800/70 transition-all duration-200 ease-in-out last:border-0 ${
                        isEditing ? 'bg-indigo-500/5' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-100">
                            {fmt.name(feature)}
                          </span>
                          {selectedIds.includes(feature.id) && (
                            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                              {t('admin.inQuote')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-400">
                          {fmt.category(feature.category)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {feature.requiredParentId ? (
                          <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Link2 className="h-3 w-3 shrink-0 text-slate-600" />
                            <span className="truncate">
                              {nameById.get(feature.requiredParentId) ??
                                t('admin.unknown')}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">
                            {'—'}
                          </span>
                        )}
                      </td>
                      <td className="tabular px-5 py-3.5 text-end text-xs text-slate-400">
                        {feature.weeks}
                      </td>
                      <td className="tabular px-5 py-3.5 text-end text-sm font-semibold text-slate-200">
                        {fmt.sar(feature.cost)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(feature.id)
                              setPendingDeleteId(null)
                            }}
                            aria-label={t('admin.edit', {
                              name: fmt.name(feature),
                            })}
                            className="rounded-lg p-2 text-slate-400 transition-all duration-200 ease-in-out hover:bg-slate-800 hover:text-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(feature.id)}
                            onBlur={() => setPendingDeleteId(null)}
                            aria-label={t(
                              confirming
                                ? 'admin.confirmDelete'
                                : 'admin.delete',
                              { name: fmt.name(feature) },
                            )}
                            className={`flex items-center gap-1.5 rounded-lg p-2 text-red-400 transition-all duration-200 ease-in-out hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                              confirming
                                ? 'bg-red-500/10 px-2.5 text-xs font-semibold'
                                : ''
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                            {confirming && t('admin.confirm')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
