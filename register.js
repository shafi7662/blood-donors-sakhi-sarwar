// Donor registration — save to Supabase, then WhatsApp the team
(function () {
  fillCitySelect($("city"));
  fillGroupSelect($("group"));
  $("config-note").innerHTML = configWarningBox();

  $("donor-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    var btn = $("submit-btn");
    btn.disabled = true;

    var data = {
      name: $("name").value.trim(),
      city: $("city").value,
      blood_group: $("group").value,
      phone: $("phone").value.trim(),
      age: parseInt($("age").value, 10),
      last_donation_date: $("last-donation").value || null,
      donation_count: $("last-donation").value ? 1 : 0,
      consent: $("consent").checked
    };

    var saved = false;
    if (SUPABASE_READY && supabaseClient) {
      var res = await supabaseClient.from("donors").insert([data]);
      if (res.error) {
        console.error(res.error);
        showToast("رجسٹریشن محفوظ نہیں ہو سکی — براہِ کرم WhatsApp پر براہِ راست رابطہ کریں۔");
      } else {
        saved = true;
      }
    }

    // WhatsApp summary to the team (works even before Supabase setup)
    var text =
      "السلام علیکم! میں خون کا عطیہ دینا چاہتا/چاہتی ہوں۔\n" +
      "نام: " + data.name + "\n" +
      "شہر: " + data.city + "\n" +
      "بلڈ گروپ: " + data.blood_group + "\n" +
      "عمر: " + data.age + "\n" +
      "فون: " + data.phone + "\n" +
      "آخری عطیہ: " + (data.last_donation_date || "کبھی نہیں دیا");
    window.open(waLink(SUPABASE_CONFIG.TEAM_WHATSAPP, text), "_blank");

    var ok = $("success");
    ok.style.display = "block";
    ok.innerHTML = "<b>شکریہ، " + data.name.replace(/</g, "&lt;") + "!</b> آپ کی تفصیل " +
      (saved ? "محفوظ ہو گئی ہے اور " : "") +
      "WhatsApp پر ٹیم کو بھیج دی گئی ہے۔ ٹیم جلد آپ سے رابطہ کرے گی۔";
    $("donor-form").reset();
    btn.disabled = false;
    window.scrollTo(0, ok.offsetTop - 20);
  });
})();
