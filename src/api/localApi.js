// Demo mode: same interface as the Supabase API, stored in this browser only.
// Used when VITE_SUPABASE_URL / VITE_SUPABASE_KEY are not set.
const KEY = 'nu-ojt-demo:v1'

const SAMPLE_STUDENTS = [
  ['Sample Student One', 'IT235'],
  ['Sample Student Two', 'IT235'],
  ['Sample Student Three', 'IT235'],
  ['Sample Student Four', 'IT232'],
  ['Sample Student Five', 'IT232'],
].map(([fullName, section], i) => ({ id: `demo-${i + 1}`, fullName, section, requiredHours: 400 }))

function read() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY))
    if (data?.students && data?.entries) return data
  } catch {
    // fall through to a fresh demo
  }
  return { students: SAMPLE_STUDENTS, entries: [] }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // storage blocked: demo still works for this visit
  }
}

function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const copy = (value) => JSON.parse(JSON.stringify(value))

export const localApi = {
  async listStudents() {
    return copy(read().students)
  },

  async listEntries(studentId) {
    return copy(read().entries.filter((e) => e.studentId === studentId))
  },

  async listAllEntries() {
    return copy(read().entries)
  },

  async addEntry(studentId, entry) {
    const data = read()
    const saved = {
      timeIn: null, timeOut: null, minutes: null, breakMinutes: 0,
      notes: '', manual: false, carryOver: false,
      ...entry, id: newId(), studentId,
    }
    data.entries.push(saved)
    write(data)
    return copy(saved)
  },

  async updateEntry(id, patch) {
    const data = read()
    const index = data.entries.findIndex((e) => e.id === id)
    if (index === -1) throw new Error('That entry no longer exists.')
    data.entries[index] = { ...data.entries[index], ...patch }
    write(data)
    return copy(data.entries[index])
  },

  async deleteEntry(id) {
    const data = read()
    data.entries = data.entries.filter((e) => e.id !== id)
    write(data)
  },
}
