import { Editor } from '@tiptap/react'
import DropdownMenu from './DropdownMenu'

interface HeadingDropdownProps {
  editor: Editor
}

const HeadingDropdown = ({ editor }: HeadingDropdownProps) => {
  const getCurrentHeadingLevel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
    if (editor.isActive('heading', { level: 4 })) return 'Heading 4'
    return 'Normal text'
  }

  return (
    <DropdownMenu
      trigger={
        <>
          {getCurrentHeadingLevel()}
          <span style={{ fontSize: '10px' }}>▼</span>
        </>
      }
    >
      <button
        className={`dropdown-item ${!editor.isActive('heading') ? 'active' : ''}`}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        Normal text
      </button>
      <button
        className={`dropdown-item ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={{ fontSize: '18px', fontWeight: 600 }}
      >
        Heading 1
      </button>
      <button
        className={`dropdown-item ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={{ fontSize: '16px', fontWeight: 600 }}
      >
        Heading 2
      </button>
      <button
        className={`dropdown-item ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        Heading 3
      </button>
      <button
        className={`dropdown-item ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        style={{ fontSize: '13px', fontWeight: 600 }}
      >
        Heading 4
      </button>
    </DropdownMenu>
  )
}

export default HeadingDropdown

