import { Editor } from '@tiptap/react'
import { type EditState } from '../types'
import { insertSequenceSection, updateSequenceSection } from '../services/editorOperations'
import SequenceActionForm from './interactive-forms/SequenceActionForm'
import Popover from './common/Popover'
import './InteractiveSettingsPopover.css'

interface SequencePopoverProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
  editState?: EditState | null
}

const SequencePopover = ({
  editor,
  isOpen,
  onClose,
  anchorEl,
  editState,
}: SequencePopoverProps) => {

  const handleApply = (sectionId: string, requirements: string) => {
    // If editing an existing element, update it; otherwise insert new
    if (editState) {
      updateSequenceSection(editor, sectionId, requirements)
    } else {
      insertSequenceSection(editor, sectionId, requirements)
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

