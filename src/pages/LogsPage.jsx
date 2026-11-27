import { useState } from 'react'
import { Download, History, Plus } from 'lucide-react'
import { useAttendance } from '../store/context'
import { useNow } from '../utils/useNow'
import { monthOptions, sortEntries, workedMinutes } from '../utils/stats'
import { formatDate, formatHours, formatMonth, monthKey } from '../utils/time'
import { download, entriesToCsv, slug } from '../utils/files'
import EntryRow from '../components/EntryRow'
import EntryModal from '../components/EntryModal'

export default function LogsPage() {
  const { entries, settings, deleteEntry } = useAttendance()
  const now = useNow(30000)
  const months = monthOptions(entries, now)
  const [month, setMonth] = useState('all')
  const [query, setQuery] = useState('')
  // null = closed, 'new' / 'past' = add form, otherwise the entry being edited
  const [editing, setEditing] = useState(null)

  const q = query.trim().toLowerCase()
  const shown = sortEntries(entries).filter(
    (e) => (month === 'all' || monthKey(e.date) === month) && (!q || e.notes?.toLowerCase().includes(q)),
  )
  const total = shown.reduce((sum, e) => sum + workedMinutes(e, now), 0)
  const days = new Set(shown.map((e) => e.date)).size

  const remove = (entry) => {
    if (window.confirm(`Delete the entry for ${formatDate(entry.date)}? This can’t be undone.`)) {
      deleteEntry(entry.id)
    }
  }

  const exportCsv = () => {
    download(`attendance-${slug(settings.name)}.csv`, entriesToCsv(entries, settings), 'text/csv;charset=utf-8')
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Attendance logs</h1>
          <p className="muted">Every time-in and time-out you’ve recorded.</p>
        </div>
        <div className="page__actions">
          <button type="button" className="btn btn--ghost" onClick={exportCsv} disabled={!entries.length}>
            <Download size={18} /> Export CSV
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => setEditing('past')}>
            <History size={18} /> Log past hours
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setEditing('new')}>
            <Plus size={18} /> Add entry
          </button>
        </div>
      </div>

      <section className="card">
        <div className="toolbar">
          <select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month">
            <option value="all">All months</option>
            {months.map((m) => <option key={m} value={m}>{formatMonth(m)}</option>)}
          </select>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks and notes"
            aria-label="Search notes"
          />
          <div className="toolbar__summary">
            <span><strong>{formatHours(total)}</strong> rendered</span>
            <span><strong>{days}</strong> {days === 1 ? 'day' : 'days'}</span>
          </div>
        </div>

        {shown.length ? (
          <ul className="entries">
            {shown.map((e) => (
              <EntryRow key={e.id} entry={e} settings={settings} now={now} onEdit={setEditing} onDelete={remove} />
            ))}
          </ul>
        ) : (
          <p className="empty">
            {entries.length ? 'No entries match.' : 'No entries yet. Forgot to time in? Use Add entry.'}
          </p>
        )}
      </section>

      {editing && (
        <EntryModal
          entry={typeof editing === 'string' ? null : editing}
          mode={editing === 'past' ? 'past' : 'times'}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
