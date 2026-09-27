import type { LegalDocument } from '../types'

/**
 * الشروط والأحكام — Terms and Conditions, Arabic.
 *
 * ── FOR THE TRANSLATOR ────────────────────────────────────────────────────
 * Section titles and the table of contents are translated. Every section body
 * is `blocks: null`, which marks it as awaiting translation: the page renders a
 * placeholder for it and sets `noindex`, and the language switch warns readers
 * that the Arabic text is not ready.
 *
 * To supply a section, replace `blocks: null` with the same block list the
 * English file uses for that section — see `../en/terms.ts` for the source text
 * and `../types.ts` for the markup. The structure must match: the documents
 * cross-reference each other by section number.
 *
 * ── WHY THIS MATTERS ──────────────────────────────────────────────────────
 * Section 19 of the English Terms states that where an Arabic version exists
 * and the two conflict, **the Arabic version prevails**. This file therefore
 * becomes the governing text once it is filled in. It must be written or
 * reviewed by a Saudi-licensed lawyer, not machine-translated.
 *
 * `{token}` values are substituted from `src/content/company.ts` and need no
 * translation — leave them exactly as written.
 */
const termsAr: LegalDocument = {
  id: 'terms',
  title: 'الشروط والأحكام',
  metaDescription: 'الشروط والأحكام الخاصة بـ {name}، {shortAddress}.',
  contentsLabel: 'المحتويات',

  summary: {
    heading: 'الملخص',
    blocks: null,
  },

  sections: [
    { n: 1, title: 'حول هذه الشروط', blocks: null },
    { n: 2, title: 'التعريفات', blocks: null },
    { n: 3, title: 'الأهلية وحسابك', blocks: null },
    { n: 4, title: 'خدماتنا', blocks: null },
    { n: 5, title: 'تقديم شكوى', blocks: null },
    { n: 6, title: 'الاستخدام المقبول', blocks: null },
    { n: 7, title: 'المحتوى الذي تقدمه', blocks: null },
    { n: 8, title: 'الملكية الفكرية', blocks: null },
    { n: 9, title: 'الرسوم', blocks: null },
    { n: 10, title: 'المراسلات الإلكترونية', blocks: null },
    { n: 11, title: 'الخصوصية والبيانات الشخصية', blocks: null },
    { n: 12, title: 'روابط وخدمات الأطراف الأخرى', blocks: null },
    { n: 13, title: 'إخلاء المسؤولية', blocks: null },
    { n: 14, title: 'حدود المسؤولية', blocks: null },
    { n: 15, title: 'مسؤوليتك تجاهنا', blocks: null },
    { n: 16, title: 'الإيقاف والإنهاء', blocks: null },
    { n: 17, title: 'التغييرات على هذه الشروط', blocks: null },
    { n: 18, title: 'القانون الحاكم وتسوية النزاعات', blocks: null },
    { n: 19, title: 'أحكام عامة', blocks: null },
    { n: 20, title: 'تواصل معنا', blocks: null },
  ],
}

export default termsAr
