// Admin panel — password gate, then Supabase Auth, then donor/request lists
// Phone numbers and reports are visible ONLY after sign-in (RLS: authenticated role).
(function () {
  fillGroupSelect($("d-group"), "— تمام گروپ —", true);
  fillCitySelect($("d-city"), "— تمام شہر —");
  $("config-note").innerHTML = configWarningBox();

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  // ---- Donors ----
  async function loadDonors() {
    var q = supabaseClient.from("donors").select("*").order("created_at", { ascending: false });
    if ($("d-group").value) q = q.eq("blood_group", $("d-group").value);
    if ($("d-city").value) q = q.eq("city", $("d-city").value);
    var res = await q.limit(200);
    var tbody = $("donor-rows");
    tbody.innerHTML = "";
    if (res.error) {
      console.error(res.error);
      showToast("ڈونرز لوڈ نہیں ہو سکے — کیا آپ سائن ان ہیں؟");
      return;
    }
    $("donor-count").textContent = "(" + res.data.length + ")";
    $("donor-empty").style.display = res.data.length ? "none" : "block";
    res.data.forEach(function (d) {
      var tr = document.createElement("tr");
      var wa = waLink(d.phone,
        "السلام علیکم " + d.name + "! میں المصباح / المصطفیٰ بلڈ ڈونیشن ٹیم سے ہوں۔ " +
        "آپ کے بلڈ گروپ (" + d.blood_group + ") کی ضرورت ہے — کیا آپ خون دے سکتے ہیں؟");
      tr.innerHTML =
        "<td>" + esc(d.name) + "</td>" +
        "<td><b>" + esc(d.blood_group) + "</b></td>" +
        "<td>" + esc(d.city) + "</td>" +
        "<td>" + esc(d.age) + "</td>" +
        "<td>" + esc(d.last_donation_date || "—") + "</td>" +
        "<td dir=\"ltr\">" + esc(d.phone) + "</td>" +
        "<td><a class=\"btn small green\" href=\"" + wa + "\" target=\"_blank\">WhatsApp</a></td>";
      tbody.appendChild(tr);
    });
  }

  // ---- Requests ----
  async function loadRequests() {
    var res = await supabaseClient.from("blood_requests")
      .select("*").order("created_at", { ascending: false }).limit(200);
    var tbody = $("req-rows");
    tbody.innerHTML = "";
    if (res.error) {
      console.error(res.error);
      showToast("درخواستیں لوڈ نہیں ہو سکیں — کیا آپ سائن ان ہیں؟");
      return;
    }
    $("req-count").textContent = "(" + res.data.length + ")";
    $("req-empty").style.display = res.data.length ? "none" : "block";
    res.data.forEach(function (r) {
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
        "<td><a class=\"btn small green\" href=\"" + wa + "\" target=\"_blank\">WhatsApp</a></td>";
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
  }

  function statusLabel(s) {
    return { pending: "زیرِ غور", arranged: "انتظام ہو گیا", fulfilled: "مکمل", cancelled: "منسوخ" }[s] || s;
  }

  $("refresh-donors").addEventListener("click", loadDonors);
  $("refresh-reqs").addEventListener("click", loadRequests);
  $("d-group").addEventListener("change", loadDonors);
  $("d-city").addEventListener("change", loadDonors);
})();
