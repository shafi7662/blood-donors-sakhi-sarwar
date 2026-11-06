-- ============================================================
--  Blood Donor Website — Sakhi Sarwar
--  Supabase schema — Supabase Dashboard → SQL Editor میں چلائیں
--  (ایک ہی بار چلانا کافی ہے)
-- ============================================================

-- ---------- Tables ----------
create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  blood_group text not null check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  phone text not null,
  age int not null check (age between 18 and 60),
  last_donation_date date,
  donation_count int not null default 0,
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.blood_requests (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  hospital text not null,
  city text not null,
  blood_group text not null check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  units_needed int not null check (units_needed between 1 and 10),
  report_path text,
  requester_phone text not null,
  status text not null default 'pending'
    check (status in ('pending','arranged','fulfilled','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists donors_blood_group_idx on public.donors (blood_group);
create index if not exists donors_city_idx on public.donors (city);
create index if not exists requests_status_idx on public.blood_requests (status);
create index if not exists requests_group_idx on public.blood_requests (blood_group);

-- ---------- Public view: donors WITHOUT phone numbers ----------
-- security_invoker = false (security definer): یہ view RLS کو بائی پاس
-- کر کے صرف وہ کالم دکھاتا ہے جو اس میں لکھے ہیں — فون نمبر کبھی
-- عوامی تلاش میں نہیں آئے گا، چاہے کوئی براہِ راست view کو ہی کیوں نہ پڑھے۔
create or replace view public.public_donors
with (security_invoker = false) as
select id, name, city, blood_group, last_donation_date, created_at
from public.donors;

grant select on public.public_donors to anon, authenticated;

-- ---------- Row Level Security ----------
alter table public.donors enable row level security;
alter table public.blood_requests enable row level security;

-- Donors: کوئی بھی (بغیر لاگ ان) رجسٹر کر سکتا ہے — صرف INSERT
drop policy if exists "Anyone can register as a donor" on public.donors;
create policy "Anyone can register as a donor"
  on public.donors for insert
  to anon, authenticated
  with check (true);

-- Donors: مکمل پڑھنا صرف لاگ ان ایڈمن کو (authenticated role)
drop policy if exists "Admin can read donors" on public.donors;
create policy "Admin can read donors"
  on public.donors for select
  to authenticated
  using (true);

-- Donors: ایڈمن اپ ڈیٹ کر سکتا ہے (مثلاً غلط نمبر درست کرنا)
drop policy if exists "Admin can update donors" on public.donors;
create policy "Admin can update donors"
  on public.donors for update
  to authenticated
  using (true) with check (true);

-- Requests: کوئی بھی درخواست بھیج سکتا ہے — صرف INSERT
drop policy if exists "Anyone can submit a blood request" on public.blood_requests;
create policy "Anyone can submit a blood request"
  on public.blood_requests for insert
  to anon, authenticated
  with check (true);

-- Requests: مکمل پڑھنا / حالت بدلنا صرف لاگ ان ایڈمن کو
drop policy if exists "Admin can read requests" on public.blood_requests;
create policy "Admin can read requests"
  on public.blood_requests for select
  to authenticated
  using (true);

drop policy if exists "Admin can update requests" on public.blood_requests;
create policy "Admin can update requests"
  on public.blood_requests for update
  to authenticated
  using (true) with check (true);

-- ---------- v2 (2026-11-06): ایڈمن مینجمنٹ ----------
-- donation_count: عطیات کی تعداد (رجسٹریشن پر 1 اگر آخری عطیہ کی تاریخ دی گئی ہو، ورنہ 0؛
-- ایڈمن پینل کا "عطیہ درج کریں" بٹن ہر نئے عطیے پر +1 کرتا ہے اور آخری تاریخ آج کی کر دیتا ہے)۔
alter table public.donors add column if not exists donation_count int not null default 0;

-- ایڈمن ڈونر / درخواست حذف کر سکتا ہے (ایڈمن پینل کا حذف بٹن)
drop policy if exists "Admin can delete donors" on public.donors;
create policy "Admin can delete donors"
  on public.donors for delete
  to authenticated
  using (true);

drop policy if exists "Admin can delete requests" on public.blood_requests;
create policy "Admin can delete requests"
  on public.blood_requests for delete
  to authenticated
  using (true);

-- ---------- Storage bucket: HB reports (private) ----------
insert into storage.buckets (id, name, public)
values ('blood-reports', 'blood-reports', false)
on conflict (id) do nothing;

-- کوئی بھی رپورٹ اپ لوڈ کر سکتا ہے (درخواست فارم سے)
drop policy if exists "Anyone can upload reports" on storage.objects;
create policy "Anyone can upload reports"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'blood-reports');

-- رپورٹ پڑھنا / ڈاؤن لوڈ کرنا صرف لاگ ان ایڈمن کو
-- (ایڈمن پینل 1 گھنٹے کا signed URL بنا کر کھولتا ہے)
drop policy if exists "Admin can read reports" on storage.objects;
create policy "Admin can read reports"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'blood-reports');

-- ============================================================
--  نوٹ:
--  1) anon صارف براہِ راست donors / blood_requests ٹیبل کو SELECT
--     نہیں کر سکتا — عوامی تلاش صرف public_donors view سے ہوتی ہے۔
--  2) ایڈمن کو Supabase Dashboard → Authentication → Users میں
--     ایک صارف بنا کر دینا ہوگا؛ وہی ای میل/پاس ورڈ admin.html
--     کے سائن ان میں استعمال ہوگا۔
--  3) service_role key کبھی ویب سائٹ کے کوڈ میں نہ ڈالیں۔
-- ============================================================
