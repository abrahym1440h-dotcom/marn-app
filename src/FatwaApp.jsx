// ============================================================================
// FatwaApp.jsx — قسم "فتوى" داخل مرن
// ملف مستقل بالكامل. استورده في App.jsx:  import FatwaApp from './FatwaApp';
import { Card as KitCard } from './CardKit.jsx';
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
const RotateCcw = mk(<><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></>);
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
  bg: '#06120E',
  surface: '#0C1E18',
  surfaceAlt: '#0F261D',
  border: '#1B3A2E',
  borderSoft: '#143025',
  text: '#E9F5EE',
  textDim: '#8FB3A2',
  textFaint: '#5C7D6C',
  accent: '#1FB286',
  accentSoft: 'rgba(31,178,134,0.13)',
  accentLine: 'rgba(31,178,134,0.32)',
  good: '#2FD89B',
  goodSoft: 'rgba(47,216,155,0.13)',
  gold: '#D9B45A',
  goldSoft: 'rgba(217,180,90,0.13)',
  purple: '#6FCBA8',
  purpleSoft: 'rgba(111,203,168,0.12)',
  rose: '#5BC9A0',
  roseSoft: 'rgba(91,201,160,0.12)',
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
  { id: 'sabah', title: 'أذكار الصباح', Icon: Sunrise, tint: T.gold },
  { id: 'masa', title: 'أذكار المساء', Icon: Moon, tint: T.accent },
  { id: 'tasabeeh', title: 'التسبيح والباقيات', Icon: Heart, tint: T.good },
  { id: 'istighfar', title: 'الاستغفار والتوبة', Icon: Sparkles, tint: T.accent },
  { id: 'salah_nabi', title: 'الصلاة على النبي ﷺ', Icon: Star, tint: T.gold },
  { id: 'baad', title: 'أذكار بعد الصلاة', Icon: Compass, tint: T.good },
  { id: 'hammwakarb', title: 'أدعية الهمّ والكرب', Icon: Moon, tint: T.purple },
  { id: 'istiqadh', title: 'أذكار الاستيقاظ', Icon: Sun, tint: T.gold },
  { id: 'nawm', title: 'أذكار النوم', Icon: Moon, tint: T.purple },
  { id: 'wudu', title: 'أذكار الوضوء', Icon: Droplet, tint: T.accent },
  { id: 'taeam', title: 'أذكار الطعام', Icon: Heart, tint: T.good },
  { id: 'manzil', title: 'أذكار المنزل', Icon: Home, tint: T.accent },
  { id: 'masjid', title: 'أذكار المسجد', Icon: Compass, tint: T.gold },
  { id: 'safar', title: 'أذكار السفر', Icon: Globe, tint: T.purple },
];

const ADHKAR = {
  sabah: [
    { text: 'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ... (آية الكرسي)', count: 1, note: 'من قالها حين يصبح أُجير من الجن حتى يمسي' },
    { text: 'قُلْ هُوَ اللَّهُ أَحَدٌ (الإخلاص والمعوذتان)', count: 3, note: 'تكفيه من كل شيء' },
    { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ.', count: 1 },
    { text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.', count: 1 },
    { text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ... (سيد الاستغفار)', count: 1, note: 'من قالها موقناً فمات دخل الجنة' },
    { text: 'رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.', count: 3 },
    { text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي.', count: 3 },
    { text: 'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.', count: 7 },
    { text: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.', count: 3 },
    { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ.', count: 100, note: 'حُطّت خطاياه وإن كانت مثل زبد البحر' },
    { text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 10 },
    { text: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.', count: 3 },
    { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.', count: 1 },
    { text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.', count: 3 },
    { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.', count: 3 },
    { text: 'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ.', count: 100 },
  ],
  masa: [
    { text: 'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ... (آية الكرسي)', count: 1 },
    { text: 'قُلْ هُوَ اللَّهُ أَحَدٌ (الإخلاص والمعوذتان)', count: 3 },
    { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ.', count: 1 },
    { text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.', count: 1 },
    { text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ... (سيد الاستغفار)', count: 1 },
    { text: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.', count: 3, note: 'لم يضرّه شيء تلك الليلة' },
    { text: 'رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.', count: 3 },
    { text: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.', count: 3 },
    { text: 'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.', count: 7 },
    { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ.', count: 100 },
    { text: 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ.', count: 1 },
    { text: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ.', count: 1 },
    { text: 'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ.', count: 100 },
  ],
  istiqadh: [
    { text: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.', count: 1 },
    { text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 1 },
    { text: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي وَأَذِنَ لِي بِذِكْرِهِ.', count: 1 },
    { text: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ.', count: 1 },
  ],
  nawm: [
    { text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.', count: 1 },
    { text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.', count: 3 },
    { text: 'سُبْحَانَ اللهِ (33) وَالْحَمْدُ لِلَّهِ (33) وَاللهُ أَكْبَرُ (34).', count: 1, note: 'خير من خادم' },
    { text: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ.', count: 1 },
    { text: 'قراءة آية الكرسي.', count: 1, note: 'لن يزال عليك من الله حافظ' },
    { text: 'قراءة سورة الإخلاص والمعوذتين والنفث في الكفين ومسح الجسد.', count: 3 },
    { text: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا.', count: 1 },
    { text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَكَفَانَا وَآوَانَا.', count: 1 },
  ],
  baad: [
    { text: 'أَسْتَغْفِرُ اللهَ.', count: 3 },
    { text: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.', count: 1 },
    { text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ... اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ.', count: 1 },
    { text: 'سُبْحَانَ اللهِ.', count: 33 },
    { text: 'الْحَمْدُ لِلَّهِ.', count: 33 },
    { text: 'اللهُ أَكْبَرُ.', count: 33 },
    { text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 1, note: 'تمام المئة، غُفرت خطاياه' },
    { text: 'قراءة آية الكرسي دبر كل صلاة.', count: 1, note: 'لم يمنعه من الجنة إلا الموت' },
    { text: 'قراءة الإخلاص والمعوذتين.', count: 1 },
    { text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.', count: 1 },
  ],
  manzil: [
    { text: 'بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا. (عند الدخول)', count: 1 },
    { text: 'بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ. (عند الخروج)', count: 1 },
    { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ.', count: 1 },
    { text: 'السلام عليكم عند دخول البيت وذكر اسم الله.', count: 1, note: 'يطرد الشيطان' },
    { text: 'قراءة سورة البقرة في البيت.', count: 1, note: 'لا يدخله الشيطان' },
  ],
  masjid: [
    { text: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ. (عند الدخول بالرجل اليمنى)', count: 1 },
    { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ. (عند الخروج بالرجل اليسرى)', count: 1 },
    { text: 'أَعُوذُ بِاللهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ.', count: 1 },
    { text: 'بِسْمِ اللهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ.', count: 1 },
  ],
  safar: [
    { text: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ.', count: 1 },
    { text: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى.', count: 1 },
    { text: 'اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ.', count: 1 },
    { text: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ. (عند النزول منزلاً)', count: 3 },
    { text: 'سُبْحَانَ اللهِ (عند الصعود)، اللهُ أَكْبَرُ.', count: 1 },
  ],
  tasabeeh: [
    { text: 'سُبْحَانَ اللهِ.', count: 33 },
    { text: 'الْحَمْدُ لِلَّهِ.', count: 33 },
    { text: 'اللهُ أَكْبَرُ.', count: 34 },
    { text: 'لَا إِلَهَ إِلَّا اللهُ.', count: 100 },
    { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ.', count: 100 },
    { text: 'سُبْحَانَ اللهِ الْعَظِيمِ وَبِحَمْدِهِ.', count: 100 },
    { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ.', count: 100, note: 'كنز من كنوز الجنة' },
    { text: 'أَسْتَغْفِرُ اللهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ.', count: 100 },
    { text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.', count: 100 },
    { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.', count: 3 },
    { text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 100 },
  ],
  hammwakarb: [
    { text: 'لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ.', count: 1 },
    { text: 'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ.', count: 1 },
    { text: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ. (دعاء ذي النون)', count: 1 },
    { text: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ.', count: 7 },
    { text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ.', count: 1 },
    { text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ.', count: 1 },
  ],
  taeam: [
    { text: 'بِسْمِ اللهِ. (عند بدء الطعام)', count: 1 },
    { text: 'بِسْمِ اللهِ أَوَّلَهُ وَآخِرَهُ. (إذا نسي التسمية)', count: 1 },
    { text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ. (بعد الطعام)', count: 1, note: 'غُفر له ما تقدم من ذنبه' },
    { text: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ.', count: 1 },
    { text: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ.', count: 1 },
  ],
  wudu: [
    { text: 'بِسْمِ اللهِ. (عند بدء الوضوء)', count: 1 },
    { text: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. (بعد الوضوء)', count: 1, note: 'فُتحت له أبواب الجنة الثمانية' },
    { text: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ.', count: 1 },
    { text: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ.', count: 1 },
  ],
  istighfar: [
    { text: 'أَسْتَغْفِرُ اللهَ.', count: 100 },
    { text: 'أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ.', count: 3 },
    { text: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ.', count: 100 },
    { text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ... (سيد الاستغفار)', count: 1 },
    { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ.', count: 100 },
  ],
  salah_nabi: [
    { text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ... (الصلاة الإبراهيمية)', count: 1 },
    { text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.', count: 100, note: 'من صلى عليّ واحدة صلى الله عليه عشراً' },
    { text: 'صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ.', count: 10 },
    { text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ.', count: 10 },
  ],
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
  const hist = (history || [])
    .filter((m) => m && m.role)
    .slice(-6)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text || m.raw || (m.card && m.card.title) || '' }));
  const body = { question, agent: 'fatwa', lang: 'ar', forceSearch: true, history: hist };
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('network');
  const data = await res.json();
  if (data && data.card) return { card: data.card, sources: Array.isArray(data.sources) ? data.sources : [], raw: '' };
  return { card: null, sources: [], raw: extractText(data) || '' };
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${T.border}`, background: `linear-gradient(180deg, ${T.accent}14, ${T.surface} 80%)`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 5 }}>
      {onMenu ? <button onClick={onMenu} style={iconBtn}><Menu size={22} color={T.text} /></button> : <div style={{ width: 40 }} />}
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          {Icon && <span style={{ width: 30, height: 30, borderRadius: 9, background: `${T.accent}1c`, border: `1px solid ${T.accent}33`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={17} color={T.accent} /></span>}
          <span style={{ fontWeight: 800, color: T.text, fontSize: 17 }}>{title}</span>
        </div>
        {subtitle && <div style={{ color: T.textDim, fontSize: 12, marginTop: 3 }}>{subtitle}</div>}
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
    <button onClick={onClick} className="listrow" style={{ textAlign: 'right', background: 'transparent', border: 'none', borderBottom: `1px solid ${T.borderSoft}`, padding: '15px 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 13, width: '100%', transition: 'background .15s' }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: `${tint}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={19} color={tint} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: T.text, fontSize: 15.5 }}>{title}</div>
        {desc && <div style={{ color: T.textFaint, fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>{desc}</div>}
        {count != null && <div style={{ color: T.textFaint, fontSize: 12, marginTop: 2 }}>{count} عنصر</div>}
      </div>
      <ChevronLeft size={17} color={T.textFaint} />
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
    <div style={{ padding: 18 }} className="fadeup">
      <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', marginBottom: 18, border: `1px solid ${T.border}`, background: `radial-gradient(140% 120% at 50% -20%, ${T.accentSoft}, transparent 60%), ${T.surface}` }}>
        <div style={{ textAlign: 'center', padding: '30px 20px 26px' }}>
          <div style={{ width: 70, height: 70, borderRadius: 20, background: `linear-gradient(145deg, ${T.accent}, ${T.good})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 30px ${T.accent}44` }}>
            <Compass size={34} color="#06120E" />
          </div>
          <div style={{ fontWeight: 800, fontSize: 21, color: T.text, marginTop: 16 }}>بسم الله الرحمن الرحيم</div>
          <div style={{ color: T.accent, fontSize: 13.5, marginTop: 8, fontWeight: 600 }}>﴿فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ﴾</div>
        </div>
      </div>
      <button onClick={() => go('chat')} className="fcard" style={{ width: '100%', background: `linear-gradient(135deg, ${T.accent}, ${T.good})`, border: 'none', borderRadius: 18, padding: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, boxShadow: `0 8px 24px ${T.accent}33` }}>
        <MessageCircle size={26} color="#06120E" />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, color: '#06120E', fontSize: 17 }}>اسأل سؤالاً دينياً</div>
          <div style={{ color: 'rgba(6,18,14,0.75)', fontSize: 13, fontWeight: 600 }}>إجابة فورية مستندة لمصادر شرعية موثوقة</div>
        </div>
      </button>
      <div style={{ borderTop: `1px solid ${T.borderSoft}` }}>
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
      const r = await callFatwaApi(q, next);
      if (r && r.card) setMessages([...next, { role: 'assistant', card: r.card, sources: r.sources || [] }]);
      else setMessages([...next, { role: 'assistant', raw: (r && r.raw) || '', parsed: parseFatwa((r && r.raw) || '') }]);
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
                {m.card ? (
                  <KitCard card={m.card} theme="fatwa" sources={m.sources} />
                ) : m.parsed && m.parsed.structured ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {m.parsed.hukm && <Section label="الحكم الشرعي" color={T.accent} text={m.parsed.hukm} />}
                    {m.parsed.dalil && <div style={{ background: T.goldSoft, border: `1px solid ${T.gold}33`, borderRadius: 10, padding: 12 }}><div style={{ color: T.gold, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>الدليل</div><div style={{ color: T.text, fontSize: 14, lineHeight: 1.9 }}>{m.parsed.dalil}</div></div>}
                    {m.parsed.sharh && <Section label="الشرح" color={T.good} text={m.parsed.sharh} />}
                  </div>
                ) : (
                  <div style={{ color: T.text, fontSize: 15, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{m.parsed ? m.parsed.text : ''}</div>
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

function FatwaCard({ card, sources }) {
  const tabs = Array.isArray(card && card.tabs) ? card.tabs : [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {card && card.title && <div style={{ color: T.text, fontWeight: 800, fontSize: 16 }}>{card.title}</div>}
      {card && card.sub && <div style={{ color: T.textDim, fontSize: 13, lineHeight: 1.8, marginTop: -4 }}>{card.sub}</div>}
      {tabs.map((tb, i) => {
        const label = (tb && tb.label) || '';
        const d = (tb && tb.data) || {};
        const items = Array.isArray(d.items) ? d.items : null;
        const body = d.body || d.text || '';
        const isDalil = /دليل/.test(label);
        const isHukm = /حكم/.test(label);
        const titleColor = isDalil ? T.gold : isHukm ? T.accent : T.good;
        if (!items && !body) return null;
        return (
          <div key={i} style={{ background: isDalil ? T.goldSoft : 'transparent', border: isDalil ? `1px solid ${T.gold}33` : 'none', borderRadius: isDalil ? 10 : 0, padding: isDalil ? 12 : 0 }}>
            {label && <div style={{ color: titleColor, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{label}</div>}
            {items ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {d.intro && <div style={{ color: T.textDim, fontSize: 13, marginBottom: 2 }}>{d.intro}</div>}
                {items.map((it, j) => (
                  <div key={j} style={{ display: 'flex', gap: 9, color: T.text, fontSize: 14.5, lineHeight: 1.95 }}>
                    <span style={{ flexShrink: 0, marginTop: 9, width: 5, height: 5, borderRadius: '50%', background: titleColor }} />
                    <span>{typeof it === 'string' ? it : (it.title ? (it.desc ? `${it.title} — ${it.desc}` : it.title) : (it.desc || ''))}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: T.text, fontSize: 14.5, lineHeight: 1.95, whiteSpace: 'pre-wrap' }}>{body}</div>
            )}
          </div>
        );
      })}
      {Array.isArray(sources) && sources.length > 0 && (
        <div style={{ borderTop: `1px solid ${T.borderSoft}`, paddingTop: 10 }}>
          <div style={{ color: T.textDim, fontWeight: 700, fontSize: 12, marginBottom: 7 }}>المصادر</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {sources.slice(0, 20).map((s, k) => (
              <a key={k} href={s.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 7, color: T.accent, fontSize: 13, textDecoration: 'none' }}>
                <ExternalLink size={13} color={T.accent} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title || s.domain || s.url}</span>
              </a>
            ))}
          </div>
        </div>
      )}
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
      <div style={{ borderTop: `1px solid ${T.borderSoft}` }}>
        {FATWA_CATEGORIES.map((c) => <FeatureCard key={c.id} {...c} onClick={() => setCat(c.id)} />)}
      </div>
    </div>
  );
}

function AdhkarView() {
  const [cat, setCat] = useState(null);
  if (cat) {
    const c = ADHKAR_CATEGORIES.find((x) => x.id === cat);
    const list = ADHKAR[cat] || [];
    return <TasbihRunner cat={c} list={list} onExit={() => setCat(null)} />;
  }
  return (
    <div style={{ padding: 0 }} className="fadeup">
      <div style={{ padding: '18px 18px 6px' }}>
        <Heading title="الأذكار والأدعية" subtitle="اختر القسم لتبدأ التسبيح" />
      </div>
      <div>
        {ADHKAR_CATEGORIES.map((c, i) => {
          const n = (ADHKAR[c.id] || []).length;
          return (
            <button key={c.id} onClick={() => setCat(c.id)} className="listrow" style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'right', background: 'transparent', border: 'none', borderTop: i === 0 ? `1px solid ${T.borderSoft}` : 'none', borderBottom: `1px solid ${T.borderSoft}`, padding: '16px 18px', cursor: 'pointer', width: '100%', transition: 'background .15s' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${c.tint}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <c.Icon size={19} color={c.tint} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: T.text, fontSize: 15.5 }}>{c.title}</div>
                <div style={{ color: T.textFaint, fontSize: 12, marginTop: 2 }}>{n} ذكر</div>
              </div>
              <ChevronLeft size={17} color={T.textFaint} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TasbihRunner({ cat, list, onExit }) {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const item = list[idx] || { text: '', count: 1 };
  const target = item.count || 1;
  const done = count >= target;
  const pct = Math.min(100, Math.round((count / target) * 100));
  const allDone = idx >= list.length - 1 && done;

  const tap = () => {
    if (count + 1 >= target) {
      setCount(target);
      if (navigator.vibrate) navigator.vibrate(30);
    } else {
      setCount((c) => c + 1);
      if (navigator.vibrate) navigator.vibrate(8);
    }
  };
  const next = () => { if (idx < list.length - 1) { setIdx(idx + 1); setCount(0); } };
  const prev = () => { if (idx > 0) { setIdx(idx - 1); setCount(0); } };

  const R = 92, C = 2 * Math.PI * R;
  return (
    <div style={{ padding: 18, minHeight: '100%', display: 'flex', flexDirection: 'column' }} className="fadeup">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <button onClick={onExit} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>{cat.title}</span>
          <cat.Icon size={18} color={cat.tint} />
        </div>
      </div>
      <div style={{ color: T.textDim, fontSize: 12.5, textAlign: 'center', marginBottom: 14 }}>{idx + 1} من {list.length}</div>

      {/* نص الذكر */}
      <div style={{ background: `linear-gradient(160deg, ${cat.tint}12, transparent 60%), ${T.surface}`, border: `1px solid ${T.border}`, borderRadius: 20, padding: '22px 20px', marginBottom: 18, textAlign: 'center', minHeight: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: T.text, fontSize: 18, lineHeight: 2.1, fontWeight: 600 }}>{item.text}</div>
        {item.note && <div style={{ color: cat.tint, fontSize: 12.5, marginTop: 12, fontWeight: 600 }}>✦ {item.note}</div>}
      </div>

      {/* المسبحة الدائرية */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <button onClick={tap} className="tasbih-tap" style={{ position: 'relative', width: 210, height: 210, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
          <svg width="210" height="210" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="105" cy="105" r={R} fill="none" stroke={T.border} strokeWidth="11" />
            <circle cx="105" cy="105" r={R} fill="none" stroke={done ? T.good : cat.tint} strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100} style={{ transition: 'stroke-dashoffset .25s, stroke .25s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: done ? T.good : T.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{count}</div>
            <div style={{ fontSize: 14, color: T.textDim, marginTop: 4, fontWeight: 700 }}>من {target}</div>
            {done && <div style={{ fontSize: 12, color: T.good, marginTop: 6, fontWeight: 700 }}>✓ اكتمل</div>}
          </div>
        </button>
      </div>
      <div style={{ color: T.textFaint, fontSize: 12, textAlign: 'center', marginBottom: 18 }}>اضغط الدائرة للتسبيح</div>

      {/* أزرار التنقل */}
      <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
        <button onClick={prev} disabled={idx === 0} style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 13, padding: '13px 0', color: idx === 0 ? T.textFaint : T.text, fontWeight: 700, cursor: idx === 0 ? 'default' : 'pointer', fontFamily: FONT, opacity: idx === 0 ? 0.5 : 1 }}>السابق</button>
        <button onClick={() => setCount(0)} style={{ width: 52, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><RotateCcw size={18} color={T.textDim} /></button>
        <button onClick={next} disabled={idx >= list.length - 1} style={{ flex: 1, background: done ? `linear-gradient(135deg, ${cat.tint}, ${T.good})` : cat.tint, border: 'none', borderRadius: 13, padding: '13px 0', color: '#06120E', fontWeight: 800, cursor: idx >= list.length - 1 ? 'default' : 'pointer', fontFamily: FONT, opacity: idx >= list.length - 1 ? 0.5 : 1 }}>التالي</button>
      </div>
      {allDone && <div style={{ textAlign: 'center', color: T.good, fontWeight: 700, fontSize: 14, marginTop: 14 }}>تقبّل الله — أتممت أذكار {cat.title}</div>}
    </div>
  );
}

function PrayerView() {
  const [times, setTimes] = useState(null);
  const [loc, setLoc] = useState('مكة المكرمة');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
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
      if (h * 60 + m > mins) return { key: k, time: fmtClock(times[k]), raw: times[k] };
    }
    return { key: 'Fajr', time: fmtClock(times.Fajr), raw: times.Fajr, tomorrow: true };
  }, [times, now]);

  const countdown = useMemo(() => {
    if (!next) return '';
    const [h, m] = (next.raw || '00:00').split(':').map(Number);
    let target = new Date(now); target.setHours(h, m, 0, 0);
    if (next.tomorrow || target <= now) target.setDate(target.getDate() + 1);
    let diff = Math.max(0, Math.floor((target - now) / 1000));
    const hh = Math.floor(diff / 3600); diff %= 3600;
    const mm = Math.floor(diff / 60); const ss = diff % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }, [next, now]);

  if (!times) return <div style={{ padding: 40, textAlign: 'center' }}><Loader2 size={26} color={T.accent} style={{ animation: 'spin 1s linear infinite' }} /><div style={{ color: T.textDim, marginTop: 12 }}>جاري جلب المواقيت...</div></div>;

  const nextMeta = PRAYER_META.find((p) => p.key === next?.key);
  return (
    <div style={{ padding: 18 }} className="fadeup">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.textDim, fontSize: 13, marginBottom: 14, justifyContent: 'flex-end' }}>
        <span>{loc}</span><MapPin size={14} color={T.accent} />
      </div>
      <div style={{ position: 'relative', overflow: 'hidden', background: `radial-gradient(130% 120% at 50% -10%, ${T.accentSoft}, transparent 60%), ${T.surface}`, border: `1px solid ${T.accentLine}`, borderRadius: 22, padding: '26px 20px', textAlign: 'center', marginBottom: 18 }}>
        <div style={{ color: T.accent, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>الصلاة القادمة</div>
        {nextMeta && <div style={{ width: 54, height: 54, borderRadius: 15, background: `${T.accent}1c`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '6px auto 10px' }}><nextMeta.Icon size={28} color={T.accent} /></div>}
        <div style={{ fontWeight: 800, fontSize: 24, color: T.text }}>{nextMeta?.name}</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.accent, marginTop: 2 }}>{next?.time}</div>
        <div style={{ marginTop: 14, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: T.bg + 'aa', border: `1px solid ${T.border}`, borderRadius: 14, padding: '10px 22px' }}>
          <div dir="ltr" style={{ fontSize: 30, fontWeight: 800, color: T.text, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>{countdown}</div>
          <div style={{ fontSize: 11.5, color: T.textDim, fontWeight: 600 }}>الوقت المتبقّي</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PRAYER_META.map((p) => {
          const isNext = p.key === next?.key;
          return (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isNext ? T.accentSoft : T.surface, border: `1px solid ${isNext ? T.accentLine : T.border}`, borderRadius: 14, padding: '14px 18px' }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: isNext ? T.accent : T.text }}>{fmtClock(times[p.key])}</span>
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
function fmtClock(t) {
  if (!t || !/^\d{1,2}:\d{2}/.test(String(t))) return t;
  const fmt = (typeof window !== 'undefined' && window.__marnTimeFmt) || '12';
  if (fmt === '24') return t;
  const [h, m] = String(t).split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return t;
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'م' : 'ص'}`;
}
const FALLBACK_TIMES = { Fajr: '04:15', Sunrise: '05:40', Dhuhr: '12:25', Asr: '15:43', Maghrib: '19:07', Isha: '20:27' };

const QADA_KEY = 'fatwa_qada_v1';
function loadQada() { try { return { owed: 0, done: 0, ...JSON.parse(localStorage.getItem(QADA_KEY) || '{}') }; } catch { return { owed: 0, done: 0 }; } }
function saveQada(q) { try { localStorage.setItem(QADA_KEY, JSON.stringify(q)); } catch {} }

function TrackingView() {
  const [tab, setTab] = useState('salah');
  const [data, setData] = useState(loadTracking);
  const [qada, setQada] = useState(loadQada);
  const setQ = (patch) => { const nq = { ...qada, ...patch }; if (nq.owed < 0) nq.owed = 0; if (nq.done < 0) nq.done = 0; if (nq.done > nq.owed) nq.done = nq.owed; setQada(nq); saveQada(nq); };
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
        <>
          {/* بطاقة صيام اليوم */}
          <div style={{ background: `linear-gradient(135deg, ${T.goldSoft}, transparent 70%), ${T.surface}`, border: `1px solid ${day.fasted ? T.gold + '66' : T.border}`, borderRadius: 18, padding: 22, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Moon size={26} color={day.fasted ? T.gold : T.textDim} />
              <div style={{ textAlign: 'end' }}>
                <div style={{ fontWeight: 800, fontSize: 17, color: T.text }}>{day.fasted ? 'صمت اليوم — تقبّل الله' : 'صيام اليوم'}</div>
                <div style={{ color: T.textDim, fontSize: 12.5, marginTop: 2 }}>{day.fasted ? (day.fastType === 'qada' ? 'محسوب من القضاء' : 'نافلة — أجر عظيم') : 'سجّل صيامك وحدد نوعه'}</div>
              </div>
            </div>
            {!day.fasted ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => update({ fasted: true, fastType: 'nafl' })} style={{ flex: 1, background: T.gold, color: '#1a1208', border: 'none', borderRadius: 12, padding: '13px 0', fontWeight: 800, cursor: 'pointer', fontSize: 14.5 }}>صيام نافلة</button>
                <button onClick={() => { update({ fasted: true, fastType: 'qada' }); setQ({ done: qada.done + 1 }); }} style={{ flex: 1, background: 'transparent', color: T.gold, border: `1.5px solid ${T.gold}`, borderRadius: 12, padding: '13px 0', fontWeight: 800, cursor: 'pointer', fontSize: 14.5 }}>صيام قضاء</button>
              </div>
            ) : (
              <button onClick={() => { if (day.fastType === 'qada') setQ({ done: qada.done - 1 }); update({ fasted: false, fastType: null }); }} style={{ width: '100%', background: 'transparent', color: T.textDim, border: `1px solid ${T.border}`, borderRadius: 12, padding: '11px 0', fontWeight: 700, cursor: 'pointer', fontSize: 13.5 }}>تراجع عن تسجيل اليوم</button>
            )}
          </div>

          {/* عدّاد القضاء */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ background: T.accentSoft, color: T.accent, borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>{Math.max(0, qada.owed - qada.done)} متبقٍ</span>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.text }}>قضاء الصيام</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, textAlign: 'center' }}>
                <div style={{ color: T.textDim, fontSize: 12.5, marginBottom: 8 }}>الأيام التي عليّ</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <button onClick={() => setQ({ owed: qada.owed - 1 })} style={{ ...stepBtn, width: 38, height: 38 }}><Minus size={16} color={T.text} /></button>
                  <span style={{ fontWeight: 800, fontSize: 26, color: T.text, minWidth: 36 }}>{qada.owed}</span>
                  <button onClick={() => setQ({ owed: qada.owed + 1 })} style={{ ...stepBtn, width: 38, height: 38, background: T.accent }}><Plus size={16} color="#fff" /></button>
                </div>
              </div>
              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, textAlign: 'center' }}>
                <div style={{ color: T.textDim, fontSize: 12.5, marginBottom: 8 }}>قضيتُ منها</div>
                <div style={{ fontWeight: 800, fontSize: 32, color: T.good, lineHeight: '38px' }}>{qada.done}</div>
              </div>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: T.surfaceAlt, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ height: '100%', width: `${qada.owed ? Math.round((qada.done / qada.owed) * 100) : 0}%`, background: `linear-gradient(90deg, ${T.good}, ${T.gold})`, borderRadius: 999, transition: 'width .4s' }} />
            </div>
            <div style={{ color: T.textDim, fontSize: 12, textAlign: 'center' }}>{qada.owed === 0 ? 'حدد عدد الأيام التي عليك قضاؤها' : qada.done >= qada.owed ? 'أتممت القضاء كاملاً — تقبّل الله طاعتك' : `أنجزت ${Math.round((qada.done / qada.owed) * 100)}٪ من القضاء`}</div>
          </div>
        </>
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
        <Stat Icon={Check} value={`${loadQada().done}/${loadQada().owed}`} label="قضاء الصيام" tint={T.gold} />
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
        <div style={{ borderTop: `1px solid ${T.borderSoft}` }}>
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
    <div style={{ textAlign: 'right', marginBottom: 18, position: 'relative', paddingInlineStart: 14 }}>
      <div style={{ position: 'absolute', insetInlineStart: 0, top: 3, bottom: 3, width: 4, borderRadius: 4, background: `linear-gradient(${T.accent}, ${T.good})` }} />
      <div style={{ fontWeight: 800, fontSize: 21, color: T.text, letterSpacing: '-0.3px' }}>{title}</div>
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
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .fatwa-scroll::-webkit-scrollbar{width:0} .fcard:active{transform:scale(.97)} .fcard:hover{border-color:${T.accentLine}!important} .listrow:active{background:${T.surface}!important} .listrow:hover{background:${T.surfaceAlt}!important} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}} .fadeup{animation:fadeUp .35s ease both} .tasbih-tap:active{transform:scale(.95);transition:transform .08s}`}</style>
      <TopBar
        title={meta.title}
        Icon={meta.Icon}
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
    </div>
  );
}
