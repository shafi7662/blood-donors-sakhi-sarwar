// Donor registration — save to Supabase, then WhatsApp the team
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

  $("donor-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    var btn = $("submit-btn");
    btn.disabled = true;

    // Team number DB se aa jaye to wahi use ho (admin ne badla ho to naya)
    if (typeof siteSettingsReady !== "undefined" && siteSettingsReady && siteSettingsReady.then) {
      try { await siteSettingsReady; } catch (err) { /* fallback number */ }
    }

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
        showToast(t("toast_reg_fail"));
      } else {
        saved = true;
      }
    }

    // WhatsApp summary to the team (works even before Supabase setup)
    var text =
      t("wa_reg_greeting") + "\n" +
      t("wa_name") + data.name + "\n" +
      t("wa_city") + cityLabel(data.city) + "\n" +
      t("wa_group") + data.blood_group + "\n" +
      t("wa_age") + data.age + "\n" +
      t("wa_phone") + data.phone + "\n" +
      t("wa_last") + (data.last_donation_date || t("wa_never"));
    window.open(waLink(SUPABASE_CONFIG.TEAM_WHATSAPP, text), "_blank");

    var ok = $("success");
    ok.style.display = "block";
    ok.innerHTML = t(saved ? "reg_ok_saved" : "reg_ok_nosave", { name: data.name.replace(/</g, "&lt;") });
    $("donor-form").reset();
    btn.disabled = false;
    window.scrollTo(0, ok.offsetTop - 20);
  });
})();
