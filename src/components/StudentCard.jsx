import { formatHours } from '../utils/time'
import { initials, studentStatus } from '../utils/roster'
import ProgressBar from './ProgressBar'

export default function StudentCard({ row, onSelect }) {
  const { student, minutes, remaining, active } = row
  const status = studentStatus(row)

  return (
    <button
      type="button"
      className={`student${active ? ' is-on' : ''}`}
      onClick={() => onSelect(student.id)}
    >
      <span className="student__top">
        <span className="avatar-circle" aria-hidden="true">{initials(student.fullName)}</span>
        <span className="student__who">
          <span className="student__name">{student.fullName}</span>
          <span className={`pill pill--${status.tone}`}>
            {status.tone === 'ok' && <span className="pulse" aria-hidden="true" />}
            {status.label}
          </span>
        </span>
      </span>
      <ProgressBar minutes={minutes} requiredHours={student.requiredHours} size="sm" />
      <span className="student__hours">
        <span><strong>{formatHours(minutes)}</strong> of {student.requiredHours}h</span>
        <span>{remaining ? `${formatHours(remaining)} to go` : 'Done'}</span>
      </span>
    </button>
  )
}
