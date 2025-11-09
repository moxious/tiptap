import { useState } from 'react'
import { validateSectionId, validateRequirement } from '../../services/validation'
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
  const [validationErrors, setValidationErrors] = useState<{ sectionId?: string; requirements?: string }>({})

  const handleSectionIdChange = (value: string) => {
    setSectionId(value)
    // Clear validation error when user starts typing
    if (validationErrors.sectionId) {
      setValidationErrors(prev => ({ ...prev, sectionId: undefined }))
    }
  }

  const handleRequirementsChange = (value: string) => {
    setRequirements(value)
    // Clear validation error when user starts typing
    if (validationErrors.requirements) {
      setValidationErrors(prev => ({ ...prev, requirements: undefined }))
    }
  }

  const handleApply = () => {
    // Validate inputs before applying
    const errors: { sectionId?: string; requirements?: string } = {}

    // Validate section ID (required)
    if (!sectionId.trim()) {
      errors.sectionId = 'Section ID is required'
    } else {
      const idValidation = validateSectionId(sectionId)
      if (!idValidation.valid) {
        errors.sectionId = idValidation.error
      }
    }

    // Validate requirements (optional)
    if (requirements.trim()) {
      const reqValidation = validateRequirement(requirements)
      if (!reqValidation.valid) {
        errors.requirements = reqValidation.error
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return // Don't apply if there are validation errors
    }

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
          onChange={(e) => handleSectionIdChange(e.target.value)}
          placeholder="e.g., setup, configure, deploy"
          autoFocus
          className={validationErrors.sectionId ? 'error' : ''}
          aria-required="true"
          aria-invalid={validationErrors.sectionId ? 'true' : 'false'}
          aria-describedby={validationErrors.sectionId ? 'section-id-error' : 'section-id-hint'}
        />
        {validationErrors.sectionId && (
          <span id="section-id-error" className="field-error" role="alert">
            {validationErrors.sectionId}
          </span>
        )}
        {!validationErrors.sectionId && (
          <span id="section-id-hint" className="field-hint">
            Unique identifier for this section (used for dependencies)
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="requirements">Requirements:</label>
        <input
          id="requirements"
          type="text"
          value={requirements}
          onChange={(e) => handleRequirementsChange(e.target.value)}
          placeholder="e.g., section-completed:previous-section"
          className={validationErrors.requirements ? 'error' : ''}
          aria-invalid={validationErrors.requirements ? 'true' : 'false'}
          aria-describedby={validationErrors.requirements ? 'requirements-error' : 'requirements-hint'}
        />
        {validationErrors.requirements && (
          <span id="requirements-error" className="field-error" role="alert">
            {validationErrors.requirements}
          </span>
        )}
        {!validationErrors.requirements && (
          <span id="requirements-hint" className="field-hint">
            Optional: dependencies on other sections
          </span>
        )}
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

