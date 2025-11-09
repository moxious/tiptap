import { useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { type EditStateOrNull } from '../types'
import { usePopoverManager } from '../hooks/usePopoverManager'
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
  // Use popover manager to coordinate multiple popovers
  const { popovers, open, close } = usePopoverManager(['interactive', 'sequence'])

  // Open appropriate popover when editState changes
  useEffect(() => {
    if (editState) {
      if (editState.type === 'sequence') {
        // For sequence, open the sequence popover
        open('sequence', document.body)
      } else if (editState.type === 'listItem' || editState.type === 'span' || editState.type === 'comment') {
        // For other interactive elements, open interactive popover
        open('interactive', document.body)
      }
    }
  }, [editState, open])

  if (!editor) {
    return null
  }

  const handleInteractiveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    open('interactive', event.currentTarget)
  }

  const handleSequenceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    open('sequence', event.currentTarget)
  }

  const handlePopoverClose = () => {
    close('interactive')
    onCloseEdit?.()
  }

  const handleSequencePopoverClose = () => {
    close('sequence')
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
        isOpen={popovers.interactive.isOpen}
        onClose={handlePopoverClose}
        anchorEl={popovers.interactive.anchorEl}
        editState={editState && (editState.type === 'listItem' || editState.type === 'span' || editState.type === 'comment') ? editState : null}
      />

      <SequencePopover
        editor={editor}
        isOpen={popovers.sequence.isOpen}
        onClose={handleSequencePopoverClose}
        anchorEl={popovers.sequence.anchorEl}
        editState={editState && editState.type === 'sequence' ? editState : null}
      />
    </>
  )
}

export default Toolbar
