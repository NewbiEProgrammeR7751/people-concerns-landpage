/** All catalog costs are held and quoted in Saudi riyals. */
export const CURRENCY = 'SAR'

/**
 * Arabic uses Latin digits deliberately: Saudi B2B finance overwhelmingly
 * quotes in them, they keep the tabular columns aligned, and they match the
 * English-only PDF.
 */
const LOCALES = { en: 'en-US', ar: 'ar-SA-u-nu-latn' }

const cache = new Map()
const formatter = (lang) => {
  const locale = LOCALES[lang] ?? LOCALES.en
  if (!cache.has(locale)) {
    cache.set(
      locale,
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: CURRENCY,
        maximumFractionDigits: 0,
      }),
    )
  }
  return cache.get(locale)
}

/** "SAR 45,000" in English, "45,000 ر.س." in Arabic. */
export const formatSar = (amount, lang = 'en') =>
  formatter(lang).format(Number(amount) || 0)

/** Weeks carry at most one decimal, since delivery applies a 0.6 factor. */
export const roundWeeks = (weeks) => Math.round((Number(weeks) || 0) * 10) / 10

/** English-only week label, for the PDF. The UI uses the i18n plural forms. */
export const formatWeeks = (weeks) => {
  const value = roundWeeks(weeks)
  return `${value} ${value === 1 ? 'week' : 'weeks'}`
}

/** Arabic name when present and Arabic is active, English otherwise. */
export const featureName = (feature, lang = 'en') =>
  lang === 'ar' && feature.nameAr ? feature.nameAr : feature.nameEn
