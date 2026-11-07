// Admin panel — ONE login: the panel's own password (the gate).
// Behind it, the panel signs in to Supabase automatically with the panel's
// service account (same password — see ADMIN_EMAIL / ADMIN_PASSWORD in
// supabase-config.js). No second login is ever shown.
// Phone numbers and reports are visible ONLY after that sign-in (RLS: authenticated role).
// v8 (2026-11-07): gate restored, Supabase form removed, add-admin form removed
// (with one shared password, "making an admin" just means sharing the password).
// v2: search + blood-group filter, per-donor stats (last donation, days since, count),
// "record donation" button, and delete buttons (RLS delete policies for authenticated).
(function () {
  function fillAdminSelects() {
    var dg = $("d-group").value, rg = $("r-group").value, dc = $("d-city").value, ug = $("upd-group").value;
    fillGroupSelect($("d-group"), t("all_groups"), true);
    fillGroupSelect($("r-group"), t("all_groups"), true);
    fillCitySelect($("d-city"), t("all_cities"));
    fillGroupSelect($("upd-group"), t("pick_group"));
    $("d-group").value = dg; $("r-group").value = rg; $("d-city").value = dc; $("upd-group").value = ug;
  }
  fillAdminSelects();

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

  // ---- The panel's own login: one password ----
  // Behind the gate, the panel signs in to Supabase automatically with the
  // panel's service account (same password). The user never sees a second login.
  $("gate-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    if ($("gate-pass").value !== SUPABASE_CONFIG.ADMIN_PASSWORD) {
      $("gate-error").style.display = "block";
      return;
    }
    $("gate-error").style.display = "none";
    if (!SUPABASE_READY || !supabaseClient) {
      showToast(t("toast_auth_setup"));
      return;
    }
    var s = await supabaseClient.auth.getSession();
    if (!s.data || !s.data.session) {
      var res = await supabaseClient.auth.signInWithPassword({
        email: SUPABASE_CONFIG.ADMIN_EMAIL,
        password: SUPABASE_CONFIG.ADMIN_PASSWORD
      });
      if (res.error) {
        console.error(res.error);
        showToast(t("auth_error"));
        return;
      }
    }
    $("gate-box").style.display = "none";
    $("data-box").style.display = "block";
    loadDonors();
    loadRequests();
    loadUpdates();
  });

  $("signout-btn").addEventListener("click", async function () {
    if (supabaseClient) await supabaseClient.auth.signOut();
    location.reload();
  });

  // Language switched: refill translated selects and re-render cached tables
  window.__onLangChange = function () {
    fillAdminSelects();
    renderDonors();
    renderRequests();
    renderUpdates();
  };

  // ---- Donors: fetch once, filter locally ----
  async function loadDonors() {
    var res = await supabaseClient.from("donors").select("*").order("created_at", { ascending: false }).limit(200);
    if (res.error) {
      console.error(res.error);
      showToast(t("toast_donors_fail"));
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
      var wa = waLink(d.phone, t("wa_admin_donor", { name: d.name, group: d.blood_group }));
      var count = d.donation_count == null ? 0 : d.donation_count;
      tr.innerHTML =
        "<td>" + esc(d.name) + "</td>" +
        "<td><b>" + esc(d.blood_group) + "</b></td>" +
        "<td>" + esc(cityLabel(d.city)) + "</td>" +
        "<td>" + esc(d.age) + "</td>" +
        "<td>" + esc(d.last_donation_date || "—") + "</td>" +
        "<td>" + daysSince(d.last_donation_date) + "</td>" +
        "<td><b>" + count + "</b></td>" +
        "<td dir=\"ltr\">" + esc(d.phone) + "</td>" +
        "<td style=\"white-space:nowrap\">" +
          "<a class=\"btn small green\" href=\"" + wa + "\" target=\"_blank\">" + esc(t("btn_whatsapp")) + "</a> " +
          "<button class=\"btn small\" type=\"button\" data-donated=\"" + d.id + "\" data-name=\"" + esc(d.name) + "\">" + esc(t("btn_donated")) + "</button> " +
          "<button class=\"btn small danger\" type=\"button\" data-del-donor=\"" + d.id + "\" data-name=\"" + esc(d.name) + "\">" + esc(t("btn_delete")) + "</button>" +
        "</td>";
      tbody.appendChild(tr);
    });

    // record a donation: count +1, last donation = today
    tbody.querySelectorAll("[data-donated]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        var donor = allDonors.find(function (x) { return x.id === btnEl.dataset.donated; });
        if (!donor) return;
        if (!confirm(t("confirm_donated", { name: donor.name }))) return;
        var upd = await supabaseClient.from("donors").update({
          donation_count: (donor.donation_count || 0) + 1,
          last_donation_date: todayStr()
        }).eq("id", donor.id);
        if (upd.error) { console.error(upd.error); showToast(t("toast_donated_fail")); }
        else { showToast(t("toast_donated_ok", { name: donor.name, count: (donor.donation_count || 0) + 1 })); loadDonors(); }
      });
    });

    // delete a donor (with confirm — cannot be undone)
    tbody.querySelectorAll("[data-del-donor]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        if (!confirm(t("confirm_del_donor", { name: btnEl.dataset.name }))) return;
        var del = await supabaseClient.from("donors").delete().eq("id", btnEl.dataset.delDonor);
        if (del.error) { console.error(del.error); showToast(t("toast_del_donor_fail")); }
        else { showToast(t("toast_del_donor_ok")); loadDonors(); }
      });
    });
  }

  // ---- Requests: fetch once, filter by group locally ----
  async function loadRequests() {
    var res = await supabaseClient.from("blood_requests")
      .select("*").order("created_at", { ascending: false }).limit(200);
    if (res.error) {
      console.error(res.error);
      showToast(t("toast_reqs_fail"));
      return;
    }
    allRequests = res.data;
    renderRequests();
  }

  // cc (1 یونٹ ≈ 400cc) — پرانی قطاروں میں صرف units_needed ہو تو اس سے حساب
  function ccOf(r) {
    if (r.cc_needed) return r.cc_needed;
    if (r.units_needed) return r.units_needed * 400;
    return null;
  }
  function ccText(r) {
    var cc = ccOf(r);
    if (!cc) return "—";
    return cc + " cc (~" + Math.ceil(cc / 400) + " " + t("cc_units") + ")";
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
        t("wa_admin_req", { group: r.blood_group, cc: ccText(r), patient: r.patient_name }));
      var statusBadge = r.status === "fulfilled"
        ? '<span class="badge done">' + esc(t("status_fulfilled")) + "</span>"
        : '<span class="badge">' + esc(statusLabel(r.status)) + "</span>";
      tr.innerHTML =
        "<td>" + esc(r.patient_name) + "</td>" +
        "<td>" + esc(r.hospital) + (CURRENT_LANG === "ur" ? "، " : ", ") + esc(cityLabel(r.city)) + "</td>" +
        "<td><b>" + esc(r.blood_group) + "</b></td>" +
        "<td><b>" + esc(ccText(r)) + "</b></td>" +
        "<td>" + statusBadge + "<br>" +
          "<select data-req=\"" + r.id + "\" class=\"status-sel\">" +
            ["pending", "arranged", "fulfilled", "cancelled"].map(function (s) {
              return "<option value=\"" + s + "\"" + (s === r.status ? " selected" : "") + ">" + statusLabel(s) + "</option>";
            }).join("") +
          "</select></td>" +
        "<td>" + (r.report_path
          ? "<button class=\"btn small\" type=\"button\" data-report=\"" + esc(r.report_path) + "\">" + esc(t("th_report_btn")) + "</button>"
          : "—") + "</td>" +
        "<td dir=\"ltr\">" + esc(r.requester_phone) + "</td>" +
        "<td style=\"white-space:nowrap\">" +
          "<a class=\"btn small green\" href=\"" + wa + "\" target=\"_blank\">" + esc(t("btn_whatsapp")) + "</a> " +
          "<button class=\"btn small danger\" type=\"button\" data-del-req=\"" + r.id + "\" data-name=\"" + esc(r.patient_name) + "\">" + esc(t("btn_delete")) + "</button>" +
        "</td>";
      tbody.appendChild(tr);
    });

    // status changes
    tbody.querySelectorAll(".status-sel").forEach(function (sel) {
      sel.addEventListener("change", async function () {
        var upd = await supabaseClient.from("blood_requests")
          .update({ status: sel.value }).eq("id", sel.dataset.req);
        if (upd.error) { console.error(upd.error); showToast(t("toast_status_fail")); }
        else { showToast(t("toast_status_ok")); loadRequests(); }
      });
    });

    // report downloads (1-hour signed URL — bucket is private)
    tbody.querySelectorAll("[data-report]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        var s = await supabaseClient.storage.from("blood-reports")
          .createSignedUrl(btnEl.dataset.report, 3600);
        if (s.error || !s.data) {
          console.error(s.error);
          showToast(t("toast_report_fail"));
          return;
        }
        window.open(s.data.signedUrl, "_blank");
      });
    });

    // delete a request (with confirm — cannot be undone)
    tbody.querySelectorAll("[data-del-req]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        if (!confirm(t("confirm_del_req", { name: btnEl.dataset.name }))) return;
        var del = await supabaseClient.from("blood_requests").delete().eq("id", btnEl.dataset.delReq);
        if (del.error) { console.error(del.error); showToast(t("toast_del_req_fail")); }
        else { showToast(t("toast_del_req_ok")); loadRequests(); }
      });
    });
  }

  // ---- Updates: photo + story of patients who received blood ----
  var allUpdates = [];

  async function loadUpdates() {
    var res = await supabaseClient.from("updates")
      .select("*").order("created_at", { ascending: false }).limit(200);
    if (res.error) {
      console.error(res.error);
      showToast(t("toast_upd_load_fail"));
      return;
    }
    allUpdates = res.data;
    renderUpdates();
  }

  function renderUpdates() {
    var tbody = $("upd-rows");
    tbody.innerHTML = "";
    $("upd-count").textContent = "(" + allUpdates.length + ")";
    $("upd-empty").style.display = allUpdates.length ? "none" : "block";
    allUpdates.forEach(function (u) {
      var tr = document.createElement("tr");
      var thumb = u.photo_url
        ? '<img class="upd-thumb" src="' + esc(u.photo_url) + '" alt="' + esc(u.patient_name) + '" loading="lazy">'
        : "—";
      tr.innerHTML =
        "<td>" + thumb + "</td>" +
        "<td>" + esc(u.patient_name) + "</td>" +
        "<td><b>" + esc(u.blood_group || "—") + "</b></td>" +
        "<td>" + esc(u.hospital || "—") + "</td>" +
        "<td>" + esc(fmtDate(u.created_at)) + "</td>" +
        "<td style=\"white-space:nowrap\">" +
          "<button class=\"btn small danger\" type=\"button\" data-del-upd=\"" + u.id + "\" data-name=\"" + esc(u.patient_name) + "\" data-photo=\"" + esc(u.photo_path || "") + "\">" + esc(t("btn_delete")) + "</button>" +
        "</td>";
      tbody.appendChild(tr);
    });

    // delete an update: row first, then try to remove the photo file
    tbody.querySelectorAll("[data-del-upd]").forEach(function (btnEl) {
      btnEl.addEventListener("click", async function () {
        if (!confirm(t("confirm_del_upd", { name: btnEl.dataset.name }))) return;
        var del = await supabaseClient.from("updates").delete().eq("id", btnEl.dataset.delUpd);
        if (del.error) {
          console.error(del.error);
          showToast(t("toast_upd_del_fail"));
          return;
        }
        // Photo file cleanup — best effort; the row is already gone.
        var photoPath = btnEl.dataset.photo || "";
        if (photoPath) {
          var rm = await supabaseClient.storage.from("donation-updates").remove([photoPath]);
          if (rm.error) {
            console.error(rm.error);
            showToast(t("toast_upd_photo_left"));
          } else {
            showToast(t("toast_upd_del_ok"));
          }
        } else {
          showToast(t("toast_upd_del_ok"));
        }
        loadUpdates();
      });
    });
  }

  // New update: validate → upload photo (public bucket) → insert row
  $("update-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    var btn = $("upd-submit");
    btn.disabled = true;

    var file = $("upd-photo").files[0];
    if (!file) { showToast(t("toast_upd_no_photo")); btn.disabled = false; return; }
    if (["image/jpeg", "image/png", "image/webp"].indexOf(file.type) === -1) {
      showToast(t("toast_upd_bad_type")); btn.disabled = false; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(t("toast_upd_big_file")); btn.disabled = false; return;
    }
    if (!$("upd-consent").checked) {
      showToast(t("toast_upd_no_consent")); btn.disabled = false; return;
    }

    if (!SUPABASE_READY || !supabaseClient) {
      showToast(t("toast_auth_setup")); btn.disabled = false; return;
    }

    // 1) Upload the photo to the public bucket (random id in the path)
    var safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    var rand = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : ("id-" + Date.now() + "-" + Math.floor(Math.random() * 1e9));
    var path = "updates/" + rand + "-" + Date.now() + "-" + safeName;
    var up = await supabaseClient.storage.from("donation-updates").upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (up.error) {
      console.error(up.error);
      showToast(t("toast_upd_fail"));
      btn.disabled = false;
      return;
    }
    var pub = supabaseClient.storage.from("donation-updates").getPublicUrl(path);

    // 2) Save the update row
    var ins = await supabaseClient.from("updates").insert([{
      patient_name: $("upd-name").value.trim(),
      blood_group: $("upd-group").value || null,
      hospital: $("upd-hospital").value.trim() || null,
      story: $("upd-story").value.trim() || null,
      photo_url: pub.data ? pub.data.publicUrl : null,
      photo_path: path
    }]);
    if (ins.error) {
      console.error(ins.error);
      showToast(t("toast_upd_fail"));
      btn.disabled = false;
      return;
    }

    showToast(t("toast_upd_ok"));
    $("update-form").reset();
    btn.disabled = false;
    loadUpdates();
  });

  function statusLabel(s) {
    return { pending: t("status_pending"), arranged: t("status_arranged"), fulfilled: t("status_fulfilled"), cancelled: t("status_cancelled") }[s] || s;
  }

  $("refresh-donors").addEventListener("click", loadDonors);
  $("refresh-reqs").addEventListener("click", loadRequests);
  $("refresh-updates").addEventListener("click", loadUpdates);
  $("d-search").addEventListener("input", renderDonors);
  $("d-group").addEventListener("change", renderDonors);
  $("d-city").addEventListener("change", renderDonors);
  $("r-group").addEventListener("change", renderRequests);
})();
