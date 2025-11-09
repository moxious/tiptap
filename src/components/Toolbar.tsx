import { useState } from 'react'
import { Editor } from '@tiptap/react'
import { type EditStateOrNull } from '../types'
import HeadingDropdown from './dropdowns/HeadingDropdown'
import FormatDropdown from './dropdowns/FormatDropdown'
import ListDropdown from './dropdowns/ListDropdown'
import InteractiveSettingsPopover from './InteractiveSettingsPopover'
import SequencePopover from './SequencePopover'
import './Toolbar.css'

interface ToolbarProps {
  editor: Editor | null
  editState?: EditStateOrNull
  onCloseEdit?: () => void
}

const Toolbar = ({ editor, editState, onCloseEdit }: ToolbarProps) => {
  // Track toolbar-initiated popover opening
  const [toolbarPopover, setToolbarPopover] = useState<{
    type: 'interactive' | 'sequence'
    anchor: HTMLElement
  } | null>(null)

  // Derive popover open states from both editState and toolbarPopover
  // Interactive popover opens for listItem, span, comment via editState OR toolbar button
  const interactivePopoverOpen = 
    (editState && ['listItem', 'span', 'comment'].includes(editState.type)) ||
    toolbarPopover?.type === 'interactive'
  
  const sequencePopoverOpen = 
    editState?.type === 'sequence' || 
    toolbarPopover?.type === 'sequence'

  // Derive anchor elements (editState takes priority over toolbar clicks)
  // When clicking lightning bolts, use the editor wrapper as anchor for better positioning
  const interactiveAnchor = editState && ['listItem', 'span', 'comment'].includes(editState.type)
    ? document.querySelector('.editor-wrapper') as HTMLElement
    : toolbarPopover?.type === 'interactive' ? toolbarPopover.anchor : null
  
  const sequenceAnchor = editState?.type === 'sequence'
    ? document.querySelector('.editor-wrapper') as HTMLElement
    : toolbarPopover?.type === 'sequence' ? toolbarPopover.anchor : null

  if (!editor) {
    return null
  }

  const handleInteractiveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setToolbarPopover({ type: 'interactive', anchor: event.currentTarget })
  }

  const handleSequenceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setToolbarPopover({ type: 'sequence', anchor: event.currentTarget })
  }

  const handlePopoverClose = () => {
    setToolbarPopover(null)
    onCloseEdit?.()
  }

  const handleSequencePopoverClose = () => {
    setToolbarPopover(null)
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
            aria-label="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            aria-label="Italic (Ctrl+I)"
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
            aria-label="Add Interactive Action"
          >
            ⚡
          </button>
          <button
            className="toolbar-btn"
            onClick={handleSequenceClick}
            title="Add Sequence Section"
            aria-label="Add Sequence Section"
          >
            📑
          </button>
          <button
            className={`toolbar-btn ${editor.isActive('interactiveComment') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleInteractiveComment().run()}
            title="Interactive Comment"
            aria-label="Interactive Comment"
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
            aria-label="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            className="toolbar-btn"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo (Ctrl+Shift+Z)"
          >
            ↷
          </button>
        </div>
      </div>

      <InteractiveSettingsPopover
        editor={editor}
        isOpen={interactivePopoverOpen}
        onClose={handlePopoverClose}
        anchorEl={interactiveAnchor}
        editState={editState && (editState.type === 'listItem' || editState.type === 'span' || editState.type === 'comment') ? editState : null}
      />

      <SequencePopover
        editor={editor}
        isOpen={sequencePopoverOpen}
        onClose={handleSequencePopoverClose}
        anchorEl={sequenceAnchor}
        editState={editState && editState.type === 'sequence' ? editState : null}
      />
    </>
  )
}

export default Toolbar
