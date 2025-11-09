import { Node, mergeAttributes } from '@tiptap/core'

export interface InteractiveSpanOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    interactiveSpan: {
      setInteractiveSpan: (attributes?: Record<string, any>) => ReturnType
      toggleInteractiveSpan: () => ReturnType
      unsetInteractiveSpan: () => ReturnType
    }
  }
}

export const InteractiveSpan = Node.create<InteractiveSpanOptions>({
  name: 'interactiveSpan',

  group: 'inline',

  inline: true,

  content: 'inline*',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      class: {
        default: 'interactive',
        parseHTML: element => element.getAttribute('class') || 'interactive',
        renderHTML: attributes => {
          return { class: attributes.class || 'interactive' }
        },
      },
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return { id: attributes.id }
        },
      },
      'data-targetaction': {
        default: null,
        parseHTML: element => element.getAttribute('data-targetaction'),
        renderHTML: attributes => {
          if (!attributes['data-targetaction']) {
            return {}
          }
          return { 'data-targetaction': attributes['data-targetaction'] }
        },
      },
      'data-reftarget': {
        default: null,
        parseHTML: element => element.getAttribute('data-reftarget'),
        renderHTML: attributes => {
          if (!attributes['data-reftarget']) {
            return {}
          }
          return { 'data-reftarget': attributes['data-reftarget'] }
        },
      },
      'data-requirements': {
        default: null,
        parseHTML: element => element.getAttribute('data-requirements'),
        renderHTML: attributes => {
          if (!attributes['data-requirements']) {
            return {}
          }
          return { 'data-requirements': attributes['data-requirements'] }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.interactive',
        getAttrs: (node) => {
          if (typeof node === 'string') return false
          const element = node as HTMLElement
          // Don't match if it's a sequence section
          if (element.getAttribute('data-targetaction') === 'sequence') {
            return false
          }
          return null
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addNodeView() {
    return ({ HTMLAttributes }) => {
      const span = document.createElement('span')
      
      // Apply all HTML attributes
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          span.setAttribute(key, String(value))
        }
      })

      // Create and append lightning bolt
      const lightning = document.createElement('span')
      lightning.className = 'interactive-lightning'
      lightning.textContent = '⚡'
      span.appendChild(lightning)

      // Create content wrapper
      const contentDOM = document.createElement('span')
      span.appendChild(contentDOM)

      return {
        dom: span,
        contentDOM,
      }
    }
  },

  addCommands() {
    return {
      setInteractiveSpan:
        (attributes) =>
        ({ commands, state }) => {
          const { from, to } = state.selection
          // If there's a selection, wrap it in an interactive span
          if (from !== to) {
            return commands.insertContentAt(
              { from, to },
              {
                type: this.name,
                attrs: attributes,
                content: state.doc.slice(from, to).content.toJSON(),
              }
            )
          }
          // Otherwise insert an empty interactive span
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
            content: [{ type: 'text', text: 'Interactive text' }],
          })
        },
      toggleInteractiveSpan:
        () =>
        ({ commands, state, chain }) => {
          const { from, to, $from } = state.selection
          
          // Check if we're inside an interactive span
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth)
            if (node.type.name === this.name) {
              // We're inside an interactive span, so unwrap it
              const pos = $from.before(depth)
              const nodeSize = node.nodeSize
              
              // Extract the content
              const content = node.content
              
              // Delete the node and insert its content
              return chain()
                .deleteRange({ from: pos, to: pos + nodeSize })
                .insertContentAt(pos, content.toJSON())
                .run()
            }
          }
          
          // Not inside an interactive span, so wrap the selection
          if (from !== to) {
            return commands.insertContentAt(
              { from, to },
              {
                type: this.name,
                attrs: { class: 'interactive' },
                content: state.doc.slice(from, to).content.toJSON(),
              }
            )
          }
          
          return false
        },
      unsetInteractiveSpan:
        () =>
        ({ state, chain }) => {
          const { $from } = state.selection
          
          // Find if we're inside an interactive span
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth)
            if (node.type.name === this.name) {
              const pos = $from.before(depth)
              const nodeSize = node.nodeSize
              const content = node.content
              
              return chain()
                .deleteRange({ from: pos, to: pos + nodeSize })
                .insertContentAt(pos, content.toJSON())
                .run()
            }
          }
          
          return false
        },
    }
  },
})

