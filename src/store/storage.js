// Personal settings stay on this device. Hours live in Supabase (see src/api).
export const STORAGE_KEY = 'nu-ojt-settings:v2'

export const DEFAULT_SETTINGS = {
  studentId: '', // Supabase students.id of whoever uses this device
  studentNumber: '',
  program: '',
  school: 'National University Fairview',
  term: 'Term 2',
  company: '',
  supervisor: '',
  startDate: '',
  expectedIn: '08:00',
  expectedOut: '17:00',
  breakMinutes: 60,
  graceMinutes: 15,
  workDays: [1, 2, 3, 4, 5],
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Storage blocked (private mode): settings last for this visit only.
  }
}
