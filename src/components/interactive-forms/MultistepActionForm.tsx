import { useState } from 'react'
import { type InteractiveFormProps, COMMON_REQUIREMENTS } from './types'
import './InteractiveForm.css'

const MultistepActionForm = ({ editor, onApply, onCancel, initialValues }: InteractiveFormProps) => {
  const [requirements, setRequirements] = useState(initialValues?.['data-requirements'] || '')

  const handleApply = () => {
    onApply({
      'data-targetaction': 'multistep',
      'data-requirements': requirements,
      class: 'interactive',
    })
  }

  return (
    <div className="interactive-form">
      <h4>Multistep Action</h4>
      <p className="form-description">Multiple related actions in sequence (typically contains nested interactive spans)</p>
      
      <div className="form-field">
        <label htmlFor="requirements">Requirements:</label>
        <input
          id="requirements"
          type="text"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="e.g., exists-reftarget (optional)"
          autoFocus
        />
        <div className="common-options">
          {COMMON_REQUIREMENTS.slice(0, 3).map(req => (
            <button
              key={req}
              type="button"
              className="option-chip"
              onClick={() => setRequirements(req)}
            >
              {req}
            </button>
          ))}
        </div>
        <span className="field-hint">Requirements are usually set on child interactive spans</span>
      </div>

      <div className="info-box">
        <strong>Note:</strong> Multistep actions typically contain nested interactive spans. 
        After applying, add child elements with their own interactive markup inside this list item.
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button 
          type="button" 
          onClick={handleApply} 
          className="btn-apply"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default MultistepActionForm

