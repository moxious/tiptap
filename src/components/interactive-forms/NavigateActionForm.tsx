import { useState } from 'react'
import { type InteractiveFormProps } from './types'
import './InteractiveForm.css'

const NavigateActionForm = ({ editor, onApply, onCancel, initialValues }: InteractiveFormProps) => {
  const [path, setPath] = useState(initialValues?.['data-reftarget'] || '')
  const [requirements, setRequirements] = useState(initialValues?.['data-requirements'] || '')

  const handleApply = () => {
    onApply({
      'data-targetaction': 'navigate',
      'data-reftarget': path,
      'data-requirements': requirements || `on-page:${path}`,
      class: 'interactive',
    })
  }

  return (
    <div className="interactive-form">
      <h4>Navigate Action</h4>
      <p className="form-description">Navigate to a specific page</p>
      
      <div className="form-field">
        <label htmlFor="path">Page Path:</label>
        <input
          id="path"
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="e.g., /dashboards, /datasources"
          autoFocus
        />
        <span className="field-hint">The URL path to navigate to</span>
      </div>

      <div className="form-field">
        <label htmlFor="requirements">Requirements:</label>
        <input
          id="requirements"
          type="text"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder={`Auto: on-page:${path || '/path'}`}
        />
        <span className="field-hint">Leave blank to auto-generate on-page requirement</span>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button 
          type="button" 
          onClick={handleApply} 
          className="btn-apply"
          disabled={!path}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default NavigateActionForm

