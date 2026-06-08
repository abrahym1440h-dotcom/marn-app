// ============================================================================
// FatwaApp.jsx — قسم "فتوى" داخل مرن
// ملف مستقل بالكامل. استورده في App.jsx:  import FatwaApp from './FatwaApp';
// ثم اعرضه شاشة كاملة عند appView === 'fatwa'  مثل GroupsApp و OrganizerApp:
//   {appView === 'fatwa' && <FatwaApp onClose={() => setAppView(null)} />}
// وزر في EmptyState:  onClick={() => setAppView('fatwa')}
//
// الهوية: Clean Navy (#070C1A / #4A8FFF) — لا إيموجي، أيقونات Lucide فقط — عربي RTL
// الشات يستخدم نفس الـ API الحالي (Cerebras) عبر POST /api/ask
//   عدّل callFatwaApi() فقط لو كان شكل طلب ask.js مختلف.
// ============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ---------------------------------------------------------------------------
// أيقونات SVG مضمّنة (بدون أي مكتبة خارجية — لا تحتاج تثبيت)
// ---------------------------------------------------------------------------
const mk = (children) => function Icon({ size = 20, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>{children}</svg>
  );
};
const Home = mk(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>);
const MessageCircle = mk(<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />);
const BookOpen = mk(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>);
const Heart = mk(<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />);
const Clock = mk(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>);
const Activity = mk(<path d="M22 12h-4l-3 9L9 3l-3 9H2" />);
const Calendar = mk(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>);
const BarChart3 = mk(<><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></>);
const HelpCircle = mk(<><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>);
const ShieldCheck = mk(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></>);
const Menu = mk(<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>);
const X = mk(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>);
const ChevronDown = mk(<polyline points="6 9 12 15 18 9" />);
const ChevronLeft = mk(<polyline points="15 18 9 12 15 6" />);
const Search = mk(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>);
const Send = mk(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>);
const ArrowRight = mk(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>);
const MapPin = mk(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></>);
const Sunrise = mk(<><path d="M12 2v8" /><path d="m4.93 10.93 1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" /><path d="M22 22H2" /><path d="m8 6 4-4 4 4" /><path d="M16 18a4 4 0 0 0-8 0" /></>);
const Sun = mk(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>);
const Sunset = mk(<><path d="M12 10V2" /><path d="m4.93 10.93 1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" /><path d="M22 22H2" /><path d="m16 6-4 4-4-4" /><path d="M16 18a4 4 0 0 0-8 0" /></>);
const Moon = mk(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);
const CloudSun = mk(<><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M15.95 12.65a4 4 0 0 0-5.93-4.13" /><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" /></>);
const Plus = mk(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>);
const Minus = mk(<line x1="5" y1="12" x2="19" y2="12" />);
const Check = mk(<polyline points="20 6 9 17 4 12" />);
const Sparkles = mk(<path d="m12 3 1.9 5.8 5.8 1.9-5.8 1.9L12 18.4l-1.9-5.8L4.3 10.7l5.8-1.9z" />);
const ExternalLink = mk(<><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>);
const Compass = mk(<><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>);
const Star = mk(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />);
const Loader2 = mk(<path d="M21 12a9 9 0 1 1-6.219-8.56" />);
const Coins = mk(<><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></>);
const Users = mk(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
const Globe = mk(<><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>);
const Flower2 = mk(<><circle cx="12" cy="8" r="3" /><path d="M12 11v10" /><path d="M8 16c-2 0-3 1-3 3M16 16c2 0 3 1 3 3" /></>);
const Scale = mk(<><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></>);
const ScrollText = mk(<><path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></>);
const Droplet = mk(<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />);
const Bell = mk(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>);

// ---------------------------------------------------------------------------
// الهوية (Clean Navy)
// ---------------------------------------------------------------------------
const T = {
  bg: '#070C1A',
  surface: '#0E1730',
  surfaceAlt: '#101B38',
  border: '#1E2A4A',
  borderSoft: '#16223F',
  text: '#E8EEFB',
  textDim: '#8A98B8',
  textFaint: '#5A6886',
  accent: '#4A8FFF',
  accentSoft: 'rgba(74,143,255,0.12)',
  accentLine: 'rgba(74,143,255,0.30)',
  good: '#34C77B',
  goodSoft: 'rgba(52,199,123,0.12)',
  gold: '#E2B14A',
  goldSoft: 'rgba(226,177,74,0.12)',
  purple: '#A78BFA',
  purpleSoft: 'rgba(167,139,250,0.12)',
  rose: '#F472B6',
  roseSoft: 'rgba(244,114,182,0.12)',
};

const FONT = "'Tajawal','Segoe UI',system-ui,sans-serif";

// ---------------------------------------------------------------------------
// بيانات أولية (وسّعها كما تحب — كل مصفوفة قابلة للزيادة)
// ---------------------------------------------------------------------------
const FATWA_CATEGORIES = [
  { id: 'ibadat', title: 'العبادات', desc: 'أحكام الصلاة والصيام والزكاة والحج', Icon: Compass, tint: T.accent, tintSoft: T.accentSoft },
  { id: 'muamalat', title: 'المعاملات', desc: 'أحكام البيع والشراء والتجارة والعقود', Icon: Scale, tint: T.good, tintSoft: T.goodSoft },
  { id: 'usra', title: 'الأسرة', desc: 'أحكام الزواج والطلاق وحقوق الأسرة', Icon: Users, tint: T.purple, tintSoft: T.purpleSoft },
  { id: 'aqida', title: 'العقيدة', desc: 'أصول الإيمان وأركان الإسلام والعقيدة', Icon: BookOpen, tint: T.gold, tintSoft: T.goldSoft },
  { id: 'muasira', title: 'قضايا معاصرة', desc: 'فتاوى في المسائل المعاصرة والتقنية', Icon: Globe, tint: T.accent, tintSoft: T.accentSoft },
  { id: 'amma', title: 'أسئلة عامة', desc: 'أسئلة متنوعة في الفقه الإسلامي', Icon: HelpCircle, tint: T.rose, tintSoft: T.roseSoft },
  { id: 'akhlaq', title: 'الأخلاق والآداب', desc: 'آداب الإسلام وأخلاقياته في الحياة', Icon: Flower2, tint: T.purple, tintSoft: T.purpleSoft },
];

const FATWAS = {
  ibadat: [
    { q: 'ما حكم ترك صلاة الفجر؟', hukm: 'صلاة الفجر فرض عين على كل مسلم بالغ عاقل، وتركها عمداً من كبائر الذنوب.', dalil: 'قال تعالى: ﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾ [النساء: 103]', sharh: 'الصلوات الخمس فريضة من الله على كل مسلم، ولا يجوز تركها أو التهاون فيها، ومن نام عنها أو نسيها فليصلها إذا ذكرها.' },
    { q: 'هل يجوز الجمع بين الصلاتين في السفر؟', hukm: 'يجوز للمسافر الجمع بين الظهر والعصر، وبين المغرب والعشاء، جمع تقديم أو تأخير.', dalil: 'ثبت أن النبي ﷺ كان يجمع بين الصلاتين في السفر.', sharh: 'الجمع رخصة في السفر للتيسير، والقصر أيضاً سنة في السفر بقصر الرباعية إلى ركعتين.' },
    { q: 'ما هي شروط صحة الصيام؟', hukm: 'يشترط لصحة الصيام: الإسلام، والنية، والإمساك عن المفطرات من الفجر إلى المغرب.', dalil: 'قال تعالى: ﴿فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ﴾ [البقرة: 185]', sharh: 'تجب النية من الليل في الفرض، ويبطل الصيام بالأكل والشرب والجماع عمداً.' },
    { q: 'ما حكم قضاء رمضان؟', hukm: 'قضاء ما فات من رمضان واجب على من أفطر بعذر، ويبادر به قبل رمضان التالي.', dalil: 'قال تعالى: ﴿فَعِدَّةٌ مِّنْ أَيَّامٍ أُخَرَ﴾ [البقرة: 184]', sharh: 'من أخّر القضاء حتى دخل رمضان آخر بلا عذر، قضى وأطعم مع القضاء على قول جمهور العلماء.' },
    { q: 'ما نصاب الزكاة للذهب والفضة؟', hukm: 'نصاب الذهب 85 غراماً، والفضة 595 غراماً، ومقدار الزكاة 2.5% بعد حولان الحول.', dalil: 'قال ﷺ: «ليس فيما دون خمس أواقٍ صدقة».', sharh: 'تجب الزكاة إذا بلغ المال النصاب وحال عليه الحول، وتخرج للأصناف الثمانية.' },
  ],
  muamalat: [
    { q: 'هل تجب الزكاة على المال المدّخر في البنك؟', hukm: 'نعم، تجب الزكاة على المال المدّخر إذا بلغ النصاب وحال عليه الحول.', dalil: 'عموم أدلة وجوب الزكاة في الأموال النامية.', sharh: 'يُحسب الرصيد عند تمام الحول، ويُخرج 2.5%، أما الفوائد الربوية فلا تُملك ولا تُزكّى بل تُتخلّص منها.' },
    { q: 'ما حكم بيع التقسيط بزيادة؟', hukm: 'يجوز بيع التقسيط بزيادة على الثمن النقدي بشرط تحديد الثمن والأجل عند العقد.', dalil: 'الأصل في البيوع الحل ما لم يكن فيها ربا أو غرر.', sharh: 'يُمنع زيادة الثمن بعد العقد مقابل التأخير، فهذا هو ربا الجاهلية.' },
  ],
  usra: [
    { q: 'ما شروط صحة عقد النكاح؟', hukm: 'يشترط: الولي، والشاهدان، ورضا الزوجين، والمهر، وخلو الزوجين من الموانع.', dalil: 'قال ﷺ: «لا نكاح إلا بولي».', sharh: 'النكاح بلا ولي باطل عند الجمهور، والإشهاد عليه واجب لإعلان النكاح.' },
    { q: 'ما حكم الطلاق في الحيض؟', hukm: 'الطلاق في الحيض طلاق بدعي محرّم، ويختلف العلماء في وقوعه.', dalil: 'قال تعالى: ﴿فَطَلِّقُوهُنَّ لِعِدَّتِهِنَّ﴾ [الطلاق: 1]', sharh: 'السنة أن يُطلّق في طهر لم يجامعها فيه، ويُؤمر بمراجعتها إن طلّق في الحيض.' },
  ],
  aqida: [
    { q: 'ما أركان الإيمان الستة؟', hukm: 'أركان الإيمان ستة: الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره.', dalil: 'حديث جبريل المشهور في صحيح مسلم.', sharh: 'هذه الأركان أصل الاعتقاد، من جحد ركناً منها فقد كفر.' },
  ],
  muasira: [
    { q: 'ما حكم التعامل بالعملات الرقمية؟', hukm: 'مسألة اجتهادية معاصرة، والأحوط الحذر لما فيها من غرر وتقلّب شديد.', dalil: 'تُبنى على قواعد منع الغرر والمقامرة في المعاملات.', sharh: 'يختلف الحكم باختلاف نوع العملة وطريقة التعامل، ويُرجع فيها لأهل الاختصاص والمجامع الفقهية.' },
  ],
  amma: [
    { q: 'ما حكم تهنئة غير المسلمين بأعيادهم؟', hukm: 'مسألة فيها خلاف؛ الجمهور على المنع من التهنئة بالأعياد الدينية.', dalil: 'تُبنى على قاعدة عدم إقرار شعائر الكفر.', sharh: 'يُفرّق بين التهنئة بالعيد الديني وبين حسن المعاملة والبر والعدل المأمور به.' },
  ],
  akhlaq: [
    { q: 'ما آداب طلب العلم؟', hukm: 'طلب العلم الشرعي فرض كفاية، وفرض عين فيما لا يسع المسلم جهله.', dalil: 'قال ﷺ: «طلب العلم فريضة على كل مسلم».', sharh: 'من آدابه: الإخلاص، والتواضع، والعمل بالعلم، وتوقير العلماء.' },
  ],
};

const ADHKAR_CATEGORIES = [
  { id: 'sabah', title: 'أذكار الصباح', count: 12, Icon: Sunrise, tint: T.gold },
  { id: 'masa', title: 'أذكار المساء', count: 10, Icon: Moon, tint: T.accent },
  { id: 'istiqadh', title: 'أذكار الاستيقاظ', count: 4, Icon: Sun, tint: T.gold },
  { id: 'nawm', title: 'أذكار النوم', count: 9, Icon: Moon, tint: T.purple },
  { id: 'baad', title: 'أذكار بعد الصلاة', count: 9, Icon: Heart, tint: T.good },
  { id: 'manzil', title: 'أذكار المنزل', count: 5, Icon: Home, tint: T.accent },
  { id: 'masjid', title: 'أذكار المسجد', count: 2, Icon: Compass, tint: T.gold },
  { id: 'safar', title: 'أذكار السفر', count: 4, Icon: Globe, tint: T.purple },
];

const ADHKAR = {
  sabah: [
    { text: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', count: 1 },
    { text: 'اللهم بك أصبحنا وبك أمسينا، وبك نحيا وبك نموت وإليك النشور.', count: 1 },
    { text: 'سبحان الله وبحمده.', count: 100 },
    { text: 'أعوذ بكلمات الله التامات من شر ما خلق.', count: 3 },
  ],
  masa: [
    { text: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', count: 1 },
    { text: 'اللهم بك أمسينا وبك أصبحنا، وبك نحيا وبك نموت وإليك المصير.', count: 1 },
    { text: 'سبحان الله وبحمده.', count: 100 },
  ],
  istiqadh: [{ text: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور.', count: 1 }],
  nawm: [{ text: 'باسمك اللهم أموت وأحيا.', count: 1 }, { text: 'سبحان الله (33) والحمد لله (33) والله أكبر (34).', count: 1 }],
  baad: [{ text: 'أستغفر الله (ثلاثاً)، اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.', count: 1 }, { text: 'سبحان الله (33) الحمد لله (33) الله أكبر (33) ولا إله إلا الله وحده لا شريك له.', count: 1 }],
  manzil: [{ text: 'باسم الله ولجنا، وباسم الله خرجنا، وعلى الله ربنا توكلنا.', count: 1 }],
  masjid: [{ text: 'اللهم افتح لي أبواب رحمتك (عند الدخول).', count: 1 }, { text: 'اللهم إني أسألك من فضلك (عند الخروج).', count: 1 }],
  safar: [{ text: 'الله أكبر الله أكبر الله أكبر، سبحان الذي سخّر لنا هذا وما كنا له مقرنين.', count: 1 }],
};

const FAQ_CATEGORIES = [
  { id: 'tahara', title: 'الطهارة', count: 5, Icon: Droplet, tint: T.accent },
  { id: 'salah', title: 'الصلاة', count: 5, Icon: Compass, tint: T.good },
  { id: 'siyam', title: 'الصيام', count: 5, Icon: Moon, tint: T.gold },
  { id: 'zakah', title: 'الزكاة', count: 4, Icon: Coins, tint: T.gold },
  { id: 'nikah', title: 'النكاح والأسرة', count: 3, Icon: Users, tint: T.purple },
  { id: 'muamalat', title: 'المعاملات', count: 4, Icon: Scale, tint: T.good },
];

const FAQ = {
  salah: [
    { q: 'ما حكم قضاء الصلاة الفائتة؟', a: 'قضاء الصلاة الفائتة واجب على من تركها بعذر كنوم أو نسيان، ويقضيها حين يتذكر أو يستيقظ. أما من تركها عمداً فعليه التوبة وقضاؤها على الراجح.' },
    { q: 'هل تصح الصلاة بدون سورة بعد الفاتحة؟', a: 'نعم تصح؛ قراءة سورة بعد الفاتحة سنة وليست ركناً، والركن هو قراءة الفاتحة.' },
    { q: 'ما حكم الصلاة في الثوب النجس؟', a: 'الصلاة في الثوب النجس لا تصح مع العلم والقدرة على إزالة النجاسة، ومن صلى ناسياً ثم علم أعاد على الراجح.' },
    { q: 'ما حكم الجمع بين الصلاتين للمسافر؟', a: 'يجوز للمسافر الجمع بين الظهر والعصر، والمغرب والعشاء، تقديماً أو تأخيراً تيسيراً عليه.' },
    { q: 'هل يجب الوضوء لكل صلاة؟', a: 'لا يجب الوضوء لكل صلاة ما دام على طهارة، بل يصلي بوضوئه ما لم ينتقض.' },
  ],
  tahara: [
    { q: 'ما نواقض الوضوء؟', a: 'من نواقض الوضوء: الخارج من السبيلين، وزوال العقل بنوم أو إغماء، وأكل لحم الإبل على الراجح.' },
    { q: 'هل يجوز المسح على الجوربين؟', a: 'يجوز المسح على الجوربين للمقيم يوم وليلة، وللمسافر ثلاثة أيام بلياليها بشرط لبسهما على طهارة.' },
  ],
  siyam: [{ q: 'هل يفطر الصائم بالحقنة؟', a: 'الحقنة غير المغذية لا تفطر، أما الحقنة المغذية التي تقوم مقام الطعام فتفطر.' }],
  zakah: [{ q: 'متى تجب زكاة الفطر؟', a: 'تجب زكاة الفطر بغروب شمس آخر يوم من رمضان، وتُخرج قبل صلاة العيد.' }],
  nikah: [{ q: 'ما مقدار المهر؟', a: 'لا حدّ لأقل المهر ولا أكثره، والسنة تخفيفه، وأفضل النكاح أيسره مؤونة.' }],
  muamalat: [{ q: 'ما حكم القرض بفائدة؟', a: 'القرض بفائدة محدّدة مقدّماً هو الربا المحرّم بنص القرآن والسنة وإجماع الأمة.' }],
};

const SOURCES = [
  { title: 'القرآن الكريم', desc: 'المصدر الأول والأساسي للإسلام، كلام الله المنزّل على نبيه محمد ﷺ.', tags: ['سورة البقرة', 'سورة النساء', 'سورة المائدة', 'سورة الأعراف'], Icon: BookOpen, tint: T.good, tintSoft: T.goodSoft },
  { title: 'السنة النبوية الشريفة', desc: 'أقوال النبي ﷺ وأفعاله وتقريراته، المصدر الثاني للتشريع. نعتمد الأحاديث الصحيحة والحسنة فقط.', tags: ['صحيح البخاري', 'صحيح مسلم', 'سنن أبي داود', 'جامع الترمذي', 'سنن النسائي', 'سنن ابن ماجه'], Icon: ScrollText, tint: T.gold, tintSoft: T.goldSoft },
  { title: 'العلماء الثقات المعتمدون', desc: 'نستند إلى فتاوى وشروح كبار علماء الأمة المعتمدين عبر التاريخ والمعاصرين.', tags: ['الإمام ابن باز', 'الإمام ابن عثيمين', 'الإمام الألباني', 'اللجنة الدائمة للإفتاء', 'مجمع الفقه الإسلامي'], Icon: ShieldCheck, tint: T.accent, tintSoft: T.accentSoft },
  { title: 'كتب الفقه والمذاهب الأربعة', desc: 'نعتمد على المذاهب الفقهية الأربعة (الحنفي، المالكي، الشافعي، الحنبلي) مع ذكر موضع الخلاف عند الحاجة.', tags: ['المجموع للنووي', 'المغني لابن قدامة', 'بداية المجتهد', 'الفتاوى الكبرى لابن تيمية'], Icon: BookOpen, tint: T.purple, tintSoft: T.purpleSoft },
];

const EVENTS_DEF = [
  { name: 'يوم عرفة', month: 12, day: 9, kind: 'ركن', tint: T.good, Icon: Compass },
  { name: 'عيد الأضحى المبارك', month: 12, day: 10, kind: 'عيد', tint: T.gold, Icon: Star },
  { name: 'أول أيام التشريق', month: 12, day: 11, kind: 'مستحب', tint: T.accent, Icon: Sparkles },
  { name: 'رأس السنة الهجرية', month: 1, day: 1, kind: 'عام', tint: T.purple, Icon: Moon },
  { name: 'يوم عاشوراء', month: 1, day: 10, kind: 'مستحب', tint: T.accent, Icon: Moon },
];

const PRAYER_META = [
  { key: 'Fajr', name: 'الفجر', Icon: Sunrise },
  { key: 'Sunrise', name: 'الشروق', Icon: Sun },
  { key: 'Dhuhr', name: 'الظهر', Icon: Sun },
  { key: 'Asr', name: 'العصر', Icon: CloudSun },
  { key: 'Maghrib', name: 'المغرب', Icon: Sunset },
  { key: 'Isha', name: 'العشاء', Icon: Moon },
];

// ---------------------------------------------------------------------------
// مساعدات
// ---------------------------------------------------------------------------
function hijriParts(date) {
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const p = fmt.formatToParts(date);
    const get = (t) => parseInt(p.find((x) => x.type === t).value, 10);
    return { d: get('day'), m: get('month'), y: get('year') };
  } catch { return { d: 1, m: 1, y: 1447 }; }
}
function hijriLong(date) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  } catch { return ''; }
}
function findNextHijri(month, day) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 400; i++) {
    const dt = new Date(today.getTime() + i * 86400000);
    const h = hijriParts(dt);
    if (h.m === month && h.d === day) return { date: dt, daysLeft: i, hijri: h };
  }
  return null;
}
function todayKey() { return new Date().toISOString().slice(0, 10); }
function loadTracking() {
  try { return JSON.parse(localStorage.getItem('marn_fatwa_tracking') || '{}'); } catch { return {}; }
}
function saveTracking(obj) {
  try { localStorage.setItem('marn_fatwa_tracking', JSON.stringify(obj)); } catch { /* ignore */ }
}

// نداء الـ API — نفس ask.js (Cerebras). عدّل المسار/الشكل هنا فقط لو لزم.
const FATWA_SYSTEM = 'أنت مساعد فتاوى إسلامي يجيب وفق منهج أهل السنة والجماعة. أجب بدقة واختصار، واستشهد بالدليل من القرآن والسنة وأقوال العلماء الثقات. نسّق الإجابة في ثلاثة أقسام بهذا الشكل تماماً:\nالحكم الشرعي: ...\nالدليل: ...\nالشرح: ...\nوضّح المذهب عند الاختلاف، وتجنّب المسائل الخلافية الحساسة.';

// يستخرج النص من أي شكل ردّ شائع (مباشر / OpenAI-Cerebras / Anthropic / مغلّف)
function extractText(d) {
  if (d == null) return '';
  if (typeof d === 'string') return d;
  const direct = d.content ?? d.text ?? d.answer ?? d.reply ?? d.message ??
    d.output ?? d.result ?? d.response ?? d.completion;
  if (typeof direct === 'string') return direct;
  if (Array.isArray(d.choices) && d.choices.length) {
    const c = d.choices[0];
    const t = c?.message?.content ?? c?.text ?? c?.delta?.content;
    if (typeof t === 'string') return t;
  }
  if (Array.isArray(d.content)) {
    const t = d.content.map((b) => (typeof b === 'string' ? b : b?.text || '')).join('').trim();
    if (t) return t;
  }
  const nested = d.data ?? d.body ?? d.result ?? (direct && typeof direct === 'object' ? direct : null);
  return nested && nested !== d ? extractText(nested) : '';
}

async function callFatwaApi(question, history) {
  const messages = [
    { role: 'system', content: FATWA_SYSTEM },
    ...history.slice(-6).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.raw || m.text || '' })),
    { role: 'user', content: question },
  ];
  // نرسل كل الصيغ الشائعة معاً حتى يعمل مع أي ask.js دون أي تعديل
  const body = { messages, question, prompt: question, message: question, query: question, system: FATWA_SYSTEM };
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('network');
  const raw = await res.text();
  let data;
  try { data = JSON.parse(raw); } catch { return raw.trim(); }
  return extractText(data) || raw.trim();
}

function parseFatwa(raw) {
  const t = (raw || '').trim();
  const grab = (label, next) => {
    const re = new RegExp(label + '\\s*[:：]\\s*([\\s\\S]*?)(?=(?:' + next + ')\\s*[:：]|$)', 'u');
    const m = t.match(re);
    return m ? m[1].trim() : '';
  };
  const hukm = grab('الحكم الشرعي', 'الدليل|الشرح');
  const dalil = grab('الدليل', 'الشرح');
  const sharh = grab('الشرح', '$a');
  if (hukm || dalil || sharh) return { structured: true, hukm, dalil, sharh };
  return { structured: false, text: t };
}

// ---------------------------------------------------------------------------
// عناصر واجهة صغيرة
// ---------------------------------------------------------------------------
function TopBar({ title, subtitle, Icon, onBack, onMenu }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${T.borderSoft}`, background: T.surface, position: 'sticky', top: 0, zIndex: 5 }}>
      <button onClick={onMenu} style={iconBtn}><Menu size={22} color={T.text} /></button>
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {Icon && <Icon size={18} color={T.accent} />}
          <span style={{ fontWeight: 800, color: T.text, fontSize: 17 }}>{title}</span>
        </div>
        {subtitle && <div style={{ color: T.textDim, fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {onBack ? (
        <button onClick={onBack} style={iconBtn}><ArrowRight size={22} color={T.text} /></button>
      ) : <div style={{ width: 40 }} />}
    </div>
  );
}

const iconBtn = { width: 40, height: 40, borderRadius: 12, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

function Tag({ children, tint, soft }) {
  return <span style={{ background: soft, color: tint, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{children}</span>;
}

function FeatureCard({ Icon, title, desc, tint, tintSoft, onClick, count }) {
  return (
    <button onClick={onClick} style={{ textAlign: 'right', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: tintSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={tint} />
      </div>
      <div style={{ fontWeight: 800, color: T.text, fontSize: 16 }}>{title}</div>
      {desc && <div style={{ color: T.textDim, fontSize: 13, lineHeight: 1.6 }}>{desc}</div>}
      {count != null && <div style={{ color: T.textFaint, fontSize: 12 }}>{count} عنصر</div>}
    </button>
  );
}

function Accordion({ items, render }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((it, i) => (
        <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ChevronDown size={18} color={T.textDim} style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: '.2s' }} />
            <span style={{ fontWeight: 700, color: T.text, fontSize: 15, textAlign: 'right', flex: 1, marginRight: 12 }}>{it.q}</span>
          </button>
          {open === i && <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${T.borderSoft}` }}>{render(it)}</div>}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// الشاشات
// ---------------------------------------------------------------------------
function HomeView({ go }) {
  const tiles = [
    { id: 'adhkar', title: 'الأذكار', desc: 'أذكار الصباح والمساء', Icon: Heart, tint: T.rose, tintSoft: T.roseSoft },
    { id: 'prayer', title: 'مواقيت الصلاة', desc: 'المواقيت حسب موقعك', Icon: Bell, tint: T.accent, tintSoft: T.accentSoft },
    { id: 'library', title: 'الفتاوى', desc: 'مكتبة الأحكام الشرعية', Icon: BookOpen, tint: T.purple, tintSoft: T.purpleSoft },
    { id: 'tracking', title: 'المتابعة', desc: 'تابع عباداتك اليومية', Icon: Activity, tint: T.good, tintSoft: T.goodSoft },
    { id: 'analytics', title: 'التحليلات', desc: 'إحصائيات عباداتك', Icon: BarChart3, tint: T.accent, tintSoft: T.accentSoft },
    { id: 'calendar', title: 'التقويم الإسلامي', desc: 'المناسبات والأحداث', Icon: Calendar, tint: T.gold, tintSoft: T.goldSoft },
    { id: 'faq', title: 'الأسئلة الشائعة', desc: 'إجابات سريعة', Icon: HelpCircle, tint: T.rose, tintSoft: T.roseSoft },
    { id: 'sources', title: 'المصادر', desc: 'شفافية ومصداقية', Icon: ShieldCheck, tint: T.good, tintSoft: T.goodSoft },
  ];
  return (
    <div style={{ padding: 18 }}>
      <div style={{ textAlign: 'center', padding: '24px 0 18px' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: T.accentSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Compass size={32} color={T.accent} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 20, color: T.text, marginTop: 14 }}>بسم الله الرحمن الرحيم</div>
        <div style={{ color: T.textDim, fontSize: 13, marginTop: 6 }}>﴿فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ﴾</div>
      </div>
      <button onClick={() => go('chat')} style={{ width: '100%', background: T.accent, border: 'none', borderRadius: 16, padding: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <MessageCircle size={26} color="#fff" />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, color: '#fff', fontSize: 17 }}>اسأل سؤالاً دينياً</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>احصل على إجابة فورية مستندة للشرع</div>
        </div>
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {tiles.map((t) => <FeatureCard key={t.id} {...t} onClick={() => go(t.id)} />)}
      </div>
    </div>
  );
}

function ChatView() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const starters = ['ما حكم الصلاة', 'ما نصاب الزكاة؟', 'شروط صحة الصيام', 'حكم الجمع للمسافر'];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput('');
    const next = [...messages, { role: 'user', text: q }];
    setMessages(next);
    setLoading(true);
    try {
      const raw = await callFatwaApi(q, next);
      setMessages([...next, { role: 'assistant', raw, parsed: parseFatwa(raw) }]);
    } catch {
      setMessages([...next, { role: 'assistant', raw: '', parsed: { structured: false, text: 'تعذّر الاتصال بالخادم. تأكد من اتصالك ثم حاول مرة أخرى.' } }]);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
        {messages.length === 0 && (
          <div style={{ padding: '10px 0' }}>
            <div style={{ color: T.textDim, fontSize: 14, marginBottom: 12 }}>اطرح سؤالك الشرعي، أو ابدأ بأحد هذه:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {starters.map((s) => (
                <button key={s} onClick={() => send(s)} style={{ background: T.accentSoft, color: T.accent, border: `1px solid ${T.accentLine}`, borderRadius: 999, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-start' : 'flex-end', marginBottom: 14 }}>
            {m.role === 'user' ? (
              <div style={{ background: T.accent, color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', maxWidth: '80%', fontSize: 15, fontWeight: 600 }}>{m.text}</div>
            ) : (
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '16px 16px 16px 4px', padding: 16, maxWidth: '92%' }}>
                {m.parsed.structured ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {m.parsed.hukm && <Section label="الحكم الشرعي" color={T.accent} text={m.parsed.hukm} />}
                    {m.parsed.dalil && <div style={{ background: T.goldSoft, border: `1px solid ${T.gold}33`, borderRadius: 10, padding: 12 }}><div style={{ color: T.gold, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>الدليل</div><div style={{ color: T.text, fontSize: 14, lineHeight: 1.9 }}>{m.parsed.dalil}</div></div>}
                    {m.parsed.sharh && <Section label="الشرح" color={T.good} text={m.parsed.sharh} />}
                  </div>
                ) : (
                  <div style={{ color: T.text, fontSize: 15, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{m.parsed.text}</div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={16} color={T.accent} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: T.textDim, fontSize: 14 }}>جاري البحث في المصادر...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 14, borderTop: `1px solid ${T.borderSoft}`, background: T.surface, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 46, height: 46, borderRadius: 14, background: input.trim() ? T.accent : T.surfaceAlt, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <Send size={20} color={input.trim() ? '#fff' : T.textFaint} />
        </button>
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="اكتب سؤالك هنا..."
          style={{ flex: 1, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '13px 16px', color: T.text, fontSize: 15, fontFamily: FONT, textAlign: 'right', outline: 'none' }}
        />
      </div>
    </div>
  );
}
function Section({ label, color, text }) {
  return (
    <div>
      <div style={{ color, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{label}</div>
      <div style={{ color: T.text, fontSize: 14, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{text}</div>
    </div>
  );
}

function LibraryView() {
  const [cat, setCat] = useState(null);
  if (cat) {
    const c = FATWA_CATEGORIES.find((x) => x.id === cat);
    const items = (FATWAS[cat] || []).map((f) => ({ ...f, q: f.q }));
    return (
      <div style={{ padding: 18 }}>
        <button onClick={() => setCat(null)} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع للأقسام</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 18px' }}>
          <c.Icon size={22} color={c.tint} /><span style={{ fontWeight: 800, fontSize: 18, color: T.text }}>{c.title}</span>
          <span style={{ color: T.textFaint, fontSize: 13 }}>· {items.length} فتوى</span>
        </div>
        {items.length ? (
          <Accordion items={items} render={(it) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14 }}>
              {it.hukm && <Section label="الحكم الشرعي" color={T.accent} text={it.hukm} />}
              {it.dalil && <div style={{ background: T.goldSoft, border: `1px solid ${T.gold}33`, borderRadius: 10, padding: 12 }}><div style={{ color: T.gold, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>الدليل</div><div style={{ color: T.text, fontSize: 14, lineHeight: 1.9 }}>{it.dalil}</div></div>}
              {it.sharh && <Section label="الشرح" color={T.good} text={it.sharh} />}
            </div>
          )} />
        ) : <Empty text="لا توجد فتاوى في هذا القسم بعد." />}
      </div>
    );
  }
  return (
    <div style={{ padding: 18 }}>
      <Heading title="الفتاوى الشرعية" subtitle="اختر القسم المطلوب" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {FATWA_CATEGORIES.map((c) => <FeatureCard key={c.id} {...c} onClick={() => setCat(c.id)} />)}
      </div>
    </div>
  );
}

function AdhkarView() {
  const [cat, setCat] = useState(null);
  if (cat) {
    const c = ADHKAR_CATEGORIES.find((x) => x.id === cat);
    return (
      <div style={{ padding: 18 }}>
        <button onClick={() => setCat(null)} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 18px' }}>
          <c.Icon size={22} color={c.tint} /><span style={{ fontWeight: 800, fontSize: 18, color: T.text }}>{c.title}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(ADHKAR[cat] || []).map((d, i) => <DhikrCard key={i} text={d.text} target={d.count} tint={c.tint} />)}
          {!(ADHKAR[cat] || []).length && <Empty text="سيُضاف هذا القسم قريباً." />}
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: 18 }}>
      <Heading title="الأذكار والأدعية" subtitle="اختر القسم المطلوب" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {ADHKAR_CATEGORIES.map((c) => (
          <FeatureCard key={c.id} Icon={c.Icon} title={c.title} count={c.count} tint={c.tint} tintSoft={T.accentSoft} onClick={() => setCat(c.id)} />
        ))}
      </div>
    </div>
  );
}
function DhikrCard({ text, target, tint }) {
  const [n, setN] = useState(0);
  const done = n >= target;
  return (
    <button onClick={() => setN((v) => (v >= target ? 0 : v + 1))} style={{ textAlign: 'right', background: done ? T.goodSoft : T.surface, border: `1px solid ${done ? T.good + '55' : T.border}`, borderRadius: 14, padding: 16, cursor: 'pointer' }}>
      <div style={{ color: T.text, fontSize: 16, lineHeight: 2 }}>{text}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <span style={{ color: done ? T.good : T.textDim, fontSize: 13, fontWeight: 700 }}>{done ? 'اكتمل' : 'اضغط للتسبيح'}</span>
        <span style={{ background: done ? T.good : tint, color: '#fff', borderRadius: 999, padding: '4px 12px', fontWeight: 800, fontSize: 14 }}>{n} / {target}</span>
      </div>
    </button>
  );
}

function PrayerView() {
  const [times, setTimes] = useState(null);
  const [loc, setLoc] = useState('مكة المكرمة');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let lat = 21.4225, lng = 39.8262;
    const fetchTimes = (la, ln) => {
      const d = new Date();
      const ds = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      fetch(`https://api.aladhan.com/v1/timings/${ds}?latitude=${la}&longitude=${ln}&method=4`)
        .then((r) => r.json())
        .then((j) => setTimes(j?.data?.timings || null))
        .catch(() => setTimes(FALLBACK_TIMES));
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLoc('موقعك الحالي'); fetchTimes(pos.coords.latitude, pos.coords.longitude); },
        () => fetchTimes(lat, lng),
        { timeout: 6000 }
      );
    } else fetchTimes(lat, lng);
  }, []);

  const order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const next = useMemo(() => {
    if (!times) return null;
    const mins = now.getHours() * 60 + now.getMinutes();
    for (const k of order) {
      if (k === 'Sunrise') continue;
      const [h, m] = (times[k] || '00:00').split(':').map(Number);
      if (h * 60 + m > mins) return { key: k, time: times[k] };
    }
    return { key: 'Fajr', time: times.Fajr };
  }, [times, now]);

  if (!times) return <div style={{ padding: 40, textAlign: 'center' }}><Loader2 size={26} color={T.accent} style={{ animation: 'spin 1s linear infinite' }} /><div style={{ color: T.textDim, marginTop: 12 }}>جاري جلب المواقيت...</div></div>;

  const nextMeta = PRAYER_META.find((p) => p.key === next?.key);
  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.textDim, fontSize: 13, marginBottom: 14, justifyContent: 'flex-end' }}>
        <span>{loc}</span><MapPin size={14} color={T.accent} />
      </div>
      <div style={{ background: T.accentSoft, border: `1px solid ${T.accentLine}`, borderRadius: 18, padding: 24, textAlign: 'center', marginBottom: 18 }}>
        <div style={{ color: T.accent, fontWeight: 700, fontSize: 13 }}>الصلاة القادمة</div>
        {nextMeta && <nextMeta.Icon size={30} color={T.accent} style={{ margin: '10px auto' }} />}
        <div style={{ fontWeight: 800, fontSize: 22, color: T.text }}>{nextMeta?.name}</div>
        <div style={{ fontWeight: 800, fontSize: 34, color: T.accent, marginTop: 4 }}>{next?.time}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PRAYER_META.map((p) => {
          const isNext = p.key === next?.key;
          return (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isNext ? T.accentSoft : T.surface, border: `1px solid ${isNext ? T.accentLine : T.border}`, borderRadius: 14, padding: '14px 18px' }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: isNext ? T.accent : T.text }}>{times[p.key]}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, color: isNext ? T.accent : T.text, fontSize: 16 }}>{p.name}</span>
                <p.Icon size={20} color={isNext ? T.accent : T.textDim} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const FALLBACK_TIMES = { Fajr: '04:15', Sunrise: '05:40', Dhuhr: '12:25', Asr: '15:43', Maghrib: '19:07', Isha: '20:27' };

function TrackingView() {
  const [tab, setTab] = useState('salah');
  const [data, setData] = useState(loadTracking);
  const key = todayKey();
  const day = data[key] || { prayers: [false, false, false, false, false], quranPages: 0, fasted: false };

  const update = (patch) => {
    const nd = { ...data, [key]: { ...day, ...patch } };
    setData(nd); saveTracking(nd);
  };
  const prayers = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
  const donePrayers = day.prayers.filter(Boolean).length;

  return (
    <div style={{ padding: 18 }}>
      <Heading title="متابعة العبادات" subtitle={hijriLong(new Date())} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {[['salah', 'الصلاة', Compass], ['quran', 'القرآن', BookOpen], ['siyam', 'الصيام', Moon]].map(([id, label, Ic]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: tab === id ? T.accent : T.surface, color: tab === id ? '#fff' : T.textDim, border: `1px solid ${tab === id ? T.accent : T.border}`, borderRadius: 12, padding: '11px 0', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14 }}>
            <Ic size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'salah' && (
        <>
          <div style={{ background: T.goodSoft, border: `1px solid ${T.good}44`, borderRadius: 16, padding: 22, textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 32, color: T.good }}>{donePrayers}/5</div>
            <div style={{ color: T.textDim, fontSize: 13, marginTop: 4 }}>صلوات اليوم</div>
          </div>
          {prayers.map((p, i) => {
            const on = day.prayers[i];
            return (
              <button key={p} onClick={() => { const np = [...day.prayers]; np[i] = !np[i]; update({ prayers: np }); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.surface, border: `1px solid ${on ? T.good + '66' : T.border}`, borderRadius: 14, padding: '15px 18px', marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ width: 26, height: 26, borderRadius: 999, border: `2px solid ${on ? T.good : T.border}`, background: on ? T.good : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && <Check size={16} color="#fff" />}</div>
                <span style={{ fontWeight: 700, color: T.text, fontSize: 16 }}>{p}</span>
              </button>
            );
          })}
        </>
      )}

      {tab === 'quran' && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22, textAlign: 'center' }}>
          <div style={{ color: T.textDim, fontSize: 13 }}>صفحات قرأتها اليوم</div>
          <div style={{ fontWeight: 800, fontSize: 40, color: T.accent, margin: '8px 0' }}>{day.quranPages}</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={() => update({ quranPages: Math.max(0, day.quranPages - 1) })} style={stepBtn}><Minus size={20} color={T.text} /></button>
            <button onClick={() => update({ quranPages: day.quranPages + 1 })} style={{ ...stepBtn, background: T.accent }}><Plus size={20} color="#fff" /></button>
          </div>
        </div>
      )}

      {tab === 'siyam' && (
        <button onClick={() => update({ fasted: !day.fasted })} style={{ width: '100%', background: day.fasted ? T.goldSoft : T.surface, border: `1px solid ${day.fasted ? T.gold + '66' : T.border}`, borderRadius: 16, padding: 24, cursor: 'pointer', textAlign: 'center' }}>
          <Moon size={30} color={day.fasted ? T.gold : T.textDim} />
          <div style={{ fontWeight: 800, fontSize: 18, color: T.text, marginTop: 10 }}>{day.fasted ? 'صمت اليوم — تقبّل الله' : 'سجّل صيام اليوم'}</div>
        </button>
      )}
    </div>
  );
}
const stepBtn = { width: 52, height: 52, borderRadius: 14, background: T.surfaceAlt, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

function CalendarView() {
  const events = useMemo(() => {
    return EVENTS_DEF.map((e) => { const n = findNextHijri(e.month, e.day); return { ...e, ...n }; })
      .filter((e) => e.date).sort((a, b) => a.daysLeft - b.daysLeft);
  }, []);
  const nearest = events[0];
  return (
    <div style={{ padding: 18 }}>
      <Heading title="التقويم الإسلامي" subtitle={hijriLong(new Date())} />
      {nearest && (
        <div style={{ background: T.goodSoft, border: `1px solid ${T.good}44`, borderRadius: 16, padding: 20, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 30, color: T.good }}>{nearest.daysLeft}</div>
            <div style={{ color: T.textDim, fontSize: 12 }}>{nearest.daysLeft === 0 ? 'اليوم' : 'يوماً'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: T.good, fontWeight: 700, fontSize: 12 }}>أقرب مناسبة</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: T.text, marginTop: 2 }}>{nearest.name}</div>
            <div style={{ color: T.textDim, fontSize: 13 }}>{nearest.hijri.d} / {nearest.hijri.m} / {nearest.hijri.y} هـ</div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {events.map((e, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center', minWidth: 48 }}>
              <div style={{ fontWeight: 800, fontSize: 20, color: e.tint }}>{e.daysLeft}</div>
              <div style={{ color: T.textFaint, fontSize: 11 }}>يوم</div>
            </div>
            <div style={{ textAlign: 'right', flex: 1, marginRight: 12 }}>
              <div style={{ fontWeight: 700, color: T.text, fontSize: 16 }}>{e.name}</div>
              <div style={{ color: T.textDim, fontSize: 13 }}>{e.hijri.d} / {e.hijri.m} / {e.hijri.y} هـ</div>
            </div>
            <Tag tint={e.tint} soft={e.tint + '1f'}>{e.kind}</Tag>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsView() {
  const data = loadTracking();
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    const rec = data[k];
    days.push({ label: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'][d.getDay()], count: rec ? rec.prayers.filter(Boolean).length : 0, fasted: rec?.fasted, pages: rec?.quranPages || 0 });
  }
  const totalFasts = days.filter((d) => d.fasted).length;
  const totalPages = days.reduce((s, d) => s + d.pages, 0);
  const fullDays = days.filter((d) => d.count === 5).length;
  let streak = 0; for (let i = days.length - 1; i >= 0; i--) { if (days[i].count === 5) streak++; else break; }
  const max = 5;

  return (
    <div style={{ padding: 18 }}>
      <Heading title="التحليلات" subtitle="أداؤك خلال آخر 14 يوماً" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <Stat Icon={Compass} value={`${fullDays}/14`} label="أيام الصلاة الكاملة" tint={T.accent} />
        <Stat Icon={Activity} value={`${streak}`} label="أطول سلسلة (يوم)" tint={T.gold} />
        <Stat Icon={Moon} value={`${totalFasts}`} label="أيام الصيام" tint={T.purple} />
        <Stat Icon={BookOpen} value={`${totalPages}`} label="صفحات القرآن" tint={T.good} />
      </div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18 }}>
        <div style={{ fontWeight: 700, color: T.text, marginBottom: 4 }}>الالتزام اليومي بالصلاة</div>
        <div style={{ color: T.textDim, fontSize: 12, marginBottom: 16 }}>عدد الصلوات المؤداة يومياً (من 5)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
          {days.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', height: 96, display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', height: `${(d.count / max) * 100}%`, minHeight: 3, background: d.count === 5 ? T.good : T.accent, borderRadius: 6 }} />
              </div>
              <span style={{ fontSize: 10, color: T.textFaint }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ color: T.textFaint, fontSize: 12, textAlign: 'center', marginTop: 14 }}>تُحسب البيانات من صفحة المتابعة على هذا الجهاز.</div>
    </div>
  );
}
function Stat({ Icon, value, label, tint }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, textAlign: 'right' }}>
      <Icon size={20} color={tint} />
      <div style={{ fontWeight: 800, fontSize: 26, color: T.text, marginTop: 8 }}>{value}</div>
      <div style={{ color: T.textDim, fontSize: 12, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FaqView() {
  const [cat, setCat] = useState(null);
  const [query, setQuery] = useState('');

  const allMatches = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim();
    const out = [];
    Object.keys(FAQ).forEach((k) => (FAQ[k] || []).forEach((it) => { if (it.q.includes(q) || it.a.includes(q)) out.push(it); }));
    return out;
  }, [query]);

  return (
    <div style={{ padding: 18 }}>
      <Heading title="الأسئلة الشائعة" subtitle="إجابات سريعة للمسائل الأكثر تكراراً" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 16px', marginBottom: 18 }}>
        <Search size={18} color={T.textDim} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث في الأسئلة..." style={{ flex: 1, background: 'transparent', border: 'none', color: T.text, fontSize: 15, fontFamily: FONT, textAlign: 'right', outline: 'none' }} />
      </div>

      {allMatches ? (
        allMatches.length ? <Accordion items={allMatches} render={(it) => <div style={{ color: T.text, fontSize: 14, lineHeight: 1.9, paddingTop: 14 }}>{it.a}</div>} /> : <Empty text="لا نتائج مطابقة." />
      ) : cat ? (
        <>
          <button onClick={() => setCat(null)} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع للأقسام</button>
          <div style={{ height: 12 }} />
          <Accordion items={FAQ[cat] || []} render={(it) => <div style={{ color: T.text, fontSize: 14, lineHeight: 1.9, paddingTop: 14 }}>{it.a}</div>} />
          {!(FAQ[cat] || []).length && <Empty text="سيُضاف هذا القسم قريباً." />}
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {FAQ_CATEGORIES.map((c) => (
            <FeatureCard key={c.id} Icon={c.Icon} title={c.title} count={c.count} tint={c.tint} tintSoft={T.accentSoft} onClick={() => setCat(c.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SourcesView() {
  return (
    <div style={{ padding: 18 }}>
      <Heading title="المصادر والمراجع" subtitle="شفافية ومصداقية في الإجابات" />
      <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, marginBottom: 16, textAlign: 'center' }}>
        <Moon size={24} color={T.gold} />
        <div style={{ fontWeight: 800, color: T.text, marginTop: 8 }}>التزامنا بالأمانة العلمية</div>
        <div style={{ color: T.textDim, fontSize: 13, lineHeight: 1.8, marginTop: 6 }}>جميع الإجابات مستقاة من الكتاب والسنة وأقوال العلماء الثقات — لا نجتهد في القطعيات، ونوضّح الخلاف في المسائل الاجتهادية.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SOURCES.map((s, i) => (
          <div key={i} style={{ background: s.tintSoft, border: `1px solid ${s.tint}33`, borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
              <span style={{ fontWeight: 800, color: T.text, fontSize: 16 }}>{s.title}</span>
              <s.Icon size={20} color={s.tint} />
            </div>
            <div style={{ color: T.textDim, fontSize: 13, lineHeight: 1.8, margin: '10px 0', textAlign: 'right' }}>{s.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
              {s.tags.map((t) => <Tag key={t} tint={s.tint} soft={s.tint + '22'}>{t}</Tag>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        <a href="https://binbaz.org.sa" target="_blank" rel="noreferrer" style={{ color: T.accent, fontWeight: 700, textDecoration: 'none' }}>binbaz.org.sa</a>
        <span style={{ color: T.textDim }}>·</span>
        <a href="https://islamweb.net" target="_blank" rel="noreferrer" style={{ color: T.accent, fontWeight: 700, textDecoration: 'none' }}>islamweb.net</a>
        <span style={{ color: T.textDim, fontSize: 13 }}>للبحث عن فتاوى موثقة:</span>
        <ExternalLink size={16} color={T.textDim} />
      </div>
    </div>
  );
}

function Heading({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'right', marginBottom: 18 }}>
      <div style={{ fontWeight: 800, fontSize: 20, color: T.text }}>{title}</div>
      {subtitle && <div style={{ color: T.textDim, fontSize: 13, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}
function Empty({ text }) {
  return <div style={{ color: T.textFaint, textAlign: 'center', padding: '40px 0', fontSize: 14 }}>{text}</div>;
}
const backLink = { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: T.accent, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, padding: 0 };

// ---------------------------------------------------------------------------
// القائمة الجانبية
// ---------------------------------------------------------------------------
const NAV = [
  { id: 'home', label: 'الرئيسية', Icon: Home },
  { id: 'chat', label: 'شات الفتاوى', Icon: MessageCircle },
  { id: 'library', label: 'الفتاوى', Icon: BookOpen },
  { id: 'adhkar', label: 'الأذكار', Icon: Heart },
  { id: 'prayer', label: 'مواقيت الصلاة', Icon: Bell },
  { id: 'tracking', label: 'المتابعة', Icon: Activity },
  { id: 'calendar', label: 'التقويم', Icon: Calendar },
  { id: 'analytics', label: 'التحليلات', Icon: BarChart3 },
  { id: 'faq', label: 'الأسئلة الشائعة', Icon: HelpCircle },
  { id: 'sources', label: 'المصادر', Icon: ShieldCheck },
];

function Drawer({ open, view, onSelect, onClose, onExit }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 300, maxWidth: '82%', background: T.surface, borderLeft: `1px solid ${T.border}`, padding: 18, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <button onClick={onClose} style={iconBtn}><X size={22} color={T.text} /></button>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>فتوى</div>
            <div style={{ color: T.textDim, fontSize: 12 }}>المساعد الشرعي الذكي</div>
          </div>
        </div>
        {NAV.map((n) => {
          const active = view === n.id;
          return (
            <button key={n.id} onClick={() => { onSelect(n.id); onClose(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, background: active ? T.accent : 'transparent', color: active ? '#fff' : T.text, border: 'none', borderRadius: 12, padding: '13px 14px', marginBottom: 4, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
              {n.label}
              <n.Icon size={20} color={active ? '#fff' : T.textDim} />
            </button>
          );
        })}
        <div style={{ borderTop: `1px solid ${T.borderSoft}`, marginTop: 12, paddingTop: 12 }}>
          <button onClick={onExit} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, background: 'transparent', color: T.textDim, border: 'none', borderRadius: 12, padding: '13px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
            العودة إلى مرن
            <ArrowRight size={20} color={T.textDim} />
          </button>
        </div>
        <div style={{ color: T.textFaint, fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 1.8 }}>﴿فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ﴾</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// المكوّن الرئيسي
// ---------------------------------------------------------------------------
export default function FatwaApp({ onClose, marnT, marnF, dark, initialScreen }) {
  const [view, setView] = useState(initialScreen || 'home');
  const [drawer, setDrawer] = useState(false);

  // مطابقة نظام مرن (الثيم/الوضع) — تجعل فتوى جزءاً من مرن لا تطبيقاً منفصلاً
  if (marnT) {
    Object.assign(T, {
      bg: marnT.pageBg, surface: marnT.cardBg, surfaceAlt: marnT.inputBg || marnT.pillFill,
      border: marnT.line, borderSoft: marnT.line,
      text: marnT.text, textDim: marnT.sub, textFaint: marnT.faint,
      accent: '#1FA98F', accentSoft: 'rgba(31,169,143,0.12)', accentLine: 'rgba(31,169,143,0.30)',
    });
    Object.assign(backLink, { color: T.accent });
  }

  const meta = {
    home: { title: 'فتوى', Icon: Compass },
    chat: { title: 'شات الفتاوى', Icon: MessageCircle },
    library: { title: 'الفتاوى', Icon: BookOpen },
    adhkar: { title: 'الأذكار', Icon: Heart },
    prayer: { title: 'مواقيت الصلاة', Icon: Bell },
    tracking: { title: 'المتابعة', Icon: Activity },
    calendar: { title: 'التقويم', Icon: Calendar },
    analytics: { title: 'التحليلات', Icon: BarChart3 },
    faq: { title: 'الأسئلة الشائعة', Icon: HelpCircle },
    sources: { title: 'المصادر', Icon: ShieldCheck },
  }[view];

  return (
    <div dir="rtl" style={{ position: 'fixed', inset: 0, zIndex: 40, background: T.bg, color: T.text, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .fatwa-scroll::-webkit-scrollbar{width:0}`}</style>
      <TopBar
        title={meta.title}
        Icon={meta.Icon}
        onMenu={() => setDrawer(true)}
        onBack={onClose}
      />
      <div className="fatwa-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {view === 'home' && <HomeView go={setView} />}
        {view === 'chat' && <ChatView />}
        {view === 'library' && <LibraryView />}
        {view === 'adhkar' && <AdhkarView />}
        {view === 'prayer' && <PrayerView />}
        {view === 'tracking' && <TrackingView />}
        {view === 'calendar' && <CalendarView />}
        {view === 'analytics' && <AnalyticsView />}
        {view === 'faq' && <FaqView />}
        {view === 'sources' && <SourcesView />}
      </div>
      <Drawer open={drawer} view={view} onSelect={setView} onClose={() => setDrawer(false)} onExit={onClose} />
    </div>
  );
}
