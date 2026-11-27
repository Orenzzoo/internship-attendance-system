import Field from './Field'

// Shared by onboarding and settings. `values`/`onChange` hold a settings-shaped object.
export default function ProfileFields({ values, onChange }) {
  const set = (key) => (e) => onChange({ ...values, [key]: e.target.value })

  return (
    <div className="form-grid">
      <Field label="Full name" wide>
        <input required value={values.name} onChange={set('name')} placeholder="Juan Dela Cruz" />
      </Field>
      <Field label="Student number">
        <input value={values.studentId} onChange={set('studentId')} placeholder="2022-123456" />
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
      <Field label="Required hours">
        <input
          type="number"
          min="1"
          step="1"
          required
          value={values.requiredHours}
          onChange={set('requiredHours')}
        />
      </Field>
      <Field label="Term">
        <input value={values.term} onChange={set('term')} placeholder="Term 2" />
      </Field>
    </div>
  )
}
