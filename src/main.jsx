import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Base first so page styles can override it.
import './index.css'
import './styles/layout.css'
import './styles/today.css'
import './styles/pages.css'
import './styles/progress.css'
import './styles/print.css'
import App from './App'
import AttendanceProvider from './store/AttendanceProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AttendanceProvider>
      <App />
    </AttendanceProvider>
  </StrictMode>,
)
