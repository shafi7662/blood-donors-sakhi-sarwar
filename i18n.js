// ============================================================
//  i18n — Urdu / English toggle (default Urdu; saved in localStorage)
//  Load order on every page: supabase-config.js → i18n.js → app.js → page.js
//  Usage: t("key") or t("key", {name: "Ali"}) for {name} placeholders.
//  Static text: <span data-i18n="key">…</span>, innerHTML: data-i18n-html,
//  placeholder: data-i18n-ph. Page title: body data-page="home" → title_home.
// ============================================================

var I18N = {
  ur: {
    brand_name: "المصباح اور المصطفیٰ بلڈ ڈونیشن",
    brand_sub: "سخی سرور، ضلع ڈیرہ غازی خان — خدمتِ خلق",
    admin_brand: "ایڈمن پینل",
    admin_brand_sub: "المصباح میڈیکل ٹیم اور المصطفیٰ بلڈ ڈونیشن گروپ",
    nav_home: "ہوم", nav_register: "ڈونر بنیں", nav_need: "خون چاہیے", nav_admin: "ایڈمن",
    title_home: "المصباح اور المصطفیٰ — بلڈ ڈونیشن، سخی سرور",
    title_register: "ڈونر بنیں — المصباح اور المصطفیٰ بلڈ ڈونیشن",
    title_need: "خون چاہیے — المصباح اور المصطفیٰ بلڈ ڈونیشن",
    title_admin: "ایڈمن پینل — المصباح اور المصطفیٰ بلڈ ڈونیشن",
    footer_home: "المصباح میڈیکل ٹیم اور المصطفیٰ بلڈ ڈونیشن گروپ — سخی سرور، ڈیرہ غازی خان<br>خدمتِ خلق — اللہ کی رضا کے لیے",
    footer_short: "المصباح میڈیکل ٹیم اور المصطفیٰ بلڈ ڈونیشن گروپ — سخی سرور، ڈیرہ غازی خان",
    notice_home: "<b>اہم:</b> یہ ویب سائٹ خون جمع نہیں کرتی، کوئی فیس نہیں لیتی، اور خون کا لین دین نہیں کرتی۔ یہ صرف مریض اور عطیہ دہندہ کے درمیان رابطے کا ذریعہ ہے۔ خون صرف لائسنس یافتہ لیب یا بلڈ بینک میں لیا اور چیک کیا جاتا ہے۔",
    config_warn: "نوٹ: ویب سائٹ کی سیٹ اپ ابھی مکمل نہیں ہوئی (Supabase کی تفصیل supabase-config.js میں بھرنا باقی ہے)۔ فارم پھر بھی WhatsApp کے ذریعے ٹیم تک پہنچ جائے گا۔",
    all_groups: "— تمام گروپ —", all_cities: "— تمام شہر —",
    pick_city: "— شہر منتخب کریں —", pick_group: "— گروپ منتخب کریں —",
    city_sakhi: "سخی سرور", city_dgk: "ڈیرہ غازی خان", city_taunsa: "تونسہ",
    city_kotchutta: "کوٹ چھٹہ", city_jampur: "جام پور", city_rajanpur: "راجن پور",
    city_multan: "ملتان", city_other: "دیگر",
    hero_h1: "خون عطیہ کریں، زندگی بچائیں",
    hero_badge: "✦ سخی سرور اور ڈیرہ غازی خان ✦",
    hero_p: "ہم سخی سرور اور ڈیرہ غازی خان کے رضاکار ہیں۔ ہمارا مقصد یہ ہے کہ جس مریض کو خون کی ضرورت ہو، اسے بروقت عطیہ دہندہ مل جائے۔ آپ کا ایک عطیہ کسی کی زندگی بچا سکتا ہے۔",
    hero_cta_donor: "ڈونر بنیں", hero_cta_need: "خون چاہیے",
    marquee: "خون عطیہ کریں ✦ زندگی بچائیں ✦ ایک عطیہ، ایک زندگی ✦ خدمتِ خلق ✦&nbsp;",
    trust1: "✓ مفت خدمت — کوئی فیس نہیں",
    trust2: "✓ خون صرف لائسنس یافتہ لیب سے",
    trust3: "✓ ڈونر کا فون نمبر خفیہ رہتا ہے",
    teams_h2: "ہماری ٹیمیں",
    team1_name: "المصباح میڈیکل ٹیم",
    team1_desc: "سخی سرور میں مریضوں کی مدد اور خون کا انتظام کرنے والی رضاکار ٹیم۔",
    team2_name: "المصطفیٰ بلڈ ڈونیشن گروپ",
    team2_desc: "سخی سرور میں خون کے عطیات کا انتظام کرنے والا رضاکار گروپ۔ دونوں ٹیمیں مل کر ایک ہی کام کرتی ہیں۔",
    how_h2: "طریقہ کار — کیسے کام کرتا ہے؟",
    step1: "<b>ڈونر بنیں یا تلاش کریں:</b> خون دینے کے لیے رجسٹر کریں، یا نیچے اپنے گروپ کا ڈونر تلاش کریں۔",
    step2: "<b>ٹیم رابطہ کرے گی:</b> مریض اپنی HB رپورٹ اور بلڈ گروپ ٹیم کو دیتا ہے؛ ٹیم جتنی cc خون درکار ہو، اتنے کا انتظام کرتی ہے۔ رابطہ WhatsApp کے ذریعے ہوتا ہے۔",
    step3: "<b>خون صرف لائسنس یافتہ لیب سے:</b> خون کا لینا، چیک کرنا اور لگانا صرف اسپتال یا لائسنس یافتہ لیب / بلڈ بینک میں ہوتا ہے۔",
    elig_h2: "خون کون دے سکتا ہے؟",
    elig_p: "عمر 18 سے 60 سال، وزن کم از کم 50 کلو، آخری عطیہ کم از کم 3 ماہ پہلے دیا ہو، اور ہیپاٹائٹس بی یا سی نہ ہو۔ عطیے سے پہلے لیب آپ کی صحت ضرور چیک کرتی ہے۔",
    elig_cta: "ابھی ڈونر بنیں",
    search_h2: "ڈونر تلاش کریں",
    search_hint: "رازداری: یہاں صرف نام، شہر، بلڈ گروپ اور آخری عطیے کی تاریخ نظر آتی ہے۔ فون نمبر کبھی عوامی طور پر نہیں دکھایا جاتا — ڈونر سے رابطہ ٹیم کے ذریعے ہوتا ہے۔",
    pill_all: "سب",
    lbl_group: "بلڈ گروپ", lbl_city: "شہر",
    search_btn: "تلاش کریں",
    results_empty: "اس گروپ / شہر کا کوئی ڈونر ابھی رجسٹرڈ نہیں ہے۔ براہِ کرم ٹیم سے رابطہ کریں یا بعد میں دوبارہ دیکھیں۔",
    donor_last: "آخری عطیہ: ", donor_first: "پہلی بار عطیہ کے لیے تیار",
    donor_contact: "رابطے کے لیے ٹیم سے کہیں — فون نمبر یہاں نہیں دکھایا جاتا۔",
    toast_list_setup: "ڈونر لسٹ ابھی سیٹ اپ ہو رہی ہے — براہِ کرم ٹیم سے WhatsApp پر رابطہ کریں۔",
    toast_list_fail: "ڈونر لسٹ لوڈ نہیں ہو سکی — بعد میں دوبارہ کوشش کریں۔",
    reg_h2: "ڈونر کے طور پر رجسٹر کریں",
    reg_intro: "آپ کی تفصیل محفوظ کی جائے گی تاکہ جب آپ کے گروپ کا خون چاہیے ہو تو ٹیم آپ سے رابطہ کر سکے۔",
    reg_privacy: "رازداری: آپ کا فون نمبر ویب سائٹ پر عوامی طور پر کبھی نہیں دکھایا جائے گا — وہ صرف ٹیم (ایڈمن پینل) کو نظر آئے گا۔",
    lbl_name: "نام", ph_name: "اپنا نام لکھیں",
    lbl_phone: "فون / WhatsApp نمبر", ph_phone: "مثلاً 03001234567",
    phone_hint: "نمبر صرف ٹیم کو نظر آئے گا، عوام کو نہیں۔",
    lbl_age: "عمر", ph_age: "مثلاً 25",
    lbl_last: "آخری بار خون کب دیا تھا؟",
    last_hint: "اگر کبھی نہیں دیا تو خالی چھوڑ دیں۔ دو عطیوں کے درمیان کم از کم 3 ماہ کا وقفہ ہونا چاہیے۔",
    consent: "میں رضا مندی سے اپنا نام، شہر، بلڈ گروپ اور فون نمبر ٹیم کو دے رہا/رہی ہوں تاکہ ضرورت پڑنے پر مجھ سے رابطہ کیا جا سکے۔",
    reg_submit: "رجسٹر کریں",
    reg_notice: "<b>اہم:</b> خون صرف لائسنس یافتہ لیب یا بلڈ بینک میں لیا اور چیک کیا جاتا ہے۔ عطیے سے پہلے آپ کی صحت کی جانچ ہوگی۔",
    toast_reg_fail: "رجسٹریشن محفوظ نہیں ہو سکی — براہِ کرم WhatsApp پر براہِ راست رابطہ کریں۔",
    reg_ok_saved: "<b>شکریہ، {name}!</b> آپ کی تفصیل محفوظ ہو گئی ہے اور WhatsApp پر ٹیم کو بھیج دی گئی ہے۔ ٹیم جلد آپ سے رابطہ کرے گی۔",
    reg_ok_nosave: "<b>شکریہ، {name}!</b> آپ کی تفصیل WhatsApp پر ٹیم کو بھیج دی گئی ہے۔ ٹیم جلد آپ سے رابطہ کرے گی۔",
    wa_reg_greeting: "السلام علیکم! میں خون کا عطیہ دینا چاہتا/چاہتی ہوں۔",
    wa_name: "نام: ", wa_city: "شہر: ", wa_group: "بلڈ گروپ: ", wa_age: "عمر: ",
    wa_phone: "فون: ", wa_last: "آخری عطیہ: ", wa_never: "کبھی نہیں دیا",
    need_h2: "خون کی درخواست",
    need_intro: "مریض کی HB رپورٹ اور بلڈ گروپ بتائیں — ٹیم جتنی cc خون درکار ہوگا، اتنے کا انتظام کرے گی۔",
    need_report_note: "<b>رپورٹ کے بارے میں:</b> آپ کی اپ لوڈ کردہ رپورٹ ٹیم کے ایڈمن پینل میں محفوظ ہو جائے گی اور ٹیم وہیں سے دیکھ/ڈاؤن لوڈ کر لے گی۔ WhatsApp کے لنک کے ساتھ فائل خودکار طور پر نہیں جاتی — اس لیے رپورٹ یہیں اپ لوڈ کرنا ضروری ہے۔",
    lbl_patient: "مریض کا نام", ph_patient: "مریض کا نام",
    lbl_hospital: "اسپتال", ph_hospital: "مثلاً حیدر میڈی کیئر اسپتال، سخی سرور",
    lbl_group_need: "کون سا بلڈ گروپ چاہیے؟",
    lbl_cc: "کتنا خون چاہیے (cc)؟",
    cc_hint: "ڈاکٹر جتنی cc بتائے، اتنی لکھیں — مثلاً 400cc (1 یونٹ) یا 700cc (تقریباً 2 یونٹ)۔ 1 یونٹ ≈ 400cc۔",
    lbl_report: "HB رپورٹ (تصویر یا PDF)",
    report_hint: "رپورٹ کی واضح تصویر یا PDF اپ لوڈ کریں (زیادہ سے زیادہ 5 MB)۔",
    lbl_req_phone: "رابطہ نمبر (درخواست دہندہ)",
    need_submit: "درخواست بھیجیں",
    need_notice: "<b>اہم:</b> خون صرف لائسنس یافتہ لیب یا بلڈ بینک سے لیا اور چیک کیا جاتا ہے۔ یہ ویب سائٹ خون جمع نہیں کرتی اور کوئی فیس نہیں لیتی۔",
    toast_no_file: "براہِ کرم HB رپورٹ اپ لوڈ کریں۔",
    toast_big_file: "رپورٹ 5 MB سے بڑی ہے — چھوٹی فائل اپ لوڈ کریں۔",
    toast_cc_range: "براہِ کرم خون کی مقدار cc میں لکھیں (50 سے 5000 تک)۔",
    toast_setup_wa: "سیٹ اپ مکمل نہیں ہے — براہِ کرم رپورٹ WhatsApp پر براہِ راست بھیجیں۔",
    toast_up_fail: "رپورٹ اپ لوڈ نہیں ہو سکی — انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔",
    toast_save_fail: "درخواست محفوظ نہیں ہو سکی — دوبارہ کوشش کریں۔",
    need_success: "<b>شکریہ!</b> آپ کی درخواست اور HB رپورٹ محفوظ ہو گئی ہے اور ٹیم کو WhatsApp پر اطلاع بھیج دی گئی ہے۔ ٹیم جلد آپ سے رابطہ کرے گی۔",
    wa_need_greeting: "السلام علیکم! مریض کے لیے خون کی ضرورت ہے۔",
    wa_patient: "مریض: ", wa_hospital: "اسپتال: ", wa_blood: "خون: ",
    wa_approx: "تقریباً", wa_units: "یونٹ", wa_contact: "رابطہ: ",
    wa_report_link: "HB رپورٹ: ", wa_report_7d: "(یہ لنک 7 دن تک کام کرے گا۔)",
    wa_report_admin: "HB رپورٹ اپ لوڈ کر دی ہے — براہِ کرم ایڈمن پینل سے دیکھ لیں۔",
    wa_report_sep: "HB رپورٹ میں WhatsApp پر الگ سے بھیج رہا/رہی ہوں۔",
    gate_h2: "ایڈمن لاگ ان",
    gate_hint: "یہ صفحہ صرف ٹیم کے ذمہ دار کے لیے ہے۔",
    lbl_pass: "پاس ورڈ", ph_gate_pass: "ایڈمن پاس ورڈ",
    gate_open: "کھولیں", gate_error: "پاس ورڈ غلط ہے۔",
    auth_h2: "Supabase ایڈمن سائن ان",
    auth_hint: "ڈونرز کے فون نمبر اور رپورٹس صرف لاگ ان ایڈمن دیکھ سکتا ہے۔ یہ ای میل / پاس ورڈ وہی ہے جو Supabase Dashboard → Authentication میں ایڈمن صارف کے لیے بنایا گیا تھا (تفصیل README میں)۔",
    lbl_email: "ای میل", ph_auth_pass: "Supabase ایڈمن پاس ورڈ",
    auth_signin: "سائن ان", auth_error: "سائن ان ناکام — ای میل / پاس ورڈ چیک کریں۔",
    donors_h2: "رجسٹرڈ ڈونرز",
    lbl_search: "تلاش (نام / فون / شہر)", ph_search: "مثلاً شافی، 0336…، سخی سرور",
    refresh: "تازہ کریں",
    th_name: "نام", th_group: "گروپ", th_city: "شہر", th_age: "عمر",
    th_last: "آخری عطیہ", th_days: "دن گزرے", th_donations: "عطیات", th_phone: "فون",
    donor_empty: "کوئی ڈونر نہیں ملا۔",
    reqs_h2: "خون کی درخواستیں",
    th_patient: "مریض", th_hospital: "اسپتال", th_blood_cc: "خون (cc)",
    th_status: "حالت", th_report: "رپورٹ", th_report_btn: "رپورٹ دیکھیں",
    req_empty: "کوئی درخواست نہیں ہے۔",
    signout: "سائن آؤٹ",
    admin_footer: "یہ پینل صرف ٹیم کے ذمہ دار کے لیے ہے — ڈونرز کی تفصیل کسی سے شیئر نہ کریں۔",
    btn_whatsapp: "WhatsApp", btn_donated: "عطیہ درج کریں", btn_delete: "حذف کریں",
    wa_cta: "واٹس ایپ پر ٹیم سے فوری رابطہ کریں",
    wa_hello: "السلام علیکم! مجھے بلڈ ڈونیشن کے بارے میں معلومات چاہیے۔",
    status_pending: "زیرِ غور", status_arranged: "انتظام ہو گیا",
    status_fulfilled: "مکمل", status_cancelled: "منسوخ",
    toast_auth_setup: "Supabase سیٹ اپ مکمل نہیں ہے — پہلے supabase-config.js بھریں۔",
    toast_donors_fail: "ڈونرز لوڈ نہیں ہو سکے — کیا آپ سائن ان ہیں؟",
    toast_reqs_fail: "درخواستیں لوڈ نہیں ہو سکیں — کیا آپ سائن ان ہیں؟",
    toast_donated_fail: "عطیہ درج نہیں ہو سکا۔",
    toast_donated_ok: "عطیہ درج ہو گیا — {name} ({count} بار)۔",
    toast_del_donor_fail: "حذف نہیں ہو سکا۔",
    toast_del_donor_ok: "ڈونر حذف ہو گیا۔",
    toast_status_fail: "حالت اپ ڈیٹ نہیں ہو سکی۔",
    toast_status_ok: "حالت اپ ڈیٹ ہو گئی۔",
    toast_report_fail: "رپورٹ کھول نہیں سکی — دوبارہ کوشش کریں۔",
    toast_del_req_fail: "حذف نہیں ہو سکا۔",
    toast_del_req_ok: "درخواست حذف ہو گئی۔",
    confirm_donated: "{name} کا آج کا عطیہ درج کریں؟",
    confirm_del_donor: "{name} کو حذف کریں؟ یہ واپس نہیں ہوگا۔",
    confirm_del_req: "{name} کی درخواست حذف کریں؟ یہ واپس نہیں ہوگا۔",
    wa_admin_donor: "السلام علیکم {name}! میں المصباح / المصطفیٰ بلڈ ڈونیشن ٹیم سے ہوں۔ آپ کے بلڈ گروپ ({group}) کی ضرورت ہے — کیا آپ خون دے سکتے ہیں؟",
    wa_admin_req: "السلام علیکم! آپ کی خون کی درخواست ({group}، {cc}، {patient}) مل گئی ہے۔ ٹیم انتظام کر رہی ہے۔",
    cc_units: "یونٹ"
  },
  en: {
    brand_name: "Al Misbah & Al Mustafa Blood Donation",
    brand_sub: "Sakhi Sarwar, District Dera Ghazi Khan — Serving humanity",
    admin_brand: "Admin Panel",
    admin_brand_sub: "Al Misbah Medical Team and Al Mustafa Blood Donation Group",
    nav_home: "Home", nav_register: "Become a donor", nav_need: "Need blood", nav_admin: "Admin",
    title_home: "Al Misbah & Al Mustafa — Blood Donation, Sakhi Sarwar",
    title_register: "Become a Donor — Al Misbah & Al Mustafa Blood Donation",
    title_need: "Need Blood — Al Misbah & Al Mustafa Blood Donation",
    title_admin: "Admin Panel — Al Misbah & Al Mustafa Blood Donation",
    footer_home: "Al Misbah Medical Team and Al Mustafa Blood Donation Group — Sakhi Sarwar, Dera Ghazi Khan<br>Serving humanity — for the pleasure of Allah",
    footer_short: "Al Misbah Medical Team and Al Mustafa Blood Donation Group — Sakhi Sarwar, Dera Ghazi Khan",
    notice_home: "<b>Important:</b> This website does not collect blood, charge any fee, or trade blood. It only connects patients with donors. Blood is collected and tested only at a licensed lab or blood bank.",
    config_warn: "Note: The website setup is not complete yet (Supabase details still need to be filled in supabase-config.js). The form will still reach the team via WhatsApp.",
    all_groups: "— All groups —", all_cities: "— All cities —",
    pick_city: "— Select city —", pick_group: "— Select blood group —",
    city_sakhi: "Sakhi Sarwar", city_dgk: "Dera Ghazi Khan", city_taunsa: "Taunsa",
    city_kotchutta: "Kot Chutta", city_jampur: "Jampur", city_rajanpur: "Rajanpur",
    city_multan: "Multan", city_other: "Other",
    hero_h1: "Donate Blood, Save a Life",
    hero_badge: "✦ Sakhi Sarwar & Dera Ghazi Khan ✦",
    hero_p: "We are volunteers from Sakhi Sarwar and Dera Ghazi Khan. Our goal is that any patient who needs blood finds a donor in time. Your one donation can save a life.",
    hero_cta_donor: "Become a donor", hero_cta_need: "Need blood",
    marquee: "Donate blood ✦ Save a life ✦ One donation, one life ✦ Serving humanity ✦&nbsp;",
    trust1: "✓ Free service — no fee",
    trust2: "✓ Blood only from a licensed lab",
    trust3: "✓ Donor's phone number stays private",
    teams_h2: "Our teams",
    team1_name: "Al Misbah Medical Team",
    team1_desc: "A volunteer team in Sakhi Sarwar that helps patients and arranges blood.",
    team2_name: "Al Mustafa Blood Donation Group",
    team2_desc: "A volunteer group in Sakhi Sarwar that arranges blood donations. Both teams work together as one.",
    how_h2: "How it works",
    step1: "<b>Register or search:</b> Register to donate blood, or find a donor for your group below.",
    step2: "<b>The team will contact you:</b> The patient shares their HB report and blood group with the team; the team arranges however many cc of blood are needed. Contact is made via WhatsApp.",
    step3: "<b>Blood only from a licensed lab:</b> Blood is collected, tested and transfused only at a hospital or licensed lab / blood bank.",
    elig_h2: "Who can donate blood?",
    elig_p: "Age 18 to 60, weight at least 50 kg, last donation at least 3 months ago, and no hepatitis B or C. The lab always checks your health before a donation.",
    elig_cta: "Become a donor now",
    search_h2: "Find a donor",
    search_hint: "Privacy: Only the name, city, blood group and last donation date are shown here. Phone numbers are never shown publicly — the team connects you with the donor.",
    pill_all: "All",
    lbl_group: "Blood group", lbl_city: "City",
    search_btn: "Search",
    results_empty: "No donor for this group / city is registered yet. Please contact the team or check again later.",
    donor_last: "Last donation: ", donor_first: "Ready to donate for the first time",
    donor_contact: "Ask the team to connect you — phone numbers are not shown here.",
    toast_list_setup: "The donor list is still being set up — please contact the team on WhatsApp.",
    toast_list_fail: "The donor list could not be loaded — please try again later.",
    reg_h2: "Register as a donor",
    reg_intro: "Your details will be saved so the team can contact you when blood of your group is needed.",
    reg_privacy: "Privacy: Your phone number will never be shown publicly on the website — only the team (admin panel) will see it.",
    lbl_name: "Name", ph_name: "Enter your name",
    lbl_phone: "Phone / WhatsApp number", ph_phone: "e.g. 03001234567",
    phone_hint: "Your number is visible only to the team, not the public.",
    lbl_age: "Age", ph_age: "e.g. 25",
    lbl_last: "When did you last donate blood?",
    last_hint: "Leave empty if you have never donated. There should be at least 3 months between two donations.",
    consent: "I willingly share my name, city, blood group and phone number with the team so they can contact me when needed.",
    reg_submit: "Register",
    reg_notice: "<b>Important:</b> Blood is collected and tested only at a licensed lab or blood bank. Your health will be checked before donation.",
    toast_reg_fail: "Registration could not be saved — please contact the team directly on WhatsApp.",
    reg_ok_saved: "<b>Thank you, {name}!</b> Your details have been saved and sent to the team on WhatsApp. The team will contact you soon.",
    reg_ok_nosave: "<b>Thank you, {name}!</b> Your details have been sent to the team on WhatsApp. The team will contact you soon.",
    wa_reg_greeting: "Hello! I would like to donate blood.",
    wa_name: "Name: ", wa_city: "City: ", wa_group: "Blood group: ", wa_age: "Age: ",
    wa_phone: "Phone: ", wa_last: "Last donation: ", wa_never: "Never donated",
    need_h2: "Blood request",
    need_intro: "Share the patient's HB report and blood group — the team will arrange however many cc of blood are needed.",
    need_report_note: "<b>About the report:</b> Your uploaded report will be saved in the team's admin panel, where the team can view / download it. A file cannot be sent automatically with a WhatsApp link — so uploading the report here is essential.",
    lbl_patient: "Patient's name", ph_patient: "Patient's name",
    lbl_hospital: "Hospital", ph_hospital: "e.g. Haider Medicare Hospital, Sakhi Sarwar",
    lbl_group_need: "Which blood group is needed?",
    lbl_cc: "How much blood is needed (cc)?",
    cc_hint: "Enter the cc the doctor told you — e.g. 400cc (1 unit) or 700cc (approx. 2 units). 1 unit ≈ 400cc.",
    lbl_report: "HB report (photo or PDF)",
    report_hint: "Upload a clear photo or PDF of the report (max 5 MB).",
    lbl_req_phone: "Contact number (requester)",
    need_submit: "Send request",
    need_notice: "<b>Important:</b> Blood is collected and tested only at a licensed lab or blood bank. This website does not collect blood and charges no fee.",
    toast_no_file: "Please upload the HB report.",
    toast_big_file: "The report is larger than 5 MB — please upload a smaller file.",
    toast_cc_range: "Please enter the amount of blood in cc (50 to 5000).",
    toast_setup_wa: "Setup is not complete — please send the report directly on WhatsApp.",
    toast_up_fail: "The report could not be uploaded — check your internet and try again.",
    toast_save_fail: "The request could not be saved — please try again.",
    need_success: "<b>Thank you!</b> Your request and HB report have been saved and the team has been notified on WhatsApp. The team will contact you soon.",
    wa_need_greeting: "Hello! Blood is needed for a patient.",
    wa_patient: "Patient: ", wa_hospital: "Hospital: ", wa_blood: "Blood: ",
    wa_approx: "approx.", wa_units: "units", wa_contact: "Contact: ",
    wa_report_link: "HB report: ", wa_report_7d: "(This link works for 7 days.)",
    wa_report_admin: "I have uploaded the HB report — please check it in the admin panel.",
    wa_report_sep: "I will send the HB report separately on WhatsApp.",
    gate_h2: "Admin login",
    gate_hint: "This page is only for the team's responsible person.",
    lbl_pass: "Password", ph_gate_pass: "Admin password",
    gate_open: "Open", gate_error: "Wrong password.",
    auth_h2: "Supabase admin sign-in",
    auth_hint: "Donors' phone numbers and reports are visible only to a signed-in admin. This email / password is the one created for the admin user in Supabase Dashboard → Authentication (details in the README).",
    lbl_email: "Email", ph_auth_pass: "Supabase admin password",
    auth_signin: "Sign in", auth_error: "Sign-in failed — check your email / password.",
    donors_h2: "Registered donors",
    lbl_search: "Search (name / phone / city)", ph_search: "e.g. Shafi, 0336…, Sakhi Sarwar",
    refresh: "Refresh",
    th_name: "Name", th_group: "Group", th_city: "City", th_age: "Age",
    th_last: "Last donation", th_days: "Days since", th_donations: "Donations", th_phone: "Phone",
    donor_empty: "No donor found.",
    reqs_h2: "Blood requests",
    th_patient: "Patient", th_hospital: "Hospital", th_blood_cc: "Blood (cc)",
    th_status: "Status", th_report: "Report", th_report_btn: "View report",
    req_empty: "No requests yet.",
    signout: "Sign out",
    admin_footer: "This panel is only for the team's responsible person — never share donors' details with anyone.",
    btn_whatsapp: "WhatsApp", btn_donated: "Record donation", btn_delete: "Delete",
    wa_cta: "Contact the team instantly on WhatsApp",
    wa_hello: "Hello! I need information about blood donation.",
    status_pending: "Pending", status_arranged: "Arranged",
    status_fulfilled: "Fulfilled", status_cancelled: "Cancelled",
    toast_auth_setup: "Supabase setup is not complete — fill in supabase-config.js first.",
    toast_donors_fail: "Donors could not be loaded — are you signed in?",
    toast_reqs_fail: "Requests could not be loaded — are you signed in?",
    toast_donated_fail: "Donation could not be recorded.",
    toast_donated_ok: "Donation recorded — {name} ({count} times).",
    toast_del_donor_fail: "Could not delete.",
    toast_del_donor_ok: "Donor deleted.",
    toast_status_fail: "Status could not be updated.",
    toast_status_ok: "Status updated.",
    toast_report_fail: "The report could not be opened — please try again.",
    toast_del_req_fail: "Could not delete.",
    toast_del_req_ok: "Request deleted.",
    confirm_donated: "Record today's donation for {name}?",
    confirm_del_donor: "Delete {name}? This cannot be undone.",
    confirm_del_req: "Delete {name}'s request? This cannot be undone.",
    wa_admin_donor: "Hello {name}! I am from the Al Misbah / Al Mustafa Blood Donation team. We need your blood group ({group}) — can you donate blood?",
    wa_admin_req: "Hello! We received your blood request ({group}, {cc}, {patient}). The team is arranging it.",
    cc_units: "units"
  }
};

var LANG_KEY = "blood-lang";

function getLang() {
  try {
    var q = new URLSearchParams(window.location.search).get("lang");
    if (q === "en" || q === "ur") { try { localStorage.setItem(LANG_KEY, q); } catch (e) {} return q; }
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "ur") return saved;
  } catch (e) {}
  return "ur";
}

var CURRENT_LANG = getLang();

function t(key, vars) {
  var dict = I18N[CURRENT_LANG] || I18N.ur;
  var s = dict[key];
  if (s == null) s = (I18N.ur[key] != null ? I18N.ur[key] : key);
  if (vars) {
    Object.keys(vars).forEach(function (k) {
      s = s.split("{" + k + "}").join(String(vars[k]));
    });
  }
  return s;
}

function applyI18n() {
  var lang = CURRENT_LANG;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  document.body.classList.toggle("lang-en", lang === "en");
  document.body.classList.toggle("lang-ur", lang === "ur");
  var page = document.body.getAttribute("data-page");
  if (page) document.title = t("title_" + page);
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
  var toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.textContent = lang === "ur" ? "English" : "اردو";
}

function setLang(lang) {
  if (lang !== "en" && lang !== "ur") return;
  CURRENT_LANG = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  applyI18n();
  // Re-render any page content built by JS (search results, tables, selects)
  if (typeof window.__onLangChange === "function") window.__onLangChange();
}

document.addEventListener("DOMContentLoaded", function () {
  applyI18n();
  var toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      setLang(CURRENT_LANG === "ur" ? "en" : "ur");
    });
  }
});
