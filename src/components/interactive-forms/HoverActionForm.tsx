import { useState } from 'react'
import { type InteractiveFormProps, COMMON_REQUIREMENTS } from './types'
import './InteractiveForm.css'

const HoverActionForm = ({ editor, onApply, onCancel, initialValues }: InteractiveFormProps) => {
  const [selector, setSelector] = useState(initialValues?.['data-reftarget'] || '')
  const [requirements, setRequirements] = useState(initialValues?.['data-requirements'] || 'exists-reftarget')

  const handleApply = () => {
    onApply({
      'data-targetaction': 'hover',
      'data-reftarget': selector,
      'data-requirements': requirements,
      class: 'interactive',
    })
  }

  return (
    <div className="interactive-form">
      <h4>Hover Action</h4>
      <p className="form-description">Reveal hover-hidden UI elements</p>
      
      <div className="form-field">
        <label htmlFor="selector">Element Selector:</label>
        <input
          id="selector"
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder='e.g., div[data-cy="item"]:has(p:contains("name"))'
          autoFocus
        />
        <span className="field-hint">CSS selector for the element to hover over</span>
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
          disabled={!selector}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default HoverActionForm

