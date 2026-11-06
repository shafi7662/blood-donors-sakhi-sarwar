// ============================================================
//  Shared helpers — har page par use hotay hain
// ============================================================

function $(id) { return document.getElementById(id); }

function showToast(msg) {
  var t = $("toast");
  if (!t) { alert(msg); return; }
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(function () { t.style.display = "none"; }, 4000);
}

// Pakistani number → wa.me format (0300... → 92...)
function cleanPhone(p) {
  var d = String(p || "").replace(/\D/g, "");
  if (d.indexOf("92") === 0) return d;
  if (d.charAt(0) === "0") return "92" + d.slice(1);
  return d;
}

function waLink(phone, text) {
  return "https://wa.me/" + cleanPhone(phone) + "?text=" + encodeURIComponent(text);
}

function teamWhatsAppConfigured() {
  var n = String(SUPABASE_CONFIG.TEAM_WHATSAPP || "").replace(/\D/g, "");
  return n.length >= 10;
}

// Config na mukammal ho to user ko saaf batao (khamoshi se fail na ho)
function configWarningBox() {
  if (SUPABASE_READY) return "";
  return '<div class="notice">نوٹ: ویب سائٹ کی سیٹ اپ ابھی مکمل نہیں ہوئی ' +
    "(Supabase کی تفصیل supabase-config.js میں بھرنا باقی ہے)۔ " +
    "فارم پھر بھی WhatsApp کے ذریعے ٹیم تک پہنچ جائے گا۔</div>";
}

var CITIES = [
  "سخی سرور",
  "ڈیرہ غازی خان",
  "تونسہ",
  "کوٹ چھٹہ",
  "جام پور",
  "راجن پور",
  "ملتان",
  "دیگر"
];

var BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function fillCitySelect(selectEl, placeholder) {
  selectEl.innerHTML = "";
  var opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = placeholder || "— شہر منتخب کریں —";
  selectEl.appendChild(opt0);
  CITIES.forEach(function (c) {
    var o = document.createElement("option");
    o.value = c; o.textContent = c;
    selectEl.appendChild(o);
  });
}

function fillGroupSelect(selectEl, placeholder, allLabel) {
  selectEl.innerHTML = "";
  var opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = placeholder || (allLabel ? "— تمام گروپ —" : "— گروپ منتخب کریں —");
  selectEl.appendChild(opt0);
  BLOOD_GROUPS.forEach(function (g) {
    var o = document.createElement("option");
    o.value = g; o.textContent = g;
    selectEl.appendChild(o);
  });
}
