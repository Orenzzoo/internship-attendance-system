import { useEffect, useState } from 'react'

// Re-renders every `interval` ms so clocks and running totals stay live.
export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}
