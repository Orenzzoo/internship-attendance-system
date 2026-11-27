// Horizontal bar toward the required hours. `ticks` adds 100-hour markers underneath.
export default function ProgressBar({ minutes, requiredHours, size = 'md', ticks = false }) {
  const percent = requiredHours ? Math.min(100, (minutes / (requiredHours * 60)) * 100) : 0
  const done = percent >= 100
  const marks = []
  if (ticks) for (let h = 0; h <= requiredHours; h += 100) marks.push(h)

  return (
    <div className={`bar bar--${size}`}>
      <div
        className="bar__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={requiredHours}
        aria-valuenow={Math.floor(minutes / 60)}
        aria-label={`${Math.floor(percent)}% of ${requiredHours} hours`}
      >
        <div className={`bar__fill${done ? ' bar__fill--done' : ''}`} style={{ width: `${percent}%` }} />
      </div>
      {ticks && (
        <div className="bar__ticks" aria-hidden="true">
          {marks.map((h) => (
            <span key={h} style={{ left: `${(h / requiredHours) * 100}%` }}>{h}h</span>
          ))}
        </div>
      )}
    </div>
  )
}
