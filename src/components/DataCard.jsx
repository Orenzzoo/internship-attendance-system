import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { useAttendance } from '../store/context'
import { download, entriesToCsv, readJsonFile, slug } from '../utils/files'
import { toDateKey } from '../utils/time'

// Backup, restore and reset. Data only lives in this browser, so backups matter.
export default function DataCard({ onRestored }) {
  const { settings, entries, replaceAll, resetAll } = useAttendance()
  const fileInput = useRef(null)
  const [message, setMessage] = useState(null)

  const backup = () => {
    const name = `attendance-backup-${slug(settings.name)}-${toDateKey(new Date())}.json`
    download(name, JSON.stringify({ settings, entries }, null, 2), 'application/json')
  }

  const restore = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const data = await readJsonFile(file)
      const count = Array.isArray(data.entries) ? data.entries.length : 0
      if (!window.confirm(`Replace everything on this device with ${count} entries from the backup?`)) return
      const restored = replaceAll(data)
      onRestored?.(restored.settings)
      setMessage({ ok: true, text: `Restored ${count} entries.` })
    } catch (err) {
      setMessage({ ok: false, text: err.message })
    }
  }

  const reset = () => {
    if (window.confirm('Delete your profile and all entries on this device? Download a backup first if you need it.')) {
      resetAll()
    }
  }

  return (
    <section className="card">
      <h2>Your data</h2>
      <p className="muted">
        Entries are saved in this browser only. Download a backup now and then, and restore it on
        another phone or laptop to continue there.
      </p>

      <div className="data-actions">
        <button type="button" className="btn btn--ghost" onClick={backup}>
          <Download size={18} /> Download backup
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => fileInput.current.click()}>
          <Upload size={18} /> Restore backup
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          disabled={!entries.length}
          onClick={() => download(`attendance-${slug(settings.name)}.csv`, entriesToCsv(entries, settings), 'text/csv;charset=utf-8')}
        >
          <Download size={18} /> Export CSV
        </button>
        <button type="button" className="btn btn--danger" onClick={reset}>
          <RotateCcw size={18} /> Reset everything
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={restore} />
      </div>

      {message && <p className={message.ok ? 'form-ok' : 'form-error'}>{message.text}</p>}
    </section>
  )
}
