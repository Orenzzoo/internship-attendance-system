import { Trash2 } from 'lucide-react'
import { useAttendance } from '../store/context'
import { isForgotten, isHoursOnly, isOpen, sortEntries, workedMinutes } from '../utils/stats'
import { formatDate, formatHours, formatTime } from '../utils/time'

function describe(entry) {
  if (isHoursOnly(entry)) return entry.carryOver ? 'Earlier hours' : 'Hours added'
  if (isForgotten(entry)) return `${formatTime(entry.timeIn)} – no time out`
  return `${formatTime(entry.timeIn)} – ${isOpen(entry) ? 'now' : formatTime(entry.timeOut)}`
}

// The last few entries, so a wrong one can be removed.
export default function RecentEntries({ entries }) {
  const { busy, deleteEntry } = useAttendance()
  const recent = sortEntries(entries).slice(0, 4)
  if (!recent.length) return null

  const remove = (entry) => {
    if (window.confirm(`Delete the ${formatDate(entry.date)} entry (${describe(entry)})? This can’t be undone.`)) {
      deleteEntry(entry.id)
    }
  }

  return (
    <div className="recent">
      <h3>Recent</h3>
      <ul>
        {recent.map((e) => (
          <li key={e.id}>
            <span className="recent__date">{formatDate(e.date)}</span>
            <span className="recent__times">{describe(e)}</span>
            <span className="recent__hours">{formatHours(workedMinutes(e))}</span>
            <button
              type="button"
              className="icon-btn icon-btn--danger"
              onClick={() => remove(e)}
              disabled={busy}
              aria-label={`Delete ${formatDate(e.date)} entry`}
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
