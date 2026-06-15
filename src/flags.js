// flags.js — تحويل اسم المنتخب إلى رمز دولة ISO ورابط علم (flagcdn)
const MAP = {
  "السعودية":"sa","المنتخب السعودي":"sa","الأخضر":"sa","الاخضر":"sa",
  "الأرجنتين":"ar","الارجنتين":"ar","البرازيل":"br","فرنسا":"fr",
  "إنجلترا":"gb-eng","انجلترا":"gb-eng","اسكتلندا":"gb-sct","ويلز":"gb-wls","أيرلندا الشمالية":"gb-nir",
  "إسبانيا":"es","اسبانيا":"es","ألمانيا":"de","المانيا":"de","البرتغال":"pt",
  "إيطاليا":"it","ايطاليا":"it","هولندا":"nl","بلجيكا":"be","كرواتيا":"hr",
  "المغرب":"ma","مصر":"eg","الجزائر":"dz","تونس":"tn","ليبيا":"ly","السودان":"sd",
  "اليابان":"jp","كوريا الجنوبية":"kr","كوريا":"kr","أستراليا":"au","استراليا":"au",
  "الولايات المتحدة":"us","أمريكا":"us","امريكا":"us","المكسيك":"mx","كندا":"ca",
  "الأوروغواي":"uy","اوروغواي":"uy","كولومبيا":"co","الإكوادور":"ec","الاكوادور":"ec",
  "تشيلي":"cl","بيرو":"pe","باراغواي":"py","فنزويلا":"ve","بوليفيا":"bo",
  "نيجيريا":"ng","السنغال":"sn","غانا":"gh","الكاميرون":"cm","ساحل العاج":"ci","مالي":"ml",
  "جنوب أفريقيا":"za","الرأس الأخضر":"cv","الكونغو":"cd",
  "قطر":"qa","الإمارات":"ae","الامارات":"ae","العراق":"iq","إيران":"ir","ايران":"ir",
  "الأردن":"jo","الاردن":"jo","عمان":"om","سلطنة عمان":"om","الكويت":"kw","البحرين":"bh",
  "سوريا":"sy","اليمن":"ye","فلسطين":"ps","لبنان":"lb",
  "الدنمارك":"dk","السويد":"se","النرويج":"no","سويسرا":"ch","النمسا":"at",
  "بولندا":"pl","أوكرانيا":"ua","اوكرانيا":"ua","صربيا":"rs","تركيا":"tr","اليونان":"gr",
  "تشيكيا":"cz","المجر":"hu","رومانيا":"ro","إيرلندا":"ie","أيرلندا":"ie","آيسلندا":"is",
  "أوزبكستان":"uz","اوزبكستان":"uz","الصين":"cn","إندونيسيا":"id","اندونيسيا":"id",
  "الهند":"in","نيوزيلندا":"nz","نيوزيلاندا":"nz","تايلاند":"th","فيتنام":"vn",
  "بنما":"pa","كوستاريكا":"cr","هندوراس":"hn","جامايكا":"jm","الإكوادور‎":"ec",
  // إنجليزي
  "saudi arabia":"sa","argentina":"ar","brazil":"br","france":"fr","england":"gb-eng",
  "spain":"es","germany":"de","portugal":"pt","italy":"it","netherlands":"nl","belgium":"be",
  "croatia":"hr","morocco":"ma","egypt":"eg","japan":"jp","south korea":"kr","usa":"us",
  "united states":"us","mexico":"mx","canada":"ca","uruguay":"uy","colombia":"co",
};
export function flagCode(name) {
  if (!name) return null;
  const k = String(name).trim().toLowerCase();
  const raw = String(name).trim();
  if (MAP[raw]) return MAP[raw];
  if (MAP[k]) return MAP[k];
  const k2 = raw.replace(/^منتخب\s+/, "").replace(/^ال(?=.)/, "").trim();
  return MAP[raw.replace(/^منتخب\s+/, "").trim()] || MAP["ال" + k2] || MAP[k2] || null;
}
export function flagUrl(nameOrCode, w) {
  if (!nameOrCode) return null;
  let c = String(nameOrCode).trim();
  if (c.length > 5 || /[\u0600-\u06FF\s]/.test(c)) c = flagCode(c);
  else c = c.toLowerCase();
  return c ? ("https://flagcdn.com/w" + (w || 40) + "/" + c + ".png") : null;
}
