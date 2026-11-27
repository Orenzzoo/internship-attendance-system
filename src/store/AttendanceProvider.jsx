import { useEffect, useMemo, useState } from 'react'
import { AttendanceContext } from './context'
import { emptyData, loadData, newId, normalize, saveData } from './storage'
import { toDateKey } from '../utils/time'

export default function AttendanceProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => saveData(data), [data])

  const actions = useMemo(() => ({
    saveSettings: (patch) =>
      setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),

    timeIn: () =>
      setData((d) => {
        // Only one open session at a time.
        if (d.entries.some((e) => !e.timeOut)) return d
        const now = new Date()
        const entry = {
          id: newId(),
          date: toDateKey(now),
          timeIn: now.toISOString(),
          timeOut: null,
          breakMinutes: Number(d.settings.breakMinutes) || 0,
          notes: '',
          manual: false,
        }
        return { ...d, entries: [...d.entries, entry] }
      }),

    timeOut: (notes) =>
      setData((d) => ({
        ...d,
        entries: d.entries.map((e) =>
          e.timeOut
            ? e
            : { ...e, timeOut: new Date().toISOString(), notes: notes?.trim() || e.notes },
        ),
      })),

    addEntry: (entry) =>
      setData((d) => ({ ...d, entries: [...d.entries, { ...entry, id: newId(), manual: true }] })),

    updateEntry: (id, patch) =>
      setData((d) => ({
        ...d,
        entries: d.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),

    deleteEntry: (id) =>
      setData((d) => ({ ...d, entries: d.entries.filter((e) => e.id !== id) })),

    replaceAll: (raw) => {
      const next = normalize(raw)
      setData(next)
      return next
    },

    resetAll: () => setData(emptyData()),
  }), [])

  const value = useMemo(() => ({ ...data, ...actions }), [data, actions])

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>
}
