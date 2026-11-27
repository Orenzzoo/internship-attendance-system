import { useState } from 'react'
import { ArrowRight, History } from 'lucide-react'
import { useAttendance } from '../store/context'
import { useNow } from '../utils/useNow'
import { computeStats, lastNDays, sortEntries } from '../utils/stats'
import { greeting } from '../utils/time'
import ClockCard from '../components/ClockCard'
import ProgressCard from '../components/ProgressCard'
import StatTiles from '../components/StatTiles'
import WeekChart from '../components/WeekChart'
import EntryRow from '../components/EntryRow'
import EntryModal from '../components/EntryModal'

export default function TodayPage({ onNavigate }) {
  const { entries, settings } = useAttendance()
  // Totals only need to move once a minute; the clock card ticks on its own.
  const now = useNow(30000)
  const stats = computeStats(entries, settings, now)
  const recent = sortEntries(entries).slice(0, 4)
  const [loggingPast, setLoggingPast] = useState(false)

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>{greeting(now)}, {settings.name.split(' ')[0]}</h1>
          <p className="muted">{settings.section} · {settings.company || 'Your internship'} · {settings.term}</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => setLoggingPast(true)}>
          <History size={18} /> Log past hours
        </button>
      </div>

      {!entries.length && (
        <div className="banner banner--gold">
          <History size={18} />
          <span>
            Already rendered hours before this app? <strong>Log past hours</strong> to add them as one
            total or day by day.
          </span>
        </div>
      )}

      <div className="today-grid">
        <ClockCard />
        <ProgressCard stats={stats} settings={settings} />
      </div>

      <StatTiles stats={stats} />

      <div className="today-grid today-grid--even">
        <WeekChart days={lastNDays(entries, 7, now)} />

        <section className="card">
          <div className="card__head">
            <h2>Recent entries</h2>
            <button type="button" className="link-btn" onClick={() => onNavigate('logs')}>
              See all <ArrowRight size={16} />
            </button>
          </div>
          {recent.length ? (
            <ul className="entries entries--compact">
              {recent.map((e) => (
                <EntryRow key={e.id} entry={e} settings={settings} now={now} />
              ))}
            </ul>
          ) : (
            <p className="empty">No entries yet. Tap <strong>Time in</strong> when you start your shift.</p>
          )}
        </section>
      </div>

      {loggingPast && <EntryModal mode="past" onClose={() => setLoggingPast(false)} />}
    </div>
  )
}
