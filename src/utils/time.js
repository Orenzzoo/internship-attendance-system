// Dates are stored as local 'YYYY-MM-DD' keys; clock times as ISO strings.
export const pad = (n) => String(n).padStart(2, '0')

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function combine(dateKey, hhmm) {
  const date = fromDateKey(dateKey)
  const [h, m] = hhmm.split(':').map(Number)
  date.setHours(h, m, 0, 0)
  return date
}

export function toHHMM(iso) {
  const d = new Date(iso)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function monthKey(dateKey) {
  return dateKey.slice(0, 7)
}

export function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' })
}

export function formatDate(key, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return fromDateKey(key).toLocaleDateString('en-PH', options)
}

export function formatLongDate(date) {
  return date.toLocaleDateString('en-PH', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export function formatMonth(key) {
  return fromDateKey(`${key}-01`).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })
}

// 512.4 minutes -> "8h 32m"
export function formatHours(minutes) {
  // Round (not floor) so rendered + remaining always add up to the requirement.
  const total = Math.max(0, Math.round(minutes))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  return `${h}h ${pad(m)}m`
}

// Decimal hours for reports and CSV, e.g. 8.53
export function toDecimalHours(minutes) {
  return (Math.max(0, minutes) / 60).toFixed(2)
}

export function formatElapsed(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

export function greeting(date) {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
