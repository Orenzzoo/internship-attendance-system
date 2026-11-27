import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Base first so the other styles can override it.
import './index.css'
import './styles/layout.css'
import './styles/progress.css'
import './styles/kiosk.css'
import App from './App'
import AttendanceProvider from './store/AttendanceProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AttendanceProvider>
      <App />
    </AttendanceProvider>
  </StrictMode>,
)
