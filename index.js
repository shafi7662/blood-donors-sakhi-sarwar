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

  function render(donors) {
    lastDonors = donors || [];
    resultsEl.innerHTML = "";
    if (!donors || donors.length === 0) {
      emptyEl.style.display = "block";
      return;
    }
    emptyEl.style.display = "none";
    donors.forEach(function (d) {
      var div = document.createElement("div");
      div.className = "donor";
      div.innerHTML =
        '<span class="group">' + esc(d.blood_group) + "</span> " +
        '<span class="name">' + esc(d.name) + "</span><br>" +
        '<span class="meta">' + esc(cityLabel(d.city)) +
        (d.last_donation_date ? " — " + esc(t("donor_last")) + esc(d.last_donation_date) : " — " + esc(t("donor_first"))) +
        "</span><br>" +
        '<span class="meta">' + esc(t("donor_contact")) + "</span>";
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

  // Language switched: refill translated selects and re-render cached results
  window.__onLangChange = function () {
    fillSelects();
    $("config-note").innerHTML = configWarningBox();
    render(lastDonors);
  };

  search();
})();
