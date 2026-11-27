import { breakApplied, isHoursOnly, isLate, sortEntries, workedMinutes } from './stats'
import { formatTime, toDecimalHours } from './time'

export function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

export function entriesToCsv(entries, settings) {
  const header = ['Date', 'Time in', 'Time out', 'Break (min)', 'Hours', 'Late', 'Tasks / notes']
  const rows = sortEntries(entries).reverse().map((e) => [
    e.date,
    isHoursOnly(e) ? (e.carryOver ? 'Earlier hours' : 'Hours only') : formatTime(e.timeIn),
    isHoursOnly(e) ? '' : e.timeOut ? formatTime(e.timeOut) : 'Ongoing',
    breakApplied(e),
    toDecimalHours(workedMinutes(e)),
    isLate(e, settings) ? 'Yes' : '',
    e.notes,
  ])
  return [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n')
}

export function slug(text) {
  return (text || 'intern').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
