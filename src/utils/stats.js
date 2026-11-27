import { toDateKey } from './time'

// Lunch break is only deducted on shifts longer than this (a half day has no lunch).
export const BREAK_AFTER_MINUTES = 5 * 60

// Two kinds of entries:
//  - clocked: timeIn/timeOut, hours worked out from the times
//  - hours only: `minutes` typed in by hand (e.g. hours rendered before this app).
//    `carryOver` marks a lump sum covering several days.
export const isHoursOnly = (entry) => entry.minutes != null

export const isOpen = (entry) => !isHoursOnly(entry) && !entry.timeOut

// An open session from an earlier day means the intern forgot to time out.
// It counts as zero until it's fixed, instead of piling up overnight hours.
export function isForgotten(entry, now = new Date()) {
  return isOpen(entry) && entry.date !== toDateKey(now)
}

export function rawMinutes(entry, now = new Date()) {
  if (isHoursOnly(entry)) return Number(entry.minutes) || 0
  if (isForgotten(entry, now)) return 0
  const end = entry.timeOut ? new Date(entry.timeOut) : now
  return Math.max(0, (end - new Date(entry.timeIn)) / 60000)
}

export function breakApplied(entry, now = new Date()) {
  if (isHoursOnly(entry)) return 0
  return rawMinutes(entry, now) > BREAK_AFTER_MINUTES ? Number(entry.breakMinutes) || 0 : 0
}

export function workedMinutes(entry, now = new Date()) {
  return Math.max(0, rawMinutes(entry, now) - breakApplied(entry, now))
}

export function totalMinutes(entries, now = new Date()) {
  return entries.reduce((sum, e) => sum + workedMinutes(e, now), 0)
}

// Lump sums aren't one day's work, so they're left out of daily figures.
export function minutesOnDate(entries, dateKey, now) {
  return entries
    .filter((e) => e.date === dateKey && !e.carryOver)
    .reduce((sum, e) => sum + workedMinutes(e, now), 0)
}

// Newest first: by date, then by time in.
export function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return (b.timeIn || '').localeCompare(a.timeIn || '')
  })
}
