import { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { type ActionType, type InteractiveAttributes } from './interactive-forms/types'
import ButtonActionForm from './interactive-forms/ButtonActionForm'
import HighlightActionForm from './interactive-forms/HighlightActionForm'
import FormFillActionForm from './interactive-forms/FormFillActionForm'
import NavigateActionForm from './interactive-forms/NavigateActionForm'
import HoverActionForm from './interactive-forms/HoverActionForm'
import MultistepActionForm from './interactive-forms/MultistepActionForm'
import './InteractiveSettingsPopover.css'

interface InteractiveSettingsPopoverProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
  editState?: {
    type: 'listItem' | 'sequence' | 'span' | 'comment' | null
    attrs: Record<string, any>
    pos: number
  } | null
}

const InteractiveSettingsPopover = ({
  editor,
  isOpen,
  onClose,
  anchorEl,
  editState,
}: InteractiveSettingsPopoverProps) => {
  const [selectedAction, setSelectedAction] = useState<ActionType | ''>('')
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelectedAction('')
    } else if (editState?.attrs) {
      // If editing, pre-select the action type
      const actionType = editState.attrs['data-targetaction'] as ActionType
      if (actionType) {
        setSelectedAction(actionType)
      }
    }
  }, [isOpen, editState])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        // If anchor is document.body, we should close on any outside click
        // Otherwise, also check if click is outside anchor
        if (anchorEl === document.body || (anchorEl && !anchorEl.contains(event.target as Node))) {
          onClose()
        }
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose, anchorEl])

  const handleApply = (attributes: InteractiveAttributes) => {
    // Prepare all attributes
    const elementAttributes: Record<string, any> = {
      class: attributes.class || 'interactive',
    }
    
    if (attributes['data-targetaction']) {
      elementAttributes['data-targetaction'] = attributes['data-targetaction']
    }
    if (attributes['data-reftarget']) {
      elementAttributes['data-reftarget'] = attributes['data-reftarget']
    }
    if (attributes['data-requirements']) {
      elementAttributes['data-requirements'] = attributes['data-requirements']
    }
    if (attributes['data-doit'] === 'false') {
      elementAttributes['data-doit'] = 'false'
    }
    if (attributes['id']) {
      elementAttributes['id'] = attributes['id']
    }
    
    // If editing an existing element, update it based on type
    if (editState) {
      if (editState.type === 'listItem') {
        editor.chain().focus().updateAttributes('listItem', elementAttributes).run()
      } else if (editState.type === 'span') {
        editor.chain().focus().updateAttributes('interactiveSpan', elementAttributes).run()
      } else if (editState.type === 'comment') {
        // Interactive comments don't have data attributes, just update the class if needed
        editor.chain().focus().updateAttributes('interactiveComment', { class: elementAttributes.class }).run()
      }
    } else {
      // Otherwise, convert current selection to interactive list item (default behavior)
      editor.chain().focus().convertToInteractiveListItem(elementAttributes).run()
    }
    
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen || !anchorEl) {
    return null
  }

  const renderForm = () => {
    const formProps = {
      editor,
      onApply: handleApply,
      onCancel: handleCancel,
      initialValues: editState?.attrs,
    }

    switch (selectedAction) {
      case 'button':
        return <ButtonActionForm {...formProps} />
      case 'highlight':
        return <HighlightActionForm {...formProps} />
      case 'formfill':
        return <FormFillActionForm {...formProps} />
      case 'navigate':
        return <NavigateActionForm {...formProps} />
      case 'hover':
        return <HoverActionForm {...formProps} />
      case 'multistep':
        return <MultistepActionForm {...formProps} />
      default:
        return (
          <div className="action-selector">
            <h4>Select Interactive Action</h4>
            <p className="selector-description">Choose the type of interaction for this element</p>
            <div className="action-grid">
              <button
                className="action-option"
                onClick={() => setSelectedAction('button')}
              >
                <span className="action-icon">🔘</span>
                <span className="action-name">Button</span>
                <span className="action-desc">Click a button</span>
              </button>
              <button
                className="action-option"
                onClick={() => setSelectedAction('highlight')}
              >
                <span className="action-icon">✨</span>
                <span className="action-name">Highlight</span>
                <span className="action-desc">Highlight an element</span>
              </button>
              <button
                className="action-option"
                onClick={() => setSelectedAction('formfill')}
              >
                <span className="action-icon">📝</span>
                <span className="action-name">Form Fill</span>
                <span className="action-desc">Fill an input field</span>
              </button>
              <button
                className="action-option"
                onClick={() => setSelectedAction('navigate')}
              >
                <span className="action-icon">🧭</span>
                <span className="action-name">Navigate</span>
                <span className="action-desc">Go to a page</span>
              </button>
              <button
                className="action-option"
                onClick={() => setSelectedAction('hover')}
              >
                <span className="action-icon">👆</span>
                <span className="action-name">Hover</span>
                <span className="action-desc">Reveal on hover</span>
              </button>
              <button
                className="action-option"
                onClick={() => setSelectedAction('multistep')}
              >
                <span className="action-icon">📋</span>
                <span className="action-name">Multistep</span>
                <span className="action-desc">Multiple actions</span>
              </button>
            </div>
            <div className="selector-actions">
              <button onClick={onClose} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        )
    }
  }

  // Calculate position based on anchor element
  const rect = anchorEl.getBoundingClientRect()
  const style: React.CSSProperties = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`,
    zIndex: 1000,
  }

  return (
    <>
      <div className="popover-backdrop" />
      <div ref={popoverRef} className="interactive-settings-popover" style={style}>
        {selectedAction && (
          <button
            className="back-button"
            onClick={() => setSelectedAction('')}
            title="Back to action selection"
          >
            ← Back
          </button>
        )}
        {renderForm()}
      </div>
    </>
  )
}

export default InteractiveSettingsPopover

