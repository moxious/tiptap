import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { type InteractiveAttributesOutput } from './interactive-forms/types'
import { type EditState } from '../types'
import { buildInteractiveAttributes, getNodeTypeName } from '../services/attributeBuilder'
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
  editState?: EditState | null
}

const InteractiveSettingsPopover = ({
  editor,
  isOpen,
  onClose,
  anchorEl,
  editState,
}: InteractiveSettingsPopoverProps) => {
  const [selectedAction, setSelectedAction] = useState<string>('')

  useEffect(() => {
    if (!isOpen) {
      setSelectedAction('')
    } else if (editState?.attrs) {
      // If editing, pre-select the action type
      const actionType = editState.attrs['data-targetaction']
      if (actionType) {
        setSelectedAction(actionType)
      }
    }
  }, [isOpen, editState])

  const handleApply = (attributes: InteractiveAttributesOutput) => {
    // Build attributes based on element type
    const elementType = editState?.type || 'listItem'
    const elementAttributes = buildInteractiveAttributes(elementType, attributes)
    
    // If editing an existing element, update it
    if (editState) {
      const nodeType = getNodeTypeName(editState.type)
      editor.chain().focus().updateAttributes(nodeType, elementAttributes).run()
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


