// Admin panel — password gate, then Supabase Auth, then donor/request management
// Phone numbers and reports are visible ONLY after sign-in (RLS: authenticated role).
// v2: search + blood-group filter, per-donor stats (last donation, days since, count),
// "record donation" button, and delete buttons (RLS delete policies for authenticated).
(function () {
  fillGroupSelect($("d-group"), "— تمام گروپ —", true);
  fillGroupSelect($("r-group"), "— تمام گروپ —", true);
  fillCitySelect($("d-city"), "— تمام شہر —");
  $("config-note").innerHTML = configWarningBox();

  var allDonors = [];
  var allRequests = [];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function todayStr() {
    var n = new Date();
    return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0");
  }

  // Days since a date (YYYY-MM-DD); "—" when no date yet
  function daysSince(dateStr) {
    if (!dateStr) return "—";
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return "—";
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var diff = Math.floor((now - d) / 86400000);
    return diff < 0 ? 0 : diff;
  }

  // ---- Step 1: simple gate ----
  $("gate-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if ($("gate-pass").value === SUPABASE_CONFIG.ADMIN_PASSWORD) {
      $("gate-box").style.display = "none";
      $("auth-box").style.display = "block";
      $("gate-error").style.display = "none";
    } else {
      $("gate-error").style.display = "block";
    }
  });

  // ---- Step 2: Supabase Auth ----
  $("auth-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!SUPABASE_READY || !supabaseClient) {
      showToast("Supabase سیٹ اپ مکمل نہیں ہے — پہلے supabase-config.js بھریں۔");
      return;
    }
    var btn = $("auth-btn");
    btn.disabled = true;
    var res = await supabaseClient.auth.signInWithPassword({
      email: $("auth-email").value.trim(),
      password: $("auth-pass").value
    });
    btn.disabled = false;
    if (res.error) {
      console.error(res.error);
      $("auth-error").style.display = "block";
      return;
    }
    $("auth-error").style.display = "none";
    $("auth-box").style.display = "none";
    $("data-box").style.display = "block";
    loadDonors();
    loadRequests();
  });

  $("signout-btn").addEventListener("click", async function () {
    if (supabaseClient) await supabaseClient.auth.signOut();
    location.reload();
  });

  // ---- Donors: fetch once, filter locally ----
  async function loadDonors() {
    var res = await supabaseClient.from("donors").select("*").order("created_at", { ascending: false }).limit(200);
    if (res.error) {
      console.error(res.error);
      showToast("ڈونرز لوڈ نہیں ہو سکے — کیا آپ سائن ان ہیں؟");
      return;
    }
    allDonors = res.data;
    renderDonors();
  }

  function renderDonors() {
    var q = ($("d-search").value || "").trim();
    var group = $("d-group").value;
    var city = $("d-city").value;
    var list = allDonors.filter(function (d) {
      if (group && d.blood_group !== group) return false;
      if (city && d.city !== city) return false;
      if (q) {
        var hay = (d.name + " " + d.phone + " " + d.city).toLowerCase();
        if (hay.indexOf(q.toLowerCase()) === -1) return false;
      }
      return true;
    });
    var tbody = $("donor-rows");
    tbody.innerHTML = "";
    $("donor-count").textContent = "(" + list.length + (list.length !== allDonors.length ? " / " + allDonors.length : "") + ")";
    $("donor-empty").style.display = list.length ? "none" : "block";
    list.forEach(function (d) {
      var tr = document.createElement("tr");
      var wa = waLink(d.phone,
        "السلام علیکم " + d.name + "! میں المصباح / المصطفیٰ بلڈ ڈونیشن ٹیم سے ہوں۔ " +
        "آپ کے بلڈ گروپ (" + d.blood_group + ") کی ضرورت ہے — کیا آپ خون دے سکتے ہیں؟");
      var count = d.donation_count == null ? 0 : d.donation_count;
      tr.innerHTML =
        "<td>" + esc(d.name) + "</td>" +
        "<td><b>" + esc(d.blood_group) + "</b></td>" +
        "<td>" + esc(d.city) + "</td>" +
        "<td>" + esc(d.age) + "</td>" +
        "<td>" + esc(d.last_donation_date || "—") + "</td>" +
        "<td>" + daysSince(d.last_donation_date) + "</td>" +
        "<td><b>" + count + "</b></td>" +
        "<td dir=\"ltr\">" + esc(d.phone) + "</td>" +
        "<td style=\"white-space:nowrap\">" +
          "<a class=\"btn small green\" href=\"" + wa + "\" target=\"_blank\">WhatsApp</a> " +
          "<button class=\"btn small\" type=\"button\" data-donated=\"" + d.id + "\" data-name=\"" + esc(d.name) + "\">عطیہ درج کریں</button> " +
          "<button class=\"btn small danger\" type=\"button\" data-del-donor=\"" + d.id + "\" data-name=\"" + esc(d.name) + "\">حذف کریں</button>" +
        "</td>";
      tbody.appendChild(tr);
    });

    // record a donation: count +1, last donation = today
    tbody.querySelectorAll("[data-donated]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        var donor = allDonors.find(function (x) { return x.id === btnEl.dataset.donated; });
        if (!donor) return;
        if (!confirm(donor.name + " کا آج کا عطیہ درج کریں؟")) return;
        var upd = await supabaseClient.from("donors").update({
          donation_count: (donor.donation_count || 0) + 1,
          last_donation_date: todayStr()
        }).eq("id", donor.id);
        if (upd.error) { console.error(upd.error); showToast("عطیہ درج نہیں ہو سکا۔"); }
        else { showToast("عطیہ درج ہو گیا — " + donor.name + " (" + ((donor.donation_count || 0) + 1) + " بار)۔"); loadDonors(); }
      });
    });

    // delete a donor (with confirm — cannot be undone)
    tbody.querySelectorAll("[data-del-donor]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        if (!confirm(btnEl.dataset.name + " کو حذف کریں؟ یہ واپس نہیں ہوگا۔")) return;
        var del = await supabaseClient.from("donors").delete().eq("id", btnEl.dataset.delDonor);
        if (del.error) { console.error(del.error); showToast("حذف نہیں ہو سکا۔"); }
        else { showToast("ڈونر حذف ہو گیا۔"); loadDonors(); }
      });
    });
  }

  // ---- Requests: fetch once, filter by group locally ----
  async function loadRequests() {
    var res = await supabaseClient.from("blood_requests")
      .select("*").order("created_at", { ascending: false }).limit(200);
    if (res.error) {
      console.error(res.error);
      showToast("درخواستیں لوڈ نہیں ہو سکیں — کیا آپ سائن ان ہیں؟");
      return;
    }
    allRequests = res.data;
    renderRequests();
  }

  function renderRequests() {
    var group = $("r-group").value;
    var list = allRequests.filter(function (r) {
      return !group || r.blood_group === group;
    });
    var tbody = $("req-rows");
    tbody.innerHTML = "";
    $("req-count").textContent = "(" + list.length + (list.length !== allRequests.length ? " / " + allRequests.length : "") + ")";
    $("req-empty").style.display = list.length ? "none" : "block";
    list.forEach(function (r) {
      var tr = document.createElement("tr");
      var wa = waLink(r.requester_phone,
        "السلام علیکم! آپ کی خون کی درخواست (" + r.blood_group + "، " + r.units_needed + " یونٹ، " +
        r.patient_name + ") مل گئی ہے۔ ٹیم انتظام کر رہی ہے۔");
      var statusBadge = r.status === "fulfilled"
        ? '<span class="badge done">مکمل</span>'
        : '<span class="badge">' + esc(statusLabel(r.status)) + "</span>";
      tr.innerHTML =
        "<td>" + esc(r.patient_name) + "</td>" +
        "<td>" + esc(r.hospital) + "، " + esc(r.city) + "</td>" +
        "<td><b>" + esc(r.blood_group) + "</b></td>" +
        "<td>" + esc(r.units_needed) + "</td>" +
        "<td>" + statusBadge + "<br>" +
          "<select data-req=\"" + r.id + "\" class=\"status-sel\">" +
            ["pending", "arranged", "fulfilled", "cancelled"].map(function (s) {
              return "<option value=\"" + s + "\"" + (s === r.status ? " selected" : "") + ">" + statusLabel(s) + "</option>";
            }).join("") +
          "</select></td>" +
        "<td>" + (r.report_path
          ? "<button class=\"btn small\" type=\"button\" data-report=\"" + esc(r.report_path) + "\">رپورٹ دیکھیں</button>"
          : "—") + "</td>" +
        "<td dir=\"ltr\">" + esc(r.requester_phone) + "</td>" +
        "<td style=\"white-space:nowrap\">" +
          "<a class=\"btn small green\" href=\"" + wa + "\" target=\"_blank\">WhatsApp</a> " +
          "<button class=\"btn small danger\" type=\"button\" data-del-req=\"" + r.id + "\" data-name=\"" + esc(r.patient_name) + "\">حذف کریں</button>" +
        "</td>";
      tbody.appendChild(tr);
    });

    // status changes
    tbody.querySelectorAll(".status-sel").forEach(function (sel) {
      sel.addEventListener("change", async function () {
        var upd = await supabaseClient.from("blood_requests")
          .update({ status: sel.value }).eq("id", sel.dataset.req);
        if (upd.error) { console.error(upd.error); showToast("حالت اپ ڈیٹ نہیں ہو سکی۔"); }
        else { showToast("حالت اپ ڈیٹ ہو گئی۔"); loadRequests(); }
      });
    });

    // report downloads (1-hour signed URL — bucket is private)
    tbody.querySelectorAll("[data-report]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        var s = await supabaseClient.storage.from("blood-reports")
          .createSignedUrl(btnEl.dataset.report, 3600);
        if (s.error || !s.data) {
          console.error(s.error);
          showToast("رپورٹ کھول نہیں سکی — دوبارہ کوشش کریں۔");
          return;
        }
        window.open(s.data.signedUrl, "_blank");
      });
    });

    // delete a request (with confirm — cannot be undone)
    tbody.querySelectorAll("[data-del-req]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        if (!confirm(btnEl.dataset.name + " کی درخواست حذف کریں؟ یہ واپس نہیں ہوگا۔")) return;
        var del = await supabaseClient.from("blood_requests").delete().eq("id", btnEl.dataset.delReq);
        if (del.error) { console.error(del.error); showToast("حذف نہیں ہو سکا۔"); }
        else { showToast("درخواست حذف ہو گئی۔"); loadRequests(); }
      });
    });
  }

  function statusLabel(s) {
    return { pending: "زیرِ غور", arranged: "انتظام ہو گیا", fulfilled: "مکمل", cancelled: "منسوخ" }[s] || s;
  }

  $("refresh-donors").addEventListener("click", loadDonors);
  $("refresh-reqs").addEventListener("click", loadRequests);
  $("d-search").addEventListener("input", renderDonors);
  $("d-group").addEventListener("change", renderDonors);
  $("d-city").addEventListener("change", renderDonors);
  $("r-group").addEventListener("change", renderRequests);
})();
