# OJT Attendance

An attendance tracker for National University Fairview interns. Time in and out, watch your
hours climb toward the 400-hour requirement, and print a monthly Daily Time Record (DTR) for
your supervisor to sign.

## Features

- **Time in / time out** with a live clock and a running timer while you're on duty.
- **Task notes** on time out, so your DTR doubles as a work journal.
- **Progress to your required hours** (400 by default), with hours left and an estimated finish date.
- **Lunch break deduction**: the break (60 minutes by default) comes off any shift longer than 5 hours.
- **Late flag** when you time in after your schedule plus a grace period.
- **Missed time-out warning**: if you forget to time out, that day counts as zero until you set the time.
- **Logs**: filter by month, search notes, add a missed day, edit or delete entries.
- **Printable DTR** per month with totals and signature lines. Print or save as PDF.
- **CSV export** and **JSON backup / restore** to move your data between devices.
- Works on phones (bottom tab bar) and desktops.

## Where the data lives

Everything is saved in your browser's local storage. Nothing is sent to a server, and each
intern uses the app on their own device. Clearing browser data erases it, so download a backup
from **Settings → Your data** every week or so.

## Run it locally

Needs Node 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Put it online (GitHub Pages)

1. In the repository on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site.
3. The link appears under **Settings → Pages** (usually `https://<username>.github.io/internship-attendance-system/`).

## Project layout

```
src/
  App.jsx               tabs and page switching
  store/                localStorage data + actions (time in/out, add, edit, delete, backup)
  pages/                Today, Logs, Report (DTR), Settings, Onboarding
  components/           clock card, progress ring, entry row and editor, etc.
  utils/                time formatting, hour math, CSV and file helpers
  styles/               page styles; colors live in index.css
```

Not an official National University app.
