import { useEffect, useState } from 'react'
import { Clock, FileText, ListChecks, Settings } from 'lucide-react'
import { useAttendance } from './store/context'
import Header from './components/Header'
import Onboarding from './pages/Onboarding'
import TodayPage from './pages/TodayPage'
import LogsPage from './pages/LogsPage'
import ReportPage from './pages/ReportPage'
import SettingsPage from './pages/SettingsPage'

const TABS = [
  { id: 'today', label: 'Today', icon: Clock },
  { id: 'logs', label: 'Logs', icon: ListChecks },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function tabFromHash() {
  const id = window.location.hash.slice(1)
  return TABS.some((t) => t.id === id) ? id : 'today'
}

export default function App() {
  const { settings } = useAttendance()
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

  if (!settings.name) return <Onboarding />

  return (
    <div className="app">
      <Header tabs={TABS} active={tab} onChange={go} />
      <main className="container">
        {tab === 'today' && <TodayPage onNavigate={go} />}
        {tab === 'logs' && <LogsPage />}
        {tab === 'report' && <ReportPage />}
        {tab === 'settings' && <SettingsPage />}
      </main>
      <footer className="footer no-print">
        {settings.school} · OJT {settings.term} · Data stays on this device
      </footer>
    </div>
  )
}
