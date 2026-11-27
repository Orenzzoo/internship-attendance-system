import { useCallback, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useAttendance } from '../store/context'
import { useNow } from '../utils/useNow'
import { buildRows, matchesQuery } from '../utils/roster'
import StudentCard from '../components/StudentCard'
import StudentPanel from '../components/StudentPanel'
import Toast from '../components/Toast'

// The only screen: find your name, tap it, time in or out.
export default function KioskPage() {
  const { students, entries } = useAttendance()
  const now = useNow(30000)
  const [query, setQuery] = useState('')
  const [section, setSection] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [toast, setToast] = useState(null)
  const searchRef = useRef(null)

  // A to Z by name across both sections, so a name is easy to spot.
  const rows = buildRows(students, entries, now)
    .sort((a, b) => a.student.fullName.localeCompare(b.student.fullName))
  const sections = [...new Set(students.map((s) => s.section))]
  const shown = rows.filter(
    (r) => (section === 'all' || r.student.section === section) && matchesQuery(r.student.fullName, query),
  )
  const onDuty = rows.filter((r) => r.active).length
  const selected = rows.find((r) => r.student.id === selectedId)

  // After a time in/out: close the panel, clear the search, show what happened.
  const finish = useCallback((result) => {
    setSelectedId(null)
    setQuery('')
    setToast({ ...result, id: Date.now() })
  }, [])

  const closeToast = useCallback(() => setToast(null), [])

  return (
    <div className="kiosk">
      <div className="kiosk__intro">
        <h1>Tap your name to time in or out</h1>
        <p className="muted">
          {onDuty ? `${onDuty} ${onDuty === 1 ? 'intern' : 'interns'} on duty now` : 'Nobody is on duty yet'}
        </p>
      </div>

      <div className="kiosk__filters">
        <label className="search">
          <Search size={20} aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your name"
            aria-label="Find your name"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="icon-btn"
              aria-label="Clear search"
              onClick={() => { setQuery(''); searchRef.current?.focus() }}
            >
              <X size={18} />
            </button>
          )}
        </label>

        <div className="chips" role="group" aria-label="Section">
          {['all', ...sections].map((s) => (
            <button
              key={s}
              type="button"
              className={`chip${section === s ? ' is-on' : ''}`}
              aria-pressed={section === s}
              onClick={() => setSection(s)}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {shown.length ? (
        <div className="student-grid">
          {shown.map((row) => (
            <StudentCard key={row.student.id} row={row} onSelect={setSelectedId} />
          ))}
        </div>
      ) : (
        <p className="empty card">No one matches “{query}”.</p>
      )}

      {selected && (
        <StudentPanel row={selected} onClose={() => setSelectedId(null)} onDone={finish} />
      )}
      {toast && <Toast key={toast.id} message={toast.message} undo={toast.undo} onClose={closeToast} />}
    </div>
  )
}
