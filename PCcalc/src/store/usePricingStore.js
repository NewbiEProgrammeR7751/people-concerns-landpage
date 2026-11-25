import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ancestorsOf, descendantsOf } from '../lib/dependencies'
import { parseFeatureCsv } from '../lib/parseCsv'
import { DEFAULT_MARGIN } from '../lib/pricing'

/** Categories offered in the admin form. Free-form entries are also allowed. */
export const CATEGORIES = [
  'Core HR',
  'Payroll',
  'Compliance',
  'Facility Management',
]

/**
 * Seeded HR & Facility catalog. Costs are in SAR, weeks are build estimates,
 * and `requiredParentId` encodes real prerequisites — WPS Integration needs the
 * Payroll Engine, which in turn needs the Employee Database.
 */
const DEFAULT_CATALOG = [
  // --- Core HR ---
  {
    id: 'hr-employee-db',
    category: 'Core HR',
    nameEn: 'Employee Database',
    nameAr: 'قاعدة بيانات الموظفين',
    cost: 45000,
    weeks: 6,
    requiredParentId: null,
  },
  {
    id: 'hr-org-chart',
    category: 'Core HR',
    nameEn: 'Org Chart & Hierarchy',
    nameAr: 'الهيكل التنظيمي والتسلسل الإداري',
    cost: 18000,
    weeks: 3,
    requiredParentId: 'hr-employee-db',
  },
  {
    id: 'hr-self-service',
    category: 'Core HR',
    nameEn: 'Employee Self-Service Portal',
    nameAr: 'بوابة الخدمة الذاتية للموظفين',
    cost: 32000,
    weeks: 5,
    requiredParentId: 'hr-employee-db',
  },
  {
    id: 'hr-onboarding',
    category: 'Core HR',
    nameEn: 'Onboarding & Offboarding Workflows',
    nameAr: 'إجراءات التعيين وإنهاء الخدمة',
    cost: 26000,
    weeks: 4,
    requiredParentId: 'hr-employee-db',
  },
  {
    id: 'hr-leave',
    category: 'Core HR',
    nameEn: 'Leave & Attendance Management',
    nameAr: 'إدارة الإجازات والحضور',
    cost: 29000,
    weeks: 4,
    requiredParentId: 'hr-employee-db',
  },

  // --- Payroll ---
  {
    id: 'pay-engine',
    category: 'Payroll',
    nameEn: 'Payroll Engine',
    nameAr: 'محرك الرواتب',
    cost: 65000,
    weeks: 8,
    requiredParentId: 'hr-employee-db',
  },
  {
    id: 'pay-wps',
    category: 'Payroll',
    nameEn: 'WPS Integration',
    nameAr: 'التكامل مع نظام حماية الأجور',
    cost: 38000,
    weeks: 5,
    requiredParentId: 'pay-engine',
  },
  {
    id: 'pay-eos',
    category: 'Payroll',
    nameEn: 'End-of-Service Calculator',
    nameAr: 'حاسبة مكافأة نهاية الخدمة',
    cost: 22000,
    weeks: 3,
    requiredParentId: 'pay-engine',
  },
  {
    id: 'pay-payslip',
    category: 'Payroll',
    nameEn: 'Digital Payslips',
    nameAr: 'قسائم الرواتب الرقمية',
    cost: 15000,
    weeks: 2,
    requiredParentId: 'pay-engine',
  },

  // --- Compliance ---
  {
    id: 'comp-gosi',
    category: 'Compliance',
    nameEn: 'GOSI Integration',
    nameAr: 'التكامل مع التأمينات الاجتماعية',
    cost: 34000,
    weeks: 4,
    requiredParentId: 'hr-employee-db',
  },
  {
    id: 'comp-iqama',
    category: 'Compliance',
    nameEn: 'Iqama & Visa Expiry Tracking',
    nameAr: 'متابعة انتهاء الإقامات والتأشيرات',
    cost: 21000,
    weeks: 3,
    requiredParentId: 'hr-employee-db',
  },
  {
    id: 'comp-saudization',
    category: 'Compliance',
    nameEn: 'Saudization (Nitaqat) Dashboard',
    nameAr: 'لوحة السعودة (نطاقات)',
    cost: 28000,
    weeks: 4,
    requiredParentId: 'hr-employee-db',
  },

  // --- Facility Management ---
  {
    id: 'fac-assets',
    category: 'Facility Management',
    nameEn: 'Asset & Equipment Register',
    nameAr: 'سجل الأصول والمعدات',
    cost: 30000,
    weeks: 4,
    requiredParentId: null,
  },
  {
    id: 'fac-tickets',
    category: 'Facility Management',
    nameEn: 'Maintenance Ticketing',
    nameAr: 'تذاكر الصيانة',
    cost: 36000,
    weeks: 5,
    requiredParentId: 'fac-assets',
  },
  {
    id: 'fac-preventive',
    category: 'Facility Management',
    nameEn: 'Preventive Maintenance Scheduler',
    nameAr: 'جدولة الصيانة الوقائية',
    cost: 27000,
    weeks: 4,
    requiredParentId: 'fac-tickets',
  },
  {
    id: 'fac-vendor',
    category: 'Facility Management',
    nameEn: 'Vendor & Contract Management',
    nameAr: 'إدارة الموردين والعقود',
    cost: 24000,
    weeks: 3,
    requiredParentId: 'fac-assets',
  },
]

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `feat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const normalise = (feature) => ({
  nameEn: String(feature.nameEn ?? '').trim(),
  nameAr: String(feature.nameAr ?? '').trim(),
  category: String(feature.category ?? '').trim() || 'Uncategorised',
  cost: Math.max(0, Number(feature.cost) || 0),
  weeks: Math.max(0, Number(feature.weeks) || 0),
  requiredParentId: feature.requiredParentId || null,
})

const freshState = () => ({
  catalog: DEFAULT_CATALOG,
  selectedIds: [],
  profitMargin: DEFAULT_MARGIN,
  clientName: '',
  language: 'en',
})

export const usePricingStore = create(
  persist(
    (set, get) => ({
      ...freshState(),

      /**
       * Selecting a feature pulls in every prerequisite above it; clearing one
       * drops everything that depends on it. Either way the quote stays valid.
       */
      toggleFeature: (id) =>
        set((state) => {
          const selected = new Set(state.selectedIds)
          if (selected.has(id)) {
            selected.delete(id)
            for (const child of descendantsOf(state.catalog, id)) {
              selected.delete(child)
            }
          } else {
            selected.add(id)
            for (const parent of ancestorsOf(state.catalog, id)) {
              selected.add(parent)
            }
          }
          // Preserve catalog order so the invoice reads top-down.
          return {
            selectedIds: state.catalog
              .filter((feature) => selected.has(feature.id))
              .map((feature) => feature.id),
          }
        }),

      setProfitMargin: (profitMargin) =>
        set({ profitMargin: Math.min(90, Math.max(0, Number(profitMargin) || 0)) }),

      setClientName: (clientName) => set({ clientName }),

      setLanguage: (language) => set({ language }),

      resetSelection: () => set({ selectedIds: [], clientName: '' }),

      addFeature: (feature) =>
        set((state) => ({
          catalog: [...state.catalog, { id: newId(), ...normalise(feature) }],
        })),

      updateFeature: (id, patch) =>
        set((state) => ({
          catalog: state.catalog.map((feature) =>
            feature.id === id
              ? { ...feature, ...normalise({ ...feature, ...patch }) }
              : feature,
          ),
        })),

      deleteFeature: (id) =>
        set((state) => {
          // Drop the feature, deselect it and anything that required it, and
          // orphan its direct children rather than leaving dangling parent ids.
          const doomed = new Set([id, ...descendantsOf(state.catalog, id)])
          return {
            catalog: state.catalog
              .filter((feature) => feature.id !== id)
              .map((feature) =>
                feature.requiredParentId === id
                  ? { ...feature, requiredParentId: null }
                  : feature,
              ),
            selectedIds: state.selectedIds.filter(
              (selectedId) => !doomed.has(selectedId),
            ),
          }
        }),

      /**
       * Parses raw CSV text and appends whatever is valid. Returns a summary so
       * the caller can report how it went; invalid rows are skipped, not fatal.
       */
      importCSV: (text) => {
        const { features, errors, totalRows } = parseFeatureCsv(text)
        if (features.length > 0) {
          set((state) => ({
            catalog: [
              ...state.catalog,
              ...features.map((feature) => ({
                id: newId(),
                ...normalise(feature),
              })),
            ],
          }))
        }
        return { added: features.length, errors, totalRows }
      },

      resetCatalog: () =>
        set({
          ...freshState(),
          profitMargin: get().profitMargin,
          language: get().language,
        }),
    }),
    {
      name: 'pccalc',
      version: 3,
      migrate: (persisted, version) => {
        // v1 stored { price } features and selectedFeatureIds, which cannot be
        // mapped onto { cost, weeks, requiredParentId }; start clean instead.
        if (version < 2) return freshState()
        // v2 -> v3: a single `name` becomes the English name; Arabic starts
        // blank and falls back to English until someone fills it in.
        if (version < 3) {
          return {
            ...freshState(),
            ...persisted,
            language: 'en',
            catalog: (persisted.catalog ?? []).map(({ name, ...rest }) => ({
              ...rest,
              nameEn: rest.nameEn ?? name ?? '',
              nameAr: rest.nameAr ?? '',
            })),
          }
        }
        return persisted
      },
    },
  ),
)
