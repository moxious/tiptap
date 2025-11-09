import { useState } from 'react'
import './InteractiveForm.css'

interface SequenceActionFormProps {
  onApply: (sectionId: string, requirements: string) => void
  onCancel: () => void
  initialSectionId?: string
  initialRequirements?: string
}

const SequenceActionForm = ({ onApply, onCancel, initialSectionId = '', initialRequirements = '' }: SequenceActionFormProps) => {
  const [sectionId, setSectionId] = useState(initialSectionId)
  const [requirements, setRequirements] = useState(initialRequirements)

  const handleApply = () => {
    onApply(sectionId, requirements)
  }

  return (
    <div className="interactive-form">
      <h4>Sequence (Section) Action</h4>
      <p className="form-description">A section containing multiple steps with a checkpoint</p>
      
      <div className="form-field">
        <label htmlFor="section-id">Section ID:</label>
        <input
          id="section-id"
          type="text"
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          placeholder="e.g., setup, configure, deploy"
          autoFocus
        />
        <span className="field-hint">Unique identifier for this section (used for dependencies)</span>
      </div>

      <div className="form-field">
        <label htmlFor="requirements">Requirements:</label>
        <input
          id="requirements"
          type="text"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="e.g., section-completed:previous-section"
        />
        <span className="field-hint">Optional: dependencies on other sections</span>
      </div>

      <div className="info-box">
        <strong>Note:</strong> Sequence actions typically wrap a heading and a list of steps. 
        After applying, add child elements inside this section.
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button 
          type="button" 
          onClick={handleApply} 
          className="btn-apply"
          disabled={!sectionId}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default SequenceActionForm

