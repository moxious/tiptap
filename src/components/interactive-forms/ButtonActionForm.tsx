import { useState } from 'react'
import { type InteractiveFormProps, COMMON_REQUIREMENTS } from './types'
import './InteractiveForm.css'

const ButtonActionForm = ({ editor, onApply, onCancel, initialValues }: InteractiveFormProps) => {
  const [buttonText, setButtonText] = useState(initialValues?.['data-reftarget'] || '')
  const [requirements, setRequirements] = useState(initialValues?.['data-requirements'] || 'exists-reftarget')

  const handleApply = () => {
    onApply({
      'data-targetaction': 'button',
      'data-reftarget': buttonText,
      'data-requirements': requirements,
      class: 'interactive',
    })
  }

  return (
    <div className="interactive-form">
      <h4>Button Click Action</h4>
      <p className="form-description">Click a button with specific text</p>
      
      <div className="form-field">
        <label htmlFor="button-text">Button Text:</label>
        <input
          id="button-text"
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          placeholder="e.g., Save, Create, Submit"
          autoFocus
        />
        <span className="field-hint">The exact text displayed on the button</span>
      </div>

      <div className="form-field">
        <label htmlFor="requirements">Requirements:</label>
        <input
          id="requirements"
          type="text"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="e.g., exists-reftarget"
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
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button 
          type="button" 
          onClick={handleApply} 
          className="btn-apply"
          disabled={!buttonText}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default ButtonActionForm

