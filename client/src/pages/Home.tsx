import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from "react";
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

const ASSET_BASE = new URL("./assets/", window.location.href).toString();
const asset = (file: string) => `${ASSET_BASE}${file}`;

type Lang = "ar" | "en";
type PageId = "home" | "world" | "portfolio" | "sound" | "contact";
type Category = "all" | "campaigns" | "visuals" | "systems" | "motion" | "audio";
type ToneKind = "spark" | "pulse" | "gate";

type Project = {
  id: number;
  category: Exclude<Category, "all">;
  image: string;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
  tag: string;
  metric: string;
  size: "feature" | "wide" | "tall" | "compact";
  video?: string;
  audio?: string;
  link?: string;
};

type AudioRig = {
  ctx: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
  interval: number | null;
};

type Copy = {
  brand: string;
  lab: string;
  audioOn: string;
  audioOff: string;
  menu: string;
  close: string;
  nav: Record<PageId, string>;
  categories: Record<Category, string>;
  home: {
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
    primary: string;
    secondary: string;
    scroll: string;
    stats: { value: string; label: string }[];
    portalsTitle: string;
    portalsBody: string;
  };
  world: {
    kicker: string;
    title: string;
    body: string;
    cards: { title: string; body: string }[];
    timeline: { label: string; title: string; body: string }[];
  };
  portfolio: {
    kicker: string;
    title: string;
    body: string;
    open: string;
    close: string;
    live: string;
  };
  sound: {
    kicker: string;
    title: string;
    body: string;
    activate: string;
    deactivate: string;
    hint: string;
    pads: { kind: ToneKind; title: string; body: string }[];
    statusOn: string;
    statusOff: string;
  };
  contact: {
    kicker: string;
    title: string;
    body: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    success: string;
    linksTitle: string;
  };
  footer: string;
};

const copy: Record<Lang, Copy> = {
  ar: {
    brand: "تامر مستريحي",
    lab: "Galaxy AI Portfolio",
    audioOn: "الصوت يعمل",
    audioOff: "تشغيل الصوت",
    menu: "القائمة",
    close: "إغلاق",
    nav: {
      home: "الرئيسية",
      world: "عالم المجرة",
      portfolio: "الأعمال",
      sound: "الصوت",
      contact: "تواصل",
    },
    categories: {
      all: "الكل",
      campaigns: "حملات",
      visuals: "صور",
      systems: "أنظمة",
      motion: "فيديو",
      audio: "صوت",
    },
    home: {
      eyebrow: "واجهة كونية · ذكاء اصطناعي توليدي · تجربة عربية فاخرة",
      title: "ادخل إلى مجرة",
      accent: "تامر الإبداعية",
      body: "إعادة تصميم كاملة للصفحة كعالم مجري حي: كواكب ضوئية، ماس متفاعل مع الحركة والتمرير، وصفحات فرعية تربط الأعمال بالصوت والتجربة البصرية.",
      primary: "استكشف عالم المجرة",
      secondary: "شاهد الأعمال",
      scroll: "مرّر لتتحرك قطع الماس حولك",
      stats: [
        { value: "05", label: "صفحات مترابطة" },
        { value: "32+", label: "أصل بصري وصوتي" },
        { value: "360°", label: "إحساس مجري تفاعلي" },
      ],
      portalsTitle: "بوابات فرعية داخل المجرة",
      portalsBody: "كل بوابة صممت كصفحة مستقلة: عالم المجرة، معرض الأعمال، مختبر الصوت، ومنطقة التواصل.",
    },
    world: {
      kicker: "01 / عالم المجرة",
      title: "مدينة ضوئية تدور حول قلب من الماس.",
      body: "هذا القسم يحول الصفحة إلى مشهد كوني احترافي: طبقات نجوم، سدم، مدارات، وبوابات معلومات تتحرك بسلاسة مع مؤشر المستخدم والتمرير.",
      cards: [
        { title: "سديم الهوية", body: "تدرجات بنفسجية وزرقاء تمنح الموقع عمقاً سينمائياً وتبرز العلامة الشخصية." },
        { title: "مدارات البيانات", body: "الحلقات والكواكب الصغيرة تمثل رحلة الفكرة من البرومبت إلى المنتج القابل للاستخدام." },
        { title: "بوابات الماس", body: "الماس العائم يستجيب لحركة الصفحة ليخلق إحساساً ثلاثي الأبعاد دون مكتبات ثقيلة." },
      ],
      timeline: [
        { label: "INIT", title: "تشغيل العالم", body: "يبدأ المشهد بخلفية نجوم متعددة الطبقات وإضاءة ناعمة." },
        { label: "MOVE", title: "استجابة للحركة", body: "كل قطعة ماس تنحرف بعمق مختلف عند تحريك المؤشر أو التمرير." },
        { label: "SOUND", title: "صوت تفاعلي", body: "زر الصوت يشغل مؤثرات كونية توليدية يمكن إيقافها في أي وقت." },
      ],
    },
    portfolio: {
      kicker: "02 / معرض الأعمال",
      title: "أعمال تتحول إلى نجوم داخل الخريطة.",
      body: "مختارات من الأصول الموجودة في المشروع: صور، حملات، فيديوهات، أنظمة ومؤثرات صوتية ضمن معرض متحرك ببطاقات زجاجية.",
      open: "فتح العمل",
      close: "إغلاق المعرض",
      live: "فتح الرابط",
    },
    sound: {
      kicker: "03 / مختبر الصوت",
      title: "مؤثرات صوتية توليدية ترافق الصفحة.",
      body: "بسبب سياسات المتصفح يبدأ الصوت بعد ضغط زر التشغيل. بعدها يمكنك سماع خلفية كونية هادئة وتجربة نبضات قصيرة عند التفاعل.",
      activate: "تشغيل صوت الصفحة",
      deactivate: "إيقاف الصوت",
      hint: "جرّب الأزرار الصوتية بعد التشغيل، ثم تحرك داخل الصفحة وشاهد الماس يتفاعل بصرياً.",
      pads: [
        { kind: "spark", title: "وميض الماس", body: "رنين قصير لامع يناسب لمس البطاقات والبوابات." },
        { kind: "pulse", title: "نبضة المجرة", body: "ذبذبة منخفضة تمنح الإحساس بقلب كوني نابض." },
        { kind: "gate", title: "فتح بوابة", body: "صعود صوتي سريع لانتقال بين الصفحات الفرعية." },
      ],
      statusOn: "المشهد الصوتي يعمل الآن",
      statusOff: "الصوت متوقف — اضغط التشغيل للبدء",
    },
    contact: {
      kicker: "04 / منطقة التواصل",
      title: "لنبنِ عالماً جديداً يستحق المشاهدة.",
      body: "أرسل فكرة مشروعك أو حملتك وسأعود إليك برؤية عملية تجمع الهندسة، الذكاء الاصطناعي، والتصميم البصري.",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "اكتب فكرة المشروع",
      submit: "إرسال عبر البريد",
      success: "تم تجهيز الرسالة في بريدك. يمكنك إرسالها الآن.",
      linksTitle: "قنوات مباشرة",
    },
    footer: "تامر مستريحي — مجرة تصميم توليدية، مصممة بدقة.",
  },
  en: {
    brand: "Tamer Mistareehi",
    lab: "Galaxy AI Portfolio",
    audioOn: "Sound on",
    audioOff: "Enable sound",
    menu: "Menu",
    close: "Close",
    nav: {
      home: "Home",
      world: "Galaxy World",
      portfolio: "Portfolio",
      sound: "Sound",
      contact: "Contact",
    },
    categories: {
      all: "All",
      campaigns: "Campaigns",
      visuals: "Visuals",
      systems: "Systems",
      motion: "Motion",
      audio: "Audio",
    },
    home: {
      eyebrow: "Cosmic interface · Generative AI · Premium visual experience",
      title: "Enter Tamer’s",
      accent: "creative galaxy",
      body: "A complete redesign into a living galaxy world: glowing planets, diamonds reacting to motion and scroll, sound effects, and subpages connecting the work to the visual experience.",
      primary: "Explore the galaxy",
      secondary: "View the work",
      scroll: "Scroll to move the diamonds around you",
      stats: [
        { value: "05", label: "Connected pages" },
        { value: "32+", label: "Visual and audio assets" },
        { value: "360°", label: "Interactive galaxy feel" },
      ],
      portalsTitle: "Subpage portals inside the galaxy",
      portalsBody: "Each portal is a page of its own: galaxy world, portfolio archive, sound lab, and contact zone.",
    },
    world: {
      kicker: "01 / Galaxy world",
      title: "A luminous city orbiting a diamond core.",
      body: "This section turns the page into a professional cosmic scene: layered stars, nebulas, orbital rings, and information gates that move smoothly with the user’s pointer and scroll.",
      cards: [
        { title: "Identity nebula", body: "Purple and blue gradients give the site cinematic depth and elevate the personal brand." },
        { title: "Data orbits", body: "Rings and satellites represent the journey from prompt to a product people can use." },
        { title: "Diamond gates", body: "Floating diamonds react to movement and scrolling for a lightweight 3D illusion." },
      ],
      timeline: [
        { label: "INIT", title: "World ignition", body: "The scene opens with multi-layered stars and soft ambient glow." },
        { label: "MOVE", title: "Motion response", body: "Every diamond drifts with a different depth when you move or scroll." },
        { label: "SOUND", title: "Interactive sound", body: "The audio button launches a generated cosmic soundscape you can stop anytime." },
      ],
    },
    portfolio: {
      kicker: "02 / Work archive",
      title: "Projects become stars on the map.",
      body: "Selected project assets from the repository: images, campaigns, videos, systems, and audio moments inside a motion-rich glass gallery.",
      open: "Open project",
      close: "Close gallery",
      live: "Open link",
    },
    sound: {
      kicker: "03 / Sound lab",
      title: "Generated sound effects for the page.",
      body: "Browser policy requires a click before audio starts. After that, you can hear a soft cosmic bed and trigger short effects while interacting.",
      activate: "Enable page sound",
      deactivate: "Stop sound",
      hint: "Try the sound pads after enabling audio, then move around the page and watch the diamonds react visually.",
      pads: [
        { kind: "spark", title: "Diamond shimmer", body: "A short bright chime for cards and portals." },
        { kind: "pulse", title: "Galaxy pulse", body: "A low vibration that feels like a beating cosmic core." },
        { kind: "gate", title: "Portal opening", body: "A fast rising sweep for moving between subpages." },
      ],
      statusOn: "The soundscape is active",
      statusOff: "Sound is off — press play to begin",
    },
    contact: {
      kicker: "04 / Contact zone",
      title: "Let’s build a world worth seeing.",
      body: "Send your product or campaign idea, and I’ll respond with a practical vision combining engineering, generative AI, and visual design.",
      name: "Name",
      email: "Email address",
      message: "Describe the project idea",
      submit: "Send by email",
      success: "Your email draft is ready. You can send it now.",
      linksTitle: "Direct channels",
    },
    footer: "Tamer Mistareehi — a generative design galaxy, engineered precisely.",
  },
};

const navItems: PageId[] = ["home", "world", "portfolio", "sound", "contact"];

const projects: Project[] = [
  {
    id: 1,
    category: "campaigns",
    image: asset("smart-lockers_3e5ea0cd.jpg"),
    video: asset("smart-lockers-storyboard_50f77bf6.mp4"),
    tag: "ORBIT / 01",
    metric: "Retail AI",
    title: { ar: "قصة الخزائن الذكية", en: "Smart Lockers Storyboard" },
    desc: { ar: "حملة متحركة لفكرة خزائن ذكية داخل المولات مع لغة ضوء مستقبلية.", en: "A motion campaign for smart lockers inside malls with a futuristic light language." },
    size: "feature",
  },
  {
    id: 2,
    category: "systems",
    image: asset("smart-mirror_12ee6def.jpg"),
    tag: "STAR / 02",
    metric: "Health UI",
    title: { ar: "مرآة تفهمك", en: "A Mirror That Understands" },
    desc: { ar: "واجهة صحية هادئة تحول التقنية إلى لحظة إنسانية يومية.", en: "A calm health interface that turns technology into an everyday human moment." },
    size: "wide",
  },
  {
    id: 3,
    category: "visuals",
    image: asset("drive-image-08_99344b2d.jpeg"),
    tag: "NEBULA / 03",
    metric: "Epic visual",
    title: { ar: "مسيرة في الصحراء", en: "March Across the Desert" },
    desc: { ar: "مشهد ملحمي مولّد بالذكاء الاصطناعي بإحساس سينمائي واسع.", en: "An AI-generated epic desert scene with a wide cinematic feeling." },
    size: "tall",
  },
  {
    id: 4,
    category: "motion",
    image: asset("cloud-birds-game_21a373fd.png"),
    video: asset("avatar-cloud-birds_b103b2a0.mp4"),
    tag: "AVATAR / 04",
    metric: "Game reel",
    title: { ar: "صائد عصافير الغيوم", en: "Cloud Birds Hunter" },
    desc: { ar: "أفتار وفيديو من عالم لعبة متصفح تفاعلية بمتاهات وطيور سحابية.", en: "An avatar reel from an interactive browser game with mazes and cloud birds." },
    size: "wide",
    link: "https://zuhairtamer-ctrl.github.io/tamerbirdgame2/",
  },
  {
    id: 5,
    category: "campaigns",
    image: asset("ads-tamer_169df2a9.jpeg"),
    video: asset("company-ad_4cec3ece.mp4"),
    tag: "SIGNAL / 05",
    metric: "Generated ad",
    title: { ar: "إعلان الشركة", en: "Company Commercial" },
    desc: { ar: "فيديو إعلاني مولّد بإيقاع سريع ولمسات ضوئية مناسبة للهوية التجارية.", en: "A generated commercial with quick rhythm and glowing brand-driven details." },
    size: "feature",
  },
  {
    id: 6,
    category: "systems",
    image: asset("ramtha-site_ac8b3003.png"),
    video: asset("avatar-ramtha_3e6f5d56.mp4"),
    tag: "PORTAL / 06",
    metric: "Web system",
    title: { ar: "معهد الرمثا", en: "Ramtha Institute" },
    desc: { ar: "موقع تفاعلي وفيديو أفتار لهوية ذهبية احتفالية.", en: "An interactive site and avatar reel with a golden anniversary identity." },
    size: "wide",
    link: "https://zuhairtamer-ctrl.github.io/tamerramtha8/",
  },
  {
    id: 7,
    category: "visuals",
    image: asset("design-arena_fa179f7d.png"),
    tag: "CORE / 07",
    metric: "Identity",
    title: { ar: "ساحة التصميم", en: "Design Arena" },
    desc: { ar: "هوية مرنة لمجتمع يتعلم ويصنع ويجرب معاً.", en: "A flexible identity for a community that learns, builds, and experiments together." },
    size: "compact",
  },
  {
    id: 8,
    category: "visuals",
    image: asset("project-collection-3_ad09aef0.png"),
    tag: "MAP / 08",
    metric: "Narrative",
    title: { ar: "سرد بصري", en: "Visual Narrative" },
    desc: { ar: "بناء قصة من الصورة والمعلومة والإيقاع داخل عرض واحد.", en: "Building one story from image, information, and rhythm." },
    size: "wide",
  },
  {
    id: 9,
    category: "audio",
    image: asset("drive-image-01_d3f5db29.jpeg"),
    audio: asset("dragon-cloud-guardian_9a6d2872.mp3"),
    tag: "AUDIO / 09",
    metric: "Sound archive",
    title: { ar: "حارس سحاب التنانين", en: "Dragon Cloud Guardian" },
    desc: { ar: "مقطوعة صوتية من الأرشيف تضيف طبقة حسية إلى العالم البصري.", en: "An audio piece from the archive adding a sensory layer to the visual world." },
    size: "compact",
  },
  {
    id: 10,
    category: "visuals",
    image: asset("drive-image-09_34ff04e6.png"),
    tag: "PORTRAIT / 10",
    metric: "AI avatar",
    title: { ar: "تامر — بورتريه مجري", en: "Tamer — Galaxy Portrait" },
    desc: { ar: "بورتريه توليدي يربط الشخصية بعالم الذكاء الاصطناعي.", en: "A generated portrait connecting the personality to the AI universe." },
    size: "feature",
  },
];

const diamonds = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  x: (index * 29 + 7) % 100,
  y: (index * 47 + 11) % 100,
  size: 7 + (index % 6) * 4,
  depth: 0.12 + (index % 8) * 0.045,
  opacity: 0.18 + (index % 7) * 0.055,
  delay: (index % 10) * 0.31,
  hue: index % 3,
}));

const routeAliases: Record<string, PageId> = {
  "": "home",
  "/": "home",
  home: "home",
  index: "home",
  "index.html": "home",
  world: "world",
  galaxy: "world",
  "galaxy-world": "world",
  portfolio: "portfolio",
  work: "portfolio",
  projects: "portfolio",
  sound: "sound",
  audio: "sound",
  contact: "contact",
};

function resolvePageFromLocation(): PageId {
  const hashValue = window.location.hash.replace(/^#\/?/, "").split("/")[0].trim();
  if (hashValue in routeAliases) return routeAliases[hashValue];

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const last = pathParts[pathParts.length - 1]?.replace(/\.html$/i, "") ?? "";
  if (last in routeAliases) return routeAliases[last];

  return "home";
}

function navigateTo(page: PageId) {
  const nextHash = page === "home" ? "#/" : `#/${page}`;
  if (window.location.hash === nextHash) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = nextHash;
  }
}

function splitTitle(title: string) {
  return title.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < title.split("\n").length - 1 ? <br /> : null}
    </span>
  ));
}

function IconForPage({ page }: { page: PageId }) {
  if (page === "world") return <Globe2 size={24} />;
  if (page === "portfolio") return <Layers3 size={24} />;
  if (page === "sound") return <AudioLines size={24} />;
  if (page === "contact") return <Mail size={24} />;
  return <Sparkles size={24} />;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("galaxy-lang") === "en" ? "en" : "ar"));
  const [page, setPage] = useState<PageId>(resolvePageFromLocation);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [category, setCategory] = useState<Category>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");

  const shellRef = useRef<HTMLElement | null>(null);
  const pointerFrame = useRef<number | null>(null);
  const nextPointer = useRef({ x: 0, y: 0 });
  const audioRef = useRef<AudioRig | null>(null);

  const t = copy[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const filteredProjects = useMemo(() => {
    if (category === "all") return projects;
    return projects.filter((project) => project.category === category);
  }, [category]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = `${t.nav[page]} — ${t.lab}`;
    localStorage.setItem("galaxy-lang", lang);
  }, [dir, lang, page, t]);

  useEffect(() => {
    const updatePage = () => {
      const next = resolvePageFromLocation();
      setPage(next);
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", updatePage);
    return () => window.removeEventListener("hashchange", updatePage);
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
      shellRef.current?.style.setProperty("--scroll-progress", String(progress));
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopAmbient();
      if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTone = (kind: ToneKind = "spark") => {
    const rig = audioRef.current;
    if (!rig) return;

    const { ctx, master } = rig;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const now = ctx.currentTime;

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(kind === "pulse" ? 420 : 2400, now);
    oscillator.type = kind === "pulse" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(kind === "pulse" ? 96 : kind === "gate" ? 220 : 880 + Math.random() * 240, now);

    if (kind === "gate") {
      oscillator.frequency.exponentialRampToValueAtTime(760, now + 0.42);
      filter.frequency.exponentialRampToValueAtTime(3600, now + 0.42);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "pulse" ? 0.09 : 0.06, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "gate" ? 0.55 : 0.22));

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + (kind === "gate" ? 0.58 : 0.25));
  };

  const startAmbient = async () => {
    if (audioRef.current) {
      setSoundOn(true);
      return;
    }

    const AudioContextCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      setAudioMessage(lang === "ar" ? "المتصفح لا يدعم Web Audio." : "This browser does not support Web Audio.");
      return;
    }

    const ctx = new AudioContextCtor();
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(920, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);
    filter.connect(master);

    const oscillators = [
      { type: "sine" as OscillatorType, freq: 58, gain: 0.028 },
      { type: "triangle" as OscillatorType, freq: 116, gain: 0.014 },
      { type: "sine" as OscillatorType, freq: 174, gain: 0.01 },
    ].map((voice) => {
      const oscillator = ctx.createOscillator();
      const voiceGain = ctx.createGain();
      oscillator.type = voice.type;
      oscillator.frequency.setValueAtTime(voice.freq, ctx.currentTime);
      voiceGain.gain.setValueAtTime(voice.gain, ctx.currentTime);
      oscillator.connect(voiceGain);
      voiceGain.connect(filter);
      oscillator.start();
      return oscillator;
    });

    master.gain.exponentialRampToValueAtTime(0.52, ctx.currentTime + 1.4);

    const rig: AudioRig = { ctx, master, oscillators, interval: null };
    audioRef.current = rig;
    rig.interval = window.setInterval(() => playTone("spark"), 4200);

    setSoundOn(true);
    setAudioMessage(lang === "ar" ? "تم تشغيل صوت المجرة." : "Galaxy sound enabled.");
  };

  const stopAmbient = () => {
    const rig = audioRef.current;
    if (!rig) return;

    const now = rig.ctx.currentTime;
    if (rig.interval !== null) clearInterval(rig.interval);
    rig.master.gain.cancelScheduledValues(now);
    rig.master.gain.setTargetAtTime(0.0001, now, 0.18);
    rig.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop(now + 0.35);
      } catch {
        // Oscillator may already be stopped.
      }
    });

    window.setTimeout(() => {
      rig.ctx.close().catch(() => undefined);
    }, 520);

    audioRef.current = null;
    setSoundOn(false);
    setAudioMessage(lang === "ar" ? "تم إيقاف الصوت." : "Sound stopped.");
  };

  const toggleSound = () => {
    if (soundOn) {
      stopAmbient();
    } else {
      startAmbient().catch(() => {
        setAudioMessage(lang === "ar" ? "تعذر تشغيل الصوت." : "Could not start audio.");
      });
    }
  };

  const goToPage = (next: PageId) => {
    playTone("gate");
    navigateTo(next);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 80;
    const y = (event.clientY / window.innerHeight - 0.5) * 80;
    nextPointer.current = { x, y };

    if (pointerFrame.current === null) {
      pointerFrame.current = requestAnimationFrame(() => {
        setPointer(nextPointer.current);
        shellRef.current?.style.setProperty("--cursor-x", `${nextPointer.current.x}px`);
        shellRef.current?.style.setProperty("--cursor-y", `${nextPointer.current.y}px`);
        pointerFrame.current = null;
      });
    }
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const subject = encodeURIComponent("Galaxy AI Portfolio Inquiry");
    const body = encodeURIComponent(`${name}\n${email}\n\n${message}`);
    window.location.href = `mailto:tamermistareehi@gmail.com?subject=${subject}&body=${body}`;
    setFormStatus("success");
    playTone("spark");
  };

  const renderPage = () => {
    switch (page) {
      case "world":
        return <GalaxyWorldPage lang={lang} t={t} goToPage={goToPage} />;
      case "portfolio":
        return (
          <PortfolioPage
            lang={lang}
            t={t}
            category={category}
            setCategory={setCategory}
            projects={filteredProjects}
            openProject={(project) => {
              setSelectedProject(project);
              playTone(project.audio ? "pulse" : "spark");
            }}
          />
        );
      case "sound":
        return <SoundPage t={t} soundOn={soundOn} audioMessage={audioMessage} toggleSound={toggleSound} playTone={playTone} startAmbient={startAmbient} />;
      case "contact":
        return <ContactPage t={t} formStatus={formStatus} handleContactSubmit={handleContactSubmit} />;
      default:
        return <HomePage lang={lang} t={t} goToPage={goToPage} />;
    }
  };

  return (
    <main ref={shellRef} className="galaxy-app" dir={dir} onPointerMove={handlePointerMove}>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />
      <CosmicBackdrop />
      <DiamondField pointer={pointer} scrollProgress={scrollProgress} />

      <header className="site-header">
        <button className="brand" onClick={() => goToPage("home")} aria-label={t.nav.home}>
          <span className="brand-orb">TM</span>
          <span>
            <strong>{t.brand}</strong>
            <small>{t.lab}</small>
          </span>
        </button>

        <nav className={menuOpen ? "site-nav open" : "site-nav"} aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item} className={page === item ? "active" : ""} onClick={() => goToPage(item)}>
              <span>{t.nav[item]}</span>
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className={soundOn ? "sound-toggle active" : "sound-toggle"} onClick={toggleSound} aria-pressed={soundOn}>
            {soundOn ? <Pause size={16} /> : <Play size={16} />}
            <span>{soundOn ? t.audioOn : t.audioOff}</span>
          </button>
          <button className="lang-toggle" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
            {lang === "ar" ? "EN" : "AR"}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? t.close : t.menu}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="page-shell">{renderPage()}</div>

      <footer className="galaxy-footer">
        <span>{t.footer}</span>
        <div>
          <a href="mailto:tamermistareehi@gmail.com">Email</a>
          <a href="tel:+962776952526">00962776952526</a>
          <a href="https://jo.linkedin.com/in/tamer-zuhair-88a551177" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>

      {selectedProject ? <ProjectModal lang={lang} t={t} project={selectedProject} onClose={() => setSelectedProject(null)} /> : null}
    </main>
  );
}

function CosmicBackdrop() {
  return (
    <div className="cosmic-backdrop" aria-hidden="true">
      <div className="star-layer star-layer-one" />
      <div className="star-layer star-layer-two" />
      <div className="nebula nebula-one" />
      <div className="nebula nebula-two" />
      <div className="nebula nebula-three" />
      <div className="grid-horizon" />
    </div>
  );
}

function DiamondField({ pointer, scrollProgress }: { pointer: { x: number; y: number }; scrollProgress: number }) {
  return (
    <div className="diamond-field" aria-hidden="true">
      {diamonds.map((diamond) => {
        const tx = pointer.x * diamond.depth;
        const ty = pointer.y * diamond.depth + scrollProgress * 90 * diamond.depth;
        return (
          <span
            key={diamond.id}
            className={`diamond diamond-hue-${diamond.hue}`}
            style={
              {
                left: `${diamond.x}%`,
                top: `${diamond.y}%`,
                width: `${diamond.size}px`,
                height: `${diamond.size}px`,
                opacity: diamond.opacity,
                animationDelay: `${diamond.delay}s`,
                transform: `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(45deg) scale(${(1 + scrollProgress * 0.45).toFixed(3)})`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

function HomePage({ lang, t, goToPage }: { lang: Lang; t: Copy; goToPage: (page: PageId) => void }) {
  const portalPages: PageId[] = ["world", "portfolio", "sound", "contact"];

  return (
    <>
      <section className="hero-section section-wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            {t.home.eyebrow}
          </div>
          <h1>
            {t.home.title}
            <em>{t.home.accent}</em>
          </h1>
          <p>{t.home.body}</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => goToPage("world")}>
              {t.home.primary}
              <ArrowUpRight size={18} />
            </button>
            <button className="ghost-action" onClick={() => goToPage("portfolio")}>
              {t.home.secondary}
              <ArrowDownLeft size={18} />
            </button>
          </div>
          <div className="hero-scroll-note">
            <ChevronDown size={17} />
            {t.home.scroll}
          </div>
        </div>

        <GalaxyModel lang={lang} />
      </section>

      <section className="stats-strip section-wrap compact-wrap">
        {t.home.stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="portal-section section-wrap compact-wrap">
        <div className="section-intro">
          <span className="section-kicker">PORTALS / 04</span>
          <h2>{t.home.portalsTitle}</h2>
          <p>{t.home.portalsBody}</p>
        </div>
        <div className="portal-grid">
          {portalPages.map((portal, index) => (
            <button className="portal-card" key={portal} onClick={() => goToPage(portal)}>
              <span className="portal-index">0{index + 1}</span>
              <span className="portal-icon">
                <IconForPage page={portal} />
              </span>
              <strong>{t.nav[portal]}</strong>
              <small>{portal === "world" ? "Nebula map" : portal === "portfolio" ? "Work archive" : portal === "sound" ? "Audio engine" : "Signal room"}</small>
              <ArrowUpRight size={18} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function GalaxyWorldPage({ t, goToPage }: { lang: Lang; t: Copy; goToPage: (page: PageId) => void }) {
  return (
    <>
      <PageHero kicker={t.world.kicker} title={t.world.title} body={t.world.body} />
      <section className="world-section section-wrap compact-wrap">
        <div className="world-stage-card">
          <GalaxyModel compact />
        </div>
        <div className="world-info-grid">
          {t.world.cards.map((card, index) => (
            <article className="glass-panel world-panel" key={card.title}>
              <span>0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="timeline-section section-wrap compact-wrap">
        {t.world.timeline.map((item) => (
          <article className="timeline-card" key={item.label}>
            <span>{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
        <button className="primary-action floating-action" onClick={() => goToPage("sound")}>
          {t.nav.sound}
          <AudioLines size={18} />
        </button>
      </section>
    </>
  );
}

function PortfolioPage({
  lang,
  t,
  category,
  setCategory,
  projects,
  openProject,
}: {
  lang: Lang;
  t: Copy;
  category: Category;
  setCategory: (category: Category) => void;
  projects: Project[];
  openProject: (project: Project) => void;
}) {
  return (
    <>
      <PageHero kicker={t.portfolio.kicker} title={t.portfolio.title} body={t.portfolio.body} />
      <section className="portfolio-section section-wrap compact-wrap">
        <div className="filter-row" role="tablist" aria-label="Portfolio categories">
          {(Object.keys(t.categories) as Category[]).map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>
              {t.categories[item]}
            </button>
          ))}
        </div>
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <button
              className={`project-card ${project.size}`}
              key={project.id}
              onClick={() => openProject(project)}
              style={{ "--delay": `${index * 70}ms` } as CSSProperties}
            >
              <div className="project-media">
                {project.video ? <video src={project.video} poster={project.image} muted autoPlay loop playsInline aria-label={project.title[lang]} /> : <img src={project.image} alt={project.title[lang]} />}
              </div>
              <div className="project-shine" />
              <div className="project-top">
                <span>{project.tag}</span>
                <span>{project.metric}</span>
              </div>
              <div className="project-bottom">
                <span>{t.categories[project.category]}</span>
                <h3>{project.title[lang]}</h3>
                <p>{project.desc[lang]}</p>
                <strong>
                  {t.portfolio.open}
                  <ArrowUpRight size={16} />
                </strong>
              </div>
              {project.audio ? (
                <div className="audio-badge">
                  <AudioLines size={16} />
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function SoundPage({
  t,
  soundOn,
  audioMessage,
  toggleSound,
  playTone,
  startAmbient,
}: {
  t: Copy;
  soundOn: boolean;
  audioMessage: string;
  toggleSound: () => void;
  playTone: (kind: ToneKind) => void;
  startAmbient: () => Promise<void>;
}) {
  const handlePad = async (kind: ToneKind) => {
    if (!soundOn) await startAmbient();
    window.setTimeout(() => playTone(kind), 70);
  };

  return (
    <>
      <PageHero kicker={t.sound.kicker} title={t.sound.title} body={t.sound.body} />
      <section className="sound-section section-wrap compact-wrap">
        <div className="sound-console glass-panel">
          <button className={soundOn ? "sound-orb active" : "sound-orb"} onClick={toggleSound}>
            {soundOn ? <Pause size={34} /> : <CirclePlay size={38} />}
            <span>{soundOn ? t.sound.deactivate : t.sound.activate}</span>
          </button>
          <div className="wave-stack" aria-hidden="true">
            {Array.from({ length: 32 }, (_, index) => (
              <span key={index} style={{ "--bar": `${(index % 9) + 2}`, "--delay": `${index * 45}ms` } as CSSProperties} />
            ))}
          </div>
          <p className="sound-status">{audioMessage || (soundOn ? t.sound.statusOn : t.sound.statusOff)}</p>
          <small>{t.sound.hint}</small>
        </div>
        <div className="sound-pad-grid">
          {t.sound.pads.map((pad, index) => (
            <button className="sound-pad" key={pad.title} onClick={() => handlePad(pad.kind)}>
              <span>0{index + 1}</span>
              <AudioLines size={22} />
              <strong>{pad.title}</strong>
              <small>{pad.body}</small>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function ContactPage({
  t,
  formStatus,
  handleContactSubmit,
}: {
  t: Copy;
  formStatus: "idle" | "success";
  handleContactSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <PageHero kicker={t.contact.kicker} title={t.contact.title} body={t.contact.body} />
      <section className="contact-section section-wrap compact-wrap">
        <form className="contact-card glass-panel" onSubmit={handleContactSubmit}>
          <label>
            <span>{t.contact.name}</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            <span>{t.contact.email}</span>
            <input name="email" required type="email" autoComplete="email" />
          </label>
          <label>
            <span>{t.contact.message}</span>
            <textarea name="message" required rows={5} />
          </label>
          <button className="primary-action" type="submit">
            {t.contact.submit}
            <Mail size={18} />
          </button>
          {formStatus === "success" ? <p className="success-message">{t.contact.success}</p> : null}
        </form>
        <aside className="contact-links glass-panel">
          <span className="section-kicker">SIGNALS</span>
          <h3>{t.contact.linksTitle}</h3>
          <a href="mailto:tamermistareehi@gmail.com">
            <Mail size={18} />
            tamermistareehi@gmail.com
          </a>
          <a href="tel:+962776952526">
            <Phone size={18} />
            00962776952526
          </a>
          <a href="https://jo.linkedin.com/in/tamer-zuhair-88a551177" target="_blank" rel="noreferrer">
            <Linkedin size={18} />
            LinkedIn
          </a>
          <a href="https://github.com/zuhairtamer-ctrl" target="_blank" rel="noreferrer">
            <Github size={18} />
            GitHub
          </a>
        </aside>
      </section>
    </>
  );
}

function PageHero({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <section className="page-hero section-wrap">
      <div className="section-kicker">{kicker}</div>
      <h1>{splitTitle(title)}</h1>
      <p>{body}</p>
    </section>
  );
}

function GalaxyModel({ compact = false }: { lang?: Lang; compact?: boolean }) {
  return (
    <div className={compact ? "galaxy-model compact" : "galaxy-model"} aria-hidden="true">
      <div className="orbit orbit-one">
        <span />
      </div>
      <div className="orbit orbit-two">
        <span />
      </div>
      <div className="orbit orbit-three">
        <span />
      </div>
      <div className="galaxy-core">
        <div className="core-text">
          <Sparkles size={22} />
          <span>AI</span>
        </div>
      </div>
      <div className="diamond-monolith">
        <Fingerprint size={26} />
      </div>
      <div className="floating-chip chip-one">
        <BrainCircuit size={17} />
        <span>GEN-AI</span>
      </div>
      <div className="floating-chip chip-two">
        <MonitorCog size={17} />
        <span>SYSTEMS</span>
      </div>
      <div className="floating-chip chip-three">
        <MousePointer2 size={17} />
        <span>MOTION</span>
      </div>
    </div>
  );
}

function ProjectModal({ lang, t, project, onClose }: { lang: Lang; t: Copy; project: Project; onClose: () => void }) {
  return (
    <div className="project-modal" role="dialog" aria-modal="true" aria-label={project.title[lang]} onClick={onClose}>
      <div className="modal-inner" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t.portfolio.close}>
          <X size={22} />
        </button>
        <div className="modal-media">
          {project.video ? (
            <video src={project.video} poster={project.image} controls autoPlay playsInline />
          ) : project.audio ? (
            <div className="modal-audio">
              <img src={project.image} alt={project.title[lang]} />
              <audio src={project.audio} controls autoPlay />
            </div>
          ) : (
            <img src={project.image} alt={project.title[lang]} />
          )}
        </div>
        <div className="modal-copy">
          <span>{project.tag}</span>
          <h2>{project.title[lang]}</h2>
          <p>{project.desc[lang]}</p>
          <div className="modal-meta">
            <strong>{project.metric}</strong>
            <small>{t.categories[project.category]}</small>
          </div>
          {project.link ? (
            <a href={project.link} target="_blank" rel="noreferrer">
              {t.portfolio.live}
              <ExternalLink size={17} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
