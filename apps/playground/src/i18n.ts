import { DEFAULT_LOCALE, getLocaleDirection, type Locale } from "afghanistan-province-chart";

/** Site translations are separate from the package's built-in map translations. */
const en = {
  meta: {
    title: "Afghanistan Province Charts — React map library",
    description:
      "Interactive, accessible React maps and choropleths for the 34 provinces of Afghanistan.",
  },
  site: {
    skip: "Skip to content",
    brand: "Afghanistan",
    brandSubtitle: "Province Charts",
    brandFull: "Afghanistan Province Charts",
    primaryNav: "Primary",
    playground: "Playground",
    choropleth: "Choropleth",
    api: "API",
    docs: "Docs",
    localization: "Localization",
    language: "Site language",
    switchTheme: "Switch to {theme} theme",
    light: "Light",
    dark: "Dark",
    heroBadge: "v0.1.0 · MIT · no API keys",
    heroTitle: "Afghanistan,",
    heroEmphasis: "province by province.",
    heroDescription:
      "A developer-first React library for interactive maps and data-driven choropleths of all 34 provinces. Typed, accessible, localization-ready and completely self-contained.",
    tryPlayground: "Try the playground",
    browseApi: "Browse the API",
    copyInstall: "Copy install command",
    copied: "Copied",
    copy: "Copy",
    heroPointCodes: "34 canonical ISO codes",
    heroPointInput: "Mouse, touch and keyboard",
    heroPointRtl: "Dari and Pashto RTL UI",
    previewMap: "Preview map of Afghanistan's provinces",
    provinces: "34 provinces",
    oneSvg: "1 lightweight SVG",
    localized: "Localized",
    threeLanguages: "3 languages",
    highlights: "Library highlights",
    features: [
      {
        title: "34 real province paths",
        body: "Build-time projected geometry from geoBoundaries ADM1. Exact ISO 3166-2 identifiers, no positional guesses.",
      },
      {
        title: "Keyboard and screen-reader ready",
        body: "Roving focus, arrow-key navigation, Enter and Space activation, live announcements and visible focus rings.",
      },
      {
        title: "English · Dari · Pashto",
        body: "Localized names and interface chrome with RTL tooltips and legends — the physical map is never mirrored.",
      },
      {
        title: "No map service required",
        body: "No API keys, tiles, CDNs or runtime network requests. Just a typed React component and ~32 kB gzipped JS.",
      },
    ],
    livePlayground: "Live playground",
    playgroundTitle: "Every prop, one map.",
    playgroundDescription:
      "Change the language, theme and colors. Switch to a choropleth to see missing values kept distinct from zero. The code panel always matches the preview.",
    dataViz: "Data visualization",
    dataTitle: "Data without losing the map.",
    dataDescription:
      "Partial datasets are first-class. Missing values get their own color, zero keeps its real scale position, and the legend, tooltip and screen-reader label all agree.",
    illustrativeDataset: "Illustrative dataset",
    metric: "Illustrative service-reach index (0–100)",
    missingTitle: "Missing is not zero.",
    missingDescription:
      "Six provinces deliberately have no value in this demo. They render in the neutral missing-data color instead of collapsing to the bottom of the scale.",
    highestValues: "Highest illustrative sample values",
    fabricated: "These numbers are fabricated for the demo and are not official statistics.",
    apiReference: "API reference",
    apiTitle: "Small surface. Strong types.",
    apiDescription:
      "Everything is exported from the package root, including the ISO province union, interaction payloads and tooltip context. No deep imports required.",
    localizationTitle: "Three languages. One geography.",
    localizationDescription:
      "Switch locale at runtime. Province identifiers never change, and RTL applies to interface chrome only — the country is not flipped.",
    nameSources:
      "Names were checked against Persian and Pashto Wikipedia province lists. Dialectal spellings vary; corrections are welcome.",
    documentation: "Documentation",
    docsTitle: "From install to dashboard.",
    docsDescription:
      "The repository ships a playground, API docs, localization notes and a data provenance record. Start with three lines of code.",
    fullGuide: "Read the full guide",
    install: "Install",
    installDescription: "Add the package with pnpm, then import the scoped stylesheet once.",
    render: "Render",
    renderDescription: "Drop the map into any card, grid, panel or full-page layout.",
    nextDescription: "Components are SSR-safe. Add",
    nextDescriptionEnd: "when you pass callbacks or control selection.",
    geographicData: "Geographic data",
    geographicTitle: "Reproducible, attributed, bundled locally.",
    geographicDescription:
      "Geometry comes from geoBoundaries gbOpen AFG ADM1 (boundary year 2007). The boundary dataset is public domain; geoBoundaries project code and derivative works are CC BY 4.0 and require attribution. Two source codes (AF_BDN and AF_KAN) are normalised to ISO 3166-2.",
    geographicSource:
      "The source GeoJSON, checksum, reviewed name mapping and generation script are kept in the repository. Projection happens at build time, so D3 is not shipped to the browser.",
    admUnits: "ADM1 units",
    boundaryYear: "boundary year",
    runtimeDownloads: "runtime downloads",
    footerNote:
      "MIT-licensed source. Boundary data public domain, with geoBoundaries attribution. Not a legal or survey-grade boundary source.",
    footerNav: "Footer",
  },
  demo: {
    configuration: "Configuration",
    reset: "Reset",
    display: "Display",
    displayMode: "Display mode",
    map: "Map",
    choropleth: "Choropleth",
    language: "Map language",
    mapColors: "Map colors",
    choroplethColors:
      "Choropleth fills come from the data scale. Switch to Map to edit these colors.",
    liveColors: "Selection and hover colors update live.",
    base: "Base",
    hover: "Hover",
    selected: "Selected",
    baseColor: "Base fill color",
    hoverColor: "Hover fill color",
    selectedColor: "Selected fill color",
    options: "Options",
    showTooltips: "Show tooltips",
    showLabels: "Show province labels",
    livePreview: "Live preview",
    interactiveMap: "Interactive province map",
    provinceChoropleth: "Province choropleth",
    selectedProvince: "Selected province",
    sampleValue: "Sample value",
    noData: "No data",
    selectHint: "Click a province — or focus it and press Enter — to select.",
    noneSelected: "No province selected. Pick one on the map.",
    sourcePreview: "Source for this preview",
    sourceDescription: "Every control above maps to a typed prop — no hidden wrappers.",
  },
  code: { copy: "Copy", copied: "Copied", failed: "Copy failed" },
  api: {
    prop: "Prop",
    type: "Type",
    default: "Default",
    notes: "Notes",
    mapPlus: "Accepts every map prop plus the data-specific props below.",
    utilities: "Utility exports",
    defaults: {
      theme: "theme defaults",
      localized: "localized",
      required: "required",
      autoDomain: "auto min/max",
      teal: "teal scale",
      scoped: "scoped token",
    },
    rows: {
      locale: "Province names, UI copy and text direction.",
      dimensions: "Container dimensions. The SVG keeps its aspect ratio.",
      selectedProvince: "Controlled selection. Passing null clears the selection.",
      defaultSelectedProvince: "Initial selection for uncontrolled usage.",
      onProvinceClick: "Canonical province metadata plus the originating event.",
      onSelectionChange: "Fires on select and deselect, including keyboard activation.",
      showTooltip: "Built-in tooltip on hover and keyboard focus.",
      showProvinceLabels: "Localized province names drawn inside the map.",
      colors: "Maps to scoped CSS variables for full theme control.",
      renderTooltip: "Replace tooltip content with React nodes. Never HTML strings.",
      interactive: "Render a muted, non-focusable map when false.",
      ariaLabel: "Accessible name applied to the SVG group.",
      data: "Values keyed by ISO code. Missing keys are not zero.",
      domain: "Fixed numeric domain for a stable scale across renders.",
      palette: "Two-stop continuous palette using CSS hex colors.",
      missingColor: "Fill for missing, null, NaN or out-of-province data.",
      formatValue: "Custom metric formatting for tooltip and legend.",
      showLegend: "Continuous legend with min, max and missing-data swatch.",
      legendTitle: "Legend heading, useful for naming the metric.",
    },
    utilityDescriptions: {
      getProvinces: "Immutable registry of all 34 provinces.",
      getProvinceByCode: "Canonical metadata for an ISO code.",
      getProvinceName: "Localized name with a safe English fallback.",
      isProvinceCode: "Runtime narrowing for untrusted strings.",
    },
  },
};

export type ShowcaseMessages = typeof en;

const prs: ShowcaseMessages = {
  meta: {
    title: "نمودارهای ولایت‌های افغانستان — کتابخانهٔ نقشهٔ React",
    description: "نقشه‌های تعاملی و دسترس‌پذیر React و نقشه‌های رنگی برای ۳۴ ولایت افغانستان.",
  },
  site: {
    skip: "رفتن به محتوای اصلی",
    brand: "افغانستان",
    brandSubtitle: "نمودارهای ولایت‌ها",
    brandFull: "نمودارهای ولایت‌های افغانستان",
    primaryNav: "ناوبری اصلی",
    playground: "محیط آزمایش",
    choropleth: "نقشهٔ رنگی",
    api: "API",
    docs: "راهنما",
    localization: "بومی‌سازی",
    language: "زبان وب‌سایت",
    switchTheme: "تغییر به نمای {theme}",
    light: "روشن",
    dark: "تاریک",
    heroBadge: "v0.1.0 · MIT · بدون کلید API",
    heroTitle: "افغانستان،",
    heroEmphasis: "ولایت به ولایت.",
    heroDescription:
      "یک کتابخانهٔ React برای توسعه‌دهندگان، با نقشه‌های تعاملی و نقشه‌های رنگی داده‌محور برای هر ۳۴ ولایت. دارای نوع‌های مشخص، دسترس‌پذیر، چندزبانه و کاملاً مستقل.",
    tryPlayground: "محیط آزمایش را امتحان کنید",
    browseApi: "مشاهدهٔ API",
    copyInstall: "نسخ فرمان نصب",
    copied: "نسخ شد",
    copy: "نسخ",
    heroPointCodes: "۳۴ کد استاندارد ISO",
    heroPointInput: "ماوس، لمس و صفحه‌کلید",
    heroPointRtl: "رابط راست‌به‌چپ دری و پشتو",
    previewMap: "پیش‌نمایش نقشهٔ ولایت‌های افغانستان",
    provinces: "۳۴ ولایت",
    oneSvg: "یک SVG سبک",
    localized: "چندزبانه",
    threeLanguages: "۳ زبان",
    highlights: "ویژگی‌های کتابخانه",
    features: [
      {
        title: "مسیرهای واقعی ۳۴ ولایت",
        body: "هندسهٔ آماده‌شده از geoBoundaries ADM1 با شناسه‌های دقیق ISO 3166-2؛ بدون حدس‌زدن موقعیت‌ها.",
      },
      {
        title: "آماده برای صفحه‌کلید و صفحه‌خوان",
        body: "جابجایی با کلیدهای جهت‌دار، انتخاب با Enter و Space، اعلان‌های زنده و نشانگر واضح فوکوس.",
      },
      {
        title: "انگلیسی · دری · پشتو",
        body: "نام‌ها و رابط بومی‌سازی‌شده با راهنما و راهنمای رنگ راست‌به‌چپ؛ خود نقشه هرگز برعکس نمی‌شود.",
      },
      {
        title: "بدون نیاز به خدمات نقشه",
        body: "بدون کلید API، کاشی نقشه، CDN یا درخواست شبکه هنگام اجرا. تنها یک کامپوننت React نوع‌دار و حدود ۳۲ کیلوبایت جاوااسکریپت فشرده.",
      },
    ],
    livePlayground: "محیط آزمایش زنده",
    playgroundTitle: "همهٔ ویژگی‌ها، یک نقشه.",
    playgroundDescription:
      "زبان، نما و رنگ‌ها را تغییر دهید. به نقشهٔ رنگی بروید تا تفاوت دادهٔ مفقود و صفر را ببینید. کد همیشه با پیش‌نمایش هماهنگ است.",
    dataViz: "نمایش داده‌ها",
    dataTitle: "داده‌ها بدون تغییر نقشه.",
    dataDescription:
      "مجموعه‌داده‌های ناقص پشتیبانی می‌شوند. دادهٔ مفقود رنگ جداگانه دارد، صفر جای واقعی‌اش را در مقیاس حفظ می‌کند و راهنمای رنگ، راهنماک و برچسب صفحه‌خوان یکسان‌اند.",
    illustrativeDataset: "داده‌های نمونه",
    metric: "شاخص نمونهٔ دسترسی به خدمات (۰–۱۰۰)",
    missingTitle: "دادهٔ مفقود صفر نیست.",
    missingDescription:
      "در این نمونه شش ولایت عمداً مقدار ندارند. این ولایت‌ها به‌جای قرارگرفتن در پایین مقیاس، با رنگ خنثای دادهٔ مفقود نمایش داده می‌شوند.",
    highestValues: "بالاترین مقدارهای نمونه",
    fabricated: "این اعداد برای نمایش ساخته شده‌اند و آمار رسمی نیستند.",
    apiReference: "مرجع API",
    apiTitle: "رابط کوچک، نوع‌های دقیق.",
    apiDescription:
      "همه‌چیز از ریشهٔ بسته صادر می‌شود؛ از جمله نوع کدهای ISO ولایت‌ها، داده‌های تعامل و اطلاعات راهنماک. نیازی به واردکردن فایل‌های داخلی نیست.",
    localizationTitle: "سه زبان، یک جغرافیا.",
    localizationDescription:
      "زبان را هنگام اجرا تغییر دهید. شناسهٔ ولایت‌ها ثابت می‌ماند و راست‌به‌چپ فقط بر رابط اثر می‌گذارد؛ نقشه برعکس نمی‌شود.",
    nameSources:
      "نام‌ها با فهرست‌های ولایت‌ها در ویکی‌پدیای فارسی و پشتو بررسی شده‌اند. املاهای محلی متفاوت‌اند؛ اصلاحات شما پذیرفته است.",
    documentation: "راهنما",
    docsTitle: "از نصب تا داشبورد.",
    docsDescription:
      "مخزن شامل محیط آزمایش، مرجع API، راهنمای بومی‌سازی و پیشینهٔ داده‌ها است. با چند خط کد آغاز کنید.",
    fullGuide: "خواندن راهنمای کامل",
    install: "نصب",
    installDescription: "بسته را با pnpm نصب کنید و شیوه‌نامهٔ آن را یک‌بار وارد کنید.",
    render: "نمایش",
    renderDescription: "نقشه را در کارت، شبکه، پنل یا صفحهٔ کامل قرار دهید.",
    nextDescription: "کامپوننت‌ها با رندر سمت سرور سازگارند. هنگام ارسال تابع یا کنترل انتخاب،",
    nextDescriptionEnd: "را اضافه کنید.",
    geographicData: "داده‌های جغرافیایی",
    geographicTitle: "بازتولیدپذیر، دارای ارجاع و بسته‌بندی‌شده در پروژه.",
    geographicDescription:
      "هندسه از geoBoundaries gbOpen AFG ADM1 (مرزهای سال ۲۰۰۷) گرفته شده است. داده‌های مرزی در مالکیت عمومی است؛ کد پروژهٔ geoBoundaries و آثار مشتق‌شده تحت CC BY 4.0 است و نیاز به ذکر منبع دارد. دو کد منبع (AF_BDN و AF_KAN) به ISO 3166-2 یکسان‌سازی شده‌اند.",
    geographicSource:
      "فایل GeoJSON منبع، اثر انگشت فایل، نگاشت بررسی‌شدهٔ نام‌ها و برنامهٔ تولید در مخزن نگهداری می‌شوند. تبدیل هندسی هنگام ساخت انجام می‌شود و D3 به مرورگر ارسال نمی‌شود.",
    admUnits: "واحد ADM1",
    boundaryYear: "سال مرزبندی",
    runtimeDownloads: "دریافت هنگام اجرا",
    footerNote:
      "کد منبع با مجوز MIT. داده‌های مرزی در مالکیت عمومی با ذکر منبع geoBoundaries. این داده‌ها منبع مرزهای حقوقی یا نقشه‌برداری دقیق نیستند.",
    footerNav: "ناوبری پایین صفحه",
  },
  demo: {
    configuration: "تنظیمات",
    reset: "بازنشانی",
    display: "نمایش",
    displayMode: "نوع نمایش",
    map: "نقشه",
    choropleth: "نقشهٔ رنگی",
    language: "زبان نقشه",
    mapColors: "رنگ‌های نقشه",
    choroplethColors:
      "رنگ‌های نقشهٔ رنگی از مقیاس داده‌ها می‌آیند. برای ویرایش رنگ‌ها به نقشه برگردید.",
    liveColors: "رنگ انتخاب و نشانگر ماوس فوراً تغییر می‌کند.",
    base: "پایه",
    hover: "نشانگر",
    selected: "انتخاب",
    baseColor: "رنگ پایهٔ ولایت",
    hoverColor: "رنگ هنگام عبور ماوس",
    selectedColor: "رنگ ولایت انتخاب‌شده",
    options: "گزینه‌ها",
    showTooltips: "نمایش راهنماک‌ها",
    showLabels: "نمایش نام ولایت‌ها",
    livePreview: "پیش‌نمایش زنده",
    interactiveMap: "نقشهٔ تعاملی ولایت‌ها",
    provinceChoropleth: "نقشهٔ رنگی ولایت‌ها",
    selectedProvince: "ولایت انتخاب‌شده",
    sampleValue: "مقدار نمونه",
    noData: "بدون معلومات",
    selectHint: "روی یک ولایت کلیک کنید یا به آن بروید و Enter را بزنید.",
    noneSelected: "هیچ ولایتی انتخاب نشده است. یکی را روی نقشه انتخاب کنید.",
    sourcePreview: "کد این پیش‌نمایش",
    sourceDescription:
      "هر تنظیم بالا با یک ویژگی نوع‌دار مرتبط است؛ هیچ لایهٔ پنهانی وجود ندارد.",
  },
  code: { copy: "نسخ", copied: "نسخ شد", failed: "نسخ انجام نشد" },
  api: {
    prop: "ویژگی",
    type: "نوع",
    default: "پیش‌فرض",
    notes: "توضیحات",
    mapPlus: "تمام ویژگی‌های نقشه به‌همراه ویژگی‌های ویژهٔ داده را می‌پذیرد.",
    utilities: "توابع کمکی",
    defaults: {
      theme: "پیش‌فرض نما",
      localized: "بومی‌سازی‌شده",
      required: "الزامی",
      autoDomain: "کمینه/بیشینهٔ خودکار",
      teal: "مقیاس فیروزه‌ای",
      scoped: "متغیر ویژه",
    },
    rows: {
      locale: "نام ولایت‌ها، متن رابط و جهت نوشتار.",
      dimensions: "اندازه‌های ظرف؛ SVG نسبت ابعاد خود را حفظ می‌کند.",
      selectedProvince: "انتخاب کنترل‌شده؛ null انتخاب را پاک می‌کند.",
      defaultSelectedProvince: "انتخاب اولیه در حالت کنترل‌نشده.",
      onProvinceClick: "اطلاعات استاندارد ولایت و رویداد آغازگر.",
      onSelectionChange: "هنگام انتخاب یا لغو انتخاب، حتی با صفحه‌کلید، اجرا می‌شود.",
      showTooltip: "راهنماک پیش‌فرض هنگام عبور ماوس و فوکوس صفحه‌کلید.",
      showProvinceLabels: "نام‌های بومی‌سازی‌شدهٔ ولایت‌ها داخل نقشه.",
      colors: "نگاشت به متغیرهای CSS برای کنترل کامل نما.",
      renderTooltip: "محتوای راهنماک را با عناصر React جایگزین کنید، نه رشتهٔ HTML.",
      interactive: "اگر false باشد نقشه غیرفعال و غیرقابل فوکوس است.",
      ariaLabel: "نام دسترس‌پذیر برای گروه SVG.",
      data: "مقادیر با کد ISO؛ مقدار مفقود صفر نیست.",
      domain: "بازهٔ عددی ثابت برای مقیاس پایدار.",
      palette: "مقیاس پیوستهٔ دورنگ با رنگ‌های هگز CSS.",
      missingColor: "رنگ مقدار مفقود، null، NaN یا دادهٔ خارج از ولایت.",
      formatValue: "قالب‌بندی دلخواه مقدار در راهنماک و راهنمای رنگ.",
      showLegend: "راهنمای رنگ با کمینه، بیشینه و نشان مقدار مفقود.",
      legendTitle: "عنوان راهنمای رنگ برای نام‌گذاری شاخص.",
    },
    utilityDescriptions: {
      getProvinces: "فهرست تغییرناپذیر هر ۳۴ ولایت.",
      getProvinceByCode: "اطلاعات استاندارد ولایت با کد ISO.",
      getProvinceName: "نام بومی‌سازی‌شده با بازگشت امن به انگلیسی.",
      isProvinceCode: "بررسی رشتهٔ ورودی نامطمئن هنگام اجرا.",
    },
  },
};

const ps: ShowcaseMessages = {
  meta: {
    title: "د افغانستان د ولایتونو چارټونه — د React د نقشې کتابتون",
    description:
      "د افغانستان د ۳۴ ولایتونو لپاره د React متقابلې او د لاسرسي وړ نقشې او رنګیزې نقشې.",
  },
  site: {
    skip: "اصلي منځپانګې ته تلل",
    brand: "افغانستان",
    brandSubtitle: "د ولایتونو چارټونه",
    brandFull: "د افغانستان د ولایتونو چارټونه",
    primaryNav: "اصلي لارښود",
    playground: "ازمېښتي چاپېریال",
    choropleth: "رنګیزه نقشه",
    api: "API",
    docs: "لارښود",
    localization: "ژبنیز ملاتړ",
    language: "د وېبپاڼې ژبه",
    switchTheme: "{theme} بڼې ته اړول",
    light: "روښانه",
    dark: "تیاره",
    heroBadge: "v0.1.0 · MIT · د API کیلي ته اړتیا نشته",
    heroTitle: "افغانستان،",
    heroEmphasis: "ولایت په ولایت.",
    heroDescription:
      "د پراختیاکوونکو لپاره د React کتابتون چې د ټولو ۳۴ ولایتونو متقابلې او د معلوماتو پر بنسټ رنګیزې نقشې جوړوي. ډول‌لرونکی، د لاسرسي وړ، څوژبی او بشپړ خپلواک دی.",
    tryPlayground: "ازمېښتي چاپېریال وازمویئ",
    browseApi: "API وګورئ",
    copyInstall: "د نصب امر کاپي کړئ",
    copied: "کاپي شو",
    copy: "کاپي",
    heroPointCodes: "۳۴ معیاري ISO کوډونه",
    heroPointInput: "ماوس، لمس او کیبورډ",
    heroPointRtl: "د دري او پښتو ښي-نه-چپ انترفېس",
    previewMap: "د افغانستان د ولایتونو د نقشې مخکتنه",
    provinces: "۳۴ ولایتونه",
    oneSvg: "یو سپک SVG",
    localized: "څوژبی",
    threeLanguages: "۳ ژبې",
    highlights: "د کتابتون ځانګړتیاوې",
    features: [
      {
        title: "د ۳۴ ولایتونو اصلي بڼې",
        body: "د geoBoundaries ADM1 له معلوماتو څخه د جوړولو پر مهال چمتو شوې هندسه؛ دقیق ISO 3166-2 پېژندنې، بې له اټکلي ځایونو.",
      },
      {
        title: "د کیبورډ او سکرین لوستونکي ملاتړ",
        body: "د غشي کیليو په وسیله ګرځېدل، د Enter او Space په وسیله ټاکل، ژوندي اعلانونه او څرګند فوکوس.",
      },
      {
        title: "انګلیسي · دري · پښتو",
        body: "ژباړل شوي نومونه، ښي-نه-چپ لارښوونې او رنګیزه لارښود؛ د نقشې اصلي بڼه هېڅکله نه اړول کېږي.",
      },
      {
        title: "د نقشې خدمت ته اړتیا نشته",
        body: "نه د API کیلي، نه ټایلونه، نه CDN او نه د چلولو پر مهال شبکيزې غوښتنې؛ یوازې یو ډول‌لرونکی React کامپوننټ او شاوخوا ۳۲ کیلوبایټه فشرده JS.",
      },
    ],
    livePlayground: "ژوندی ازمېښتي چاپېریال",
    playgroundTitle: "ټولې ځانګړنې، یوه نقشه.",
    playgroundDescription:
      "ژبه، بڼه او رنګونه بدل کړئ. رنګیزې نقشې ته لاړ شئ څو ورک ارزښت له صفر څخه جلا ووینئ. د کوډ برخه تل له مخکتنې سره سمه وي.",
    dataViz: "د معلوماتو انځورول",
    dataTitle: "معلومات، بې له دې چې نقشه بدله شي.",
    dataDescription:
      "نیمګړې معلوماتي ټولګې هم منل کېږي. ورک ارزښت ځانته رنګ لري، صفر په کچه کې خپل ځای ساتي او رنګیز لارښود، څرګندونې او د سکرین لوستونکي نومونه یو شان دي.",
    illustrativeDataset: "بېلګه‌ییز معلومات",
    metric: "د خدمتونو د لاسرسي بېلګه‌ییز شاخص (۰–۱۰۰)",
    missingTitle: "ورک ارزښت صفر نه دی.",
    missingDescription:
      "په دې بېلګه کې شپږ ولایتونه په قصدي ډول ارزښت نه لري. د کچې په ټیټ ځای کې د راوستلو پر ځای، په بې‌طرفه رنګ ښودل کېږي.",
    highestValues: "تر ټولو لوړ بېلګه‌ییز ارزښتونه",
    fabricated: "دا شمېرې یوازې د بېلګې لپاره جوړې شوې دي او رسمي احصایه نه ده.",
    apiReference: "د API لارښود",
    apiTitle: "کوچنی انترفېس، کره ډولونه.",
    apiDescription:
      "ټول توکي د بستې له اصلي ننوت څخه صادریږي، لکه د ولایتونو ISO کوډونه، د تعامل معلومات او د څرګندونو معلومات. داخلي فایلونو ته اړتیا نشته.",
    localizationTitle: "درې ژبې، یوه جغرافیه.",
    localizationDescription:
      "ژبه د کار پر مهال بدله کړئ. د ولایت کوډونه نه بدلېږي او ښي-نه-چپ یوازې پر انترفېس اغېز کوي؛ هېواد نه اړول کېږي.",
    nameSources:
      "نومونه د فارسي او پښتو ویکیپېډیا د ولایتونو له نوملړونو سره کتل شوي دي. سیمه‌ییزې بڼې توپیر لري؛ سمونې هرکلی لري.",
    documentation: "لاسوندونه",
    docsTitle: "له نصب څخه تر ډېشبورد پورې.",
    docsDescription:
      "په زېرمتون کې ازمېښتي چاپېریال، د API لاسوندونه، د ژبو یادښتونه او د معلوماتو سرچینه شته. په څو کرښو کوډ پیل وکړئ.",
    fullGuide: "بشپړ لارښود ولولئ",
    install: "نصب",
    installDescription: "بسته په pnpm نصب کړئ او د سټایل فایل یې یو ځل وارد کړئ.",
    render: "ښودل",
    renderDescription: "نقشه په کارت، شبکه، پینل یا ټوله پاڼه کې وښایئ.",
    nextDescription:
      "کامپوننټونه د سرور له رینډر سره سمون لري. کله چې د غبرګون دندې ورکوئ یا ټاکنه اداره کوئ،",
    nextDescriptionEnd: "ورزیات کړئ.",
    geographicData: "جغرافیایي معلومات",
    geographicTitle: "بیا جوړېدونکي، سرچینه‌لرونکي او له بستې سره خوندي.",
    geographicDescription:
      "هندسه له geoBoundaries gbOpen AFG ADM1 (د ۲۰۰۷ کال پولې) څخه ده. د پولو معلومات عامه ملکیت دی؛ د geoBoundaries پروژې کوډ او مشتق اثار د CC BY 4.0 لاندې دي او د سرچینې یادول غواړي. د سرچینې دوه کوډونه (AF_BDN او AF_KAN) ISO 3166-2 ته یو شان شوي دي.",
    geographicSource:
      "اصلي GeoJSON، د فایل د تصدیق نښه، د نومونو کتل شوې نقشه او د جوړولو سکریپټ په زېرمتون کې ساتل کېږي. هندسي بدلون د جوړولو پر مهال کېږي؛ D3 براوزر ته نه ځي.",
    admUnits: "ADM1 واحدونه",
    boundaryYear: "د پولو کال",
    runtimeDownloads: "د چلولو ډاونلوډونه",
    footerNote:
      "سرچینه د MIT جواز لاندې ده. د پولو معلومات عامه ملکیت دی او geoBoundaries ته سرچینه ورکول اړین دي. دا د قانوني یا دقیقې سروې پولې نه دي.",
    footerNav: "لاندې لارښود",
  },
  demo: {
    configuration: "تنظیمات",
    reset: "بیا پیل",
    display: "ښودل",
    displayMode: "د ښودلو بڼه",
    map: "نقشه",
    choropleth: "رنګیزه نقشه",
    language: "د نقشې ژبه",
    mapColors: "د نقشې رنګونه",
    choroplethColors:
      "د رنګیزې نقشې رنګونه د معلوماتو له کچې راځي. د سمون لپاره نقشې ته لاړ شئ.",
    liveColors: "د ټاکنې او ماوس رنګونه سمدستي بدلېږي.",
    base: "اصلي",
    hover: "د ماوس لاندې",
    selected: "ټاکل شوی",
    baseColor: "د ولایت اصلي رنګ",
    hoverColor: "د ماوس لاندې رنګ",
    selectedColor: "د ټاکلي ولایت رنګ",
    options: "غوراوي",
    showTooltips: "څرګندونې ښودل",
    showLabels: "د ولایتونو نومونه ښودل",
    livePreview: "ژوندۍ مخکتنه",
    interactiveMap: "د ولایتونو متقابله نقشه",
    provinceChoropleth: "د ولایتونو رنګیزه نقشه",
    selectedProvince: "ټاکل شوی ولایت",
    sampleValue: "بېلګه‌ییز ارزښت",
    noData: "معلومات نشته",
    selectHint: "پر یوه ولایت کلیک وکړئ، یا ورته فوکوس ورکړئ او Enter ووهئ.",
    noneSelected: "هیڅ ولایت نه دی ټاکل شوی. پر نقشه یو ولایت وټاکئ.",
    sourcePreview: "د دې مخکتنې کوډ",
    sourceDescription: "پورته هر تنظیم له ډول‌لرونکې ځانګړنې سره تړاو لري؛ پټ پوښ نشته.",
  },
  code: { copy: "کاپي", copied: "کاپي شو", failed: "کاپي ونه شوه" },
  api: {
    prop: "ځانګړنه",
    type: "ډول",
    default: "اصلي ارزښت",
    notes: "یادښتونه",
    mapPlus: "د نقشې ټولې ځانګړنې او د معلوماتو ځانګړې ځانګړنې مني.",
    utilities: "مرستندویه دندې",
    defaults: {
      theme: "د بڼې اصلي ارزښت",
      localized: "ژباړل شوی",
      required: "اړین",
      autoDomain: "خپله ټیټه/لوړه کچه",
      teal: "شین‌اسماني کچه",
      scoped: "ځانګړی توکن",
    },
    rows: {
      locale: "د ولایتونو نومونه، د انترفېس متن او د لیک لوری.",
      dimensions: "د چوکاټ کچه؛ SVG خپل نسبت ساتي.",
      selectedProvince: "اداره شوې ټاکنه؛ null ټاکنه پاکوي.",
      defaultSelectedProvince: "په نااداره حالت کې لومړنۍ ټاکنه.",
      onProvinceClick: "د ولایت معیاري معلومات او د پېښې سرچینه.",
      onSelectionChange: "په ټاکنه او لغوه کېدو، د کیبورډ په ګډون، چلېږي.",
      showTooltip: "د ماوس او کیبورډ فوکوس پر مهال څرګندونه.",
      showProvinceLabels: "د نقشې دننه ژباړل شوي د ولایت نومونه.",
      colors: "د بڼې د بشپړ کنټرول لپاره ځانګړي CSS متغیرونه.",
      renderTooltip: "څرګندونه د React توکو په وسیله بدله کړئ، نه د HTML متن په وسیله.",
      interactive: "که false وي، نقشه غیرفعاله او بې فوکوسه ده.",
      ariaLabel: "د SVG ډلې د لاسرسي نوم.",
      data: "د ISO کوډونو له مخې ارزښتونه؛ ورک ارزښت صفر نه دی.",
      domain: "د ثابتې کچې لپاره ټاکلې شمېره‌ییزه ساحه.",
      palette: "د CSS هګز رنګونو دوه‌پړاویزه کچه.",
      missingColor: "د ورک، null، NaN یا له ولایته بهر معلوماتو رنګ.",
      formatValue: "د څرګندونې او رنګیز لارښود لپاره د شمېرې ځانګړې بڼه.",
      showLegend: "له ټیټې، لوړې او ورکې نښې سره رنګیز لارښود.",
      legendTitle: "د شاخص د نوم لپاره د رنګیز لارښود سرلیک.",
    },
    utilityDescriptions: {
      getProvinces: "د ټولو ۳۴ ولایتونو نه بدلېدونکی نوملړ.",
      getProvinceByCode: "د ISO کوډ له مخې د ولایت معیاري معلومات.",
      getProvinceName: "ژباړل شوی نوم چې په نه شتون کې انګلیسي ته ورځي.",
      isProvinceCode: "د نامعلوم متن د کوډ په توګه کتل.",
    },
  },
};

export const SHOWCASE_MESSAGES: Readonly<Record<Locale, ShowcaseMessages>> = { en, prs, ps };

export const SITE_LANG: Readonly<Record<Locale, string>> = {
  en: "en",
  prs: "fa-AF",
  ps: "ps-AF",
};

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "prs" || value === "ps";
}

export function getBasePath(pathname: string): string {
  const withoutIndex = pathname.replace(/index\.html$/, "").replace(/\/$/, "");
  const withoutLocale = withoutIndex.replace(/\/(prs|ps)$/, "");
  return `${withoutLocale}/`;
}

export function localeFromPath(pathname: string): Locale | null {
  const match = pathname
    .replace(/index\.html$/, "")
    .replace(/\/$/, "")
    .match(/\/(prs|ps)$/);
  return match ? (match[1] as Locale) : null;
}

export function localePath(basePath: string, locale: Locale): string {
  return locale === "en" ? basePath : `${basePath}${locale}/`;
}

export function preferredLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const tag = language.toLowerCase();
    if (tag === "ps" || tag.startsWith("ps-")) return "ps";
    if (tag === "prs" || tag.startsWith("prs-") || tag === "fa" || tag === "fa-af")
      return "prs";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function applyDocumentLocale(locale: Locale): void {
  const messages = SHOWCASE_MESSAGES[locale].meta;
  document.documentElement.lang = SITE_LANG[locale];
  document.documentElement.dir = getLocaleDirection(locale);
  document.title = messages.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", messages.description);
}
