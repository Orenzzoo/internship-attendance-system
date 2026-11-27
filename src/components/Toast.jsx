import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

// Confirmation after a time in/out, with a short window to undo a mis-tap.
export default function Toast({ message, undo, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 8000)
    return () => clearTimeout(id)
  }, [onClose])

  return (
    <div className="toast" role="status">
      <CheckCircle2 size={20} />
      <span>{message}</span>
      {undo && (
        <button
          type="button"
          onClick={() => {
            onClose()
            undo()
          }}
        >
          Undo
        </button>
      )}
    </div>
  )
}
