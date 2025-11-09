import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Extension } from '@tiptap/core'

export interface InteractiveClickHandlerOptions {
  onEditInteractiveListItem?: (attrs: Record<string, any>, pos: number) => void
  onEditSequenceSection?: (attrs: Record<string, any>, pos: number) => void
  onEditInteractiveSpan?: (attrs: Record<string, any>, pos: number) => void
  onEditInteractiveComment?: (attrs: Record<string, any>, pos: number) => void
}

export const InteractiveClickHandler = Extension.create<InteractiveClickHandlerOptions>({
  name: 'interactiveClickHandler',

  addOptions() {
    return {
      onEditInteractiveListItem: undefined,
      onEditSequenceSection: undefined,
      onEditInteractiveSpan: undefined,
      onEditInteractiveComment: undefined,
    }
  },

  addProseMirrorPlugins() {
    const options = this.options

    return [
      new Plugin({
        key: new PluginKey('interactiveClickHandler'),
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target as HTMLElement
              
              // Walk up the DOM tree to find the lightning bolt
              const lightningBolt = target.closest('.interactive-lightning')
              if (!lightningBolt) {
                return false
              }

              event.preventDefault()
              event.stopPropagation()

              // Find the parent interactive element
              let element = lightningBolt.parentElement
              if (!element) return false

              // Get the position in the document
              const pos = view.posAtDOM(element, 0)
              if (pos === null || pos === undefined) return false

              const $pos = view.state.doc.resolve(pos)
              const node = $pos.parent

              // Determine the type of interactive element and extract attributes
              if (element.tagName === 'LI' && element.classList.contains('interactive')) {
                // Interactive list item
                const attrs = {
                  class: element.getAttribute('class') || '',
                  'data-targetaction': element.getAttribute('data-targetaction') || '',
                  'data-reftarget': element.getAttribute('data-reftarget') || '',
                  'data-requirements': element.getAttribute('data-requirements') || '',
                  'data-doit': element.getAttribute('data-doit') || '',
                  id: element.getAttribute('id') || '',
                }
                options.onEditInteractiveListItem?.(attrs, pos)
                return true
              } else if (element.tagName === 'SPAN' && element.getAttribute('data-targetaction') === 'sequence') {
                // Sequence section
                const attrs = {
                  id: element.getAttribute('id') || '',
                  class: element.getAttribute('class') || '',
                  'data-targetaction': element.getAttribute('data-targetaction') || '',
                  'data-reftarget': element.getAttribute('data-reftarget') || '',
                  'data-requirements': element.getAttribute('data-requirements') || '',
                }
                options.onEditSequenceSection?.(attrs, pos)
                return true
              } else if (element.tagName === 'SPAN' && element.classList.contains('interactive')) {
                // Interactive span node (now a node, not a mark)
                // Find the actual node at this position
                let interactiveNode = null
                view.state.doc.nodesBetween(pos, pos + 1, (n, p) => {
                  if (n.type.name === 'interactiveSpan') {
                    interactiveNode = { node: n, pos: p }
                    return false
                  }
                })
                if (interactiveNode) {
                  options.onEditInteractiveSpan?.(interactiveNode.node.attrs, interactiveNode.pos)
                  return true
                }
              } else if (element.tagName === 'SPAN' && element.classList.contains('interactive-comment')) {
                // Interactive comment node (now a node, not a mark)
                // Find the actual node at this position
                let commentNode = null
                view.state.doc.nodesBetween(pos, pos + 1, (n, p) => {
                  if (n.type.name === 'interactiveComment') {
                    commentNode = { node: n, pos: p }
                    return false
                  }
                })
                if (commentNode) {
                  options.onEditInteractiveComment?.(commentNode.node.attrs, commentNode.pos)
                  return true
                }
              }

              return false
            },
          },
        },
      }),
    ]
  },
})

