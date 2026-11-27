import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useAttendance } from '../store/context'
import Field from './Field'
import { combine, toDateKey, toHHMM } from '../utils/time'

function initialValues(entry, settings) {
  if (entry) {
    return {
      date: entry.date,
      timeIn: toHHMM(entry.timeIn),
      timeOut: entry.timeOut ? toHHMM(entry.timeOut) : '',
      breakMinutes: entry.breakMinutes ?? settings.breakMinutes,
      notes: entry.notes || '',
    }
  }
  return {
    date: toDateKey(new Date()),
    timeIn: settings.expectedIn,
    timeOut: settings.expectedOut,
    breakMinutes: settings.breakMinutes,
    notes: '',
  }
}

// Add a missed day, or fix the times on an existing entry.
export default function EntryModal({ entry, onClose }) {
  const { settings, addEntry, updateEntry } = useAttendance()
  const [values, setValues] = useState(() => initialValues(entry, settings))
  const [error, setError] = useState('')

  // Only today's open session may stay without a time out.
  const canStayOpen = entry && !entry.timeOut && values.date === toDateKey(new Date())

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key) => (e) => setValues({ ...values, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const timeIn = combine(values.date, values.timeIn)
    let timeOut = null
    if (values.timeOut) {
      timeOut = combine(values.date, values.timeOut)
      if (timeOut <= timeIn) return setError('Time out must be later than time in.')
    } else if (!canStayOpen) {
      return setError('Add a time out.')
    }
    if (timeIn > new Date()) return setError('Time in can’t be in the future.')

    const data = {
      date: values.date,
      timeIn: timeIn.toISOString(),
      timeOut: timeOut ? timeOut.toISOString() : null,
      breakMinutes: Math.max(0, Number(values.breakMinutes) || 0),
      notes: values.notes.trim(),
    }
    if (entry) updateEntry(entry.id, data)
    else addEntry(data)
    onClose()
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="entry-title" onMouseDown={onClose}>
      <form className="modal__panel card" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 id="entry-title">{entry ? 'Edit entry' : 'Add entry'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="form-grid">
          <Field label="Date" wide>
            <input type="date" required value={values.date} onChange={set('date')} max={toDateKey(new Date())} />
          </Field>
          <Field label="Time in">
            <input type="time" required value={values.timeIn} onChange={set('timeIn')} />
          </Field>
          <Field label="Time out" hint={canStayOpen ? 'Leave blank while still on duty' : null}>
            <input type="time" value={values.timeOut} onChange={set('timeOut')} required={!canStayOpen} />
          </Field>
          <Field label="Break (minutes)" hint="Deducted on shifts over 5 hours" wide>
            <input type="number" min="0" step="5" value={values.breakMinutes} onChange={set('breakMinutes')} />
          </Field>
          <Field label="Tasks / notes" wide>
            <textarea rows="3" value={values.notes} onChange={set('notes')} placeholder="What did you work on?" />
          </Field>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary">Save</button>
        </div>
      </form>
    </div>
  )
}
