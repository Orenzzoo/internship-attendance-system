import { AlertCircle, FlaskConical, X } from 'lucide-react'
import { useAttendance } from '../store/context'

// Demo-mode notice and save errors, shown above every page.
export default function Banners() {
  const { isDemo, saveError, dismissError } = useAttendance()

  return (
    <>
      {isDemo && (
        <div className="banner banner--info no-print">
          <FlaskConical size={18} />
          <span>
            <strong>Demo mode.</strong> Not connected to Supabase, so hours are saved in this browser only
            and the class list shows sample students.
          </span>
        </div>
      )}
      {saveError && (
        <div className="banner banner--danger no-print" role="alert">
          <AlertCircle size={18} />
          <span><strong>Not saved.</strong> {saveError}</span>
          <button type="button" className="icon-btn" onClick={dismissError} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  )
}
