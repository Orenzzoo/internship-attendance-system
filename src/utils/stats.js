import { combine, fromDateKey, toDateKey } from './time'

// Lunch break is only deducted on shifts longer than this (a half day has no lunch).
export const BREAK_AFTER_MINUTES = 5 * 60

// An open session from an earlier day means the intern forgot to time out.
// It counts as zero until they fix it, instead of piling up overnight hours.
export function isForgotten(entry, now = new Date()) {
  return !entry.timeOut && entry.date !== toDateKey(now)
}

export function rawMinutes(entry, now = new Date()) {
  if (isForgotten(entry, now)) return 0
  const end = entry.timeOut ? new Date(entry.timeOut) : now
  return Math.max(0, (end - new Date(entry.timeIn)) / 60000)
}

export function breakApplied(entry, now = new Date()) {
  return rawMinutes(entry, now) > BREAK_AFTER_MINUTES ? Number(entry.breakMinutes) || 0 : 0
}

export function workedMinutes(entry, now = new Date()) {
  return Math.max(0, rawMinutes(entry, now) - breakApplied(entry, now))
}

export function isLate(entry, settings) {
  if (!settings.expectedIn) return false
  const expected = combine(entry.date, settings.expectedIn)
  const grace = (Number(settings.graceMinutes) || 0) * 60000
  return new Date(entry.timeIn) - expected > grace
}

export function sortEntries(entries) {
  return [...entries].sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn))
}

export function minutesOnDate(entries, dateKey, now) {
  return entries
    .filter((e) => e.date === dateKey)
    .reduce((sum, e) => sum + workedMinutes(e, now), 0)
}

// Planned hours for one regular day, from the schedule in settings.
export function scheduledDailyMinutes(settings) {
  const [ih, im] = settings.expectedIn.split(':').map(Number)
  const [oh, om] = settings.expectedOut.split(':').map(Number)
  const raw = oh * 60 + om - (ih * 60 + im)
  if (raw <= 0) return 8 * 60
  return raw > BREAK_AFTER_MINUTES ? raw - (Number(settings.breakMinutes) || 0) : raw
}

// Walks forward over working days until the remaining hours are covered.
export function projectFinish(remaining, dailyMinutes, workDays, from) {
  if (remaining <= 0 || dailyMinutes <= 0 || workDays.length === 0) return null
  const daysNeeded = Math.ceil(remaining / dailyMinutes)
  const date = new Date(from)
  let counted = 0
  while (counted < daysNeeded) {
    date.setDate(date.getDate() + 1)
    if (workDays.includes(date.getDay())) counted++
  }
  return { date, days: daysNeeded }
}

function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const offset = (d.getDay() + 6) % 7 // Monday-based week
  d.setDate(d.getDate() - offset)
  return d
}

export function computeStats(entries, settings, now = new Date()) {
  const required = (Number(settings.requiredHours) || 0) * 60
  const total = entries.reduce((sum, e) => sum + workedMinutes(e, now), 0)
  const remaining = Math.max(0, required - total)
  const days = new Set(entries.map((e) => e.date))
  const daysPresent = days.size
  // Average over finished sessions only, so a shift that just started doesn't drag it down.
  const finished = entries.filter((e) => e.timeOut)
  const finishedDays = new Set(finished.map((e) => e.date)).size
  const average = finishedDays
    ? finished.reduce((sum, e) => sum + workedMinutes(e, now), 0) / finishedDays
    : 0

  const weekStart = startOfWeek(now)
  const week = entries
    .filter((e) => fromDateKey(e.date) >= weekStart)
    .reduce((sum, e) => sum + workedMinutes(e, now), 0)

  // Real average is a better guess once there are a few days logged.
  const daily = finishedDays >= 3 ? average : scheduledDailyMinutes(settings)
  const projection = projectFinish(remaining, daily, settings.workDays, now)

  return {
    required,
    total,
    remaining,
    percent: required ? Math.min(100, (total / required) * 100) : 0,
    daysPresent,
    average,
    week,
    today: minutesOnDate(entries, toDateKey(now), now),
    lateCount: entries.filter((e) => isLate(e, settings)).length,
    projection,
    dailyBasis: daily,
  }
}

// Months that have entries, plus the current month, newest first ('YYYY-MM').
export function monthOptions(entries, now = new Date()) {
  const months = new Set(entries.map((e) => e.date.slice(0, 7)))
  months.add(toDateKey(now).slice(0, 7))
  return [...months].sort().reverse()
}

export function lastNDays(entries, n, now = new Date()) {
  const result = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const key = toDateKey(d)
    result.push({
      key,
      label: d.toLocaleDateString('en-PH', { weekday: 'short' }),
      minutes: minutesOnDate(entries, key, now),
    })
  }
  return result
}
