import { useState, useEffect } from "react";
import logoIcon from "@/imports/PeopleConcerns_Icon_Transparent_500.png";
import RecentActivity from "@/components/RecentActivity";

// ── Translations (no external imports) ────────────────────────────────────

const t = {
  en: {
    dir: "ltr" as const,
    nav: { services: "Services", solutions: "Solutions", work: "Work", process: "Process", cta: "Start a Project" },
    hero: {
      badge: "Available for new projects — Q4 2026",
      h1a: "Building",
      h1b: "Digital Products",
      h1c: "Around Real Human Needs.",
      sub: "Custom mobile apps, high-performance web platforms, and tailored digital solutions built for scalable businesses.",
      cta1: "Book a Strategy Call",
      cta2: "View Case Studies",
      stat1v: "Full-Stack", stat1l: "Engineering",
      stat2v: "5+ Years", stat2l: "Experience",
      stat3v: "Production-Ready", stat3l: "Systems",
    },
    trust: "Trusted by forward-thinking companies",
    services: {
      badge: "What We Build",
      h2: "End-to-End Digital Engineering",
      sub: "From concept to cloud — we own the full stack so you ship faster and scale smarter.",
      learn: "Learn more",
      items: [
        { title: "Custom Web Applications", desc: "Performant, scalable web platforms engineered for complex business logic and enterprise-grade traffic.", tag: "Web" },
        { title: "Cross-Platform Mobile Apps", desc: "Native-quality iOS and Android experiences built once — React Native and Flutter for faster time-to-market.", tag: "Mobile" },
        { title: "UI/UX & Product Design", desc: "Human-centered interfaces backed by design systems, usability research, and conversion-focused strategy.", tag: "Design" },
        { title: "Enterprise Digital Solutions", desc: "End-to-end transformation projects: legacy modernization, API architecture, cloud migrations, and integrations.", tag: "Enterprise" },
      ],
    },
    process: {
      badge: "How We Work",
      h2: "Our Delivery Framework",
      sub: "A battle-tested four-phase process that eliminates ambiguity and keeps projects on track.",
      steps: [
        { num: "01", label: "Discovery & Strategy", desc: "Deep-dive workshops to map goals, constraints, and competitive context into a clear product roadmap." },
        { num: "02", label: "Architecture & Design", desc: "System design, component libraries, and high-fidelity prototypes validated with real users before a line of code." },
        { num: "03", label: "Full-Stack Build", desc: "Agile sprints with weekly demos, automated testing, CI/CD pipelines, and transparent progress tracking." },
        { num: "04", label: "Launch & Scale", desc: "Zero-downtime deployments, performance monitoring, and a dedicated support team ready for post-launch growth." },
      ],
    },
    metrics: {
      items: [
        { title: "Cloud-Native", subtitle: "Scalable infrastructure" },
        { title: "Modern Stack", subtitle: "React Native & Web" },
        { title: "Agile Sprints", subtitle: "Iterative delivery" },
        { title: "High Performance", subtitle: "Optimized for speed" },
      ],
    },
    cta: {
      badge: "Let's Build Together",
      h2: "Ready to Transform Your Digital Infrastructure?",
      sub: "Tell us about your project. We'll review it and get back within 24 hours with a preliminary strategy and timeline.",
      perks: ["No-commitment discovery call", "Fixed-price milestones available", "Dedicated project manager from day one"],
      fields: {
        name: { label: "Your Name", placeholder: "Alex Rivera" },
        company: { label: "Company", placeholder: "Acme Corp" },
        email: { label: "Work Email", placeholder: "alex@acmecorp.com" },
        message: { label: "Tell us about your project", placeholder: "We're looking to build a customer portal with..." },
        submit: "Send Message →",
      },
      successTitle: "Message received!",
      successSub: "We'll be in touch within 24 hours.",
    },
    footer: {
      tagline: "People Concerns — building digital products that center human needs. Technology in service of real people.",
      socials: ["Twitter", "LinkedIn", "GitHub", "Dribbble"],
      services: { title: "Services", links: ["Web Applications", "Mobile Apps", "UI/UX Design", "Enterprise Solutions", "Strategy & Consulting"] },
      company: { title: "Company", links: ["About Us", "Case Studies", "Careers", "Blog", "Contact"] },
      copy: "© 2026 People Concerns Ltd. All rights reserved.",
      legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  },
  ar: {
    dir: "rtl" as const,
    nav: { services: "الخدمات", solutions: "الحلول", work: "أعمالنا", process: "منهجيتنا", cta: "ابدأ مشروعك" },
    hero: {
      badge: "متاحون لمشاريع جديدة — الربع الرابع 2026",
      h1a: "نبني",
      h1b: "منتجات رقمية",
      h1c: "تُراعي الاحتياجات الإنسانية الحقيقية.",
      sub: "تطبيقات الجوال المخصصة، ومنصات الويب عالية الأداء، والحلول الرقمية المصممة خصيصاً للشركات القابلة للتوسع.",
      cta1: "احجز استشارة استراتيجية",
      cta2: "استعرض دراسات الحالة",
      stat1v: "هندسة متكاملة", stat1l: "واجهات وخوادم",
      stat2v: "+5 سنوات", stat2l: "خبرة في المجال",
      stat3v: "جاهزة للإنتاج", stat3l: "أنظمة موثوقة",
    },
    trust: "موثوق به من قِبل شركات رائدة",
    services: {
      badge: "ما نبنيه",
      h2: "هندسة رقمية شاملة من الفكرة إلى الإنتاج",
      sub: "من المفهوم إلى السحابة — نمتلك المكدس الكامل لتشحن أسرع وتتوسع بذكاء.",
      learn: "اعرف المزيد",
      items: [
        { title: "تطبيقات ويب مخصصة", desc: "منصات ويب عالية الأداء وقابلة للتوسع، مصممة لمنطق الأعمال المعقد وحركة المرور على مستوى المؤسسات.", tag: "ويب" },
        { title: "تطبيقات جوال متعددة المنصات", desc: "تجارب iOS وAndroid بجودة احترافية، مبنية مرة واحدة — React Native وFlutter لتسويق أسرع.", tag: "جوال" },
        { title: "تصميم واجهات وتجربة المستخدم", desc: "واجهات مرتكزة على الإنسان، مدعومة بأنظمة تصميم، وبحوث قابلية الاستخدام، واستراتيجيات تحويل فعّالة.", tag: "تصميم" },
        { title: "حلول رقمية للمؤسسات", desc: "مشاريع تحول رقمي متكاملة: تحديث الأنظمة القديمة، معماريات API، الهجرة السحابية، والتكاملات.", tag: "مؤسسات" },
      ],
    },
    process: {
      badge: "كيف نعمل",
      h2: "إطار العمل التسليمي",
      sub: "عملية من أربع مراحل مجربة تُزيل الغموض وتُبقي المشاريع في المسار الصحيح.",
      steps: [
        { num: "٠١", label: "الاستكشاف والاستراتيجية", desc: "ورش عمل متعمقة لرسم الأهداف والقيود والسياق التنافسي في خارطة طريق واضحة للمنتج." },
        { num: "٠٢", label: "التصميم والبنية المعمارية", desc: "تصميم النظام، ومكتبات المكونات، ونماذج أولية عالية الدقة يتم التحقق منها مع المستخدمين الحقيقيين قبل كتابة أي سطر كود." },
        { num: "٠٣", label: "البناء الكامل", desc: "سباقات رشيقة مع عروض توضيحية أسبوعية، واختبارات آلية، وعمليات CI/CD، ومتابعة شفافة للتقدم." },
        { num: "٠٤", label: "الإطلاق والتوسع", desc: "نشر بدون توقف، ورصد الأداء، وفريق دعم مخصص جاهز للنمو بعد الإطلاق." },
      ],
    },
    metrics: {
      items: [
        { title: "مبني للسحابة", subtitle: "بنية قابلة للتوسع" },
        { title: "تقنيات حديثة", subtitle: "React Native والويب" },
        { title: "سباقات رشيقة", subtitle: "تسليم تكراري" },
        { title: "أداء عالٍ", subtitle: "مُحسّن للسرعة" },
      ],
    },
    cta: {
      badge: "لنبني معاً",
      h2: "هل أنت مستعد لتحويل بنيتك الرقمية؟",
      sub: "أخبرنا عن مشروعك. سنراجعه ونعود إليك خلال 24 ساعة باستراتيجية أولية وجدول زمني.",
      perks: ["مكالمة استكشافية بلا التزام", "معالم بأسعار ثابتة متاحة", "مدير مشروع مخصص من اليوم الأول"],
      fields: {
        name: { label: "اسمك", placeholder: "أحمد العمري" },
        company: { label: "الشركة", placeholder: "شركة النخبة" },
        email: { label: "البريد الإلكتروني للعمل", placeholder: "ahmed@company.com" },
        message: { label: "أخبرنا عن مشروعك", placeholder: "نبحث عن بناء بوابة عملاء..." },
        submit: "إرسال الرسالة ←",
      },
      successTitle: "تم استلام رسالتك!",
      successSub: "سنتواصل معك خلال 24 ساعة.",
    },
    footer: {
      tagline: "People Concerns — نبني منتجات رقمية تُقدّم الإنسان في المركز. التكنولوجيا في خدمة الناس الحقيقيين.",
      socials: ["تويتر", "لينكدإن", "جيتهاب", "دريبل"],
      services: { title: "الخدمات", links: ["تطبيقات الويب", "تطبيقات الجوال", "تصميم UI/UX", "حلول المؤسسات", "الاستراتيجية والاستشارات"] },
      company: { title: "الشركة", links: ["من نحن", "دراسات الحالة", "الوظائف", "المدونة", "تواصل معنا"] },
      copy: "© 2026 People Concerns Ltd. جميع الحقوق محفوظة.",
      legal: ["سياسة الخصوصية", "شروط الخدمة", "سياسة الكوكيز"],
    },
  },
};

type Lang = "en" | "ar";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconGlobe() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
function IconMobile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
}
function IconPenTool() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      <path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
    </svg>
  );
}
function IconServer() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  );
}
function IconArrow({ dir }: { dir: "ltr" | "rtl" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: dir === "rtl" ? "scaleX(-1)" : "none" }}>
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function IconX() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

// ── Logo ───────────────────────────────────────────────────────────────────

function PplconsLogoMark({ size = 36 }: { size?: number }) {
  return (
    <img
      src={logoIcon}
      alt="People Concerns"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

// ── Dashboard Mockup ───────────────────────────────────────────────────────

function DashboardMockup({ lang }: { lang: Lang }) {
  const isAr = lang === "ar";
  const labels = isAr
    ? { users: "المستخدمون", revenue: "الإيرادات", churn: "معدل التراجع", growth: "النمو الشهري", breakdown: "التفاصيل" }
    : { users: "Active Users", revenue: "Revenue", churn: "Churn Rate", growth: "Monthly Growth", breakdown: "Breakdown" };

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full glow-pulse pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(42,184,168,0.18) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-8 -right-12 w-56 h-56 rounded-full glow-pulse pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,96,80,0.14) 0%, transparent 70%)", animationDelay: "1.5s" }} />

      <div className="float-1 relative z-10 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(145deg, #111d2e, #0d1623)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-3 h-3 rounded-full" style={{ background: "#e86050" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#f5c842" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#2ab8a8" }} />
          <div className="ml-4 text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>
            dashboard.pplcons.io
          </div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3">
          {[
            { label: labels.users, val: "14,283", delta: "+12.4%", up: true, color: "var(--teal)" },
            { label: labels.revenue, val: "$284K", delta: "+8.1%", up: true, color: "#5b8df0" },
            { label: labels.churn, val: "1.2%", delta: "-0.3%", up: false, color: "var(--coral)" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs mb-1" style={{ color: "#7a9cbd" }}>{s.label}</div>
              <div className="font-bold text-sm" style={{ fontFamily: isAr ? "'Cairo', sans-serif" : "'Plus Jakarta Sans', sans-serif", color: "#f0f4ff" }}>{s.val}</div>
              <div className="text-xs mt-1" style={{ color: s.up ? "var(--teal)" : "var(--coral)" }}>{s.delta}</div>
            </div>
          ))}
          <div className="col-span-2 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs mb-3" style={{ color: "#7a9cbd" }}>{labels.growth}</div>
            <div className="flex items-end gap-1 h-16">
              {[40, 60, 45, 75, 55, 85, 70, 95, 80, 100, 88, 110].map((h, i) => {
                const ratio = i / 11;
                const r = Math.round(42 + ratio * (91 - 42));
                const g = Math.round(184 + ratio * (141 - 184));
                const b = Math.round(168 + ratio * (240 - 168));
                return (
                  <div key={i} className="flex-1 rounded-sm" style={{
                    height: `${h * 0.6}%`,
                    background: i === 11 ? "#2ab8a8" : `rgb(${r},${g},${b})`,
                    opacity: 0.55 + ratio * 0.45,
                    minHeight: 4
                  }} />
                );
              })}
            </div>
          </div>
          <div className="rounded-xl p-3 flex flex-col items-center justify-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
              <circle cx="26" cy="26" r="18" fill="none" stroke="#2ab8a8" strokeWidth="7" strokeDasharray="70 113.1" strokeLinecap="round" strokeDashoffset="28"/>
              <circle cx="26" cy="26" r="18" fill="none" stroke="#5b8df0" strokeWidth="7" strokeDasharray="28 113.1" strokeLinecap="round" strokeDashoffset="-42"/>
              <circle cx="26" cy="26" r="18" fill="none" stroke="#3d5a7a" strokeWidth="7" strokeDasharray="15 113.1" strokeLinecap="round" strokeDashoffset="-70"/>
            </svg>
            <div className="text-xs mt-1" style={{ color: "#7a9cbd" }}>{labels.breakdown}</div>
          </div>
          <RecentActivity lang={lang} />
        </div>
      </div>

      <div className="float-2 absolute -right-10 top-8 w-28 rounded-2xl overflow-hidden shadow-xl z-20"
        style={{ background: "linear-gradient(145deg, #141e30, #0d1623)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="p-3">
          <div className="w-6 h-1 rounded-full mb-3 mx-auto" style={{ background: "rgba(255,255,255,0.15)" }} />
          <div className="rounded-lg p-2 mb-2" style={{ background: "var(--teal-dim)", border: "1px solid rgba(42,184,168,0.2)" }}>
            <div className="text-xs font-bold" style={{ color: "var(--teal)" }}>↑ 99.9%</div>
            <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: 9 }}>{isAr ? "التشغيل" : "Uptime"}</div>
          </div>
          <div className="rounded-lg p-2" style={{ background: "var(--coral-dim)", border: "1px solid rgba(232,96,80,0.2)" }}>
            <div className="text-xs font-bold" style={{ color: "var(--coral)" }}>42ms</div>
            <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: 9 }}>{isAr ? "متوسط الاستجابة" : "Avg resp."}</div>
          </div>
        </div>
      </div>

      <div className="float-3 absolute -left-6 -bottom-6 rounded-xl px-3 py-2.5 z-20 flex items-center gap-2"
        style={{ background: "rgba(13,22,35,0.96)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", boxShadow: "0 16px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--teal-dim)" }}>
          <span style={{ fontSize: 14 }}>🚀</span>
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{isAr ? "تم الشحن" : "Build shipped"}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: 10 }}>v3.2.1 · {isAr ? "الآن" : "just now"}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const tx = t[lang];
  const isAr = lang === "ar";
  const headingFont = isAr ? "'Cairo', 'Plus Jakarta Sans', sans-serif" : "'Plus Jakarta Sans', sans-serif";
  const bodyFont = isAr ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  // Apply dir to document
  useEffect(() => {
    document.documentElement.dir = tx.dir;
    document.documentElement.lang = lang;
  }, [lang, tx.dir]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const serviceIcons = [<IconGlobe />, <IconMobile />, <IconPenTool />, <IconServer />];
  const clientLogos = isAr
    ? ["فيرتكس كورب", "نيكساكلاود", "أوريون لابز", "ستراتوم AI", "هيليكس جروب", "أكسيوم IO"]
    : ["Vertex Corp", "NexaCloud", "Orion Labs", "Stratum AI", "Helix Group", "Axiom IO"];

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const toggleLang = () => { setLang(l => l === "en" ? "ar" : "en"); setSubmitted(false); };

  return (
    <div style={{ background: "var(--bg-deep)", color: "var(--text-primary)", overflowX: "hidden", fontFamily: bodyFont, direction: tx.dir }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: scrolled ? "rgba(8,14,26,0.92)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid var(--border-subtle)" : "none" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2.5 no-underline">
            <PplconsLogoMark size={36} />
            <div style={{ fontFamily: "'Nunito', sans-serif", lineHeight: 1.05 }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>People</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--teal)" }}>concerns</div>
            </div>
          </a>

          <div className="hidden md:flex items-center" style={{ gap: "2.5rem" }}>
            {(["services", "solutions", "work", "process"] as const).map((k) => (
              <a key={k} href={`#${k}`} className="text-sm font-medium no-underline transition-colors duration-200 hover:text-teal-400" style={{ color: "var(--text-secondary)" }}>
                {tx.nav[k]}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle — same height as CTA button */}
            <button onClick={toggleLang}
              className="flex items-center justify-center px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:border-teal-500"
              style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)", fontFamily: headingFont, height: "2.625rem", minWidth: "2.625rem" }}>
              {isAr ? "EN" : "ع"}
            </button>
            <button className="text-sm font-semibold px-5 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--teal), #1a9080)", color: "#fff", fontFamily: headingFont, height: "2.625rem" }}>
              {tx.nav.cta}
            </button>
          </div>

          <button className="md:hidden" style={{ color: "var(--text-secondary)" }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-6 pt-2" style={{ background: "rgba(8,14,26,0.98)", borderBottom: "1px solid var(--border-subtle)" }}>
            {(["services", "solutions", "work", "process"] as const).map((k) => (
              <a key={k} href={`#${k}`} onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium no-underline" style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>
                {tx.nav[k]}
              </a>
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={toggleLang} className="flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)" }}>
                {isAr ? "EN" : "ع"}
              </button>
              <button className="flex-1 text-sm font-semibold py-3 rounded-xl"
                style={{ background: "linear-gradient(135deg, var(--teal), #1a9080)", color: "#fff", fontFamily: headingFont }}>
                {tx.nav.cta}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--teal) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, var(--coral) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(var(--teal) 1px, transparent 1px), linear-gradient(90deg, var(--teal) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{ background: "var(--teal-dim)", border: "1px solid rgba(42,184,168,0.25)", color: "var(--teal)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--teal)" }} />
              {tx.hero.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight mb-6" style={{ letterSpacing: isAr ? "0" : "-0.02em", fontFamily: headingFont }}>
              {tx.hero.h1a}{" "}
              <span className="teal-glow-text">{tx.hero.h1b}</span>{" "}
              {tx.hero.h1c}
            </h1>

            <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "var(--text-secondary)" }}>
              {tx.hero.sub}
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-7 py-5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{ background: "linear-gradient(135deg, var(--teal), #1a9080)", color: "#fff", fontFamily: headingFont, boxShadow: "0 0 40px rgba(42,184,168,0.25)" }}>
                {tx.hero.cta1} <IconArrow dir={tx.dir} />
              </button>
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: headingFont, background: "rgba(255,255,255,0.04)" }}>
                {tx.hero.cta2}
              </button>
            </div>

            <div className="flex items-center gap-6 mt-20 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              {[
                { v: tx.hero.stat1v, l: tx.hero.stat1l, c: "var(--teal)" },
                { v: tx.hero.stat2v, l: tx.hero.stat2l, c: "var(--text-primary)" },
                { v: tx.hero.stat3v, l: tx.hero.stat3l, c: "var(--coral)" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-6">
                  {i > 0 && <div style={{ width: 1, height: 36, background: "var(--border-subtle)" }} />}
                  <div>
                    <div className="text-2xl font-bold" style={{ fontFamily: headingFont, color: s.c }}>{s.v}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative px-4 py-8">
            <DashboardMockup lang={lang} />
          </div>
        </div>
      </section>

      {/* ── TRUST MARQUEE ───────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.015)", overflow: "hidden" }}>
        <div className="py-10">
          <p className="text-center text-xs font-medium uppercase mb-8" style={{ color: "var(--text-muted)", letterSpacing: isAr ? "0.05em" : "0.14em" }}>
            {tx.trust}
          </p>
          {/* Marquee with fade edges */}
          <div className="relative" style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
            <div className="marquee-track">
              {[...clientLogos, ...clientLogos].map((name, i) => (
                <div key={i} className="flex items-center justify-center mx-4 px-7 py-3.5 rounded-xl flex-shrink-0"
                  style={{ border: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.03)", minWidth: 140 }}>
                  <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "#64748b", fontFamily: headingFont, letterSpacing: "0.02em" }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{ background: "var(--teal-dim)", border: "1px solid rgba(42,184,168,0.2)", color: "var(--teal)" }}>
              {tx.services.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ letterSpacing: isAr ? "0" : "-0.02em", fontFamily: headingFont }}>
              {tx.services.h2}
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>{tx.services.sub}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {tx.services.items.map((s, i) => {
              const isFeatured = i === 1;
              return (
                <div key={s.title}
                  className={`service-card rounded-2xl p-7 relative overflow-hidden${isFeatured ? " featured" : ""}`}
                  style={{
                    background: isFeatured
                      ? "linear-gradient(145deg, #0f2235, #111d2e)"
                      : "linear-gradient(145deg, #111d2e, #0d1827)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isFeatured
                      ? "inset 0 1px 0 rgba(255,255,255,0.07)"
                      : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}>
                  {/* Subtle inner glow for featured */}
                  {isFeatured && (
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(42,184,168,0.5), transparent)" }} />
                  )}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: isFeatured ? "linear-gradient(135deg, rgba(42,184,168,0.2), rgba(42,184,168,0.08))" : "var(--teal-dim)",
                        color: "var(--teal)",
                        border: isFeatured ? "1px solid rgba(42,184,168,0.25)" : "1px solid rgba(42,184,168,0.1)",
                        boxShadow: isFeatured ? "0 4px 12px rgba(42,184,168,0.15)" : "none",
                      }}>
                      {serviceIcons[i]}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "#7a9cbd",
                        border: "1px solid rgba(255,255,255,0.1)",
                        letterSpacing: "0.04em",
                      }}>
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: headingFont, color: "#ffffff" }}>{s.title}</h3>
                  <p className="text-sm" style={{ color: "#94a3b8", lineHeight: "1.75" }}>{s.desc}</p>
                  <div className="flex items-center gap-1.5 mt-6 text-sm font-semibold" style={{ color: "var(--teal)", cursor: "pointer" }}>
                    {tx.services.learn} <IconArrow dir={tx.dir} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────────────── */}
      <section id="process" className="py-28" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{ background: "var(--teal-dim)", border: "1px solid rgba(42,184,168,0.2)", color: "var(--teal)" }}>
              {tx.process.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ letterSpacing: isAr ? "0" : "-0.02em", fontFamily: headingFont }}>
              {tx.process.h2}
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>{tx.process.sub}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="absolute top-12 left-0 right-0 hidden md:block px-20">
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--teal), transparent)", opacity: 0.3 }} />
            </div>
            {tx.process.steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-6">
                  <div className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center"
                    style={{ background: i === 0 ? "linear-gradient(135deg, var(--teal), #1a9080)" : "var(--bg-card)", border: `1px solid ${i === 0 ? "var(--teal)" : "var(--border-subtle)"}`, boxShadow: i === 0 ? "0 0 32px rgba(42,184,168,0.25)" : "none" }}>
                    <span className="text-2xl font-extrabold" style={{ fontFamily: headingFont, color: i === 0 ? "#fff" : "var(--teal)", letterSpacing: isAr ? "0" : "-0.03em" }}>
                      {step.num}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: headingFont }}>{step.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ─────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, rgba(42,184,168,0.08), rgba(232,96,80,0.05))", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {tx.metrics.items.map((m, i) => {
              const colors = ["var(--teal)", "var(--text-primary)", "var(--coral)", "#5b8df0"];
              return (
                <div key={m.title}>
                  <div className="text-base sm:text-lg lg:text-2xl font-bold mb-2" style={{ fontFamily: headingFont, color: colors[i], letterSpacing: isAr ? "0" : "-0.01em" }}>
                    {m.title}
                  </div>
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{m.subtitle}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA / CONTACT ────────────────────────────────────────────────── */}
      <section id="work" className="py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0d1f35, #111d2e)", border: "1px solid rgba(42,184,168,0.2)" }}>
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(42,184,168,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(232,96,80,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                  style={{ background: "var(--teal-dim)", border: "1px solid rgba(42,184,168,0.2)", color: "var(--teal)" }}>
                  {tx.cta.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ letterSpacing: isAr ? "0" : "-0.02em", fontFamily: headingFont }}>
                  {tx.cta.h2}
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>{tx.cta.sub}</p>
                <div className="space-y-3">
                  {tx.cta.perks.map((p) => (
                    <div key={p} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal-dim)", border: "1px solid rgba(42,184,168,0.3)" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--teal-dim)", border: "1px solid rgba(42,184,168,0.3)" }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14L11 20L23 8" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: headingFont }}>{tx.cta.successTitle}</h3>
                  <p style={{ color: "var(--text-secondary)" }}>{tx.cta.successSub}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {(["name", "company"] as const).map((k) => (
                      <div key={k}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{tx.cta.fields[k].label}</label>
                        <input type="text" placeholder={tx.cta.fields[k].placeholder} required value={(formState as any)[k]}
                          onChange={(e) => setFormState(prev => ({ ...prev, [k]: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", textAlign: isAr ? "right" : "left" }}
                          onFocus={(e) => e.currentTarget.style.borderColor = "var(--teal)"}
                          onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{tx.cta.fields.email.label}</label>
                    <input type="email" placeholder={tx.cta.fields.email.placeholder} required value={formState.email}
                      onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", textAlign: isAr ? "right" : "left" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--teal)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{tx.cta.fields.message.label}</label>
                    <textarea placeholder={tx.cta.fields.message.placeholder} required value={formState.message} rows={3}
                      onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", textAlign: isAr ? "right" : "left" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--teal)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                    />
                  </div>
                  <button type="submit" className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                    style={{ background: "linear-gradient(135deg, var(--teal), #1a9080)", color: "#fff", fontFamily: headingFont, boxShadow: "0 0 30px rgba(42,184,168,0.2)" }}>
                    {tx.cta.fields.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <PplconsLogoMark size={32} />
                <div style={{ fontFamily: headingFont, lineHeight: 1.1 }}>
                  <div className="font-bold text-base" style={{ color: "var(--text-primary)" }}>People</div>
                  <div className="font-bold text-base" style={{ color: "var(--teal)" }}>concerns</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>{tx.footer.tagline}</p>
              <div className="flex gap-3 mt-6">
                {tx.footer.socials.map((s) => (
                  <button key={s} className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200"
                    style={{ border: "1px solid var(--border-subtle)", color: "var(--text-muted)", background: "rgba(255,255,255,0.03)" }}>
                    {s[0]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-4" style={{ fontFamily: headingFont, color: "var(--text-primary)" }}>{tx.footer.services.title}</div>
              {tx.footer.services.links.map((l) => (
                <a key={l} href="#" className="block text-sm py-1.5 no-underline transition-colors duration-200 hover:text-teal-400" style={{ color: "var(--text-secondary)" }}>{l}</a>
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold mb-4" style={{ fontFamily: headingFont, color: "var(--text-primary)" }}>{tx.footer.company.title}</div>
              {tx.footer.company.links.map((l) => (
                <a key={l} href="#" className="block text-sm py-1.5 no-underline transition-colors duration-200 hover:text-teal-400" style={{ color: "var(--text-secondary)" }}>{l}</a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{tx.footer.copy}</p>
            <div className="flex gap-6">
              {tx.footer.legal.map((l) => (
                <a key={l} href="#" className="text-xs no-underline transition-colors duration-200 hover:text-teal-400" style={{ color: "var(--text-muted)" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
