# Blood Donor Website — Sakhi Sarwar

A small, fast, mobile-first website (Urdu, RTL) for two volunteer teams in
Sakhi Sarwar (Dera Ghazi Khan district, Punjab, Pakistan):

- **Al Misbah Medical Team** (المصباح میڈیکل ٹیم)
- **Al Mustafa Blood Donation Group** (المصطفیٰ بلڈ ڈونیشن گروپ)

A patient gives the teams their HB report + blood group; the teams arrange
the required units. The site only **connects** people — blood is collected
and tested **only** at a licensed lab / blood bank. No payments, no blood
collection, no paid APIs.

## Files

| File | What it does |
|---|---|
| `index.html` (+ `index.js`) | Home: mission, the two teams, how it works, public donor search (blood group + city). Public search shows **only** name, city, blood group, last donation date — **never phone numbers**. |
| `register.html` (+ `register.js`) | Donor registration: name, city, blood group, phone, age, last donation date, consent. Saves to Supabase `donors`, then opens a `wa.me` link to the team with a prefilled donor summary. |
| `need-blood.html` (+ `need-blood.js`) | Blood request: patient name, hospital, city, blood group, units, HB report upload (photo/PDF ≤ 5 MB), requester phone. Saves to `blood_requests`, uploads the report to the `blood-reports` storage bucket, then opens a `wa.me` link with a summary. **A file cannot be auto-attached to a wa.me link**, so the WhatsApp message carries a **7-day signed link to the report** instead (private bucket; link is unguessable and expires). The admin panel also has a "view report" button. |
| `admin.html` (+ `admin.js`) | Admin panel: simple password gate, then Supabase Auth sign-in, then donor + request management — text search (name/phone/city) + blood-group and city filters, per-donor stats (last donation, days since, donation count), "record donation" button (count +1, last date = today), delete buttons (with confirm), per-row WhatsApp buttons, report download links (1-hour signed URLs), and request status updates. |
| `supabase-config.js` | **The ONE config file.** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `TEAM_WHATSAPP`, `ADMIN_PASSWORD`. The team WhatsApp number lives **only here** — one-line change to swap it. |
| `schema.sql` | Postgres: `donors` + `blood_requests` tables, `public_donors` view (no phone), RLS policies, `blood-reports` storage bucket. |
| `style.css`, `app.js` | Shared styles + helpers (WhatsApp links, city/group lists, toasts). |

## Setup — going live (about 20 minutes)

1. **Supabase (free tier):** create a project at supabase.com → SQL Editor →
   paste and run `schema.sql`.
2. **Admin user:** Supabase Dashboard → Authentication → Users → Add user
   (the team's admin email + password). This login is what `admin.html`
   uses; the gate password in the config is only a light screen.
3. **Config:** fill `supabase-config.js`:
   - `SUPABASE_URL` + `SUPABASE_ANON_KEY` — Dashboard → Settings → API.
     Never put the `service_role` key in this file.
   - `TEAM_WHATSAPP` — currently the owner's number (`923367050512`,
     i.e. 03367050512). All test messages go to him for now. When the two
     teams approve the site, swap this **one line** to their number.
   - `ADMIN_PASSWORD` — change from the placeholder `admin123`.
4. **Hosting (free):** upload these files to GitHub Pages, Netlify Drop, or
   any static host. No build step, no server.
5. **Test:** register a test donor → check it appears in the admin panel →
   submit a test request with a report → check the report link → delete the
   test rows.

## Honest notes

- **WhatsApp is NOT automatic.** Real automatic WhatsApp delivery needs
  the paid WhatsApp Business API (Meta). This build deliberately uses the
  free route instead: `wa.me` links (the user taps to send) + the admin
  panel where the team contacts donors/requesters. No message is ever sent
  without a human tapping send.
- **Privacy:** donor phone numbers are never shown publicly. The public
  search reads only the `public_donors` view, which has no phone column.
  Full donor/request data is readable only by the signed-in admin
  (Supabase Auth + RLS). Keep the admin credentials private.
- **Reports:** HB reports go to a **private** storage bucket. The admin
  panel opens them via 1-hour signed URLs. Do not make the bucket public.
- **Numbers go stale:** donor lists decay within weeks (people change
  numbers, donate elsewhere, become ineligible). Someone on the team must
  re-confirm donors regularly and remove bad entries from the admin panel.
- **Medical safety:** the site never collects blood and never advises on
  medical matters. Collection, screening and transfusion happen only at a
  licensed lab / blood bank, and the receiving lab's rules (e.g. same-group
  blood for a small child) always govern.
