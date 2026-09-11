import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  AudioLines,
  BrainCircuit,
  Check,
  ChevronDown,
  CirclePlay,
  ExternalLink,
  Fingerprint,
  Github,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  MonitorCog,
  MousePointer2,
  Pause,
  Phone,
  Play,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const ASSET = "/manus-storage/";

type Lang = "ar" | "en";
type Category = "all" | "ads" | "avatars" | "visuals" | "presentations";

type Copy = {
  nav: { about: string; work: string; approach: string; contact: string };
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
    primary: string;
    secondary: string;
    scroll: string;
    status: string;
  };
  about: { kicker: string; title: string; body: string; note: string; items: string[] };
  work: { kicker: string; title: string; body: string; filters: Record<Category, string>; open: string; close: string };
  approach: { kicker: string; title: string; body: string; steps: { no: string; title: string; body: string }[] };
  contact: { kicker: string; title: string; body: string; cta: string; availability: string };
  footer: string;
};

const content: Record<Lang, Copy> = {
  ar: {
    nav: { about: "نبذة", work: "الأعمال", approach: "المنهج", contact: "تواصل" },
    hero: {
      eyebrow: "مهندس اتصالات · مصمم ذكاء اصطناعي توليدي",
      title: "أحوّل الأفكار إلى",
      accent: "أنظمة تُرى وتُستخدم.",
      body: "أنا تامر مستريحي — أبني تجارب ذكية عند تقاطع الهندسة، التصميم، والخيال التوليدي. من الفكرة الأولى إلى الصورة التي تُقنع والمنتج الذي يعمل.",
      primary: "شاهد الأعمال",
      secondary: "لنتحدث عن فكرة",
      scroll: "استكشف المختبر",
      status: "متاح لمشاريع مختارة",
    },
    about: {
      kicker: "01 / عني",
      title: "هندسة دقيقة.\nخيال لا نهائي.",
      body: "تخرجت في هندسة الاتصالات من جامعة مؤتة عام 2017، وطورت خبرة عملية في الشبكات، أمن المعلومات، والأنظمة الرقمية. اليوم أستخدم هذه الخلفية لبناء عوالم بصرية وأفكار منتجات تستفيد من الذكاء الاصطناعي التوليدي.",
      note: "الموقع مبني من ملفي الشخصي وأصول أعمالي الموجودة في Drive.",
      items: ["هندسة اتصالات", "ذكاء اصطناعي توليدي", "تصميم بصري", "شبكات وأمن"],
    },
    work: {
      kicker: "02 / مختبر الأعمال",
      title: "أفكار تتحول\nإلى حضور.",
      body: "مختارات من الإعلانات، الأنظمة الذكية، والتصاميم المفاهيمية التي تشكل لغتي البصرية.",
      filters: { all: "الكل", ads: "الإعلانات", avatars: "الأفتار", visuals: "الصور", presentations: "العروض التقديمية" },
      open: "فتح المشروع",
      close: "إغلاق",
    },
    approach: {
      kicker: "03 / المنهج",
      title: "أفكر كمهندس،\nوأصمم كراوٍ.",
      body: "كل مشروع يبدأ بسؤال واضح، ثم يمر عبر حلقة سريعة من البحث، النمذجة، والاختبار حتى يصبح الذكاء شيئاً يمكن رؤيته ولمسه.",
      steps: [
        { no: "01", title: "أفكك المشكلة", body: "أحوّل الغموض إلى فرضيات، مستخدمين، وإشارات يمكن قياسها." },
        { no: "02", title: "أصنع الاحتمالات", body: "أستكشف بالصورة والبرومبت والنموذج قبل أن ألتزم بالحل." },
        { no: "03", title: "أصقل التجربة", body: "أختبر التفاصيل، الحركة، والرسالة حتى يصبح المنتج واضحاً ومقنعاً." },
      ],
    },
    contact: {
      kicker: "04 / مساحة مشتركة",
      title: "لنبنِ شيئاً\nيستحق أن يُرى.",
      body: "هل لديك فكرة منتج، حملة، أو تجربة تريد أن تمنحها بعداً جديداً؟ أرسل لي سطراً واحداً عنها.",
      cta: "راسلني الآن",
      availability: "متاح حالياً لمشاريع التصميم التوليدي والابتكار البصري.",
    },
    footer: "تامر مستريحي — هندسة الخيال، بدقة.",
  },
  en: {
    nav: { about: "About", work: "Work", approach: "Approach", contact: "Contact" },
    hero: {
      eyebrow: "Telecommunications Engineer · Generative AI Designer",
      title: "I turn ideas into",
      accent: "systems you can see.",
      body: "I’m Tamer Mistareehi — building intelligent experiences at the intersection of engineering, design, and generative imagination. From the first prompt to the product that works.",
      primary: "Explore work",
      secondary: "Start a conversation",
      scroll: "Enter the lab",
      status: "Available for select projects",
    },
    about: {
      kicker: "01 / About",
      title: "Precise engineering.\nInfinite imagination.",
      body: "I graduated in Telecommunications Engineering from Mutah University in 2017, with hands-on experience across networks, information security, and digital systems. Today I use that foundation to build visual worlds and product ideas powered by generative AI.",
      note: "This portfolio is shaped from my profile file and work assets stored in Drive.",
      items: ["Telecommunications", "Generative AI", "Visual design", "Networks + security"],
    },
    work: {
      kicker: "02 / The work lab",
      title: "Ideas become\npresence.",
      body: "A selection of generated campaigns, smart systems, and concept visuals that form my visual language.",
      filters: { all: "All work", ads: "Ads", avatars: "Avatars", visuals: "Images", presentations: "Presentations" },
      open: "Open project",
      close: "Close",
    },
    approach: {
      kicker: "03 / The approach",
      title: "I think like an engineer,\nand design like a storyteller.",
      body: "Every project starts with a clear question, then moves through a fast loop of research, prototyping, and testing until intelligence becomes something you can see and feel.",
      steps: [
        { no: "01", title: "Deconstruct", body: "I turn ambiguity into hypotheses, users, and signals we can measure." },
        { no: "02", title: "Generate", body: "I explore with image, prompt, and model before committing to one answer." },
        { no: "03", title: "Refine", body: "I test the details, motion, and message until the product feels inevitable." },
      ],
    },
    contact: {
      kicker: "04 / A shared space",
      title: "Let’s build something\nworth seeing.",
      body: "Have a product idea, campaign, or experience that deserves a new dimension? Send me one line about it.",
      cta: "Email me now",
      availability: "Currently available for generative design and visual innovation projects.",
    },
    footer: "Tamer Mistareehi — engineering imagination, precisely.",
  },
};

const projects = [
  { id: 1, category: "ads" as Category, image: `${ASSET}smart-lockers_3e5ea0cd.jpg`, tag: "AD / 01", title: { ar: "خزائن ذكية", en: "Smart Lockers" }, desc: { ar: "حملة بصرية لمنتج تقني داخل تجربة التسوق.", en: "A visual campaign for a smart product inside the retail experience." }, size: "large" },
  { id: 2, category: "visuals" as Category, image: `${ASSET}smart-mirror_12ee6def.jpg`, tag: "IMAGE / 02", title: { ar: "مرآة تفهمك", en: "A Mirror That Understands" }, desc: { ar: "تصور لواجهة صحية هادئة في أكثر الأماكن إنسانية.", en: "A concept for a calm health interface in the most human of spaces." }, size: "wide" },
  { id: 3, category: "visuals" as Category, image: `${ASSET}smart-bag_1f581587.jpg`, tag: "IMAGE / 03", title: { ar: "الحقيبة الذكية", en: "The Smart Backpack" }, desc: { ar: "ذكاء صغير يخفف ضوضاء اليوم الدراسي.", en: "Small intelligence that makes the school day feel lighter." }, size: "square" },
  { id: 4, category: "ads" as Category, image: `${ASSET}ads-tamer_169df2a9.jpeg`, tag: "CAMPAIGN / 04", title: { ar: "نظام بصري للحملات", en: "Campaign Visual System" }, desc: { ar: "سلسلة إعلانات مولّدة بلغة واحدة قابلة للتوسع.", en: "A scalable generated campaign system with a single visual voice." }, size: "tall" },
  { id: 5, category: "visuals" as Category, image: `${ASSET}data-entry_7327c8a2.jpg`, tag: "VISUAL / 05", title: { ar: "لغة البيانات", en: "The Language of Data" }, desc: { ar: "تحويل التعقيد التقني إلى صورة تتحدث بسرعة.", en: "Turning technical complexity into a visual that speaks fast." }, size: "tall" },
  { id: 6, category: "visuals" as Category, image: `${ASSET}project-collection_44492336.jpg`, tag: "CONCEPT / 06", title: { ar: "مساحات من الاحتمال", en: "Spaces of Possibility" }, desc: { ar: "تجارب بصرية تبدأ من سؤال ولا تنتهي عند إطار.", en: "Visual experiments that begin with a question, not a frame." }, size: "wide" },
  { id: 7, category: "visuals" as Category, image: `${ASSET}design-arena_fa179f7d.png`, tag: "IDENTITY / 07", title: { ar: "ساحة التصميم", en: "Design Arena" }, desc: { ar: "هوية مرنة لمجتمع يتعلم ويصنع معاً.", en: "A flexible identity for a community that learns and makes together." }, size: "square" },
  { id: 8, category: "presentations" as Category, image: `${ASSET}project-collection-3_ad09aef0.png`, tag: "PRESENTATION / 08", title: { ar: "سرد بصري", en: "Visual Narrative" }, desc: { ar: "بناء قصة من الصور والمعلومة والإيقاع.", en: "Building a story from image, information, and rhythm." }, size: "wide" },
  { id: 9, category: "avatars" as Category, image: `${ASSET}portrait_0cb3dd6a.jpg`, tag: "AVATAR / 09", title: { ar: "هوية تامر", en: "Tamer’s Avatar" }, desc: { ar: "صورة شخصية داخل عالم الذكاء الاصطناعي.", en: "A personal portrait inside an AI environment." }, size: "square" },
];

function splitTitle(value: string) {
  return value.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line}</span>);
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [category, setCategory] = useState<Category>("all");
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = content[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dir, lang]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      audio.volume = 0.18;
      audio.play().catch(() => setSoundOn(false));
    } else {
      audio.pause();
    }
  }, [soundOn]);

  const filteredProjects = useMemo(
    () => (category === "all" ? projects : projects.filter((project) => project.category === category)),
    [category],
  );

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="site-shell" dir={dir}>
      <audio ref={audioRef} loop preload="none" src={`${ASSET}ambient_2202772d.mp3`} />
      <div className="grain" aria-hidden="true" />
      <header className={`topbar ${scrolled ? "topbar-scrolled" : ""}`}>
        <button className="brand" onClick={() => scrollTo("top")} aria-label="Home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-name">TM<span>/</span>AI</span>
        </button>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`}>
          <button onClick={() => scrollTo("about")}>{t.nav.about}</button>
          <button onClick={() => scrollTo("work")}>{t.nav.work}</button>
          <button onClick={() => scrollTo("approach")}>{t.nav.approach}</button>
          <button onClick={() => scrollTo("contact")}>{t.nav.contact}</button>
        </nav>
        <div className="top-actions">
          <button className="sound-toggle" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? "Pause ambient sound" : "Play ambient sound"}>
            <AudioLines size={16} />
            <span>{soundOn ? (lang === "ar" ? "الصوت يعمل" : "Sound on") : (lang === "ar" ? "الصوت" : "Sound")}</span>
            <span className={`sound-dot ${soundOn ? "active" : ""}`} />
          </button>
          <button className="lang-toggle" onClick={() => setLang(lang === "ar" ? "en" : "ar")} aria-label="Switch language">
            <Globe2 size={15} /> {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-grid" aria-hidden="true" />
        <div className="orb orb-one" aria-hidden="true" />
        <div className="orb orb-two" aria-hidden="true" />
        <div className="hero-content page-width">
          <div className="hero-copy reveal-up">
            <div className="eyebrow"><span className="eyebrow-line" />{t.hero.eyebrow}</div>
            <h1>{t.hero.title}<br /><em>{t.hero.accent}</em></h1>
            <p className="hero-body">{t.hero.body}</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => scrollTo("work")}>
                {t.hero.primary}<ArrowUpRight size={16} />
              </button>
              <button className="button button-ghost" onClick={() => scrollTo("contact")}>
                {t.hero.secondary}<ArrowDownLeft size={16} />
              </button>
            </div>
            <div className="availability"><span className="live-pulse" />{t.hero.status}</div>
          </div>
          <div className="hero-portrait reveal-in" aria-label="Portrait of Tamer Mistareehi">
            <div className="portrait-ring ring-one" />
            <div className="portrait-ring ring-two" />
            <div className="portrait-frame">
              <img src={`${ASSET}portrait_0cb3dd6a.jpg`} alt="Tamer Mistareehi in an AI lab" />
              <div className="portrait-scan" />
            </div>
            <div className="portrait-meta meta-top"><span>AMM / 31°57'N</span><span>2026</span></div>
            <div className="portrait-meta meta-bottom"><span>FIELD NOTE 001</span><span>AI / HUMAN</span></div>
            <div className="signal-card signal-card-top"><BrainCircuit size={16} /><span>GENERATIVE<br />SYSTEMS</span></div>
            <div className="signal-card signal-card-bottom"><Fingerprint size={16} /><span>DESIGNED<br />WITH INTENT</span></div>
          </div>
        </div>
        <div className="hero-footer page-width">
          <span>© 2026 / TM-AI LAB</span>
          <button onClick={() => scrollTo("about")}>{t.hero.scroll}<ChevronDown size={15} /></button>
          <span>01 — 04</span>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div className="ticker-track"><span>GENERATIVE AI</span><i>✦</i><span>VISUAL SYSTEMS</span><i>✦</i><span>HUMAN-CENTERED DESIGN</span><i>✦</i><span>GENERATIVE AI</span><i>✦</i><span>VISUAL SYSTEMS</span><i>✦</i><span>HUMAN-CENTERED DESIGN</span><i>✦</i></div></div>

      <section id="about" className="about-section section-pad">
        <div className="page-width about-layout">
          <div className="section-kicker"><span>{t.about.kicker}</span><span className="kicker-rule" /></div>
          <div className="about-main">
            <h2 className="display-title">{splitTitle(t.about.title)}</h2>
            <div className="about-copy-grid">
              <p className="lead-copy">{t.about.body}</p>
              <div className="about-note"><Sparkles size={17} /><span>{t.about.note}</span></div>
            </div>
          </div>
          <div className="capability-list">
            {t.about.items.map((item, index) => <div className="capability" key={item}><span>0{index + 1}</span><strong>{item}</strong><Check size={14} /></div>)}
          </div>
        </div>
      </section>

      <section id="work" className="work-section section-pad">
        <div className="page-width">
          <div className="section-heading work-heading">
            <div><div className="section-kicker"><span>{t.work.kicker}</span><span className="kicker-rule" /></div><h2 className="display-title">{splitTitle(t.work.title)}</h2></div>
            <p>{t.work.body}</p>
          </div>
          <div className="filter-row" role="tablist" aria-label="Project categories">
            {(Object.keys(t.work.filters) as Category[]).map((key) => <button key={key} className={category === key ? "filter active" : "filter"} onClick={() => setCategory(key)} role="tab" aria-selected={category === key}>{t.work.filters[key]}</button>)}
          </div>
          <div className="project-grid">
            {filteredProjects.map((project, index) => <button className={`project-card ${project.size}`} key={project.id} onClick={() => setSelected(project)} style={{ "--delay": `${index * 55}ms` } as CSSProperties}>
              <img src={project.image} alt={project.title[lang]} />
              <div className="project-overlay" />
              <div className="project-topline"><span>{project.tag}</span><span className="project-arrow"><ArrowUpRight size={17} /></span></div>
              <div className="project-info"><span className="project-category">{t.work.filters[project.category]}</span><h3>{project.title[lang]}</h3><p>{project.desc[lang]}</p></div>
            </button>)}
          </div>
        </div>
      </section>

      <section id="approach" className="approach-section section-pad">
        <div className="page-width">
          <div className="section-heading approach-heading"><div><div className="section-kicker"><span>{t.approach.kicker}</span><span className="kicker-rule" /></div><h2 className="display-title">{splitTitle(t.approach.title)}</h2></div><p>{t.approach.body}</p></div>
          <div className="process-grid">
            {t.approach.steps.map((step, index) => <div className="process-step" key={step.no}><div className="process-number">{step.no}<span>↗</span></div><div><h3>{step.title}</h3><p>{step.body}</p></div><div className="process-icon">{index === 0 ? <MousePointer2 size={20} /> : index === 1 ? <Zap size={20} /> : <MonitorCog size={20} />}</div></div>)}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section section-pad">
        <div className="contact-glow" aria-hidden="true" />
        <div className="page-width contact-layout">
          <div><div className="section-kicker"><span>{t.contact.kicker}</span><span className="kicker-rule" /></div><h2 className="display-title">{splitTitle(t.contact.title)}</h2></div>
          <div className="contact-side"><p>{t.contact.body}</p><a className="contact-button" href="mailto:zuhairtamer@outlook.com">{t.contact.cta}<Mail size={17} /></a><span className="contact-availability">{t.contact.availability}</span></div>
        </div>
        <div className="contact-watermark" aria-hidden="true">TM<span>/</span>AI</div>
      </section>

      <footer className="footer page-width"><span>{t.footer}</span><div className="footer-links"><a href="mailto:zuhairtamer@outlook.com"><Mail size={15} /> Email</a><a href="tel:+962776952526"><Phone size={15} /> +962 7 7695 2526</a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a><a href="https://github.com" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a></div><span>AMMAN / JORDAN</span></footer>

      {selected && <div className="project-modal" role="dialog" aria-modal="true" aria-label={selected.title[lang]} onClick={() => setSelected(null)}><div className="modal-inner" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label={t.work.close}><X size={20} /></button><img src={selected.image} alt={selected.title[lang]} /><div className="modal-copy"><span>{selected.tag}</span><h2>{selected.title[lang]}</h2><p>{selected.desc[lang]}</p><a href="mailto:zuhairtamer@outlook.com">{t.contact.cta}<ArrowUpRight size={16} /></a></div></div></div>}
    </main>
  );
}
