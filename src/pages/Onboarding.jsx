import { useState } from 'react'
import { ArrowRight, Clock, FileText, Target } from 'lucide-react'
import { useAttendance } from '../store/context'
import ProfileFields from '../components/ProfileFields'

const POINTS = [
  { icon: Clock, text: 'Time in and out with one tap' },
  { icon: Target, text: 'See how close you are to your required hours' },
  { icon: FileText, text: 'Print a monthly DTR for your supervisor to sign' },
]

export default function Onboarding() {
  const { settings, saveSettings } = useAttendance()
  const [values, setValues] = useState(settings)

  const submit = (e) => {
    e.preventDefault()
    saveSettings({ ...values, name: values.name.trim(), requiredHours: Number(values.requiredHours) })
  }

  return (
    <div className="onboard">
      <section className="onboard__hero">
        <span className="brand__mark brand__mark--lg" aria-hidden="true">NU</span>
        <p className="eyebrow">National University Fairview</p>
        <h1>Track your OJT hours without the spreadsheet.</h1>
        <ul className="onboard__points">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text}><Icon size={18} /> {text}</li>
          ))}
        </ul>
      </section>

      <form className="card onboard__form" onSubmit={submit}>
        <h2>Set up your profile</h2>
        <p className="muted">You can change any of this later in Settings.</p>
        <ProfileFields values={values} onChange={setValues} />
        <button className="btn btn--primary btn--block" type="submit">
          Get started <ArrowRight size={18} />
        </button>
      </form>
    </div>
  )
}
