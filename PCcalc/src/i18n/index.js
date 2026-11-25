import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English', dir: 'ltr' },
  { code: 'ar', label: 'AR', name: 'العربية', dir: 'rtl' },
]

export const dirFor = (code) =>
  LANGUAGES.find((lang) => lang.code === code)?.dir ?? 'ltr'

const en = {
  nav: {
    calculator: 'Calculator',
    maintenance: 'Maintenance',
    admin: 'Admin Dashboard',
    currency: 'Currency',
    language: 'Language',
  },
  brand: { tagline: 'People Concerns' },
  footer:
    'PCcalc — People Concerns internal quoting engine. Estimates are indicative and expire after 30 days.',

  units: {
    weeks_one: '{{count}} week',
    weeks_other: '{{count}} weeks',
    modules_one: '{{count}} module',
    modules_other: '{{count}} modules',
    items_one: '{{count}} item',
    items_other: '{{count}} items',
  },

  categories: {
    'Core HR': 'Core HR',
    Payroll: 'Payroll',
    Compliance: 'Compliance',
    'Facility Management': 'Facility Management',
    Uncategorised: 'Uncategorised',
  },

  calculator: {
    title: 'Build your estimate',
    subtitle:
      'Select the modules this client needs. Prerequisites are pulled in automatically.',
    emptyTitle: 'The catalog is empty',
    emptyBody: 'Add features from the Admin Dashboard to start quoting.',
    requires: 'Requires {{name}}',
    addedWith: 'Added with {{name}}',
  },

  quote: {
    title: 'Quote Summary',
    preparedFor: 'Prepared for',
    clientPlaceholder: 'Client or company name',
    emptyTitle: 'No modules selected',
    emptyBody: 'Pick features from the catalog to build a quote.',
    remove: 'Remove {{name}}',
    internalOnly: 'Internal only',
    marginLabel: '{{value}}% margin',
    marginSlider: 'Profit margin percentage',
    baseCost: 'Base cost {{value}}',
    markup: 'Markup +{{value}}',
    deliveryTimeline: 'Delivery timeline',
    effort: '{{weeks}} of effort',
    parallelFactor: '× {{factor}} parallel factor',
    subtotal: 'Subtotal (excl. VAT)',
    vat: 'VAT ({{rate}}%)',
    finalQuote: 'Final Quote',
    export: 'Export Quote to PDF',
    generating: 'Generating…',
    downloaded: 'Quote Downloaded',
    exportFailed: 'Export Failed',
    clear: 'Clear quote',
  },

  maintenance: {
    title: 'Maintenance Packages',
    subtitle:
      'Annual support tiers, priced as a percentage of the project value excluding VAT.',
    projectValue: 'Project value (excl. VAT)',
    basedOn: 'Based on {{modules}} selected',
    emptyTitle: 'No project selected yet',
    emptyBody:
      'Choose modules in the Calculator and the packages will price themselves against that quote.',
    percentOfProject: '{{percent}}% of project value',
    popular: 'Popular',
    annualTotalInclVat: 'Annual total (incl. VAT)',
    monthlyEquivalent: '{{value}} / month equivalent',
    annualCost: 'Annual cost',
    vat: '{{rate}}% VAT',
    annualTotal: 'Annual total',
  },

  tiers: {
    basic: {
      name: 'Basic Support',
      summary: 'Break-fix cover for stable, low-change deployments.',
      perks: [
        'Business-hours email support',
        'Next-business-day response',
        'Security patches & dependency updates',
        'Quarterly health report',
      ],
    },
    standard: {
      name: 'Standard',
      summary: 'Ongoing upkeep with a monthly allowance for small changes.',
      perks: [
        'Everything in Basic Support',
        '8-hour response target',
        '8 change-request hours per month',
        'Monthly performance review',
      ],
    },
    premium: {
      name: 'Premium SLA',
      summary: 'Contracted uptime with priority routing and on-call cover.',
      perks: [
        'Everything in Standard',
        '99.9% uptime SLA',
        '4-hour response, 24/7 on-call',
        '20 change-request hours per month',
      ],
    },
    enterprise: {
      name: 'Enterprise+',
      summary: 'Dedicated team with roadmap input and compliance support.',
      perks: [
        'Everything in Premium SLA',
        '1-hour response, named engineer',
        'Unlimited change requests (fair use)',
        'Annual audit & compliance assistance',
      ],
    },
  },

  admin: {
    title: 'Pricing Manager',
    subtitle: 'Maintain the feature catalog used by every estimate.',
    reset: 'Reset to defaults',
    statFeatures: 'Features',
    statCategories: 'Categories',
    statEffort: 'Total effort',
    statValue: 'Catalog value',
    colFeature: 'Feature',
    colCategory: 'Category',
    colRequires: 'Requires',
    colWeeks: 'Weeks',
    colCost: 'Cost',
    colActions: 'Actions',
    inQuote: 'In quote',
    emptyTable: 'No features yet. Add one using the form above.',
    edit: 'Edit {{name}}',
    delete: 'Delete {{name}}',
    confirmDelete: 'Confirm deleting {{name}}',
    confirm: 'Confirm',
    unknown: 'Unknown',
  },

  form: {
    addTitle: 'Add a feature',
    editTitle: 'Edit feature',
    addSubtitle: 'New modules become available in the calculator immediately.',
    editSubtitle:
      'Updating "{{name}}" — changes apply to the calculator instantly.',
    nameEn: 'Feature name (EN)',
    nameAr: 'Feature name (AR)',
    namePlaceholder: 'e.g. Shift Scheduling',
    nameArPlaceholder: 'اختياري',
    category: 'Category',
    categoryPlaceholder: 'Select or type',
    cost: 'Cost (SAR)',
    weeks: 'Weeks',
    requires: 'Requires (optional)',
    noPrerequisite: 'No prerequisite',
    requiresHelp:
      'Selecting this feature in the calculator will pull its prerequisite in automatically.',
    importCsv: 'Import from CSV',
    csvColumns: 'Columns: Category, Feature Name, Name (AR), Cost, Weeks',
    cancel: 'Cancel',
    save: 'Save Feature',
    add: 'Add Feature',
    required: 'Required',
    invalidAmount: 'Enter a valid amount',
    invalidDuration: 'Enter a valid duration',
  },

  import: {
    success_one: 'Imported {{count}} feature successfully!',
    success_other: 'Imported {{count}} features successfully!',
    nothing: 'Nothing was imported.',
    rowPrefix: 'Row {{row}}: ',
    andMore: '…and {{count}} more skipped.',
    dismiss: 'Dismiss import result',
    tooLarge: 'File is larger than 2 MB.',
    unreadable: 'The file could not be read.',
    failed: 'Import failed.',
    missingName: 'missing a name',
    invalidCost: 'invalid cost {{value}}',
    blank: '(blank)',
    emptyFile: 'The file is empty.',
  },
}

const ar = {
  nav: {
    calculator: 'الحاسبة',
    maintenance: 'الصيانة',
    admin: 'لوحة الإدارة',
    currency: 'العملة',
    language: 'اللغة',
  },
  brand: { tagline: 'People Concerns' },
  footer:
    'PCcalc — محرك التسعير الداخلي لشركة People Concerns. التقديرات استرشادية وتنتهي صلاحيتها بعد ٣٠ يومًا.',

  units: {
    weeks_zero: '{{count}} أسبوع',
    weeks_one: 'أسبوع واحد',
    weeks_two: 'أسبوعان',
    weeks_few: '{{count}} أسابيع',
    weeks_many: '{{count}} أسبوعًا',
    weeks_other: '{{count}} أسبوع',
    modules_zero: 'لا توجد وحدات',
    modules_one: 'وحدة واحدة',
    modules_two: 'وحدتان',
    modules_few: '{{count}} وحدات',
    modules_many: '{{count}} وحدة',
    modules_other: '{{count}} وحدة',
    items_zero: 'لا توجد عناصر',
    items_one: 'عنصر واحد',
    items_two: 'عنصران',
    items_few: '{{count}} عناصر',
    items_many: '{{count}} عنصرًا',
    items_other: '{{count}} عنصر',
  },

  categories: {
    'Core HR': 'الموارد البشرية الأساسية',
    Payroll: 'الرواتب',
    Compliance: 'الالتزام والامتثال',
    'Facility Management': 'إدارة المرافق',
    Uncategorised: 'غير مصنّف',
  },

  calculator: {
    title: 'أنشئ تقديرك',
    subtitle:
      'اختر الوحدات التي يحتاجها هذا العميل. تُضاف المتطلبات الأساسية تلقائيًا.',
    emptyTitle: 'الكتالوج فارغ',
    emptyBody: 'أضف ميزات من لوحة الإدارة للبدء في إعداد العروض.',
    requires: 'يتطلب {{name}}',
    addedWith: 'أُضيف مع {{name}}',
  },

  quote: {
    title: 'ملخص العرض',
    preparedFor: 'مُعدّ لصالح',
    clientPlaceholder: 'اسم العميل أو الشركة',
    emptyTitle: 'لم يتم اختيار أي وحدات',
    emptyBody: 'اختر الميزات من الكتالوج لإنشاء عرض سعر.',
    remove: 'إزالة {{name}}',
    internalOnly: 'داخلي فقط',
    marginLabel: 'هامش ربح {{value}}٪',
    marginSlider: 'نسبة هامش الربح',
    baseCost: 'التكلفة الأساسية {{value}}',
    markup: 'الهامش المضاف +{{value}}',
    deliveryTimeline: 'الجدول الزمني للتسليم',
    effort: '{{weeks}} من الجهد',
    parallelFactor: '× {{factor}} معامل التوازي',
    subtotal: 'المجموع الفرعي (بدون ضريبة)',
    vat: 'ضريبة القيمة المضافة ({{rate}}٪)',
    finalQuote: 'العرض النهائي',
    export: 'تصدير العرض إلى PDF',
    generating: 'جارٍ الإنشاء…',
    downloaded: 'تم تنزيل العرض',
    exportFailed: 'فشل التصدير',
    clear: 'مسح العرض',
  },

  maintenance: {
    title: 'باقات الصيانة',
    subtitle:
      'باقات دعم سنوية، تُسعَّر كنسبة مئوية من قيمة المشروع بدون ضريبة القيمة المضافة.',
    projectValue: 'قيمة المشروع (بدون ضريبة)',
    basedOn: 'بناءً على {{modules}} مختارة',
    emptyTitle: 'لم يتم اختيار مشروع بعد',
    emptyBody:
      'اختر الوحدات في الحاسبة وسيتم تسعير الباقات تلقائيًا بناءً على ذلك العرض.',
    percentOfProject: '{{percent}}٪ من قيمة المشروع',
    popular: 'الأكثر طلبًا',
    annualTotalInclVat: 'الإجمالي السنوي (شامل الضريبة)',
    monthlyEquivalent: '{{value}} / ما يعادل شهريًا',
    annualCost: 'التكلفة السنوية',
    vat: 'ضريبة القيمة المضافة {{rate}}٪',
    annualTotal: 'الإجمالي السنوي',
  },

  tiers: {
    basic: {
      name: 'الدعم الأساسي',
      summary: 'تغطية إصلاح الأعطال للأنظمة المستقرة قليلة التغيير.',
      perks: [
        'دعم عبر البريد في ساعات العمل',
        'الاستجابة في يوم العمل التالي',
        'تحديثات أمنية وتحديث الاعتماديات',
        'تقرير حالة ربع سنوي',
      ],
    },
    standard: {
      name: 'القياسية',
      summary: 'صيانة مستمرة مع رصيد شهري للتعديلات الصغيرة.',
      perks: [
        'كل ما في الدعم الأساسي',
        'هدف استجابة خلال ٨ ساعات',
        '٨ ساعات طلبات تغيير شهريًا',
        'مراجعة أداء شهرية',
      ],
    },
    premium: {
      name: 'اتفاقية مستوى الخدمة المتميزة',
      summary: 'جاهزية تعاقدية مع أولوية في المعالجة وتغطية عند الطلب.',
      perks: [
        'كل ما في الباقة القياسية',
        'اتفاقية جاهزية ٩٩٫٩٪',
        'استجابة خلال ٤ ساعات، دعم ٢٤/٧',
        '٢٠ ساعة طلبات تغيير شهريًا',
      ],
    },
    enterprise: {
      name: 'باقة المؤسسات+',
      summary: 'فريق مخصص مع مشاركة في خارطة الطريق ودعم الامتثال.',
      perks: [
        'كل ما في الباقة المتميزة',
        'استجابة خلال ساعة، مهندس مخصص',
        'طلبات تغيير غير محدودة (ضمن الاستخدام العادل)',
        'مساعدة سنوية في التدقيق والامتثال',
      ],
    },
  },

  admin: {
    title: 'إدارة التسعير',
    subtitle: 'إدارة كتالوج الميزات المستخدم في كل تقدير.',
    reset: 'استعادة الإعدادات الافتراضية',
    statFeatures: 'الميزات',
    statCategories: 'الفئات',
    statEffort: 'إجمالي الجهد',
    statValue: 'قيمة الكتالوج',
    colFeature: 'الميزة',
    colCategory: 'الفئة',
    colRequires: 'يتطلب',
    colWeeks: 'الأسابيع',
    colCost: 'التكلفة',
    colActions: 'الإجراءات',
    inQuote: 'ضمن العرض',
    emptyTable: 'لا توجد ميزات بعد. أضف واحدة باستخدام النموذج أعلاه.',
    edit: 'تعديل {{name}}',
    delete: 'حذف {{name}}',
    confirmDelete: 'تأكيد حذف {{name}}',
    confirm: 'تأكيد',
    unknown: 'غير معروف',
  },

  form: {
    addTitle: 'إضافة ميزة',
    editTitle: 'تعديل ميزة',
    addSubtitle: 'تصبح الوحدات الجديدة متاحة في الحاسبة فورًا.',
    editSubtitle: 'تحديث "{{name}}" — تُطبَّق التغييرات على الحاسبة فورًا.',
    nameEn: 'اسم الميزة (بالإنجليزية)',
    nameAr: 'اسم الميزة (بالعربية)',
    namePlaceholder: 'مثال: جدولة الورديات',
    nameArPlaceholder: 'اختياري',
    category: 'الفئة',
    categoryPlaceholder: 'اختر أو اكتب',
    cost: 'التكلفة (ر.س)',
    weeks: 'الأسابيع',
    requires: 'يتطلب (اختياري)',
    noPrerequisite: 'بدون متطلب مسبق',
    requiresHelp: 'اختيار هذه الميزة في الحاسبة سيضيف متطلبها الأساسي تلقائيًا.',
    importCsv: 'استيراد من CSV',
    csvColumns: 'الأعمدة: الفئة، اسم الميزة، الاسم (بالعربية)، التكلفة، الأسابيع',
    cancel: 'إلغاء',
    save: 'حفظ الميزة',
    add: 'إضافة ميزة',
    required: 'مطلوب',
    invalidAmount: 'أدخل مبلغًا صحيحًا',
    invalidDuration: 'أدخل مدة صحيحة',
  },

  import: {
    success_zero: 'لم يتم استيراد أي ميزة.',
    success_one: 'تم استيراد ميزة واحدة بنجاح!',
    success_two: 'تم استيراد ميزتين بنجاح!',
    success_few: 'تم استيراد {{count}} ميزات بنجاح!',
    success_many: 'تم استيراد {{count}} ميزة بنجاح!',
    success_other: 'تم استيراد {{count}} ميزة بنجاح!',
    nothing: 'لم يتم استيراد أي شيء.',
    rowPrefix: 'الصف {{row}}: ',
    andMore: '…و{{count}} أخرى تم تخطيها.',
    dismiss: 'إخفاء نتيجة الاستيراد',
    tooLarge: 'حجم الملف أكبر من ٢ ميغابايت.',
    unreadable: 'تعذّرت قراءة الملف.',
    failed: 'فشل الاستيراد.',
    missingName: 'الاسم مفقود',
    invalidCost: 'تكلفة غير صالحة {{value}}',
    blank: '(فارغ)',
    emptyFile: 'الملف فارغ.',
  },
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React escapes for us
  returnObjects: true,
})

export default i18n
