import { useNow } from '../utils/useNow'

export default function Header() {
  const now = useNow(1000)

  return (
    <header className="header">
      <div className="header__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">NU</span>
          <div>
            <div className="brand__title">OJT Attendance</div>
            <div className="brand__sub">National University Fairview</div>
          </div>
        </div>

        <div className="header__clock">
          <strong>{now.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</strong>
          <span>{now.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
    </header>
  )
}
