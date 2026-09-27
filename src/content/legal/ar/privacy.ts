import type { LegalDocument } from '../types'

/**
 * سياسة الخصوصية — Privacy Policy, Arabic.
 *
 * ── FOR THE TRANSLATOR ────────────────────────────────────────────────────
 * Section titles and the table of contents are translated. Every section body
 * is `blocks: null`, which marks it as awaiting translation: the page renders a
 * placeholder for it and sets `noindex`, and the language switch warns readers
 * that the Arabic text is not ready.
 *
 * To supply a section, replace `blocks: null` with the same block list the
 * English file uses for that section — see `../en/privacy.ts` for the source
 * text and `../types.ts` for the markup. Section 12 refers readers to "section
 * 19", so the numbering must stay aligned with the English.
 *
 * ── WHY THIS MATTERS ──────────────────────────────────────────────────────
 * Section 19 of the English policy states that where an Arabic version exists
 * and the two conflict, **the Arabic version prevails**. This file therefore
 * becomes the governing text once it is filled in. It must be written or
 * reviewed by a Saudi-licensed lawyer, not machine-translated.
 *
 * `{token}` values are substituted from `src/content/company.ts` and need no
 * translation — leave them exactly as written.
 */
const privacyAr: LegalDocument = {
  id: 'privacy',
  title: 'سياسة الخصوصية',
  metaDescription:
    'كيف تجمع {name} البيانات الشخصية وتستخدمها وتحفظها وتتلفها وفق نظام حماية البيانات الشخصية السعودي. {shortAddress}.',
  contentsLabel: 'المحتويات',

  summary: {
    heading: 'الملخص',
    blocks: null,
  },

  sections: [
    { n: 1, title: 'من نحن', blocks: null },
    { n: 2, title: 'نطاق هذه السياسة', blocks: null },
    { n: 3, title: 'البيانات الشخصية التي نجمعها', blocks: null },
    { n: 4, title: 'البيانات الشخصية الحساسة', blocks: null },
    { n: 5, title: 'أسباب استخدام بياناتك والأساس النظامي', blocks: null },
    { n: 6, title: 'الموافقة وسحبها', blocks: null },
    { n: 7, title: 'من نشارك بياناتك معه', blocks: null },
    { n: 8, title: 'النقل خارج المملكة', blocks: null },
    { n: 9, title: 'كيف نحفظ بياناتك ونحميها', blocks: null },
    { n: 10, title: 'مدة حفظ بياناتك وكيفية إتلافها', blocks: null },
    { n: 11, title: 'حقوقك', blocks: null },
    { n: 12, title: 'كيفية تقديم طلب أو شكوى', blocks: null },
    { n: 13, title: 'انتهاكات البيانات الشخصية', blocks: null },
    { n: 14, title: 'ملفات الارتباط والتقنيات المشابهة', blocks: null },
    { n: 15, title: 'الرسائل البريدية والتسويق', blocks: null },
    { n: 16, title: 'الأطفال', blocks: null },
    { n: 17, title: 'الروابط إلى مواقع أخرى', blocks: null },
    { n: 18, title: 'التغييرات على هذه السياسة', blocks: null },
    { n: 19, title: 'تواصل معنا', blocks: null },
  ],
}

export default privacyAr
