// Home page — public donor search (public_donors view: NO phone numbers)
(function () {
  var groupSel = $("f-group");
  var citySel = $("f-city");
  var resultsEl = $("results");
  var emptyEl = $("results-empty");
  var lastDonors = [];

  function fillSelects() {
    var g = groupSel.value, c = citySel.value;
    fillGroupSelect(groupSel, t("all_groups"), true);
    fillCitySelect(citySel, t("all_cities"));
    groupSel.value = g; citySel.value = c;
  }
  fillSelects();
  $("config-note").innerHTML = configWarningBox();

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Check if 90 days have passed since last_donation_date
  function getEligibilityBadge(lastDateStr) {
    var isEn = document.body.classList.contains("lang-en");
    if (!lastDateStr) {
      return '<span class="status-pill avail">● ' + (isEn ? "Available" : "عطیے کے لیے دستیاب") + '</span>';
    }
    var lastDate = new Date(lastDateStr);
    if (isNaN(lastDate.getTime())) {
      return '<span class="status-pill avail">● ' + (isEn ? "Available" : "عطیے کے لیے دستیاب") + '</span>';
    }
    var now = new Date();
    var diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays >= 90) {
      return '<span class="status-pill avail">● ' + (isEn ? "Available" : "عطیے کے لیے دستیاب") + '</span>';
    } else {
      return '<span class="status-pill rest">⏳ ' + (isEn ? "On Rest (<3m)" : "وقفہ جاری (3 ماہ)") + '</span>';
    }
  }

  function render(donors) {
    lastDonors = donors || [];
    resultsEl.innerHTML = "";
    var emptyWrap = $("results-empty-wrap");
    if (!donors || donors.length === 0) {
      if (emptyWrap) emptyWrap.style.display = "block";
      else emptyEl.style.display = "block";
      return;
    }
    if (emptyWrap) emptyWrap.style.display = "none";
    emptyEl.style.display = "none";

    var isEn = document.body.classList.contains("lang-en");
    var reqBtnLabel = isEn ? "Request via Team" : "ٹیم سے رابطہ کریں";

    donors.forEach(function (d) {
      var div = document.createElement("div");
      div.className = "donor";
      var lastInfo = d.last_donation_date
        ? esc(t("donor_last")) + " " + esc(d.last_donation_date)
        : esc(t("donor_first"));

      div.innerHTML =
        '<div class="donor-top">' +
          '<div class="donor-ident">' +
            '<span class="group">' + esc(d.blood_group) + '</span>' +
            '<div>' +
              '<span class="name">' + esc(d.name) + '</span>' +
              '<span class="city-tag">📍 ' + esc(cityLabel(d.city)) + '</span>' +
            '</div>' +
          '</div>' +
          getEligibilityBadge(d.last_donation_date) +
        '</div>' +
        '<div class="donor-details">' +
          '🗓️ ' + lastInfo +
        '</div>' +
        '<div class="donor-footer">' +
          '<span class="meta">🔒 ' + esc(t("donor_contact")) + '</span>' +
          '<a href="need-blood.html" class="donor-req-link">' + reqBtnLabel + '</a>' +
        '</div>';
      resultsEl.appendChild(div);
    });
  }

  async function search() {
    if (!SUPABASE_READY || !supabaseClient) {
      render([]);
      showToast(t("toast_list_setup"));
      return;
    }
    var q = supabaseClient.from("public_donors").select("*").order("created_at", { ascending: false });
    if (groupSel.value) q = q.eq("blood_group", groupSel.value);
    if (citySel.value) q = q.eq("city", citySel.value);
    var res = await q.limit(100);
    if (res.error) {
      console.error(res.error);
      render([]);
      showToast(t("toast_list_fail"));
      return;
    }
    render(res.data);
  }

  $("search-btn").addEventListener("click", search);
  groupSel.addEventListener("change", search);
  citySel.addEventListener("change", search);

  // Blood-group pills: tap a group → filter + search
  document.querySelectorAll("#groups-row .group-pill").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#groups-row .group-pill").forEach(function (x) {
        x.classList.remove("active");
      });
      b.classList.add("active");
      groupSel.value = b.getAttribute("data-group");
      search();
    });
  });

  // ---- Updates: latest 6 stories of patients who received blood ----
  var lastUpdates = [];

  function renderUpdates(rows) {
    lastUpdates = rows || [];
    var listEl = $("updates-list");
    var emptyEl = $("updates-empty");
    if (!listEl) return;
    listEl.innerHTML = "";
    if (!rows || rows.length === 0) {
      if (emptyEl) emptyEl.style.display = "block";
      return;
    }
    if (emptyEl) emptyEl.style.display = "none";
    var isEn = document.body.classList.contains("lang-en");
    rows.forEach(function (u) {
      var card = document.createElement("article");
      card.className = "update-card";
      var photo = u.photo_url
        ? '<img class="update-photo" src="' + esc(u.photo_url) + '" alt="' + esc(u.patient_name) + '" loading="lazy">'
        : "";
      var meta = [];
      if (u.hospital) meta.push("🏥 " + esc(u.hospital));
      if (u.created_at) meta.push("🗓️ " + esc(fmtDate(u.created_at)));
      card.innerHTML = photo +
        '<div class="update-body">' +
          '<div class="update-top">' +
            '<span class="update-name">' + esc(u.patient_name) + '</span>' +
            (u.blood_group ? '<span class="update-group" dir="ltr">' + esc(u.blood_group) + '</span>' : "") +
          '</div>' +
          (meta.length ? '<div class="update-meta">' + meta.join(isEn ? " · " : " · ") + '</div>' : "") +
          (u.story ? '<p class="update-story">' + esc(u.story) + '</p>' : "") +
          '<div><span class="status-pill avail">' + esc(t("upd_badge")) + '</span></div>' +
        '</div>';
      listEl.appendChild(card);
    });
  }

  async function loadUpdates() {
    if (!SUPABASE_READY || !supabaseClient) { renderUpdates([]); return; }
    var res = await supabaseClient.from("updates")
      .select("*").order("created_at", { ascending: false }).limit(6);
    if (res.error) {
      // Table not created yet (or offline) → clean empty state, no noise
      console.error(res.error);
      renderUpdates([]);
      return;
    }
    renderUpdates(res.data);
  }

  // Home WhatsApp CTA — href comes from the single config number
  var waBtn = $("wa-cta");
  if (waBtn) {
    if (typeof teamWhatsAppConfigured === "function" && teamWhatsAppConfigured()) {
      waBtn.href = waLink(SUPABASE_CONFIG.TEAM_WHATSAPP, t("wa_hello"));
    } else {
      waBtn.style.display = "none";
    }
  }

  // Language switched: refill translated selects and re-render cached results
  window.__onLangChange = function () {
    fillSelects();
    $("config-note").innerHTML = configWarningBox();
    render(lastDonors);
    renderUpdates(lastUpdates);
  };

  search();
  loadUpdates();
})();
