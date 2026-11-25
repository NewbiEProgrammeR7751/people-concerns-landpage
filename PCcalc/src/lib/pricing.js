/** KSA VAT. */
export const VAT_RATE = 0.15

/** Work streams overlap, so calendar time is less than the sum of estimates. */
export const PARALLEL_FACTOR = 0.6

export const DEFAULT_MARGIN = 30

/**
 * Tier rates only. Names, summaries and perk lists are translated, so they live
 * in the i18n dictionaries under `tiers.<id>`.
 */
export const MAINTENANCE_TIERS = [
  { id: 'basic', rate: 0.1 },
  { id: 'standard', rate: 0.2 },
  { id: 'premium', rate: 0.3 },
  { id: 'enterprise', rate: 0.35 },
]

const round = (value) => Math.round(value)

/**
 * Single source of truth for quote maths.
 *
 * Figures are rounded to whole riyals at each step and the total is derived
 * from those rounded parts, so the numbers shown on screen and in the PDF add
 * up exactly rather than drifting by a halala.
 */
export function computeQuote(features, profitMargin) {
  const baseCost = features.reduce((sum, feature) => sum + feature.cost, 0)
  const totalWeeks = features.reduce((sum, feature) => sum + feature.weeks, 0)
  const margin = Number.isFinite(Number(profitMargin)) ? Number(profitMargin) : 0

  // Project value the client sees: base cost plus internal markup, before VAT.
  const subtotal = round(baseCost * (1 + margin / 100))
  const vat = round(subtotal * VAT_RATE)

  return {
    count: features.length,
    baseCost: round(baseCost),
    marginAmount: subtotal - round(baseCost),
    subtotal,
    vat,
    total: subtotal + vat,
    totalWeeks,
    deliveryWeeks: Math.round(totalWeeks * PARALLEL_FACTOR * 10) / 10,
  }
}

/** Annual maintenance figures for one tier, derived from the pre-VAT quote. */
export function maintenancePlan(subtotal, rate) {
  const annual = round(subtotal * rate)
  const vat = round(annual * VAT_RATE)
  const annualTotal = annual + vat
  return { annual, vat, annualTotal, monthly: round(annualTotal / 12) }
}
