import { useState } from 'react'
import { useAttendance } from '../store/context'
import Field from './Field'
import { toDateKey } from '../utils/time'

// Hours rendered before the app existed: one total, or a single day.
export default function PastHoursForm({ studentId, onCancel, onSaved }) {
  const { busy, addEntry } = useAttendance()
  const [hours, setHours] = useState('')
  const [date, setDate] = useState(toDateKey(new Date()))
  const [carryOver, setCarryOver] = useState(true)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const value = Number(hours)
    if (!(value > 0)) return setError('Enter how many hours.')
    if (!carryOver && value > 24) return setError('One day can’t be more than 24 hours. Tick “covers several days” for a total.')

    const saved = await addEntry(studentId, {
      date,
      timeIn: null,
      timeOut: null,
      minutes: Math.round(value * 60),
      breakMinutes: 0,
      notes: carryOver ? 'Hours rendered before using the attendance app' : '',
      carryOver,
    })
    if (saved) onSaved(saved)
  }

  return (
    <form className="past" onSubmit={submit}>
      <h3>Log hours from before this app</h3>
      <p className="muted">Add the hours you already rendered so your total is right.</p>

      <div className="form-grid">
        <Field label="Hours" hint="7.5 = 7 hours 30 minutes">
          <input
            type="number"
            min="0.25"
            step="0.25"
            required
            autoFocus
            value={hours}
            onChange={(e) => { setHours(e.target.value); setError('') }}
            placeholder={carryOver ? 'e.g. 120' : 'e.g. 8'}
          />
        </Field>
        <Field label={carryOver ? 'Up to' : 'Date'}>
          <input type="date" required value={date} max={toDateKey(new Date())} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <label className="check field--wide">
          <input type="checkbox" checked={carryOver} onChange={(e) => setCarryOver(e.target.checked)} />
          <span>
            <strong>Covers several days</strong>
            <small>Untick to add hours for a single day.</small>
          </span>
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="modal__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Back</button>
        <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? 'Saving…' : 'Add hours'}</button>
      </div>
    </form>
  )
}
