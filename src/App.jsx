import { useEffect, useState } from 'react'
import { Clock, FileText, ListChecks, Settings, Users } from 'lucide-react'
import { useAttendance } from './store/context'
import Header from './components/Header'
import StatusScreen from './components/StatusScreen'
import Banners from './components/Banners'
import Onboarding from './pages/Onboarding'
import TodayPage from './pages/TodayPage'
import LogsPage from './pages/LogsPage'
import ClassPage from './pages/ClassPage'
import ReportPage from './pages/ReportPage'
import SettingsPage from './pages/SettingsPage'

const TABS = [
  { id: 'today', label: 'Today', icon: Clock },
  { id: 'logs', label: 'Logs', icon: ListChecks },
  { id: 'class', label: 'Class', icon: Users },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function tabFromHash() {
  const id = window.location.hash.slice(1)
  return TABS.some((t) => t.id === id) ? id : 'today'
}

export default function App() {
  const { settings, student, status, loadError, reload } = useAttendance()
  const [tab, setTab] = useState(tabFromHash)

  // Keep the tab in the URL so refresh and the back button work.
  useEffect(() => {
    const onHash = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (id) => {
    window.location.hash = id
    window.scrollTo({ top: 0 })
  }

  if (status === 'loading') return <StatusScreen title="Loading your hours…" />
  if (status === 'error') {
    return (
      <StatusScreen
        title="Can’t reach the database"
        message={`${loadError}. Check your internet connection, then try again.`}
        onRetry={reload}
      />
    )
  }
  if (!student) return <Onboarding />

  return (
    <div className="app">
      <Header tabs={TABS} active={tab} onChange={go} />
      <main className="container">
        <Banners />
        {tab === 'today' && <TodayPage onNavigate={go} />}
        {tab === 'logs' && <LogsPage />}
        {tab === 'class' && <ClassPage />}
        {tab === 'report' && <ReportPage />}
        {tab === 'settings' && <SettingsPage />}
      </main>
      <footer className="footer no-print">
        {settings.school} · OJT {settings.term}
      </footer>
    </div>
  )
}
