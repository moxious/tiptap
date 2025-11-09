import { Editor } from '@tiptap/react'
import DropdownMenu from './DropdownMenu'

interface FormatDropdownProps {
  editor: Editor
}

const FormatDropdown = ({ editor }: FormatDropdownProps) => {
  return (
    <DropdownMenu
      trigger={
        <>
          Format
          <span style={{ fontSize: '10px' }}>▼</span>
        </>
      }
    >
      <button
        className={`dropdown-item ${editor.isActive('code') ? 'active' : ''}`}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <span style={{ fontFamily: 'monospace' }}>{'<>'}</span> Code
      </button>
      <button
        className={`dropdown-item ${editor.isActive('blockquote') ? 'active' : ''}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        " Blockquote
      </button>
      <div className="dropdown-divider" />
      <button
        className="dropdown-item"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        ― Horizontal Rule
      </button>
    </DropdownMenu>
  )
}

export default FormatDropdown

