// ============================================================
//  Blood Donor Website — Sakhi Sarwar
//  SUPABASE CONFIG — ایک ہی فائل میں تمام سیٹنگز
//  TODO والی ہر لائن میں اصل ویلیو بھرنا لازمی ہے،
//  ورنہ ویب سائٹ ڈیمو حالت میں رہے گی (ڈیٹا سیو نہیں ہوگا)۔
// ============================================================

const SUPABASE_CONFIG = {
  // TODO: Supabase Dashboard → Settings → API → Project URL
  // مثال: "https://abcdefghijklm.supabase.co"
  SUPABASE_URL: "https://kzdicpnccahtapxjsmog.supabase.co",

  // TODO: Supabase Dashboard → Settings → API → anon public key
  // یہ "public" key ہے — اسے براؤزر میں رکھنا محفوظ ہے۔
  // service_role key یہاں کبھی نہ لکھیں!
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZGljcG5jY2FodGFweGpzbW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NDE5OTYsImV4cCI6MjEwOTUxNzk5Nn0.WKAOmKa9fC11Qnnp-NLzanx3euwRfl2he4t1lu5pqyA",

  // ٹیم کا WhatsApp نمبر — بغیر + کے، ملک کے کوڈ کے ساتھ
  // فی الحال مالک (شفیع) کا اپنا نمبر ہے — تمام ٹیسٹ اور درخواستیں
  // اسی نمبر پر جائیں گی۔ جب دونوں ٹیمیں سائٹ پسند کر لیں تو
  // یہاں صرف یہ ایک لائن بدل کر ان کا نمبر لگا دیں —
  // نمبر صرف اسی جگہ رکھا گیا ہے، باقی سائٹ اسی کو پڑھتی ہے۔
  TEAM_WHATSAPP: "923367050512",

  // پینل کا اپنا لاگ ان پاس ورڈ — اور اسی پاس ورڈ سے پینل Supabase میں
  // خودبخود سائن ان ہوتا ہے (ADMIN_EMAIL والا اکاؤنٹ) تاکہ ڈونر ڈیٹا کھل سکے۔
  // نوٹ: یہ پاس ورڈ بدلنا ہو تو Supabase Dashboard → Authentication میں
  // اسی اکاؤنٹ کا پاس ورڈ بھی ویسا ہی بدلنا ہوگا، ورنہ پینل ڈیٹا نہیں کھولے گا۔
  // یہ صرف ایک ہلکی سی رکاوٹ ہے — اصل حفاظت RLS پالیسیز سے ہے۔
  ADMIN_EMAIL: "alshafibloodbank@gmail.com",
  ADMIN_PASSWORD: "BloodAdmin@2026"
};

// ---- Supabase client (اگر config مکمل ہو تو) ----
const SUPABASE_READY =
  typeof SUPABASE_CONFIG.SUPABASE_URL === "string" &&
  SUPABASE_CONFIG.SUPABASE_URL.indexOf("https://") === 0 &&
  SUPABASE_CONFIG.SUPABASE_URL.indexOf("YOUR-PROJECT-REF") === -1 &&
  SUPABASE_CONFIG.SUPABASE_ANON_KEY !== "YOUR-ANON-KEY";

let supabaseClient = null;
if (SUPABASE_READY && typeof supabase !== "undefined") {
  supabaseClient = supabase.createClient(
    SUPABASE_CONFIG.SUPABASE_URL,
    SUPABASE_CONFIG.SUPABASE_ANON_KEY
  );
}

// ---- Site settings (admin panel se badli ja sakti hain) ----
// team_whatsapp: DB ki site_settings table se aata hai; na mile (table
// na ho / net na ho) to upar wala TEAM_WHATSAPP (fallback) chalta hai.
// Har page load par fetch hota hai, aur wa.me links usi ko parhte hain.
async function loadSiteSettings() {
  if (!supabaseClient) return;
  try {
    var res = await supabaseClient.from("site_settings")
      .select("key,value").eq("key", "team_whatsapp").maybeSingle();
    if (res && !res.error && res.data && res.data.value) {
      var v = String(res.data.value).replace(/\D/g, "");
      if (v.length >= 10) SUPABASE_CONFIG.TEAM_WHATSAPP = v;
    }
  } catch (e) { /* fallback number rehta hai */ }
}
var siteSettingsReady = loadSiteSettings();
