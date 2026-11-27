import { isForgotten, isOpen, totalMinutes } from './stats'

// Groups the class by section with each student's hours and progress.
export function buildRoster(students, entries, now, sort = 'name') {
  const byStudent = new Map(students.map((s) => [s.id, []]))
  for (const entry of entries) byStudent.get(entry.studentId)?.push(entry)

  const rows = students.map((student) => {
    const list = byStudent.get(student.id)
    const minutes = totalMinutes(list, now)
    const required = student.requiredHours * 60
    const lastDate = list.reduce((max, e) => (e.date > max ? e.date : max), '')
    return {
      student,
      minutes,
      required,
      remaining: Math.max(0, required - minutes),
      percent: required ? Math.min(100, (minutes / required) * 100) : 0,
      onDuty: list.some((e) => isOpen(e) && !isForgotten(e, now)),
      lastDate,
    }
  })

  const compare = sort === 'hours'
    ? (a, b) => b.minutes - a.minutes
    : (a, b) => a.student.fullName.localeCompare(b.student.fullName)

  const sections = [...new Set(students.map((s) => s.section))].map((section) => {
    const sectionRows = rows.filter((r) => r.student.section === section).sort(compare)
    return { section, rows: sectionRows, total: sectionRows.reduce((sum, r) => sum + r.minutes, 0) }
  })

  return {
    sections,
    classTotal: rows.reduce((sum, r) => sum + r.minutes, 0),
    // Extra hours past someone's requirement don't fill anyone else's share.
    classProgress: rows.reduce((sum, r) => sum + Math.min(r.minutes, r.required), 0),
    required: rows.reduce((sum, r) => sum + r.required, 0),
    finished: rows.filter((r) => r.remaining === 0).length,
  }
}
