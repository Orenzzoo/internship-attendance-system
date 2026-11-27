import { Pencil, Trash2 } from 'lucide-react'
import { isForgotten, isHoursOnly, isLate, isOpen, workedMinutes } from '../utils/stats'
import { formatDate, formatHours, formatTime } from '../utils/time'

function timeLabel(entry, forgotten) {
  if (isHoursOnly(entry)) return entry.carryOver ? 'Earlier hours' : 'Hours logged'
  const end = forgotten ? '?' : entry.timeOut ? formatTime(entry.timeOut) : 'now'
  return `${formatTime(entry.timeIn)} – ${end}`
}

// One attendance entry. Edit/delete buttons only show when handlers are given.
export default function EntryRow({ entry, settings, now, onEdit, onDelete }) {
  const forgotten = isForgotten(entry, now)
  const ongoing = isOpen(entry) && !forgotten

  return (
    <li className="entry">
      <div className="entry__date">
        <strong>{formatDate(entry.date, { day: 'numeric' })}</strong>
        <span>{formatDate(entry.date, { month: 'short' })}</span>
      </div>

      <div className="entry__main">
        <div className="entry__times">
          {timeLabel(entry, forgotten)}
          <span className="entry__weekday">{formatDate(entry.date, { weekday: 'long' })}</span>
        </div>
        <div className="entry__tags">
          {ongoing && <span className="tag tag--info">On duty</span>}
          {forgotten && <span className="tag tag--danger">No time out</span>}
          {isLate(entry, settings) && <span className="tag tag--warn">Late</span>}
          {isHoursOnly(entry) && <span className="tag tag--gold">{entry.carryOver ? 'Several days' : 'Hours only'}</span>}
          {entry.manual && !isHoursOnly(entry) && <span className="tag">Added manually</span>}
        </div>
        {entry.notes && <p className="entry__notes">{entry.notes}</p>}
      </div>

      <div className="entry__hours">{formatHours(workedMinutes(entry, now))}</div>

      {(onEdit || onDelete) && (
        <div className="entry__actions">
          {onEdit && (
            <button type="button" className="icon-btn" onClick={() => onEdit(entry)} aria-label="Edit entry">
              <Pencil size={16} />
            </button>
          )}
          {onDelete && (
            <button type="button" className="icon-btn icon-btn--danger" onClick={() => onDelete(entry)} aria-label="Delete entry">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </li>
  )
}
