import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAttendance } from '../store/context'
import { api } from '../api'
import { useNow } from '../utils/useNow'
import { buildRoster } from '../utils/roster'
import { formatHours } from '../utils/time'
import ProgressBar from '../components/ProgressBar'
import RosterRow from '../components/RosterRow'

const REFRESH_MS = 60000

export default function ClassPage() {
  const { settings, students, student, entries: myEntries } = useAttendance()
  const now = useNow(30000)
  const [allEntries, setAllEntries] = useState(null)
  const [error, setError] = useState('')
  const [sort, setSort] = useState('name')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setAllEntries(await api.listAllEntries())
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Reload when my own entries change, and every minute while the page is open.
  useEffect(() => {
    load()
  }, [load, myEntries])

  useEffect(() => {
    const id = setInterval(() => document.visibilityState === 'visible' && load(), REFRESH_MS)
    return () => clearInterval(id)
  }, [load])

  if (!allEntries) {
    return (
      <div className="page">
        <h1>Class progress</h1>
        <section className="card">
          <p className="empty">{error ? `Couldn’t load the class list: ${error}` : 'Loading the class list…'}</p>
        </section>
      </div>
    )
  }

  const { sections, classTotal, classProgress, required, finished } = buildRoster(students, allEntries, now, sort)

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Class progress</h1>
          <p className="muted">Everyone’s hours toward the {settings.requiredHours}-hour requirement.</p>
        </div>
        <div className="page__actions">
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
            <option value="name">Sort by name</option>
            <option value="hours">Most hours first</option>
          </select>
          <button type="button" className="btn btn--ghost" onClick={load} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {error && <div className="banner banner--danger">Couldn’t refresh: {error}</div>}

      <section className="card class-summary">
        <div className="class-summary__stats">
          <div><strong>{students.length}</strong><span>students</span></div>
          <div><strong>{formatHours(classTotal / Math.max(1, students.length))}</strong><span>average each</span></div>
          <div><strong>{finished}</strong><span>finished</span></div>
        </div>
        <div>
          <div className="class-summary__label">
            Whole class: {Math.floor((classProgress / Math.max(1, required)) * 100)}% of everyone’s required hours
          </div>
          <ProgressBar minutes={classProgress} requiredHours={required / 60} />
        </div>
      </section>

      {sections.map(({ section, rows, total }) => (
        <section key={section} className="card">
          <div className="card__head">
            <h2>{section}</h2>
            <span className="muted">{rows.length} students · {formatHours(total)}</span>
          </div>
          <ul className="roster">
            {rows.map((row) => (
              <RosterRow key={row.student.id} row={row} isMe={row.student.id === student?.id} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
