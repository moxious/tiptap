import { type ActionType } from './types'
import './InteractiveForm.css'

interface ActionOption {
  type: ActionType
  icon: string
  name: string
  description: string
}

const ACTION_OPTIONS: ActionOption[] = [
  {
    type: 'button',
    icon: '🔘',
    name: 'Button',
    description: 'Click a button',
  },
  {
    type: 'highlight',
    icon: '✨',
    name: 'Highlight',
    description: 'Highlight an element',
  },
  {
    type: 'formfill',
    icon: '📝',
    name: 'Form Fill',
    description: 'Fill an input field',
  },
  {
    type: 'navigate',
    icon: '🧭',
    name: 'Navigate',
    description: 'Go to a page',
  },
  {
    type: 'hover',
    icon: '👆',
    name: 'Hover',
    description: 'Reveal on hover',
  },
  {
    type: 'multistep',
    icon: '📋',
    name: 'Multistep',
    description: 'Multiple actions',
  },
]

interface ActionSelectorProps {
  onSelect: (actionType: ActionType) => void
  onCancel: () => void
}

/**
 * Component for selecting an interactive action type
 * Extracted from InteractiveSettingsPopover for better separation of concerns
 */
const ActionSelector = ({ onSelect, onCancel }: ActionSelectorProps) => {
  return (
    <div className="action-selector">
      <h4>Select Interactive Action</h4>
      <p className="selector-description">Choose the type of interaction for this element</p>
      <div className="action-grid">
        {ACTION_OPTIONS.map(option => (
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

