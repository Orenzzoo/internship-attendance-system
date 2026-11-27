-- OJT Attendance: run once in Supabase > SQL Editor.
-- Then add your class with a copy of seed.example.sql.

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  section text not null,
  required_hours integer not null default 400,
  created_at timestamptz not null default now()
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  date date not null,
  -- Clocked entries have time_in / time_out.
  time_in timestamptz,
  time_out timestamptz,
  -- Hours-only entries (typed in by hand) have minutes instead.
  minutes integer check (minutes is null or minutes > 0),
  break_minutes integer not null default 0,
  notes text not null default '',
  manual boolean not null default false,
  -- A lump sum covering several days (hours before the app was used).
  carry_over boolean not null default false,
  created_at timestamptz not null default now(),
  constraint entries_has_hours check (time_in is not null or minutes is not null),
  constraint entries_out_after_in check (time_out is null or time_out > time_in)
);

create index if not exists entries_student_date on public.entries (student_id, date);

-- Row level security. There is no login: anyone with the site link can read
-- the class list and add or change entries. Students can't be added from the app.
alter table public.students enable row level security;
alter table public.entries enable row level security;

drop policy if exists "Anyone can read students" on public.students;
create policy "Anyone can read students" on public.students
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can read entries" on public.entries;
create policy "Anyone can read entries" on public.entries
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can add entries" on public.entries;
create policy "Anyone can add entries" on public.entries
  for insert to anon, authenticated with check (true);

drop policy if exists "Anyone can edit entries" on public.entries;
create policy "Anyone can edit entries" on public.entries
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "Anyone can delete entries" on public.entries;
create policy "Anyone can delete entries" on public.entries
  for delete to anon, authenticated using (true);

grant select on public.students to anon, authenticated;
grant select, insert, update, delete on public.entries to anon, authenticated;
