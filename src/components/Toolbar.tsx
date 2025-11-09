import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { type PartialEditState } from '../types'
import HeadingDropdown from './dropdowns/HeadingDropdown'
import FormatDropdown from './dropdowns/FormatDropdown'
import ListDropdown from './dropdowns/ListDropdown'
import InteractiveSettingsPopover from './InteractiveSettingsPopover'
import SequencePopover from './SequencePopover'
import './Toolbar.css'

interface ToolbarProps {
  editor: Editor | null
  editState?: PartialEditState
  onCloseEdit?: () => void
}

const Toolbar = ({ editor, editState, onCloseEdit }: ToolbarProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null)
  const [isSequencePopoverOpen, setIsSequencePopoverOpen] = useState(false)
  const [sequencePopoverAnchor, setSequencePopoverAnchor] = useState<HTMLElement | null>(null)

  // Open appropriate popover when editState changes
  useEffect(() => {
    if (editState) {
      if (editState.type === 'sequence') {
        // For sequence, just open the popover at a central location
        setSequencePopoverAnchor(document.body)
        setIsSequencePopoverOpen(true)
        // Close the other popover
        setIsPopoverOpen(false)
        setPopoverAnchor(null)
      } else if (editState.type === 'listItem' || editState.type === 'span' || editState.type === 'comment') {
        // For other interactive elements, open InteractiveSettingsPopover
        setPopoverAnchor(document.body)
        setIsPopoverOpen(true)
        // Close the other popover
        setIsSequencePopoverOpen(false)
        setSequencePopoverAnchor(null)
      }
    }
  }, [editState])

  if (!editor) {
    return null
  }

  const handleInteractiveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchor(event.currentTarget)
    setIsPopoverOpen(true)
  }

  const handleSequenceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSequencePopoverAnchor(event.currentTarget)
    setIsSequencePopoverOpen(true)
  }

  const handlePopoverClose = () => {
    setIsPopoverOpen(false)
    onCloseEdit?.()
  }

  const handleSequencePopoverClose = () => {
    setIsSequencePopoverOpen(false)
    onCloseEdit?.()
  }

  return (
    <>
      <div className="compact-toolbar">
        <div className="toolbar-group">
          <HeadingDropdown editor={editor} />
          <FormatDropdown editor={editor} />
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button
            className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <ListDropdown editor={editor} />
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button
            className="toolbar-btn interactive-btn"
            onClick={handleInteractiveClick}
            title="Add Interactive Action"
          >
            ⚡
          </button>
          <button
            className="toolbar-btn"
            onClick={handleSequenceClick}
            title="Add Sequence Section"
          >
            📑
          </button>
          <button
            className={`toolbar-btn ${editor.isActive('interactiveComment') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleInteractiveComment().run()}
            title="Interactive Comment"
          >
            💬
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            className="toolbar-btn"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Shift+Z)"
          >
            ↷
          </button>
        </div>
      </div>

      <InteractiveSettingsPopover
        editor={editor}
        isOpen={isPopoverOpen}
        onClose={handlePopoverClose}
        anchorEl={popoverAnchor}
        editState={editState?.type === 'listItem' || editState?.type === 'span' || editState?.type === 'comment' ? editState : null}
      />

      <SequencePopover
        editor={editor}
        isOpen={isSequencePopoverOpen}
        onClose={handleSequencePopoverClose}
        anchorEl={sequencePopoverAnchor}
        editState={editState?.type === 'sequence' ? editState : null}
      />
    </>
  )
}

export default Toolbar
