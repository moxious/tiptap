import { mergeAttributes, Node } from '@tiptap/core'
import ListItem from '@tiptap/extension-list-item'

export interface InteractiveListItemOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    interactiveListItem: {
      setInteractiveListItem: (attributes?: Record<string, any>) => ReturnType
      toggleInteractiveClass: () => ReturnType
      setTargetAction: (action: string) => ReturnType
      setRefTarget: (target: string) => ReturnType
      setRequirements: (requirements: string) => ReturnType
      setDoIt: (value: boolean) => ReturnType
      convertToInteractiveListItem: (attributes: Record<string, any>) => ReturnType
    }
  }
}

export const InteractiveListItem = ListItem.extend<InteractiveListItemOptions>({
  name: 'listItem',

  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {}
          }
          return { class: attributes.class }
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
      'data-doit': {
        default: null,
        parseHTML: element => element.getAttribute('data-doit'),
        renderHTML: attributes => {
          if (!attributes['data-doit']) {
            return {}
          }
          return { 'data-doit': attributes['data-doit'] }
        },
      },
    }
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const li = document.createElement('li')
      
      // Apply all HTML attributes
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          li.setAttribute(key, String(value))
        }
      })

      // Only add lightning bolt if this is an interactive list item
      if (node.attrs.class?.includes('interactive')) {
        const lightning = document.createElement('span')
        lightning.className = 'interactive-lightning'
        lightning.textContent = '⚡'
        li.appendChild(lightning)
      }

      // Create content wrapper
      const contentDOM = document.createElement('div')
      contentDOM.style.display = 'contents'
      li.appendChild(contentDOM)

      return {
        dom: li,
        contentDOM,
      }
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      toggleInteractiveClass:
        () =>
        ({ commands, state }) => {
          const { selection } = state
          const { $from } = selection
          const listItem = $from.node($from.depth - 1)
          
          if (listItem.type.name === 'listItem') {
            const currentClass = listItem.attrs.class
            const hasInteractive = currentClass?.includes('interactive')
            const newClass = hasInteractive ? null : 'interactive'
            
            return commands.updateAttributes('listItem', { class: newClass })
          }
          
          return false
        },
      setTargetAction:
        (action: string) =>
        ({ commands }) => {
          return commands.updateAttributes('listItem', { 
            'data-targetaction': action || null 
          })
        },
      setRefTarget:
        (target: string) =>
        ({ commands }) => {
          return commands.updateAttributes('listItem', { 
            'data-reftarget': target || null 
          })
        },
      setRequirements:
        (requirements: string) =>
        ({ commands }) => {
          return commands.updateAttributes('listItem', { 
            'data-requirements': requirements || null 
          })
        },
      setDoIt:
        (value: boolean) =>
        ({ commands }) => {
          return commands.updateAttributes('listItem', { 
            'data-doit': value ? 'false' : null 
          })
        },
      convertToInteractiveListItem:
        (attributes: Record<string, any>) =>
        ({ commands, state, chain }) => {
          const { selection } = state
          const { $from } = selection
          
          // Check if we're already in a list item
          let isInListItem = false
          for (let i = $from.depth; i > 0; i--) {
            if ($from.node(i).type.name === 'listItem') {
              isInListItem = true
              break
            }
          }
          
          // If not in a list item, convert current block to list item
          if (!isInListItem) {
            // First, try to convert to list item and wrap in bullet list
            const converted = chain()
              .focus()
              .clearNodes()
              .toggleBulletList()
              .run()
            
            if (!converted) {
              return false
            }
          }
          
          // Now apply all the interactive attributes
          return commands.updateAttributes('listItem', attributes)
        },
    }
  },
})

