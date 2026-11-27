import { Download, LogOut } from 'lucide-react'
import { useAttendance } from '../store/context'
import { download, entriesToCsv, slug } from '../utils/files'
import { toDateKey } from '../utils/time'

// Exports, and leaving this device. Hours themselves are kept in Supabase.
export default function DataCard() {
  const { settings, entries, forgetStudent, isDemo } = useAttendance()
  const base = `attendance-${slug(settings.name)}`

  const backup = () => {
    download(`${base}-${toDateKey(new Date())}.json`, JSON.stringify({ entries }, null, 2), 'application/json')
  }

  const leave = () => {
    if (window.confirm(`Stop using this device as ${settings.name}? Your hours stay saved and you can pick your name again any time.`)) {
      forgetStudent()
    }
  }

  return (
    <section className="card">
      <h2>Your data</h2>
      <p className="muted">
        {isDemo
          ? 'Demo mode: hours are saved in this browser only.'
          : 'Your hours are saved online, so you can time in on your phone and check them on a laptop.'}
      </p>

      <div className="data-actions">
        <button
          type="button"
          className="btn btn--ghost"
          disabled={!entries.length}
          onClick={() => download(`${base}.csv`, entriesToCsv(entries, settings), 'text/csv;charset=utf-8')}
        >
          <Download size={18} /> Export CSV
        </button>
        <button type="button" className="btn btn--ghost" disabled={!entries.length} onClick={backup}>
          <Download size={18} /> Download backup
        </button>
        <button type="button" className="btn btn--danger" onClick={leave}>
          <LogOut size={18} /> Not {settings.name.split(' ')[0]}? Switch student
        </button>
      </div>
    </section>
  )
}
