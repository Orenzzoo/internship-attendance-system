import { useState } from 'react'
import { ArrowRight, Clock, FileText, Users } from 'lucide-react'
import { useAttendance } from '../store/context'
import Field from '../components/Field'
import ProfileFields from '../components/ProfileFields'
import StudentSelect from '../components/StudentSelect'

const POINTS = [
  { icon: Clock, text: 'Time in and out with one tap, or log past hours by hand' },
  { icon: Users, text: 'See your whole class’s progress to 400 hours' },
  { icon: FileText, text: 'Print a monthly DTR for your supervisor to sign' },
]

export default function Onboarding() {
  const { settings, students, chooseStudent } = useAttendance()
  const [studentId, setStudentId] = useState('')
  const [values, setValues] = useState(settings)

  const submit = (e) => {
    e.preventDefault()
    chooseStudent(studentId, values)
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
        <h2>Who are you?</h2>
        <p className="muted">Pick your name from the class list. The rest is optional and only shows on your DTR.</p>

        {students.length ? (
          <>
            <div className="form-grid">
              <Field label="Your name" wide>
                <StudentSelect students={students} value={studentId} onChange={setStudentId} />
              </Field>
            </div>
            <ProfileFields values={values} onChange={setValues} />
            <button className="btn btn--primary btn--block" type="submit" disabled={!studentId}>
              Get started <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <p className="empty">
            The class list is empty. Whoever set up Supabase needs to add the students
            (see the README).
          </p>
        )}
      </form>
    </div>
  )
}
