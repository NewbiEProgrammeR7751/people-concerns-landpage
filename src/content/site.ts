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
  faq: 'faq',
  contact: 'contact',
} as const

/** What the FAQ says about price, given the values in company.ts. */
function priceAnswer(lang: Lang): string {
  const { websiteFrom, appFrom } = company.pricing
  if (lang === 'ar') {
    const parts = [
      websiteFrom && `تبدأ المواقع من ${websiteFrom}`,
      appFrom && `والتطبيقات من ${appFrom}`,
    ].filter(Boolean)
    return parts.length
      ? `${parts.join('، ')}. السعر النهائي يعتمد على ما تحتاجه بالضبط، ونعطيك عرضاً مكتوباً بعد مكالمة مجانية — بدون أي التزام.`
      : 'السعر يعتمد على ما تحتاجه بالضبط. نستمع إليك في مكالمة مجانية، ثم نرسل لك عرضاً مكتوباً بسعر ثابت — بدون أي التزام.'
  }
  const parts = [
    websiteFrom && `Websites start from ${websiteFrom}`,
    appFrom && `apps from ${appFrom}`,
  ].filter(Boolean)
  return parts.length
    ? `${parts.join(', and ')}. The final price depends on exactly what you need — we send a written fixed price after a free call, with no obligation.`
    : 'It depends on exactly what you need. We listen on a free call, then send a written fixed price with no obligation.'
}

/** What the FAQ says about timeframes, given the values in company.ts. */
function timeAnswer(lang: Lang): string {
  const { website, app } = company.timelines
  if (lang === 'ar') {
    const parts = [
      website && `الموقع البسيط عادةً ${website}`,
      app && `والتطبيق عادةً ${app}`,
    ].filter(Boolean)
    const opening = parts.length
      ? `${parts.join('، ')}.`
      : 'يعتمد على حجم ما تحتاجه.'
    return `${opening} نعطيك تاريخاً مكتوباً قبل أن نبدأ، ونخبرك مبكراً إن كان هناك ما يهدده.`
  }
  const parts = [
    website && `a straightforward website is usually ${website}`,
    app && `an app is usually ${app}`,
  ].filter(Boolean)
  const opening = parts.length
    ? `${parts.join(', and ')}.`
    : 'It depends on the size of what you need.'
  return `${opening.charAt(0).toUpperCase()}${opening.slice(1)} We give you a date in writing before we start, and tell you early if anything threatens it.`
}

type Copy = {
  dir: 'ltr' | 'rtl'
  htmlLang: string
  /** Label on the language button — always names the language you switch TO. */
  langSwitch: string
  langSwitchAria: string
  nav: { whatWeBuild: string; howItWorks: string; faq: string; contact: string }
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
  faq: { h2: string; sub: string; items: { q: string; a: string }[] }
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
      faq: 'FAQ',
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

    faq: {
      h2: 'Questions people ask first',
      sub: 'If yours is not here, ask us — we answer within 24 hours.',
      items: [
        { q: 'How much does it cost?', a: priceAnswer('en') },
        { q: 'How long does it take?', a: timeAnswer('en') },
        {
          q: 'Do I need to understand technology?',
          a: 'No. That is our job. We explain things in plain language, avoid jargon, and never ask you to make a technical decision on your own.',
        },
        {
          q: 'Who owns the app or website?',
          a: "You own 100% of your business data, user accounts, and domain name. We provide the technology as a fully managed service, meaning we retain the intellectual property of the core platform's source code. This allows us to continuously push updates, ensure high security, and maintain the infrastructure without you needing an in-house tech team.",
        },
        {
          q: 'What happens after launch?',
          a: 'We stay with you. Fixes for anything that breaks are included, and we offer a monthly plan for updates, hosting and small changes. You are never left with something nobody maintains.',
        },
        {
          q: 'Do you work in Arabic and English?',
          a: 'Yes, both — and we build products that work properly in both, including right-to-left Arabic layouts rather than English screens with Arabic words pasted in.',
        },
      ],
    },

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
      faq: 'أسئلة شائعة',
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

    faq: {
      h2: 'أسئلة يسألها الناس أولاً',
      sub: 'إن لم يكن سؤالك هنا، فاسألنا — نرد خلال 24 ساعة.',
      items: [
        { q: 'كم تكلفة المشروع؟', a: priceAnswer('ar') },
        { q: 'كم يستغرق من وقت؟', a: timeAnswer('ar') },
        {
          q: 'هل أحتاج إلى معرفة تقنية؟',
          a: 'لا. هذه مهمتنا. نشرح الأمور بكلمات واضحة، ونتجنب المصطلحات، ولا نطلب منك أبداً أن تتخذ قراراً تقنياً بنفسك.',
        },
        {
          q: 'لمن تكون ملكية التطبيق أو الموقع؟',
          a: 'أنت تملك 100% من بيانات عملك وحسابات مستخدميك واسم النطاق. ونحن نقدّم التقنية كخدمة مُدارة بالكامل، أي أننا نحتفظ بالملكية الفكرية للكود المصدري للمنصة الأساسية. وهذا ما يتيح لنا دفع التحديثات باستمرار، وضمان أمان عالٍ، وصيانة البنية التقنية دون أن تحتاج إلى فريق تقني داخلي.',
        },
        {
          q: 'وماذا بعد الإطلاق؟',
          a: 'نبقى معك. إصلاح أي خلل مشمول، ولدينا خطة شهرية للتحديثات والاستضافة والتعديلات الصغيرة. لن تُترك مع شيء لا يصونه أحد.',
        },
        {
          q: 'هل تعملون بالعربية والإنجليزية؟',
          a: 'نعم، بالاثنتين — ونبني منتجات تعمل بهما فعلاً، بتصميم عربي من اليمين إلى اليسار، وليس شاشات إنجليزية لُصقت فيها كلمات عربية.',
        },
      ],
    },

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
