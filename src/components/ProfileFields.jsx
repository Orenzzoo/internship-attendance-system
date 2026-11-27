import Field from './Field'

// Personal details used on the DTR. Shared by onboarding and settings.
export default function ProfileFields({ values, onChange }) {
  const set = (key) => (e) => onChange({ ...values, [key]: e.target.value })

  return (
    <div className="form-grid">
      <Field label="Student number">
        <input value={values.studentNumber} onChange={set('studentNumber')} placeholder="2022-123456" />
      </Field>
      <Field label="Program">
        <input value={values.program} onChange={set('program')} placeholder="BS Information Technology" />
      </Field>
      <Field label="Company / office" wide>
        <input value={values.company} onChange={set('company')} placeholder="Where you're interning" />
      </Field>
      <Field label="Supervisor">
        <input value={values.supervisor} onChange={set('supervisor')} placeholder="Name of your supervisor" />
      </Field>
      <Field label="Start date">
        <input type="date" value={values.startDate} onChange={set('startDate')} />
      </Field>
    </div>
  )
}
