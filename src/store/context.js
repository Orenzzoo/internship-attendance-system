import { createContext, useContext } from 'react'

export const AttendanceContext = createContext(null)

export function useAttendance() {
  const value = useContext(AttendanceContext)
  if (!value) throw new Error('useAttendance must be used inside AttendanceProvider')
  return value
}
