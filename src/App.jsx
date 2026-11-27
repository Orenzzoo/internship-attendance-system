import { useAttendance } from './store/context'
import Header from './components/Header'
import StatusScreen from './components/StatusScreen'
import Banners from './components/Banners'
import KioskPage from './pages/KioskPage'

export default function App() {
  const { status, loadError, reload } = useAttendance()

  if (status === 'loading') return <StatusScreen title="Loading the class list…" />
  if (status === 'error') {
    return (
      <StatusScreen
        title="Can’t reach the database"
        message={`${loadError}. Check the internet connection, then try again.`}
        onRetry={reload}
      />
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Banners />
        <KioskPage />
      </main>
      <footer className="footer">National University Fairview · OJT attendance</footer>
    </div>
  )
}
