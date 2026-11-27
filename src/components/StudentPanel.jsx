import { useEffect, useState } from 'react'
import { History, LogIn, LogOut, X } from 'lucide-react'
import { useAttendance } from '../store/context'
import { useNow } from '../utils/useNow'
import { firstName, initials } from '../utils/roster'
import { workedMinutes } from '../utils/stats'
import { formatElapsed, formatHours, formatTime } from '../utils/time'
import ProgressBar from './ProgressBar'
import FixTimeOut from './FixTimeOut'
import PastHoursForm from './PastHoursForm'
import RecentEntries from './RecentEntries'

// Opens when a name is tapped: one big Time in / Time out button, plus progress and past hours.
export default function StudentPanel({ row, onClose, onDone }) {
  const { busy, timeIn, timeOut, deleteEntry, updateEntry } = useAttendance()
  const now = useNow(1000)
  const [note, setNote] = useState('')
  const [addingPast, setAddingPast] = useState(false)
  const { student, active, forgotten, minutes, remaining, todayMinutes, lastOutToday } = row
  const name = firstName(student.fullName)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleIn = async () => {
    const saved = await timeIn(student.id)
    if (!saved) return
    onDone({
      message: `${name} timed in at ${formatTime(saved.timeIn)}`,
      undo: () => deleteEntry(saved.id),
    })
  }

  const handleOut = async () => {
    const result = await timeOut(student.id, note)
    if (!result) return
    const { saved, previous } = result
    onDone({
      message: `${name} timed out at ${formatTime(saved.timeOut)} · ${formatHours(workedMinutes(saved))} this shift`,
      undo: () => updateEntry(saved.id, { timeOut: null, notes: previous.notes }),
    })
  }

  const handlePastSaved = (saved) => {
    onDone({ message: `Added ${formatHours(saved.minutes)} for ${name}`, undo: () => deleteEntry(saved.id) })
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="panel-title" onMouseDown={onClose}>
      <div className="modal__panel card panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="panel__head">
          <span className="avatar-circle avatar-circle--lg" aria-hidden="true">{initials(student.fullName)}</span>
          <div>
            <h2 id="panel-title">{student.fullName}</h2>
            <span className="muted">{student.section}</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {addingPast ? (
          <PastHoursForm studentId={student.id} onCancel={() => setAddingPast(false)} onSaved={handlePastSaved} />
        ) : (
          <>
            {forgotten && <FixTimeOut entry={forgotten} />}

            {active ? (
              <div className="panel__action">
                <div className="panel__status panel__status--on">
                  <span className="pulse" aria-hidden="true" /> On duty since {formatTime(active.timeIn)}
                </div>
                <div className="panel__elapsed">{formatElapsed(now - new Date(active.timeIn))}</div>
                <textarea
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What did you work on today? (optional)"
                />
                <button type="button" className="btn btn--out btn--big" onClick={handleOut} disabled={busy}>
                  <LogOut size={22} /> {busy ? 'Saving…' : 'Time out'}
                </button>
              </div>
            ) : (
              <div className="panel__action">
                <div className="panel__status">
                  {lastOutToday
                    ? `Timed out at ${formatTime(lastOutToday)} · ${formatHours(todayMinutes)} today`
                    : 'Not timed in today'}
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--big"
                  onClick={handleIn}
                  disabled={busy || !!forgotten}
                  autoFocus
                >
                  <LogIn size={22} /> {busy ? 'Saving…' : lastOutToday ? 'Time in again' : 'Time in'}
                </button>
              </div>
            )}

            <div className="panel__progress">
              <div className="panel__progress-head">
                <strong>{formatHours(minutes)}</strong>
                <span>{remaining ? `${formatHours(remaining)} to go` : 'Completed'}</span>
              </div>
              <ProgressBar minutes={minutes} requiredHours={student.requiredHours} size="lg" ticks />
            </div>

            <RecentEntries entries={row.entries} />

            <button type="button" className="link-btn panel__past" onClick={() => setAddingPast(true)}>
              <History size={16} /> Log hours from before this app
            </button>
          </>
        )}
      </div>
    </div>
  )
}
