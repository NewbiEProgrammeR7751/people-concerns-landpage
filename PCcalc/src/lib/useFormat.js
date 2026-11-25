import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { featureName, formatSar, roundWeeks } from './format'

/**
 * Display helpers bound to the active language, so components never have to
 * thread the locale through by hand.
 */
export function useFormat() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return useMemo(
    () => ({
      lang,
      sar: (amount) => formatSar(amount, lang),
      weeks: (value) => t('units.weeks', { count: roundWeeks(value) }),
      modules: (count) => t('units.modules', { count }),
      name: (feature) => featureName(feature, lang),
      // Seeded categories are translated; anything typed in stays as written.
      category: (value) => t(`categories.${value}`, { defaultValue: value }),
    }),
    [lang, t],
  )
}
