import { CheckCircle2 } from 'lucide-react'
import { formatDate, formatHours } from '../utils/time'
import ProgressBar from './ProgressBar'

function initials(name) {
  return name.split(/\s+/).filter((p) => /^[A-Za-z]/.test(p)).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

// One student in the class list: name, hours, and a bar toward their requirement.
export default function RosterRow({ row, isMe }) {
  const { student, minutes, remaining, percent, onDuty, lastDate } = row
  const done = remaining === 0

  return (
    <li className={`roster__row${isMe ? ' is-me' : ''}`}>
      <span className="roster__avatar" aria-hidden="true">{initials(student.fullName)}</span>

      <div className="roster__main">
        <div className="roster__name">
          <span>{student.fullName}</span>
          {isMe && <span className="tag tag--info">You</span>}
          {onDuty && <span className="tag tag--ok">On duty</span>}
          {done && <span className="tag tag--gold"><CheckCircle2 size={12} /> Done</span>}
        </div>
        <ProgressBar minutes={minutes} requiredHours={student.requiredHours} size="sm" />
        <div className="roster__meta">
          {done ? 'Completed' : `${formatHours(remaining)} to go`}
          {lastDate && ` · last logged ${formatDate(lastDate, { month: 'short', day: 'numeric' })}`}
        </div>
      </div>

      <div className="roster__hours">
        <strong>{formatHours(minutes)}</strong>
        <span>{Math.floor(percent)}%</span>
      </div>
    </li>
  )
}
