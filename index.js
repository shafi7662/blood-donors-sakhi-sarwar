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
  };

  search();
})();
