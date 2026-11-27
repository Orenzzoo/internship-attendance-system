import { breakApplied, isLate, sortEntries, workedMinutes } from './stats'
import { formatTime, toDecimalHours } from './time'

export function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

export function entriesToCsv(entries, settings) {
  const header = ['Date', 'Time in', 'Time out', 'Break (min)', 'Hours', 'Late', 'Tasks / notes']
  const rows = sortEntries(entries).reverse().map((e) => [
    e.date,
    formatTime(e.timeIn),
    e.timeOut ? formatTime(e.timeOut) : 'Ongoing',
    breakApplied(e),
    toDecimalHours(workedMinutes(e)),
    isLate(e, settings) ? 'Yes' : '',
    e.notes,
  ])
  return [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n')
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result))
      } catch {
        reject(new Error('That file is not valid JSON.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsText(file)
  })
}

export function slug(text) {
  return (text || 'intern').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
