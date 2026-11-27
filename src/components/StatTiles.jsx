import { AlarmClock, CalendarDays, Gauge, Sun, TrendingUp } from 'lucide-react'
import { formatHours } from '../utils/time'

export default function StatTiles({ stats }) {
  const tiles = [
    { icon: Sun, label: 'Today', value: formatHours(stats.today) },
    { icon: TrendingUp, label: 'This week', value: formatHours(stats.week) },
    { icon: CalendarDays, label: 'Days present', value: stats.daysPresent },
    { icon: Gauge, label: 'Average a day', value: formatHours(stats.average) },
    { icon: AlarmClock, label: 'Late time-ins', value: stats.lateCount, warn: stats.lateCount > 0 },
  ]

  return (
    <section className="tiles">
      {tiles.map(({ icon: Icon, label, value, warn }) => (
        <div key={label} className="card tile">
          <span className={`tile__icon${warn ? ' tile__icon--warn' : ''}`}><Icon size={18} /></span>
          <div>
            <div className="tile__value">{value}</div>
            <div className="tile__label">{label}</div>
          </div>
        </div>
      ))}
    </section>
  )
}
