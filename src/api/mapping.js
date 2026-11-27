// App field name <-> Supabase column name
const ENTRY_FIELDS = [
  ['studentId', 'student_id'],
  ['date', 'date'],
  ['timeIn', 'time_in'],
  ['timeOut', 'time_out'],
  ['minutes', 'minutes'],
  ['breakMinutes', 'break_minutes'],
  ['notes', 'notes'],
  ['manual', 'manual'],
  ['carryOver', 'carry_over'],
]

export const ENTRY_COLUMNS = ['id', ...ENTRY_FIELDS.map(([, column]) => column)].join(', ')
export const STUDENT_COLUMNS = 'id, full_name, section, required_hours'

// Only copies keys that are set, so a partial patch stays partial.
export function toEntryRow(entry) {
  const row = {}
  for (const [key, column] of ENTRY_FIELDS) {
    if (entry[key] !== undefined) row[column] = entry[key]
  }
  return row
}

export function fromEntryRow(row) {
  const entry = { id: row.id }
  for (const [key, column] of ENTRY_FIELDS) entry[key] = row[column]
  entry.notes = entry.notes || ''
  return entry
}

export function fromStudentRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    section: row.section,
    requiredHours: row.required_hours ?? 400,
  }
}
