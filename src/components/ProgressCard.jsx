import { CalendarCheck, PartyPopper } from 'lucide-react'
import { formatHours } from '../utils/time'
import ProgressBar from './ProgressBar'

export default function ProgressCard({ stats, settings }) {
  const done = stats.required > 0 && stats.remaining === 0

  return (
    <section className="card progress">
      <div className="card__head">
        <h2>Progress to {settings.requiredHours} hours</h2>
        <span className="progress__percent">{Math.floor(stats.percent)}%</span>
      </div>

      <div className="progress__numbers">
        <div>
          <strong>{formatHours(stats.total)}</strong>
          <span>rendered</span>
        </div>
        <div className="progress__left">
          <strong>{formatHours(stats.remaining)}</strong>
          <span>to go</span>
        </div>
      </div>

      <ProgressBar minutes={stats.total} requiredHours={settings.requiredHours} size="lg" ticks />

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
