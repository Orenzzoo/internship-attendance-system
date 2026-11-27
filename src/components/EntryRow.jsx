import { Pencil, Trash2 } from 'lucide-react'
import { isForgotten, isLate, workedMinutes } from '../utils/stats'
import { formatDate, formatHours, formatTime } from '../utils/time'

// One attendance entry. Edit/delete buttons only show when handlers are given.
export default function EntryRow({ entry, settings, now, onEdit, onDelete }) {
  const late = isLate(entry, settings)
  const forgotten = isForgotten(entry, now)
  const ongoing = !entry.timeOut && !forgotten

  return (
    <li className="entry">
      <div className="entry__date">
        <strong>{formatDate(entry.date, { day: 'numeric' })}</strong>
        <span>{formatDate(entry.date, { month: 'short' })}</span>
      </div>

      <div className="entry__main">
        <div className="entry__times">
          {formatTime(entry.timeIn)} – {ongoing ? 'now' : forgotten ? '?' : formatTime(entry.timeOut)}
          <span className="entry__weekday">{formatDate(entry.date, { weekday: 'long' })}</span>
        </div>
        <div className="entry__tags">
          {ongoing && <span className="tag tag--info">On duty</span>}
          {forgotten && <span className="tag tag--danger">No time out</span>}
          {late && <span className="tag tag--warn">Late</span>}
          {entry.manual && <span className="tag">Added manually</span>}
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
