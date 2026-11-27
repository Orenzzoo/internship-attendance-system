import { createClient } from '@supabase/supabase-js'
import { ENTRY_COLUMNS, STUDENT_COLUMNS, fromEntryRow, fromStudentRow, toEntryRow } from './mapping'

const PAGE = 1000 // Supabase returns at most 1000 rows per request

function unwrap({ data, error }) {
  if (error) throw new Error(error.message)
  return data
}

export function createSupabaseApi(url, key) {
  const db = createClient(url, key, { auth: { persistSession: false } })

  // Pages through a query so the class list keeps working past 1000 entries.
  async function fetchAll(buildQuery) {
    const rows = []
    for (let from = 0; ; from += PAGE) {
      const page = unwrap(await buildQuery().range(from, from + PAGE - 1))
      rows.push(...page)
      if (page.length < PAGE) return rows
    }
  }

  return {
    async listStudents() {
      const rows = unwrap(
        await db.from('students').select(STUDENT_COLUMNS).order('section').order('full_name'),
      )
      return rows.map(fromStudentRow)
    },

    async listEntries(studentId) {
      const rows = await fetchAll(() =>
        db.from('entries').select(ENTRY_COLUMNS).eq('student_id', studentId).order('date').order('id'),
      )
      return rows.map(fromEntryRow)
    },

    async listAllEntries() {
      const rows = await fetchAll(() => db.from('entries').select(ENTRY_COLUMNS).order('date').order('id'))
      return rows.map(fromEntryRow)
    },

    async addEntry(studentId, entry) {
      const row = unwrap(
        await db.from('entries').insert(toEntryRow({ ...entry, studentId })).select(ENTRY_COLUMNS).single(),
      )
      return fromEntryRow(row)
    },

    async updateEntry(id, patch) {
      const row = unwrap(
        await db.from('entries').update(toEntryRow(patch)).eq('id', id).select(ENTRY_COLUMNS).single(),
      )
      return fromEntryRow(row)
    },

    async deleteEntry(id) {
      unwrap(await db.from('entries').delete().eq('id', id))
    },
  }
}
