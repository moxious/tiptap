import { Node, mergeAttributes } from '@tiptap/core'

export interface SequenceSectionOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sequenceSection: {
      setSequenceSection: (attributes?: Record<string, any>) => ReturnType
      insertSequenceSection: (attributes: Record<string, any>) => ReturnType
    }
  }
}

export const SequenceSection = Node.create<SequenceSectionOptions>({
  name: 'sequenceSection',
  
  group: 'block',
  
  content: 'block+',  // Can contain multiple block-level elements
  
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) return {}
          return { id: attributes.id }
        },
      },
      class: {
        default: 'interactive',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => ({
          class: attributes.class || 'interactive'
        }),
      },
      'data-targetaction': {
        default: 'sequence',
        parseHTML: element => element.getAttribute('data-targetaction'),
        renderHTML: attributes => ({
          'data-targetaction': attributes['data-targetaction'] || 'sequence'
        }),
      },
      'data-reftarget': {
        default: null,
        parseHTML: element => element.getAttribute('data-reftarget'),
        renderHTML: attributes => {
          if (!attributes['data-reftarget']) return {}
          return { 'data-reftarget': attributes['data-reftarget'] }
        },
      },
      'data-requirements': {
        default: null,
        parseHTML: element => element.getAttribute('data-requirements'),
        renderHTML: attributes => {
          if (!attributes['data-requirements']) return {}
          return { 'data-requirements': attributes['data-requirements'] }
        },
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-targetaction="sequence"]',
        priority: 100,
      },
      {
        tag: 'span.interactive[data-targetaction="sequence"]',
        priority: 100,
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addNodeView() {
    return ({ HTMLAttributes }) => {
      const dom = document.createElement('span')
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          dom.setAttribute(key, String(value))
        }
      })

      // Create and append lightning bolt
      const lightning = document.createElement('span')
      lightning.className = 'interactive-lightning'
      lightning.textContent = '⚡'
      dom.appendChild(lightning)

      // Create content wrapper
      const contentDOM = document.createElement('div')
      contentDOM.style.display = 'contents'
      dom.appendChild(contentDOM)

      return {
        dom,
        contentDOM,
      }
    }
  },
  
  addCommands() {
    return {
      setSequenceSection:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },
      insertSequenceSection:
        (attributes) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: attributes,
              content: [
                {
                  type: 'heading',
                  attrs: { level: 3 },
                  content: [{ type: 'text', text: 'Section Title Goes Here' }]
                },
                {
                  type: 'bulletList',
                  content: [
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Step 1' }] }] },
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Step 2' }] }] },
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Step 3' }] }] },
                  ]
                }
              ]
            })
            .run()
        },
    }
  },
})

