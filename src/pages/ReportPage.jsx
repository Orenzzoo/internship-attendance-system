import { useState } from 'react'
import { Printer } from 'lucide-react'
import { useAttendance } from '../store/context'
import { isForgotten, isHoursOnly, monthOptions, sortEntries, workedMinutes } from '../utils/stats'
import { formatDate, formatHours, formatMonth, formatTime, monthKey, toDecimalHours } from '../utils/time'

// Printable Daily Time Record for one month, ready for the supervisor's signature.
export default function ReportPage() {
  const { entries, settings } = useAttendance()
  const months = monthOptions(entries)
  const [month, setMonth] = useState(months[0])

  const rows = sortEntries(entries).reverse().filter((e) => monthKey(e.date) === month)
  const monthTotal = rows.reduce((sum, e) => sum + workedMinutes(e), 0)
  // Cumulative hours up to the end of the selected month.
  const toDate = entries
    .filter((e) => monthKey(e.date) <= month)
    .reduce((sum, e) => sum + workedMinutes(e), 0)

  const info = [
    ['Name', settings.name],
    ['Student no.', settings.studentNumber],
    ['Program / section', [settings.program, settings.section].filter(Boolean).join(' · ')],
    ['Company / office', settings.company],
    ['Supervisor', settings.supervisor],
    ['Period', formatMonth(month)],
  ]

  return (
    <div className="page">
      <div className="page__head no-print">
        <div>
          <h1>Daily time record</h1>
          <p className="muted">Pick a month, then print or save as PDF.</p>
        </div>
        <div className="page__actions">
          <select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month">
            {months.map((m) => <option key={m} value={m}>{formatMonth(m)}</option>)}
          </select>
          <button type="button" className="btn btn--primary" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      <article className="card dtr">
        <header className="dtr__head">
          <span className="brand__mark" aria-hidden="true">NU</span>
          <div>
            <div className="dtr__school">{settings.school}</div>
            <div className="dtr__title">On-the-job training · Daily time record · {settings.term}</div>
          </div>
        </header>

        <dl className="dtr__info">
          {info.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
        </dl>

        <div className="table-wrap">
          <table className="dtr__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time in</th>
                <th>Time out</th>
                <th className="num">Hours</th>
                <th>Tasks / remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>{formatDate(e.date)}</td>
                  {isHoursOnly(e) ? (
                    <td colSpan="2" className="muted">{e.carryOver ? 'Earlier hours (several days)' : 'Hours logged'}</td>
                  ) : (
                    <>
                      <td>{formatTime(e.timeIn)}</td>
                      <td>{e.timeOut ? formatTime(e.timeOut) : isForgotten(e) ? 'No time out' : 'On duty'}</td>
                    </>
                  )}
                  <td className="num">{toDecimalHours(workedMinutes(e))}</td>
                  <td className="dtr__notes">{e.notes}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan="5" className="empty">No entries this month.</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Total this month</td>
                <td className="num">{toDecimalHours(monthTotal)}</td>
                <td>{formatHours(monthTotal)}</td>
              </tr>
              <tr>
                <td colSpan="3">Total rendered to date</td>
                <td className="num">{toDecimalHours(toDate)}</td>
                <td>of {settings.requiredHours} required hours</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="dtr__signs">
          <div>
            <span className="dtr__line">{settings.name}</span>
            <span>Intern’s signature over printed name</span>
          </div>
          <div>
            <span className="dtr__line">{settings.supervisor}</span>
            <span>Supervisor’s signature over printed name</span>
          </div>
        </div>
      </article>
    </div>
  )
}
