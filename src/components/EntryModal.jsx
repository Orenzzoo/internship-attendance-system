import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useAttendance } from '../store/context'
import Field from './Field'
import { isHoursOnly } from '../utils/stats'
import { combine, toDateKey, toHHMM } from '../utils/time'

const PAST_HOURS_NOTE = 'Hours rendered before using the attendance app'

function initialValues(entry, settings, mode) {
  if (entry) {
    return {
      date: entry.date,
      timeIn: entry.timeIn ? toHHMM(entry.timeIn) : settings.expectedIn,
      timeOut: entry.timeOut ? toHHMM(entry.timeOut) : '',
      breakMinutes: entry.breakMinutes ?? settings.breakMinutes,
      hours: isHoursOnly(entry) ? String(+(entry.minutes / 60).toFixed(2)) : '',
      carryOver: !!entry.carryOver,
      notes: entry.notes || '',
    }
  }
  const pastHours = mode === 'past'
  return {
    date: toDateKey(new Date()),
    timeIn: settings.expectedIn,
    timeOut: settings.expectedOut,
    breakMinutes: settings.breakMinutes,
    hours: '',
    carryOver: pastHours,
    notes: pastHours ? PAST_HOURS_NOTE : '',
  }
}

// Add or fix an entry. Two kinds: clock times, or just a number of hours
// (for days done before the app existed, or a lump sum of earlier hours).
export default function EntryModal({ entry, mode = 'times', onClose }) {
  const { settings, busy, addEntry, updateEntry } = useAttendance()
  const [kind, setKind] = useState(entry ? (isHoursOnly(entry) ? 'hours' : 'times') : mode === 'times' ? 'times' : 'hours')
  const [values, setValues] = useState(() => initialValues(entry, settings, mode))
  const [error, setError] = useState('')

  // Only today's open session may stay without a time out.
  const canStayOpen = entry && !entry.timeOut && kind === 'times' && values.date === toDateKey(new Date())

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key) => (e) => {
    setValues({ ...values, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    setError('')
  }

  const buildTimes = () => {
    const timeIn = combine(values.date, values.timeIn)
    let timeOut = null
    if (values.timeOut) {
      timeOut = combine(values.date, values.timeOut)
      if (timeOut <= timeIn) return 'Time out must be later than time in.'
    } else if (!canStayOpen) {
      return 'Add a time out.'
    }
    if (timeIn > new Date()) return 'Time in can’t be in the future.'
    return {
      timeIn: timeIn.toISOString(),
      timeOut: timeOut ? timeOut.toISOString() : null,
      minutes: null,
      breakMinutes: Math.max(0, Number(values.breakMinutes) || 0),
      carryOver: false,
    }
  }

  const buildHours = () => {
    const hours = Number(values.hours)
    if (!(hours > 0)) return 'Enter how many hours.'
    if (!values.carryOver && hours > 24) {
      return 'One day can’t be more than 24 hours. Tick “covers several days” for a total.'
    }
    return { timeIn: null, timeOut: null, minutes: Math.round(hours * 60), breakMinutes: 0, carryOver: values.carryOver }
  }

  const submit = async (e) => {
    e.preventDefault()
    const result = kind === 'times' ? buildTimes() : buildHours()
    if (typeof result === 'string') return setError(result)

    const data = { date: values.date, notes: values.notes.trim(), ...result }
    const saved = entry ? await updateEntry(entry.id, data) : await addEntry(data)
    if (saved) onClose()
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="entry-title" onMouseDown={onClose}>
      <form className="modal__panel card" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 id="entry-title">{entry ? 'Edit entry' : mode === 'past' ? 'Log past hours' : 'Add entry'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {!entry && (
          <div className="segmented" role="group" aria-label="Entry type">
            <button type="button" className={kind === 'times' ? 'is-on' : ''} onClick={() => setKind('times')}>
              Time in &amp; out
            </button>
            <button type="button" className={kind === 'hours' ? 'is-on' : ''} onClick={() => setKind('hours')}>
              Hours only
            </button>
          </div>
        )}

        <div className="form-grid">
          <Field label="Date" wide hint={kind === 'hours' && values.carryOver ? 'Use the last day these hours cover' : null}>
            <input type="date" required value={values.date} onChange={set('date')} max={toDateKey(new Date())} />
          </Field>

          {kind === 'times' ? (
            <>
              <Field label="Time in">
                <input type="time" required value={values.timeIn} onChange={set('timeIn')} />
              </Field>
              <Field label="Time out" hint={canStayOpen ? 'Leave blank while still on duty' : null}>
                <input type="time" value={values.timeOut} onChange={set('timeOut')} required={!canStayOpen} />
              </Field>
              <Field label="Break (minutes)" hint="Deducted on shifts over 5 hours" wide>
                <input type="number" min="0" step="5" value={values.breakMinutes} onChange={set('breakMinutes')} />
              </Field>
            </>
          ) : (
            <>
              <Field label="Hours" wide hint="Decimals are fine: 7.5 = 7 hours 30 minutes">
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  required
                  value={values.hours}
                  onChange={set('hours')}
                  placeholder={values.carryOver ? 'e.g. 120' : 'e.g. 8'}
                  autoFocus={!entry}
                />
              </Field>
              <label className="check field--wide">
                <input type="checkbox" checked={values.carryOver} onChange={set('carryOver')} />
                <span>
                  <strong>Covers several days</strong>
                  <small>A total from before you used this app. Counts toward your hours but not as one day present.</small>
                </span>
              </label>
            </>
          )}

          <Field label="Tasks / notes" wide>
            <textarea rows="3" value={values.notes} onChange={set('notes')} placeholder="What did you work on?" />
          </Field>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  )
}
