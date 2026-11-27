# OJT Attendance

A time-in screen for National University Fairview interns, made for one shared laptop at the
station. When you arrive, find your name, tap it, and press **Time in**. Press **Time out** when
you leave. Everyone's progress toward the 400-hour requirement is on the same screen.

## Features

- **One screen**: every intern as a card with their status (in since 8:02 AM, out, not in yet)
  and a progress bar to 400 hours. Search by name or filter by section.
- **Tap your name, then Time in / Time out.** The panel closes on its own and shows a
  confirmation with **Undo** in case someone tapped the wrong name.
- **Task note** on time out (optional).
- **Log hours from before this app**: add a total covering several days, or one day's hours.
- **Lunch break**: 60 minutes comes off any shift longer than 5 hours.
- **Forgot to time out?** That day counts as zero, and the next time you tap your name it asks
  what time you left.
- **Recent entries** in each panel, with delete for mistakes.
- Updates every 30 seconds, so a phone and the station laptop stay in sync. Works on phones too.

## How data is stored

Hours are saved in a [Supabase](https://supabase.com) database (free tier is plenty), so every
device shows the same class list and hours.

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
6. For the live site, connect Supabase to the Vercel project (the integration adds
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, which the app reads), or
   add `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` yourself.

To add a student later, run an `insert` in the SQL Editor (see `seed.example.sql`).

## Run it locally

Needs Node 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Put it online (Vercel)

Import the repository in Vercel. It detects Vite on its own. Add the Supabase variables (step 6),
then every push to `main` deploys.

## Project layout

```
src/
  api/                  Supabase client, plus a localStorage version for demo mode
  store/                class list, everyone's entries, time in/out actions
  pages/KioskPage.jsx   the one screen: search, name cards
  components/           student card and panel, past hours form, progress bar, toast
  utils/                time formatting, hour math, per-student status
  styles/               page styles; colors live in index.css
supabase/               database schema and class list template
```

Not an official National University app.
