import { Editor } from '@tiptap/react'
import { type PartialEditState } from '../types'
import SequenceActionForm from './interactive-forms/SequenceActionForm'
import Popover from './common/Popover'
import './InteractiveSettingsPopover.css'

interface SequencePopoverProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
  editState?: PartialEditState
}

const SequencePopover = ({
  editor,
  isOpen,
  onClose,
  anchorEl,
  editState,
}: SequencePopoverProps) => {

  const handleApply = (sectionId: string, requirements: string) => {
    // Build the attributes object
    const attrs: Record<string, string> = {
      id: sectionId,
      class: 'interactive',
      'data-targetaction': 'sequence',
      'data-reftarget': `span#${sectionId}`,
    }
    
    if (requirements) {
      attrs['data-requirements'] = requirements
    }

    // If editing an existing element, update it
    if (editState) {
      editor.chain().focus().updateAttributes('sequenceSection', attrs).run()
    } else {
      // Otherwise, insert a new sequence section
      editor.chain().focus().insertSequenceSection(attrs).run()
    }
    
    onClose()
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} anchorEl={anchorEl}>
      <SequenceActionForm
        onApply={handleApply}
        onCancel={onClose}
        initialSectionId={editState?.attrs?.id || ''}
        initialRequirements={editState?.attrs?.['data-requirements'] || ''}
      />
    </Popover>
  )
}

export default SequencePopover

