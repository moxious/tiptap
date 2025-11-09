import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Extension } from '@tiptap/core'
import {
  determineInteractiveElementType,
  handleListItemClick,
  handleSequenceSectionClick,
  handleInteractiveSpanClick,
  handleInteractiveCommentClick,
} from './shared/clickHandlerHelpers'

export interface InteractiveClickHandlerOptions {
  onEditInteractiveListItem?: (attrs: Record<string, string>, pos: number) => void
  onEditSequenceSection?: (attrs: Record<string, string>, pos: number) => void
  onEditInteractiveSpan?: (attrs: Record<string, string>, pos: number) => void
  onEditInteractiveComment?: (attrs: Record<string, string>, pos: number) => void
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
              try {
                const target = event.target as HTMLElement
                
                // Walk up the DOM tree to find the lightning bolt
                const lightningBolt = target.closest('.interactive-lightning')
                if (!lightningBolt) {
                  return false
                }

                event.preventDefault()
                event.stopPropagation()

                // Find the parent interactive element
                const element = lightningBolt.parentElement
                if (!element) return false

                // Get the position in the document
                const pos = view.posAtDOM(element, 0)
                if (pos === null || pos === undefined) return false

                // Determine the type of interactive element
                const elementTypeResult = determineInteractiveElementType(element)
                if (!elementTypeResult) return false

                // Handle based on element type
                switch (elementTypeResult.type) {
                  case 'listItem':
                    return handleListItemClick(
                      elementTypeResult.element,
                      pos,
                      options.onEditInteractiveListItem!
                    )

                  case 'sequence':
                    return handleSequenceSectionClick(
                      elementTypeResult.element,
                      pos,
                      options.onEditSequenceSection!
                    )

                  case 'span':
                    return handleInteractiveSpanClick(
                      view,
                      pos,
                      options.onEditInteractiveSpan!
                    )

                  case 'comment':
                    return handleInteractiveCommentClick(
                      view,
                      pos,
                      options.onEditInteractiveComment!
                    )

                  default:
                    return false
                }
              } catch (error) {
                // Log error but don't crash the editor
                console.error('Error handling interactive element click:', error)
                return false
              }
            },
          },
        },
      }),
    ]
  },
})

