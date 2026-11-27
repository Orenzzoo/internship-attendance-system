import { useAttendance } from '../store/context'

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

export default function Header({ tabs, active, onChange }) {
  const { settings } = useAttendance()

  return (
    <header className="header no-print">
      <div className="header__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">NU</span>
          <div>
            <div className="brand__title">OJT Attendance</div>
            <div className="brand__sub">NU Fairview · {settings.term}</div>
          </div>
        </div>

        <nav className="nav" aria-label="Main">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`nav__item${active === id ? ' is-active' : ''}`}
              aria-current={active === id ? 'page' : undefined}
              onClick={() => onChange(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="user" title={settings.name}>
          <span className="user__name">{settings.name.split(' ')[0]}</span>
          <span className="avatar">{initials(settings.name)}</span>
        </div>
      </div>
    </header>
  )
}
