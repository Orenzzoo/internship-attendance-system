import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useAttendance } from '../store/context'
import { combine, formatDate, formatTime } from '../utils/time'

// Someone timed in on an earlier day and never timed out. Ask when they left.
export default function FixTimeOut({ entry }) {
  const { busy, updateEntry } = useAttendance()
  const [time, setTime] = useState('17:00')
  const [error, setError] = useState('')

  const save = async (e) => {
    e.preventDefault()
    const out = combine(entry.date, time)
    if (out <= new Date(entry.timeIn)) return setError('That’s before the time in.')
    await updateEntry(entry.id, { timeOut: out.toISOString() })
  }

  return (
    <form className="notice notice--warn fix" onSubmit={save}>
      <AlertTriangle size={20} />
      <div className="fix__body">
        <strong>No time out on {formatDate(entry.date)}.</strong>
        <span>Timed in at {formatTime(entry.timeIn)}. What time did you leave?</span>
        <div className="fix__row">
          <input type="time" required value={time} onChange={(e) => { setTime(e.target.value); setError('') }} />
          <button type="submit" className="btn btn--primary" disabled={busy}>Save</button>
        </div>
        {error && <span className="form-error">{error}</span>}
      </div>
    </form>
  )
}
