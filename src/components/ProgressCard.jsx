import { CalendarCheck, PartyPopper } from 'lucide-react'
import { formatHours } from '../utils/time'

const RADIUS = 70
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProgressCard({ stats, settings }) {
  const done = stats.required > 0 && stats.remaining === 0
  const offset = CIRCUMFERENCE * (1 - stats.percent / 100)

  return (
    <section className="card progress">
      <div className="card__head">
        <h2>Progress to {settings.requiredHours} hours</h2>
      </div>

      <div className="progress__body">
        <div className="ring">
          <svg viewBox="0 0 180 180" role="img" aria-label={`${Math.floor(stats.percent)} percent complete`}>
            <circle className="ring__track" cx="90" cy="90" r={RADIUS} />
            <circle
              className={`ring__bar${done ? ' ring__bar--done' : ''}`}
              cx="90"
              cy="90"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="ring__label">
            <strong>{Math.floor(stats.percent)}%</strong>
            <span>complete</span>
          </div>
        </div>

        <dl className="progress__facts">
          <div>
            <dt>Rendered</dt>
            <dd>{formatHours(stats.total)}</dd>
          </div>
          <div>
            <dt>Remaining</dt>
            <dd>{formatHours(stats.remaining)}</dd>
          </div>
        </dl>
      </div>

      {done ? (
        <p className="progress__note progress__note--done">
          <PartyPopper size={18} /> You’ve completed your required hours. Congrats, Bulldog!
        </p>
      ) : stats.projection ? (
        <p className="progress__note">
          <CalendarCheck size={18} />
          <span>
            At about {formatHours(stats.dailyBasis)} a day, you’ll finish around{' '}
            <strong>
              {stats.projection.date.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
            </strong>{' '}
            ({stats.projection.days} more working {stats.projection.days === 1 ? 'day' : 'days'}).
          </span>
        </p>
      ) : null}
    </section>
  )
}
