import { ACTION_METADATA } from '../../config/actionTypes'
import './InteractiveForm.css'

interface ActionSelectorProps {
  onSelect: (actionType: string) => void
  onCancel: () => void
}

/**
 * Component for selecting an interactive action type
 * Uses centralized action metadata from config/actionTypes
 */
const ActionSelector = ({ onSelect, onCancel }: ActionSelectorProps) => {
  return (
    <div className="action-selector">
      <h4>Select Interactive Action</h4>
      <p className="selector-description">Choose the type of interaction for this element</p>
      <div className="action-grid">
        {ACTION_METADATA.map(option => (
          <button
            key={option.type}
            className="action-option"
            onClick={() => onSelect(option.type)}
          >
            <span className="action-icon">{option.icon}</span>
            <span className="action-name">{option.name}</span>
            <span className="action-desc">{option.description}</span>
          </button>
        ))}
      </div>
      <div className="selector-actions">
        <button onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ActionSelector

