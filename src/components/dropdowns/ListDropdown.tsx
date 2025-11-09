import { Editor } from '@tiptap/react'
import DropdownMenu from './DropdownMenu'

interface ListDropdownProps {
  editor: Editor
}

const ListDropdown = ({ editor }: ListDropdownProps) => {
  return (
    <DropdownMenu
      trigger={
        <>
          <span style={{ fontSize: '16px' }}>•</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </>
      }
    >
      <button
        className={`dropdown-item ${editor.isActive('bulletList') ? 'active' : ''}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • Bulleted List
      </button>
      <button
        className={`dropdown-item ${editor.isActive('orderedList') ? 'active' : ''}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. Numbered List
      </button>
    </DropdownMenu>
  )
}

export default ListDropdown

