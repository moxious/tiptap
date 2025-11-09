import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useEffect, useState } from 'react'
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
  const [editState, setEditState] = useState<{
    type: 'listItem' | 'sequence' | 'span' | 'comment' | null
    attrs: Record<string, any>
    pos: number
  } | null>(null)

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
          setEditState({ type: 'listItem', attrs, pos })
        },
        onEditSequenceSection: (attrs, pos) => {
          setEditState({ type: 'sequence', attrs, pos })
        },
        onEditInteractiveSpan: (attrs, pos) => {
          setEditState({ type: 'span', attrs, pos })
        },
        onEditInteractiveComment: (attrs, pos) => {
          setEditState({ type: 'comment', attrs, pos })
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
      onUpdate(formatHTML(html))
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
      onUpdate(formatHTML(html))
    }
  }, [editor, onUpdate])

  return (
    <div className="tiptap-editor-container">
      <Toolbar 
        editor={editor} 
        editState={editState}
        onCloseEdit={() => setEditState(null)}
      />
      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// Format HTML with proper indentation
function formatHTML(html: string): string {
  try {
    let formatted = ''
    let indent = 0
    const tab = '  '
    
    // Split by tags
    const tokens = html.split(/(<[^>]+>)/g).filter(token => token.trim())
    
    tokens.forEach((token) => {
      if (token.startsWith('</')) {
        // Closing tag
        indent = Math.max(0, indent - 1)
        formatted += tab.repeat(indent) + token + '\n'
      } else if (token.startsWith('<')) {
        // Opening tag
        const isVoidElement = /^<(br|hr|img|input|meta|link)[^>]*>$/i.test(token)
        const isSelfClosing = token.endsWith('/>')
        
        formatted += tab.repeat(indent) + token + '\n'
        
        if (!isVoidElement && !isSelfClosing && !token.startsWith('<!')) {
          indent++
        }
      } else {
        // Text content
        const trimmed = token.trim()
        if (trimmed) {
          formatted += tab.repeat(indent) + trimmed + '\n'
        }
      }
    })
    
    return formatted.trim()
  } catch (e) {
    // Fallback to unformatted HTML if formatting fails
    return html
  }
}

export default TiptapEditor

