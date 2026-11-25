import { useRef, useState } from 'react'
import { Loader2, Plus, Save, Upload, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '../store/usePricingStore'
import { wouldCycle } from '../lib/dependencies'
import { useFormat } from '../lib/useFormat'

const EMPTY = {
  nameEn: '',
  nameAr: '',
  category: '',
  cost: '',
  weeks: '',
  requiredParentId: '',
}

const fieldClass =
  'w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 transition-all duration-200 ease-in-out focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'

const labelClass =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500'

/**
 * Add/edit form. The parent remounts it via `key` when the edit target changes,
 * so the initial state below is always in step with `editing`.
 */
export default function FeatureForm({
  editing,
  catalog,
  importing,
  onSubmit,
  onCancel,
  onImportFile,
}) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const [values, setValues] = useState(() =>
    editing
      ? {
          nameEn: editing.nameEn,
          nameAr: editing.nameAr ?? '',
          category: editing.category,
          cost: String(editing.cost),
          weeks: String(editing.weeks),
          requiredParentId: editing.requiredParentId ?? '',
        }
      : EMPTY,
  )
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  const setField = (key) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // A feature cannot require itself or anything that already depends on it.
  const parentOptions = catalog.filter(
    (feature) =>
      !editing ||
      (feature.id !== editing.id &&
        !wouldCycle(catalog, editing.id, feature.id)),
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!values.nameEn.trim()) nextErrors.nameEn = t('form.required')
    if (!values.category.trim()) nextErrors.category = t('form.required')

    const cost = Number(values.cost)
    if (values.cost === '' || Number.isNaN(cost) || cost < 0) {
      nextErrors.cost = t('form.invalidAmount')
    }
    const weeks = Number(values.weeks)
    if (values.weeks === '' || Number.isNaN(weeks) || weeks < 0) {
      nextErrors.weeks = t('form.invalidDuration')
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      nameEn: values.nameEn,
      nameAr: values.nameAr,
      category: values.category,
      cost,
      weeks,
      requiredParentId: values.requiredParentId || null,
    })
    setValues(EMPTY)
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    // Reset so picking the same file again still fires a change event.
    event.target.value = ''
    if (file) onImportFile(file)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/40"
    >
      <div className="mb-5">
        <h2 className="text-sm font-semibold tracking-tight text-slate-100">
          {t(editing ? 'form.editTitle' : 'form.addTitle')}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {editing
            ? t('form.editSubtitle', { name: fmt.name(editing) })
            : t('form.addSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-3">
          <label className={labelClass} htmlFor="feature-name-en">
            {t('form.nameEn')}
          </label>
          <input
            id="feature-name-en"
            dir="ltr"
            className={`${fieldClass} text-start`}
            value={values.nameEn}
            onChange={setField('nameEn')}
            placeholder={t('form.namePlaceholder')}
          />
          {errors.nameEn && (
            <p className="mt-1 text-[11px] text-red-400">{errors.nameEn}</p>
          )}
        </div>

        <div className="md:col-span-3">
          <label className={labelClass} htmlFor="feature-name-ar">
            {t('form.nameAr')}
          </label>
          <input
            id="feature-name-ar"
            dir="rtl"
            lang="ar"
            className={`${fieldClass} text-start`}
            value={values.nameAr}
            onChange={setField('nameAr')}
            placeholder={t('form.nameArPlaceholder')}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="feature-category">
            {t('form.category')}
          </label>
          <input
            id="feature-category"
            list="feature-categories"
            className={fieldClass}
            value={values.category}
            onChange={setField('category')}
            placeholder={t('form.categoryPlaceholder')}
          />
          <datalist id="feature-categories">
            {CATEGORIES.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {errors.category && (
            <p className="mt-1 text-[11px] text-red-400">{errors.category}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="feature-cost">
            {t('form.cost')}
          </label>
          <input
            id="feature-cost"
            type="number"
            min="0"
            step="any"
            dir="ltr"
            className={`${fieldClass} tabular text-start`}
            value={values.cost}
            onChange={setField('cost')}
            placeholder="0"
          />
          {errors.cost && (
            <p className="mt-1 text-[11px] text-red-400">{errors.cost}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="feature-weeks">
            {t('form.weeks')}
          </label>
          <input
            id="feature-weeks"
            type="number"
            min="0"
            step="0.5"
            dir="ltr"
            className={`${fieldClass} tabular text-start`}
            value={values.weeks}
            onChange={setField('weeks')}
            placeholder="0"
          />
          {errors.weeks && (
            <p className="mt-1 text-[11px] text-red-400">{errors.weeks}</p>
          )}
        </div>

        <div className="md:col-span-12">
          <label className={labelClass} htmlFor="feature-parent">
            {t('form.requires')}
          </label>
          <select
            id="feature-parent"
            className={fieldClass}
            value={values.requiredParentId}
            onChange={setField('requiredParentId')}
          >
            <option value="">{t('form.noPrerequisite')}</option>
            {parentOptions.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {fmt.category(feature.category)} — {fmt.name(feature)}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] text-slate-600">
            {t('form.requiresHelp')}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 ease-in-out hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:cursor-wait disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {t('form.importCsv')}
          </button>
          <p className="mt-1.5 text-[11px] text-slate-600">
            {t('form.csvColumns')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-200 ease-in-out hover:border-slate-600 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
              {t('form.cancel')}
            </button>
          )}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 ease-in-out hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {editing ? (
              <>
                <Save className="h-4 w-4" />
                {t('form.save')}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {t('form.add')}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
