import { useState } from 'react'
import './App.css'
import TiptapEditor from './components/TiptapEditor'

function App() {
  const [htmlContent, setHtmlContent] = useState('')

  return (
    <div className="app-container">
      <div className="editor-column">
        <h1>Interactive Tutorial Editor</h1>
        <TiptapEditor onUpdate={setHtmlContent} />
      </div>
      <div className="preview-column">
        <div className="preview-header">
          <h2>HTML Output</h2>
          <button 
            className="copy-button"
            onClick={() => navigator.clipboard.writeText(htmlContent)}
          >
            Copy HTML
          </button>
        </div>
        <pre className="html-preview">
          <code>{htmlContent}</code>
        </pre>
      </div>
    </div>
  )
}

export default App
