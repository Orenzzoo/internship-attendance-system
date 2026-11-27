import { useCallback, useEffect, useMemo, useState } from 'react'
import { AttendanceContext } from './context'
import { api, isDemo } from '../api'
import { isOpen } from '../utils/stats'
import { toDateKey } from '../utils/time'

// Lunch break taken off clocked shifts longer than 5 hours.
const BREAK_MINUTES = 60
const REFRESH_MS = 30000

// One shared laptop: everyone's entries are loaded, any student can time in or out.
export default function AttendanceProvider({ children }) {
  const [students, setStudents] = useState([])
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [busy, setBusy] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    Promise.all([api.listStudents(), api.listAllEntries()])
      .then(([studentList, entryList]) => {
        if (cancelled) return
        setStudents(studentList)
        setEntries(entryList)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setLoadError(err.message)
        setStatus('error')
      })
    return () => { cancelled = true }
  }, [reloadKey])

  // Pick up time-ins made on other devices.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== 'visible') return
      api.listAllEntries().then(setEntries).catch(() => {})
    }
    const id = setInterval(refresh, REFRESH_MS)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  // Runs a save, shows a message if it fails, and blocks double taps meanwhile.
  const run = useCallback(async (task) => {
    setBusy(true)
    setSaveError('')
    try {
      return await task()
    } catch (err) {
      setSaveError(err.message || 'Could not save. Check the internet connection and try again.')
      return null
    } finally {
      setBusy(false)
    }
  }, [])

  const actions = useMemo(() => {
    const replace = (saved) => setEntries((list) => list.map((e) => (e.id === saved.id ? saved : e)))
    const openEntry = (studentId) => entries.find((e) => e.studentId === studentId && isOpen(e))

    return {
      reload: () => setReloadKey((k) => k + 1),
      dismissError: () => setSaveError(''),

      timeIn: (studentId) => run(async () => {
        if (openEntry(studentId)) throw new Error('Already timed in.')
        const now = new Date()
        const saved = await api.addEntry(studentId, {
          date: toDateKey(now),
          timeIn: now.toISOString(),
          timeOut: null,
          minutes: null,
          breakMinutes: BREAK_MINUTES,
          notes: '',
          manual: false,
          carryOver: false,
        })
        setEntries((list) => [...list, saved])
        return saved
      }),

      // Returns the saved entry and what it was before, so the toast can undo it.
      timeOut: (studentId, notes) => run(async () => {
        const open = openEntry(studentId)
        if (!open) throw new Error('Not timed in.')
        const saved = await api.updateEntry(open.id, {
          timeOut: new Date().toISOString(),
          notes: notes?.trim() || open.notes,
        })
        replace(saved)
        return { saved, previous: open }
      }),

      addEntry: (studentId, entry) => run(async () => {
        const saved = await api.addEntry(studentId, { ...entry, manual: true })
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
  }, [entries, run])

  const value = useMemo(() => ({
    students, entries, status, loadError, saveError, busy, isDemo, ...actions,
  }), [students, entries, status, loadError, saveError, busy, actions])

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>
}
