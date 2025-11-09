import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { type ActionType, type InteractiveAttributes } from './interactive-forms/types'
import { type PartialEditState } from '../types'
import ButtonActionForm from './interactive-forms/ButtonActionForm'
import HighlightActionForm from './interactive-forms/HighlightActionForm'
import FormFillActionForm from './interactive-forms/FormFillActionForm'
import NavigateActionForm from './interactive-forms/NavigateActionForm'
import HoverActionForm from './interactive-forms/HoverActionForm'
import MultistepActionForm from './interactive-forms/MultistepActionForm'
import ActionSelector from './interactive-forms/ActionSelector'
import Popover from './common/Popover'
import './InteractiveSettingsPopover.css'

interface InteractiveSettingsPopoverProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
  editState?: PartialEditState
}

const InteractiveSettingsPopover = ({
  editor,
  isOpen,
  onClose,
  anchorEl,
  editState,
}: InteractiveSettingsPopoverProps) => {
  const [selectedAction, setSelectedAction] = useState<ActionType | ''>('')

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

  const renderContent = () => {
    const formProps = {
      editor,
      onApply: handleApply,
      onCancel: onClose,
      initialValues: editState?.attrs,
    }

    if (!selectedAction) {
      return <ActionSelector onSelect={setSelectedAction} onCancel={onClose} />
    }

    return (
      <>
        <button
          className="back-button"
          onClick={() => setSelectedAction('')}
          title="Back to action selection"
        >
          ← Back
        </button>
        {selectedAction === 'button' && <ButtonActionForm {...formProps} />}
        {selectedAction === 'highlight' && <HighlightActionForm {...formProps} />}
        {selectedAction === 'formfill' && <FormFillActionForm {...formProps} />}
        {selectedAction === 'navigate' && <NavigateActionForm {...formProps} />}
        {selectedAction === 'hover' && <HoverActionForm {...formProps} />}
        {selectedAction === 'multistep' && <MultistepActionForm {...formProps} />}
      </>
    )
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} anchorEl={anchorEl}>
      {renderContent()}
    </Popover>
  )
}

export default InteractiveSettingsPopover


