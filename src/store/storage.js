// Everything lives in this browser's localStorage. Use Settings > Backup to move devices.
export const STORAGE_KEY = 'nu-ojt-attendance:v1'

export const DEFAULT_SETTINGS = {
  name: '',
  studentId: '',
  program: '',
  school: 'National University Fairview',
  term: 'Term 2',
  company: '',
  supervisor: '',
  requiredHours: 400,
  startDate: '',
  expectedIn: '08:00',
  expectedOut: '17:00',
  breakMinutes: 60,
  graceMinutes: 15,
  workDays: [1, 2, 3, 4, 5],
}

export function emptyData() {
  return { settings: { ...DEFAULT_SETTINGS }, entries: [] }
}

export function normalize(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.entries)) {
    throw new Error('This file is not an attendance backup.')
  }
  return {
    settings: { ...DEFAULT_SETTINGS, ...data.settings },
    entries: data.entries.filter((e) => e && e.id && e.date && e.timeIn),
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalize(JSON.parse(raw)) : emptyData()
  } catch {
    return emptyData()
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage blocked (private mode) or full: the app still works for this visit.
  }
}

export function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
