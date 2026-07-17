import { X } from 'lucide-react'
import './ConfirmationModal.css'

function ConfirmationModal({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button type="button" className="icon-button" onClick={onCancel} aria-label="Close confirmation">
            <X size={16} />
          </button>
        </div>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={onCancel}>Cancel</button>
          <button type="button" className="primary-button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
