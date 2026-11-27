import { useState } from 'react'
import { Check } from 'lucide-react'
import { useAttendance } from '../store/context'
import ProfileFields from '../components/ProfileFields'
import Field from '../components/Field'
import DataCard from '../components/DataCard'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function SettingsPage() {
  const { settings, saveSettings } = useAttendance()
  const [values, setValues] = useState(settings)
  const [saved, setSaved] = useState(false)

  const update = (next) => {
    setValues(next)
    setSaved(false)
  }
  const set = (key) => (e) => update({ ...values, [key]: e.target.value })

  const toggleDay = (day) => {
    const days = values.workDays.includes(day)
      ? values.workDays.filter((d) => d !== day)
      : [...values.workDays, day].sort()
    update({ ...values, workDays: days })
  }

  const submit = (e) => {
    e.preventDefault()
    saveSettings({
      ...values,
      name: values.name.trim(),
      requiredHours: Number(values.requiredHours) || 400,
      breakMinutes: Number(values.breakMinutes) || 0,
      graceMinutes: Number(values.graceMinutes) || 0,
    })
    setSaved(true)
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Settings</h1>
          <p className="muted">Your profile, schedule and data.</p>
        </div>
      </div>

      <form className="settings" onSubmit={submit}>
        <section className="card">
          <h2>Profile</h2>
          <ProfileFields values={values} onChange={update} />
        </section>

        <section className="card">
          <h2>Schedule</h2>
          <p className="muted">Used to flag late time-ins and estimate your finish date.</p>
          <div className="form-grid">
            <Field label="Expected time in">
              <input type="time" value={values.expectedIn} onChange={set('expectedIn')} required />
            </Field>
            <Field label="Expected time out">
              <input type="time" value={values.expectedOut} onChange={set('expectedOut')} required />
            </Field>
            <Field label="Lunch break (minutes)" hint="Deducted on shifts over 5 hours">
              <input type="number" min="0" step="5" value={values.breakMinutes} onChange={set('breakMinutes')} />
            </Field>
            <Field label="Grace period (minutes)" hint="Time-ins after this count as late">
              <input type="number" min="0" step="1" value={values.graceMinutes} onChange={set('graceMinutes')} />
            </Field>
            <div className="field field--wide">
              <span className="field__label">Duty days</span>
              <div className="chips">
                {WEEKDAYS.map((label, day) => (
                  <button
                    key={label}
                    type="button"
                    className={`chip${values.workDays.includes(day) ? ' is-on' : ''}`}
                    aria-pressed={values.workDays.includes(day)}
                    onClick={() => toggleDay(day)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="settings__save">
          {saved && <span className="saved"><Check size={16} /> Saved</span>}
          <button type="submit" className="btn btn--primary">Save changes</button>
        </div>
      </form>

      {/* A restore replaces the settings, so refresh the form with them. */}
      <DataCard onRestored={(next) => { setValues(next); setSaved(false) }} />
    </div>
  )
}
