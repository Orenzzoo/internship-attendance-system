import { useCallback, useEffect, useMemo, useState } from 'react'
import { AttendanceContext } from './context'
import { loadSettings, saveSettings } from './storage'
import { api, isDemo } from '../api'
import { isOpen } from '../utils/stats'
import { toDateKey } from '../utils/time'

export default function AttendanceProvider({ children }) {
  const [local, setLocal] = useState(loadSettings)
  const [students, setStudents] = useState([])
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [busy, setBusy] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => saveSettings(local), [local])

  // Load the class list, then this student's entries.
  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    api.listStudents()
      .then(async (list) => {
        const mine = local.studentId && list.some((s) => s.id === local.studentId)
          ? await api.listEntries(local.studentId)
          : []
        if (cancelled) return
        setStudents(list)
        setEntries(mine)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setLoadError(err.message)
        setStatus('error')
      })
    return () => { cancelled = true }
  }, [local.studentId, reloadKey])

  // Pick up changes made on another device (timed in on the phone, viewing on a laptop).
  useEffect(() => {
    if (!local.studentId) return
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      api.listEntries(local.studentId).then(setEntries).catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [local.studentId])

  const student = students.find((s) => s.id === local.studentId) || null

  // Runs a save, shows a message if it fails, and blocks double taps meanwhile.
  const run = useCallback(async (task) => {
    setBusy(true)
    setSaveError('')
    try {
      return await task()
    } catch (err) {
      setSaveError(err.message || 'Could not save. Check your connection and try again.')
      return null
    } finally {
      setBusy(false)
    }
  }, [])

  const actions = useMemo(() => {
    const replace = (saved) => setEntries((list) => list.map((e) => (e.id === saved.id ? saved : e)))

    return {
      saveSettings: (patch) => setLocal((s) => ({ ...s, ...patch })),
      chooseStudent: (studentId, patch = {}) => setLocal((s) => ({ ...s, ...patch, studentId })),
      forgetStudent: () => setLocal((s) => ({ ...s, studentId: '' })),
      reload: () => setReloadKey((k) => k + 1),
      dismissError: () => setSaveError(''),

      timeIn: () => run(async () => {
        if (entries.some(isOpen)) return
        const now = new Date()
        const saved = await api.addEntry(local.studentId, {
          date: toDateKey(now),
          timeIn: now.toISOString(),
          timeOut: null,
          minutes: null,
          breakMinutes: Number(local.breakMinutes) || 0,
          notes: '',
          manual: false,
          carryOver: false,
        })
        setEntries((list) => [...list, saved])
      }),

      timeOut: (notes) => run(async () => {
        const open = entries.find(isOpen)
        if (!open) return
        replace(await api.updateEntry(open.id, {
          timeOut: new Date().toISOString(),
          notes: notes?.trim() || open.notes,
        }))
      }),

      addEntry: (entry) => run(async () => {
        const saved = await api.addEntry(local.studentId, { ...entry, manual: true })
        setEntries((list) => [...list, saved])
        return saved
      }),

      updateEntry: (id, patch) => run(async () => {
        const saved = await api.updateEntry(id, patch)
        replace(saved)
        return saved
      }),

      deleteEntry: (id) => run(async () => {
        await api.deleteEntry(id)
        setEntries((list) => list.filter((e) => e.id !== id))
        return true
      }),
    }
  }, [entries, local.studentId, local.breakMinutes, run])

  // Components read one settings object; name and required hours come from the class list.
  const settings = useMemo(() => ({
    ...local,
    name: student?.fullName || '',
    section: student?.section || '',
    requiredHours: student?.requiredHours || 400,
  }), [local, student])

  const value = useMemo(() => ({
    settings, student, students, entries, status, loadError, saveError, busy, isDemo, ...actions,
  }), [settings, student, students, entries, status, loadError, saveError, busy, actions])

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>
}
