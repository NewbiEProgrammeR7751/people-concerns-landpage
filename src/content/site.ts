import { company } from './company'

/**
 * Landing page copy, English and Arabic.
 *
 * Lifted out of App.tsx so the component file is layout and the copy is content.
 * The voice is deliberately plain: the reader is a business owner deciding
 * whether to call us, not an engineer evaluating a stack. No framework names, no
 * "full-stack", no "cloud-native".
 */

export type Lang = 'en' | 'ar'

/** Section ids, shared by the nav links and the sections themselves. */
export const SECTIONS = {
  whatWeBuild: 'what-we-build',
  howItWorks: 'how-it-works',
  contact: 'contact',
} as const

type Copy = {
  dir: 'ltr' | 'rtl'
  htmlLang: string
  /** Label on the language button — always names the language you switch TO. */
  langSwitch: string
  langSwitchAria: string
  nav: { whatWeBuild: string; howItWorks: string; contact: string }
  menuOpen: string
  menuClose: string
  hero: {
    badge: string
    h1: string
    sub: string
    ctaPrimary: string
    illustrationAlt: string
    stats: { value: string; label: string }[]
  }
  audience: { h2: string; sub: string; items: string[] }
  services: {
    h2: string
    sub: string
    items: { title: string; desc: string; tag: string }[]
  }
  process: {
    h2: string
    sub: string
    /** Label above the "what you get" line in each step. */
    youGet: string
    steps: { num: string; label: string; desc: string; deliverable: string }[]
  }
  benefits: string[]
  contact: {
    h2: string
    sub: string
    perks: string[]
    typeLabel: string
    types: { id: ProjectType; label: string }[]
    fields: {
      name: { label: string; placeholder: string }
      phone: { label: string; placeholder: string; hint: string }
      email: { label: string; placeholder: string }
      message: { label: string; optional: string; placeholder: string }
    }
    submit: string
    sending: string
    successTitle: string
    successSub: string
    successRef: string
    successAgain: string
    errorTitle: string
    errorRetry: string
  }
  footer: {
    tagline: string
    servicesTitle: string
    services: string[]
    contactTitle: string
    addressLabel: string
    emailLabel: string
    crLabel: string
    copy: string
    legal: { label: string; to: string }[]
  }
}

/** The chips above the message field. */
export type ProjectType = 'app' | 'website' | 'system' | 'unsure'

export const t: Record<Lang, Copy> = {
  en: {
    dir: 'ltr',
    htmlLang: 'en',
    langSwitch: 'العربية',
    langSwitchAria: 'Switch to Arabic',
    nav: {
      whatWeBuild: 'What we build',
      howItWorks: 'How it works',
      contact: 'Contact',
    },
    menuOpen: 'Open menu',
    menuClose: 'Close menu',

    hero: {
      badge: 'Taking on new projects',
      h1: 'We build apps and websites for your business — from idea to launch.',
      sub: 'Tell us what you need in plain words. We plan it, design it, build it, and stay with you after launch.',
      ctaPrimary: 'Tell us your idea',
      illustrationAlt: 'An illustration of a mobile app on a phone beside a website on a laptop',
      stats: [
        { value: 'Team with 5+ years each', label: 'Building for real businesses' },
        { value: 'Arabic & English', label: 'Both, from day one' },
        { value: 'Secure & Maintained', label: 'Reliable hosting and ongoing technical support' },
      ],
    },

    audience: {
      h2: 'Who we help',
      sub: 'Businesses that want the everyday work to run itself.',
      items: [
        'Clinics & salons',
        'Buildings & facilities',
        'Companies',
        'Traders',
        'Restaurants',
        'Schools',
      ],
    },

    services: {
      h2: 'What we can build for you',
      sub: 'Pick what you need — we handle the rest.',
      items: [
        {
          title: 'Websites',
          desc: 'Websites and online systems that stay fast as your business grows.',
          tag: 'Web',
        },
        {
          title: 'Mobile apps',
          desc: 'One app that works on both iPhone and Android.',
          tag: 'Mobile',
        },
        {
          title: 'Design',
          desc: 'Screens your customers understand the first time, without a manual.',
          tag: 'Design',
        },
        {
          title: 'Business systems',
          desc: 'Upgrade old systems and connect your tools so your data flows.',
          tag: 'Systems',
        },
      ],
    },

    process: {
      h2: 'How it works',
      sub: 'Four steps. You know what is happening at every one.',
      youGet: 'You get',
      steps: [
        {
          num: '01',
          label: 'Discovery',
          desc: 'We meet, you tell us what the business needs, and we ask the awkward questions early.',
          deliverable: 'A written plan and a fixed price.',
        },
        {
          num: '02',
          label: 'Design',
          desc: 'We draw every screen and agree the look before anyone writes code.',
          deliverable: 'A clickable preview you can try.',
        },
        {
          num: '03',
          label: 'Build',
          desc: 'We build it and show you progress every week, so nothing is a surprise at the end.',
          deliverable: 'A working version to test each week.',
        },
        {
          num: '04',
          label: 'Launch & support',
          desc: 'We put it live, train your team, and stay reachable afterwards.',
          deliverable: 'A live product, and us on the phone.',
        },
      ],
    },

    benefits: ['Fast', 'Secure', 'Arabic & English', 'Support after launch'],


    contact: {
      h2: "Have an idea for an app or website? Let's talk.",
      sub: 'Tell us roughly what you want. No commitment, no sales script.',
      perks: [
        'We reply within 24 hours',
        'A free first call, with no obligation',
        'A written fixed price before any work starts',
      ],
      typeLabel: 'What do you need?',
      types: [
        { id: 'app', label: 'App' },
        { id: 'website', label: 'Website' },
        { id: 'system', label: 'System' },
        { id: 'unsure', label: 'Not sure' },
      ],
      fields: {
        name: { label: 'Your name', placeholder: 'Your name' },
        phone: {
          label: 'Phone',
          placeholder: '05X XXX XXXX',
          hint: 'We will reach you here first.',
        },
        email: { label: 'Email', placeholder: 'you@example.com' },
        message: {
          label: 'Anything else',
          optional: 'optional',
          placeholder: 'A sentence or two is plenty.',
        },
      },
      submit: 'Send',
      sending: 'Sending…',
      successTitle: 'Got it — thank you.',
      successSub: 'We have emailed you a confirmation and will reply within 24 hours.',
      successRef: 'Your reference',
      successAgain: 'Send another',
      errorTitle: "We couldn't send that",
      errorRetry: 'Please try again, or email us at',
    },

    footer: {
      tagline:
        'People Concerns builds apps, websites and business systems in Riyadh — for businesses that would rather run their work than fight their software.',
      servicesTitle: 'What we build',
      services: ['Websites', 'Mobile apps', 'Design', 'Business systems'],
      contactTitle: 'Contact',
      addressLabel: 'Office',
      emailLabel: 'Email',
      crLabel: 'CR No.',
      copy: `© 2026 ${company.name}. All rights reserved.`,
      legal: [
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms and Conditions', to: '/terms-and-conditions' },
      ],
    },
  },

  ar: {
    dir: 'rtl',
    htmlLang: 'ar',
    langSwitch: 'English',
    langSwitchAria: 'التغيير إلى الإنجليزية',
    nav: {
      whatWeBuild: 'ما نبنيه',
      howItWorks: 'كيف نعمل',
      contact: 'تواصل معنا',
    },
    menuOpen: 'فتح القائمة',
    menuClose: 'إغلاق القائمة',

    hero: {
      badge: 'نستقبل مشاريع جديدة',
      h1: 'نبني تطبيقات ومواقع لأعمالك — من الفكرة حتى الإطلاق.',
      sub: 'اشرح لنا ما تحتاجه بكلمات بسيطة. نخطط له، ونصممه، ونبنيه، ونبقى معك بعد الإطلاق.',
      ctaPrimary: 'احكِ لنا فكرتك',
      illustrationAlt: 'رسم توضيحي لتطبيق على جوال بجانب موقع على حاسب محمول',
      stats: [
        { value: 'فريق خبرة كل فرد فيه +5 سنوات', label: 'نبني لأعمال حقيقية' },
        { value: 'عربي وإنجليزي', label: 'الاثنان من البداية' },
        { value: 'آمن ومُصان', label: 'استضافة موثوقة ودعم تقني مستمر' },
      ],
    },

    audience: {
      h2: 'من نخدم',
      sub: 'أعمال تريد أن يسير العمل اليومي من تلقاء نفسه.',
      items: [
        'العيادات والصالونات',
        'المباني والمنشآت',
        'الشركات',
        'التجار',
        'المطاعم',
        'المدارس',
      ],
    },

    services: {
      h2: 'ما يمكننا بناؤه لك',
      sub: 'اختر ما تحتاجه — ونحن نتولى الباقي.',
      items: [
        {
          title: 'المواقع',
          desc: 'مواقع وأنظمة إلكترونية تبقى سريعة مع نمو عملك.',
          tag: 'ويب',
        },
        {
          title: 'تطبيقات الجوال',
          desc: 'تطبيق واحد يعمل على آيفون وأندرويد.',
          tag: 'جوال',
        },
        {
          title: 'التصميم',
          desc: 'شاشات يفهمها عميلك من المرة الأولى، بدون دليل استخدام.',
          tag: 'تصميم',
        },
        {
          title: 'أنظمة الأعمال',
          desc: 'نحدّث الأنظمة القديمة ونربط أدواتك حتى تتنقل بياناتك بسلاسة.',
          tag: 'أنظمة',
        },
      ],
    },

    process: {
      h2: 'كيف نعمل',
      sub: 'أربع خطوات. تعرف ما يحدث في كل واحدة منها.',
      youGet: 'ما تحصل عليه',
      steps: [
        {
          num: '٠١',
          label: 'الاستكشاف',
          desc: 'نجتمع، وتخبرنا بما يحتاجه عملك، ونسأل الأسئلة الصعبة من البداية.',
          deliverable: 'خطة مكتوبة وسعر ثابت.',
        },
        {
          num: '٠٢',
          label: 'التصميم',
          desc: 'نرسم كل شاشة ونتفق على الشكل قبل أن يكتب أحد أي كود.',
          deliverable: 'نموذج تفاعلي تستطيع تجربته.',
        },
        {
          num: '٠٣',
          label: 'البناء',
          desc: 'نبنيه ونعرض لك التقدم كل أسبوع، حتى لا يكون هناك أي مفاجآت في النهاية.',
          deliverable: 'نسخة تعمل لتجربتها كل أسبوع.',
        },
        {
          num: '٠٤',
          label: 'الإطلاق والدعم',
          desc: 'نطلقه، وندرّب فريقك، ونبقى متاحين بعد ذلك.',
          deliverable: 'منتج يعمل، ونحن على الهاتف.',
        },
      ],
    },

    benefits: ['سريع', 'آمن', 'عربي وإنجليزي', 'دعم بعد الإطلاق'],


    contact: {
      h2: 'لديك فكرة لتطبيق أو موقع؟ لنتحدث.',
      sub: 'أخبرنا بما تريده تقريباً. بدون التزام، وبدون أسلوب بيع.',
      perks: [
        'نرد خلال 24 ساعة',
        'مكالمة أولى مجانية بدون أي التزام',
        'سعر ثابت مكتوب قبل بدء أي عمل',
      ],
      typeLabel: 'ما الذي تحتاجه؟',
      types: [
        { id: 'app', label: 'تطبيق' },
        { id: 'website', label: 'موقع' },
        { id: 'system', label: 'نظام' },
        { id: 'unsure', label: 'غير متأكد' },
      ],
      fields: {
        name: { label: 'اسمك', placeholder: 'اسمك' },
        phone: {
          label: 'الجوال',
          placeholder: '05X XXX XXXX',
          hint: 'سنتواصل معك على هذا الرقم أولاً.',
        },
        email: { label: 'البريد الإلكتروني', placeholder: 'you@example.com' },
        message: {
          label: 'أي تفاصيل أخرى',
          optional: 'اختياري',
          placeholder: 'سطر أو سطران يكفيان.',
        },
      },
      submit: 'إرسال',
      sending: 'جارٍ الإرسال…',
      successTitle: 'وصلتنا — شكراً لك.',
      successSub: 'أرسلنا لك رسالة تأكيد على بريدك، وسنرد خلال 24 ساعة.',
      successRef: 'رقمك المرجعي',
      successAgain: 'إرسال طلب آخر',
      errorTitle: 'لم نتمكن من الإرسال',
      errorRetry: 'يرجى المحاولة مرة أخرى، أو راسلنا على',
    },

    footer: {
      tagline:
        'People Concerns تبني التطبيقات والمواقع وأنظمة الأعمال في الرياض — لأعمال تفضّل أن تدير عملها بدلاً من أن تصارع برامجها.',
      servicesTitle: 'ما نبنيه',
      services: ['المواقع', 'تطبيقات الجوال', 'التصميم', 'أنظمة الأعمال'],
      contactTitle: 'تواصل معنا',
      addressLabel: 'المكتب',
      emailLabel: 'البريد الإلكتروني',
      crLabel: 'السجل التجاري',
      copy: `© 2026 ${company.name}. جميع الحقوق محفوظة.`,
      legal: [
        { label: 'سياسة الخصوصية', to: '/ar/privacy-policy' },
        { label: 'الشروط والأحكام', to: '/ar/terms-and-conditions' },
      ],
    },
  },
}
