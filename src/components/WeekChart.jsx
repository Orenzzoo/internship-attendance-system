import { formatHours, toDateKey } from '../utils/time'

// Last 7 days as simple bars. Scale tops out at 8h unless a day went over.
export default function WeekChart({ days }) {
  const max = Math.max(8 * 60, ...days.map((d) => d.minutes))
  const todayKey = toDateKey(new Date())
  const total = days.reduce((sum, d) => sum + d.minutes, 0)

  return (
    <section className="card week">
      <div className="card__head">
        <h2>Last 7 days</h2>
        <span className="muted">{formatHours(total)}</span>
      </div>
      <div className="week__bars">
        {days.map((d) => (
          <div key={d.key} className={`week__day${d.key === todayKey ? ' is-today' : ''}`}>
            <span className="week__value">{d.minutes ? (d.minutes / 60).toFixed(1) : ''}</span>
            <div className="week__track" title={`${d.label}: ${formatHours(d.minutes)}`}>
              <div className="week__fill" style={{ height: `${(d.minutes / max) * 100}%` }} />
            </div>
            <span className="week__label">{d.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
