# OJT Attendance

An attendance tracker for National University Fairview interns. Time in and out, log hours you
rendered before the app existed, watch your progress toward the 400-hour requirement, see how
the whole class is doing, and print a monthly Daily Time Record (DTR) for your supervisor.

## Features

- **Time in / time out** with a live clock and a running timer while you're on duty.
- **Log past hours**: add hours without clock times, one day at a time or as one total
  ("covers several days") for everything before you started using the app.
- **Progress bar to 400 hours** with hours left and an estimated finish date.
- **Class tab**: every student's hours and progress bar, grouped by section, with who's on duty now.
- **Task notes** on time out, so your DTR doubles as a work journal.
- **Lunch break deduction**: the break (60 minutes by default) comes off any shift longer than 5 hours.
- **Late flag** when you time in after your schedule plus a grace period.
- **Missed time-out warning**: a forgotten time-out counts as zero until you set the time.
- **Logs**: filter by month, search notes, add, edit or delete entries.
- **Printable DTR** per month with totals and signature lines.
- **CSV export**. Works on phones (bottom tab bar) and desktops.

## How data is stored

Hours are saved in a [Supabase](https://supabase.com) database (free tier is plenty), so they
follow you between phone and laptop and the Class tab can show everyone. Each device remembers
which student is using it and that student's DTR details (program, company, supervisor).

There is no login. Anyone with the site link can see the class list and add or change entries.
That keeps it simple for a class; just don't share the link outside the group.

Without Supabase settings the app runs in **demo mode**: sample students, saved in that browser only.

## Set up Supabase (once, about 10 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste in `supabase/schema.sql`, and run it.
3. Copy `supabase/seed.example.sql` to `supabase/seed.local.sql`, put in your class's names and
   sections, and run it in the SQL Editor. (`seed.local.sql` is ignored by git, so names stay out
   of this public repo.)
4. In **Project Settings → API** (or **Data API**), copy the **Project URL** and the
   **anon / publishable** key. Never use the `service_role` / secret key in the app.
5. For local development, copy `.env.example` to `.env` and fill in both values.
6. For the live site, add the same two values on GitHub under **Settings → Secrets and variables →
   Actions → Variables** as `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`.

To add a student later, run an `insert` in the SQL Editor (see `seed.example.sql`).

## Run it locally

Needs Node 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Put it online (GitHub Pages)

1. In the repository on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Add the two Supabase variables (step 6 above).
3. Push to `main`, or re-run the "Deploy to GitHub Pages" workflow. The link appears under
   **Settings → Pages** (usually `https://<username>.github.io/internship-attendance-system/`).

## Project layout

```
src/
  api/                  Supabase client, plus a localStorage version for demo mode
  store/                app state: who's using the device, their entries, save actions
  pages/                Today, Logs, Class, Report (DTR), Settings, Onboarding
  components/           clock card, progress bar, entry editor, class list rows, etc.
  utils/                time formatting, hour math, class totals, CSV
  styles/               page styles; colors live in index.css
supabase/               database schema and class list template
```

Not an official National University app.
