// Dropdown of the class list, grouped by section.
export default function StudentSelect({ students, value, onChange }) {
  const sections = [...new Set(students.map((s) => s.section))]

  return (
    <select required value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>Choose your name</option>
      {sections.map((section) => (
        <optgroup key={section} label={section}>
          {students
            .filter((s) => s.section === section)
            .map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </optgroup>
      ))}
    </select>
  )
}
