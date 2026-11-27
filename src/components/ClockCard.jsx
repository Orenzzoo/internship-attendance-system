import { useState } from 'react'
import { AlertTriangle, LogIn, LogOut } from 'lucide-react'
import { useAttendance } from '../store/context'
import { useNow } from '../utils/useNow'
import { formatDate, formatElapsed, formatHours, formatLongDate, formatTime, toDateKey } from '../utils/time'
import { minutesOnDate } from '../utils/stats'
import EntryModal from './EntryModal'

export default function ClockCard() {
  const { entries, timeIn, timeOut } = useAttendance()
  const now = useNow(1000)
  const [note, setNote] = useState('')
  const [fixing, setFixing] = useState(null)

  const active = entries.find((e) => !e.timeOut)
  const todayKey = toDateKey(now)
  const forgotten = active && active.date !== todayKey
  const loggedToday = minutesOnDate(entries.filter((e) => e.timeOut), todayKey, now)

  const handleOut = () => {
    timeOut(note)
    setNote('')
  }

  return (
    <section className={`card clock${active && !forgotten ? ' clock--on' : ''}`}>
      <div className="clock__time">
        {now.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="clock__date">{formatLongDate(now)}</div>

      {forgotten && (
        <div className="notice notice--warn">
          <AlertTriangle size={18} />
          <div>
            <strong>You didn’t time out on {formatDate(active.date)}.</strong>
            <span> Set your time out for that day before timing in again.</span>
          </div>
          <button type="button" className="btn btn--small" onClick={() => setFixing(active)}>Set time out</button>
        </div>
      )}

      {active && !forgotten && (
        <>
          <div className="clock__status">
            <span className="pulse" aria-hidden="true" />
            On duty since {formatTime(active.timeIn)}
          </div>
          <div className="clock__elapsed">{formatElapsed(now - new Date(active.timeIn))}</div>
          <textarea
            className="clock__note"
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did you work on today? (optional, saved on time out)"
          />
          <button type="button" className="btn btn--out btn--big" onClick={handleOut}>
            <LogOut size={20} /> Time out
          </button>
        </>
      )}

      {!active && (
        <>
          <div className="clock__status clock__status--idle">
            {loggedToday > 0 ? `${formatHours(loggedToday)} logged today` : 'Not timed in yet'}
          </div>
          <button type="button" className="btn btn--primary btn--big" onClick={timeIn}>
            <LogIn size={20} /> {loggedToday > 0 ? 'Time in again' : 'Time in'}
          </button>
        </>
      )}

      {fixing && <EntryModal entry={fixing} onClose={() => setFixing(null)} />}
    </section>
  )
}
