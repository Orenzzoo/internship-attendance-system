import { RefreshCw } from 'lucide-react'

// Full-page loading or error state, shown before the app has its data.
export default function StatusScreen({ title, message, onRetry }) {
  return (
    <div className="status-screen">
      <span className={`brand__mark brand__mark--lg${onRetry ? '' : ' is-loading'}`} aria-hidden="true">NU</span>
      <h1>{title}</h1>
      {message && <p className="muted">{message}</p>}
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          <RefreshCw size={18} /> Try again
        </button>
      )}
    </div>
  )
}
