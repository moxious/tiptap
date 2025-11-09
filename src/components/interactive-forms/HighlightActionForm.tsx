import { useState } from 'react'
import { type InteractiveFormProps, COMMON_REQUIREMENTS } from './types'
import './InteractiveForm.css'

const HighlightActionForm = ({ editor, onApply, onCancel, initialValues }: InteractiveFormProps) => {
  const [selector, setSelector] = useState(initialValues?.['data-reftarget'] || '')
  const [requirements, setRequirements] = useState(initialValues?.['data-requirements'] || 'exists-reftarget')
  const [showOnly, setShowOnly] = useState(initialValues?.['data-doit'] === 'false')

  const handleApply = () => {
    onApply({
      'data-targetaction': 'highlight',
      'data-reftarget': selector,
      'data-requirements': requirements,
      'data-doit': showOnly ? 'false' : null,
      class: 'interactive',
    })
  }

  return (
    <div className="interactive-form">
      <h4>Highlight Element Action</h4>
      <p className="form-description">Highlight a specific UI element</p>
      
      <div className="form-field">
        <label htmlFor="selector">CSS Selector:</label>
        <input
          id="selector"
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder='e.g., [data-testid="panel"], .my-class'
          autoFocus
        />
        <span className="field-hint">CSS selector for the element to highlight</span>
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

      <div className="form-field">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showOnly}
            onChange={(e) => setShowOnly(e.target.checked)}
          />
          Show-only (educational, no interaction required)
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button 
          type="button" 
          onClick={handleApply} 
          className="btn-apply"
          disabled={!selector}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default HighlightActionForm

