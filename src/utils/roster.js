import { isForgotten, isOpen, minutesOnDate, totalMinutes } from './stats'
import { formatDate, formatHours, formatTime, toDateKey } from './time'

// One row per student: their entries, total hours, and where they are today.
export function buildRows(students, entries, now) {
  const byStudent = new Map(students.map((s) => [s.id, []]))
  for (const entry of entries) byStudent.get(entry.studentId)?.push(entry)
  const today = toDateKey(now)

  return students.map((student) => {
    const list = byStudent.get(student.id)
    const open = list.find(isOpen) || null
    const forgotten = open && isForgotten(open, now) ? open : null
    const minutes = totalMinutes(list, now)
    const required = student.requiredHours * 60
    const lastOutToday = list
      .filter((e) => e.date === today && e.timeOut)
      .reduce((latest, e) => (!latest || e.timeOut > latest ? e.timeOut : latest), null)

    return {
      student,
      entries: list,
      minutes,
      required,
      remaining: Math.max(0, required - minutes),
      active: open && !forgotten ? open : null,
      forgotten,
      todayMinutes: minutesOnDate(list, today, now),
      lastOutToday,
    }
  })
}

// Short status line for a student's card.
export function studentStatus(row) {
  if (row.forgotten) {
    return { tone: 'danger', label: `No time out on ${formatDate(row.forgotten.date, { month: 'short', day: 'numeric' })}` }
  }
  if (row.active) return { tone: 'ok', label: `In since ${formatTime(row.active.timeIn)}` }
  if (row.lastOutToday) {
    return { tone: 'muted', label: `Out at ${formatTime(row.lastOutToday)} · ${formatHours(row.todayMinutes)} today` }
  }
  return { tone: 'idle', label: 'Not in yet' }
}

// Lowercase, no punctuation, so "kent dumo" finds "Kent Marl (Dumo) Abuyon".
export function normalizeName(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function matchesQuery(name, query) {
  const haystack = normalizeName(name)
  return normalizeName(query).split(' ').every((word) => haystack.includes(word))
}

export function initials(name) {
  return name.split(/\s+/).filter((p) => /^[A-Za-z]/.test(p)).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v'])

// Last word of the name, skipping suffixes: "Ricardo (Abat) Antonio Jr" -> "Antonio".
export function surname(name) {
  const words = name.replace(/[.,]/g, '').split(/\s+/).filter(Boolean)
  while (words.length > 1 && SUFFIXES.has(words.at(-1).toLowerCase())) words.pop()
  return words.at(-1) || name
}

// Class-list order: by surname, then by full name for anyone sharing one.
export function compareBySurname(a, b) {
  return surname(a).localeCompare(surname(b)) || a.localeCompare(b)
}

export function firstName(name) {
  return name.split(' ')[0]
}
