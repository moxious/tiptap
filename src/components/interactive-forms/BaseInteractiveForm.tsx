import { useState } from 'react'
import { type InteractiveFormProps } from './types'
import { COMMON_REQUIREMENTS, DATA_ATTRIBUTES } from '../../constants'
import { validateCssSelector, validateText, validateRequirement } from '../../services/validation'
import './InteractiveForm.css'

export interface FormField {
  id: string
  label: string
  type: 'text' | 'checkbox'
  placeholder?: string
  hint?: string
  defaultValue?: string | boolean
  required?: boolean
  autoFocus?: boolean
  showCommonOptions?: boolean
}

export interface BaseInteractiveFormConfig {
  title: string
  description: string
  actionType: string
  fields: FormField[]
  infoBox?: string
  buildAttributes: (values: Record<string, any>) => any
}

interface BaseInteractiveFormProps extends InteractiveFormProps {
  config: BaseInteractiveFormConfig
}

/**
 * Base form component for all interactive action types
 * Eliminates duplication across form components by providing a common structure
 */
const BaseInteractiveForm = ({ 
  config, 
  onApply, 
  onCancel, 
  initialValues 
}: BaseInteractiveFormProps) => {
  // Initialize state based on field configuration
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    config.fields.forEach(field => {
      if (initialValues && (initialValues as any)[field.id] !== undefined) {
        initial[field.id] = (initialValues as any)[field.id]
      } else if (field.defaultValue !== undefined) {
        initial[field.id] = field.defaultValue
      } else {
        initial[field.id] = field.type === 'checkbox' ? false : ''
      }
    })
    return initial
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
    // Clear validation error for this field when user starts typing
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const validateField = (field: FormField, value: any): string | null => {
    if (field.type === 'checkbox') {
      return null // Checkboxes don't need validation
    }

    const stringValue = String(value || '').trim()

    // Skip validation for optional empty fields
    if (!field.required && stringValue === '') {
      return null
    }

    // Required field validation
    if (field.required && stringValue === '') {
      return `${field.label.replace(':', '')} is required`
    }

    // Validate based on field type/purpose
    // CSS selectors (data-reftarget for highlight, formfill, hover)
    if (field.id === DATA_ATTRIBUTES.REF_TARGET && 
        config.actionType !== 'button' && 
        config.actionType !== 'navigate') {
      const result = validateCssSelector(stringValue)
      if (!result.valid) {
        return result.error || 'Invalid selector'
      }
    }

    // Requirements field
    if (field.id === DATA_ATTRIBUTES.REQUIREMENTS && stringValue !== '') {
      const result = validateRequirement(stringValue)
      if (!result.valid) {
        return result.error || 'Invalid requirement'
      }
    }

    // Button text and other text fields
    if (field.id === DATA_ATTRIBUTES.REF_TARGET && stringValue !== '') {
      const result = validateText(stringValue, field.label.replace(':', ''))
      if (!result.valid) {
        return result.error || 'Invalid text'
      }
    }

    return null
  }

  const handleApply = () => {
    // Validate all fields before applying
    const errors: Record<string, string> = {}
    
    config.fields.forEach(field => {
      const error = validateField(field, values[field.id])
      if (error) {
        errors[field.id] = error
      }
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return // Don't apply if there are validation errors
    }

    const attributes = config.buildAttributes(values)
    onApply(attributes)
  }

  const isValid = () => {
    return config.fields
      .filter(f => f.required)
      .every(f => {
        const value = values[f.id]
        return f.type === 'checkbox' ? true : (value && value.trim() !== '')
      })
  }

  const renderField = (field: FormField) => {
    const errorId = `${field.id}-error`
    const hintId = `${field.id}-hint`
    
    if (field.type === 'checkbox') {
      return (
        <div key={field.id} className="form-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={values[field.id] || false}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              aria-describedby={field.hint ? hintId : undefined}
            />
            {field.label}
          </label>
          {field.hint && <span id={hintId} className="field-hint">{field.hint}</span>}
        </div>
      )
    }

    return (
      <div key={field.id} className="form-field">
        <label htmlFor={field.id}>{field.label}</label>
        <input
          id={field.id}
          type="text"
          value={values[field.id] || ''}
          onChange={(e) => handleChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          autoFocus={field.autoFocus}
          className={validationErrors[field.id] ? 'error' : ''}
          aria-required={field.required ? 'true' : undefined}
          aria-invalid={validationErrors[field.id] ? 'true' : 'false'}
          aria-describedby={
            validationErrors[field.id] 
              ? errorId 
              : field.hint 
                ? hintId 
                : undefined
          }
        />
        {validationErrors[field.id] && (
          <span id={errorId} className="field-error" role="alert">
            {validationErrors[field.id]}
          </span>
        )}
        {!validationErrors[field.id] && field.hint && (
          <span id={hintId} className="field-hint">{field.hint}</span>
        )}
        {field.showCommonOptions && (
          <div className="common-options">
            {COMMON_REQUIREMENTS.slice(0, 3).map(req => (
              <button
                key={req}
                type="button"
                className="option-chip"
                onClick={() => handleChange(field.id, req)}
              >
                {req}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="interactive-form">
      <h4>{config.title}</h4>
      <p className="form-description">{config.description}</p>
      
      {config.fields.map(renderField)}

      {config.infoBox && (
        <div className="info-box">
          <strong>Note:</strong> {config.infoBox}
        </div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button 
          type="button" 
          onClick={handleApply} 
          className="btn-apply"
          disabled={!isValid()}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default BaseInteractiveForm

