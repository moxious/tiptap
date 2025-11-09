import { useState } from 'react'
import { type InteractiveFormProps } from './types'
import { COMMON_REQUIREMENTS } from '../../constants'
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

  const handleChange = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleApply = () => {
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
    if (field.type === 'checkbox') {
      return (
        <div key={field.id} className="form-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={values[field.id] || false}
              onChange={(e) => handleChange(field.id, e.target.checked)}
            />
            {field.label}
          </label>
          {field.hint && <span className="field-hint">{field.hint}</span>}
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
        />
        {field.hint && <span className="field-hint">{field.hint}</span>}
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

