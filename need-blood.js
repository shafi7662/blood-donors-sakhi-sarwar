// Blood request — upload HB report to storage, save request, WhatsApp the team
// NOTE: a file cannot be auto-attached to a wa.me link — the report lives
// in the Supabase storage bucket and the team views it from the admin panel.
(function () {
  fillCitySelect($("city"));
  fillGroupSelect($("group"));
  $("config-note").innerHTML = configWarningBox();

  $("request-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    var btn = $("submit-btn");
    btn.disabled = true;

    var file = $("report").files[0];
    if (!file) { showToast("براہِ کرم HB رپورٹ اپ لوڈ کریں۔"); btn.disabled = false; return; }
    if (file.size > 5 * 1024 * 1024) {
      showToast("رپورٹ 5 MB سے بڑی ہے — چھوٹی فائل اپ لوڈ کریں۔");
      btn.disabled = false; return;
    }

    var data = {
      patient_name: $("patient").value.trim(),
      hospital: $("hospital").value.trim(),
      city: $("city").value,
      blood_group: $("group").value,
      units_needed: parseInt($("units").value, 10),
      requester_phone: $("phone").value.trim(),
      status: "pending",
      report_path: null
    };

    if (!SUPABASE_READY || !supabaseClient) {
      showToast("سیٹ اپ مکمل نہیں ہے — براہِ کرم رپورٹ WhatsApp پر براہِ راست بھیجیں۔");
      openWhatsApp(data, false);
      btn.disabled = false;
      return;
    }

    // 1) Upload the report to the private bucket
    var safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    var path = "requests/" + Date.now() + "-" + safeName;
    var up = await supabaseClient.storage.from("blood-reports").upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (up.error) {
      console.error(up.error);
      showToast("رپورٹ اپ لوڈ نہیں ہو سکی — انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔");
      btn.disabled = false;
      return;
    }
    data.report_path = path;

    // 2) Save the request row
    var ins = await supabaseClient.from("blood_requests").insert([data]);
    if (ins.error) {
      console.error(ins.error);
      showToast("درخواست محفوظ نہیں ہو سکی — دوبارہ کوشش کریں۔");
      btn.disabled = false;
      return;
    }

    // 3) WhatsApp summary to the team (report itself is in the admin panel)
    openWhatsApp(data, true);

    var ok = $("success");
    ok.style.display = "block";
    ok.innerHTML = "<b>شکریہ!</b> آپ کی درخواست اور HB رپورٹ محفوظ ہو گئی ہے اور ٹیم کو WhatsApp پر اطلاع بھیج دی گئی ہے۔ ٹیم جلد آپ سے رابطہ کرے گی۔";
    $("request-form").reset();
    btn.disabled = false;
    window.scrollTo(0, ok.offsetTop - 20);
  });

  function openWhatsApp(data, reportSaved) {
    var text =
      "السلام علیکم! مریض کے لیے خون کی ضرورت ہے۔\n" +
      "مریض: " + data.patient_name + "\n" +
      "اسپتال: " + data.hospital + "\n" +
      "شہر: " + data.city + "\n" +
      "بلڈ گروپ: " + data.blood_group + "\n" +
      "یونٹ: " + data.units_needed + "\n" +
      "رابطہ: " + data.requester_phone + "\n" +
      (reportSaved
        ? "HB رپورٹ اپ لوڈ کر دی ہے — براہِ کرم ایڈمن پینل سے دیکھ لیں۔"
        : "HB رپورٹ میں WhatsApp پر الگ سے بھیج رہا/رہی ہوں۔");
    window.open(waLink(SUPABASE_CONFIG.TEAM_WHATSAPP, text), "_blank");
  }
})();
