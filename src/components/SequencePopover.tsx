import { useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import SequenceActionForm from './interactive-forms/SequenceActionForm'
import './InteractiveSettingsPopover.css'

interface SequencePopoverProps {
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

const SequencePopover = ({
  editor,
  isOpen,
  onClose,
  anchorEl,
  editState,
}: SequencePopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null)

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

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen || !anchorEl) {
    return null
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
        <SequenceActionForm
          onApply={handleApply}
          onCancel={handleCancel}
          initialSectionId={editState?.attrs?.id || ''}
          initialRequirements={editState?.attrs?.['data-requirements'] || ''}
        />
      </div>
    </>
  )
}

export default SequencePopover

