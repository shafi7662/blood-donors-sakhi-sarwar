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

    var cc = parseInt($("cc").value, 10);
    if (!cc || cc < 50 || cc > 5000) {
      showToast("براہِ کرم خون کی مقدار cc میں لکھیں (50 سے 5000 تک)۔");
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
      showToast("سیٹ اپ مکمل نہیں ہے — براہِ کرم رپورٹ WhatsApp پر براہِ راست بھیجیں۔");
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
    ok.innerHTML = "<b>شکریہ!</b> آپ کی درخواست اور HB رپورٹ محفوظ ہو گئی ہے اور ٹیم کو WhatsApp پر اطلاع بھیج دی گئی ہے۔ ٹیم جلد آپ سے رابطہ کرے گی۔";
    $("request-form").reset();
    btn.disabled = false;
    window.scrollTo(0, ok.offsetTop - 20);
  });

  function openWhatsApp(data, reportSaved, reportLink) {
    var text =
      "السلام علیکم! مریض کے لیے خون کی ضرورت ہے۔\n" +
      "مریض: " + data.patient_name + "\n" +
      "اسپتال: " + data.hospital + "\n" +
      "شہر: " + data.city + "\n" +
      "بلڈ گروپ: " + data.blood_group + "\n" +
      "خون: " + data.cc_needed + " cc (تقریباً " + data.units_needed + " یونٹ)\n" +
      "رابطہ: " + data.requester_phone + "\n" +
      (reportSaved
        ? (reportLink
          ? "HB رپورٹ: " + reportLink + "\n(یہ لنک 7 دن تک کام کرے گا۔)"
          : "HB رپورٹ اپ لوڈ کر دی ہے — براہِ کرم ایڈمن پینل سے دیکھ لیں۔")
        : "HB رپورٹ میں WhatsApp پر الگ سے بھیج رہا/رہی ہوں۔");
    window.open(waLink(SUPABASE_CONFIG.TEAM_WHATSAPP, text), "_blank");
  }
})();
