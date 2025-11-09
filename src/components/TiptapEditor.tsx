import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'
import { formatHTML } from '../utils/htmlFormatter'
import { useEditState } from '../hooks/useEditState'
import Toolbar from './Toolbar'
import { InteractiveListItem } from '../extensions/InteractiveListItem'
import { InteractiveSpan } from '../extensions/InteractiveSpan'
import { InteractiveComment } from '../extensions/InteractiveComment'
import { SequenceSection } from '../extensions/SequenceSection'
import { InteractiveClickHandler } from '../extensions/InteractiveClickHandler'
import './TiptapEditor.css'

interface TiptapEditorProps {
  onUpdate: (html: string) => void
}

const TiptapEditor = ({ onUpdate }: TiptapEditorProps) => {
  const { editState, startEditing, stopEditing } = useEditState()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        listItem: false, // We'll use our custom InteractiveListItem instead
      }),
      InteractiveListItem,
      InteractiveSpan,
      InteractiveComment,
      SequenceSection,
      Link.configure({
        openOnClick: false,
      }),
      InteractiveClickHandler.configure({
        onEditInteractiveListItem: (attrs, pos) => {
          startEditing('listItem', attrs, pos)
        },
        onEditSequenceSection: (attrs, pos) => {
          startEditing('sequence', attrs, pos)
        },
        onEditInteractiveSpan: (attrs, pos) => {
          startEditing('span', attrs, pos)
        },
        onEditInteractiveComment: (attrs, pos) => {
          startEditing('comment', attrs, pos)
        },
      }),
    ],
    content: `
      <h2>Interactive Tutorial Example</h2>
      <p>Create interactive tutorials with special markup. Try adding a list item and marking it as interactive!</p>

      <span id="guide-section-1" class="interactive" data-targetaction="sequence" data-reftarget="span#guide-section-1">
        <h3>Section 1: Title Me</h3>
        <ul>
          <li>Step 1</li>
          <li>Step 2</li>
          <li>Step 3</li>
        </ul>
      </span>

      <span id="guide-section-2" class="interactive" data-targetaction="sequence" data-reftarget="span#guide-section-2">
        <h3>Section 2: Title Me</h3>
        <ul>
          <li>Step 1</li>
          <li>Step 2</li>
          <li>Step 3</li>
        </ul>
      </span>

      <span id="guide-section-3" class="interactive" data-targetaction="sequence" data-reftarget="span#guide-section-3">
        <h3>Section 3: Title Me</h3>
        <ul>
          <li>Step 1</li>
          <li>Step 2</li>
          <li>Step 3</li>
        </ul>
      </span>
    `,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      formatHTML(html).then(formatted => onUpdate(formatted))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
  })

  // Initial HTML output
  useEffect(() => {
    if (editor) {
      const html = editor.getHTML()
      formatHTML(html).then(formatted => onUpdate(formatted))
    }
  }, [editor, onUpdate])

  return (
    <div className="tiptap-editor-container">
      <Toolbar 
        editor={editor} 
        editState={editState}
        onCloseEdit={stopEditing}
      />
      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TiptapEditor

