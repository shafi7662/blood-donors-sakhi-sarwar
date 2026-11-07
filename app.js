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

// Header / emergency WhatsApp buttons (class .wa-link) — href comes from the
// single configured number, same pattern as the home wa-cta wiring in index.js.
function wireWhatsAppLinks() {
  var els = document.querySelectorAll(".wa-link");
  if (!els.length) return;
  if (typeof teamWhatsAppConfigured === "function" && teamWhatsAppConfigured()) {
    var href = waLink(SUPABASE_CONFIG.TEAM_WHATSAPP, t("wa_hello"));
    els.forEach(function (el) { el.href = href; });
  } else {
    els.forEach(function (el) { el.style.display = "none"; });
  }
}
document.addEventListener("DOMContentLoaded", wireWhatsAppLinks);

// Config na mukammal ho to user ko saaf batao (khamoshi se fail na ho)
function configWarningBox() {
  if (SUPABASE_READY) return "";
  return '<div class="notice">' + t("config_warn") + "</div>";
}

// Cities: value stays the Urdu name (canonical — stored in the DB),
// display text follows the current language.
var CITIES = [
  { v: "سخی سرور", k: "city_sakhi" },
  { v: "ڈیرہ غازی خان", k: "city_dgk" },
  { v: "تونسہ", k: "city_taunsa" },
  { v: "کوٹ چھٹہ", k: "city_kotchutta" },
  { v: "جام پور", k: "city_jampur" },
  { v: "راجن پور", k: "city_rajanpur" },
  { v: "ملتان", k: "city_multan" },
  { v: "دیگر", k: "city_other" }
];

function cityLabel(urName) {
  for (var i = 0; i < CITIES.length; i++) {
    if (CITIES[i].v === urName) return t(CITIES[i].k);
  }
  return urName;
}

var BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function fillCitySelect(selectEl, placeholder) {
  selectEl.innerHTML = "";
  var opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = placeholder || t("pick_city");
  selectEl.appendChild(opt0);
  CITIES.forEach(function (c) {
    var o = document.createElement("option");
    o.value = c.v; o.textContent = t(c.k);
    selectEl.appendChild(o);
  });
}

function fillGroupSelect(selectEl, placeholder, allLabel) {
  selectEl.innerHTML = "";
  var opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = placeholder || (allLabel ? t("all_groups") : t("pick_group"));
  selectEl.appendChild(opt0);
  BLOOD_GROUPS.forEach(function (g) {
    var o = document.createElement("option");
    o.value = g; o.textContent = g;
    selectEl.appendChild(o);
  });
}
