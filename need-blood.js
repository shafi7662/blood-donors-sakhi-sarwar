// Blood request — upload HB report to storage, save request, WhatsApp the team
// NOTE: a file cannot be auto-attached to a wa.me link, so instead the team's
// WhatsApp message carries a 7-day signed link to the report (private bucket;
// the link is unguessable and expires). The team can also always view the
// report from the admin panel. Minting the link right after upload is allowed
// by the "Anyone can read just-uploaded reports" storage policy (15 min window).
(function () {
  fillCitySelect($("city"));
  fillGroupSelect($("group"));
  $("config-note").innerHTML = configWarningBox();

  window.__onLangChange = function () {
    var c = $("city").value, g = $("group").value;
    fillCitySelect($("city"));
    fillGroupSelect($("group"));
    $("city").value = c; $("group").value = g;
    $("config-note").innerHTML = configWarningBox();
  };

  $("request-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    var btn = $("submit-btn");
    btn.disabled = true;

    // Team number DB se aa jaye to wahi use ho (admin ne badla ho to naya)
    if (typeof siteSettingsReady !== "undefined" && siteSettingsReady && siteSettingsReady.then) {
      try { await siteSettingsReady; } catch (err) { /* fallback number */ }
    }

    var file = $("report").files[0];
    if (!file) { showToast(t("toast_no_file")); btn.disabled = false; return; }
    if (file.size > 5 * 1024 * 1024) {
      showToast(t("toast_big_file"));
      btn.disabled = false; return;
    }

    var cc = parseInt($("cc").value, 10);
    if (!cc || cc < 50 || cc > 5000) {
      showToast(t("toast_cc_range"));
      btn.disabled = false; return;
    }
    var units = Math.ceil(cc / 400); // 1 یونٹ ≈ 400cc — صرف اشارے کے لیے

    var data = {
      patient_name: $("patient").value.trim(),
      hospital: $("hospital").value.trim(),
      city: $("city").value,
      blood_group: $("group").value,
      cc_needed: cc,
      units_needed: units,
      requester_phone: $("phone").value.trim(),
      status: "pending",
      report_path: null
    };

    if (!SUPABASE_READY || !supabaseClient) {
      showToast(t("toast_setup_wa"));
      openWhatsApp(data, false, null);
      btn.disabled = false;
      return;
    }

    // 1) Upload the report to the private bucket (random id in the path so
    // the path itself is unguessable)
    var safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    var rand = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : ("id-" + Date.now() + "-" + Math.floor(Math.random() * 1e9));
    var path = "requests/" + rand + "-" + Date.now() + "-" + safeName;
    var up = await supabaseClient.storage.from("blood-reports").upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (up.error) {
      console.error(up.error);
      showToast(t("toast_up_fail"));
      btn.disabled = false;
      return;
    }
    data.report_path = path;

    // 2) Save the request row
    var ins = await supabaseClient.from("blood_requests").insert([data]);
    if (ins.error) {
      console.error(ins.error);
      showToast(t("toast_save_fail"));
      btn.disabled = false;
      return;
    }

    // 3) Mint a 7-day signed link to the report for the team's WhatsApp
    // message. If minting fails, fall back to the admin-panel note.
    var reportLink = null;
    var sign = await supabaseClient.storage.from("blood-reports")
      .createSignedUrl(path, 7 * 24 * 3600);
    if (!sign.error && sign.data && sign.data.signedUrl) {
      reportLink = sign.data.signedUrl;
    } else {
      console.error(sign.error);
    }

    // 4) WhatsApp summary to the team (with the report link when available)
    openWhatsApp(data, true, reportLink);

    var ok = $("success");
    ok.style.display = "block";
    ok.innerHTML = t("need_success");
    $("request-form").reset();
    btn.disabled = false;
    window.scrollTo(0, ok.offsetTop - 20);
  });

  function openWhatsApp(data, reportSaved, reportLink) {
    var text =
      t("wa_need_greeting") + "\n" +
      t("wa_patient") + data.patient_name + "\n" +
      t("wa_hospital") + data.hospital + "\n" +
      t("wa_city") + cityLabel(data.city) + "\n" +
      t("wa_group") + data.blood_group + "\n" +
      t("wa_blood") + data.cc_needed + " cc (" + t("wa_approx") + " " + data.units_needed + " " + t("wa_units") + ")\n" +
      t("wa_contact") + data.requester_phone + "\n" +
      (reportSaved
        ? (reportLink
          ? t("wa_report_link") + reportLink + "\n" + t("wa_report_7d")
          : t("wa_report_admin"))
        : t("wa_report_sep"));
    window.open(waLink(SUPABASE_CONFIG.TEAM_WHATSAPP, text), "_blank");
  }
})();
