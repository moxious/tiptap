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

                console.log('🔍 [InteractiveClickHandler] Lightning bolt clicked:', lightningBolt)

                event.preventDefault()
                event.stopPropagation()

                // Find the parent interactive element
                const element = lightningBolt.parentElement
                if (!element) {
                  console.error('❌ [InteractiveClickHandler] No parent element found for lightning bolt')
                  return false
                }

                console.log('📍 [InteractiveClickHandler] Parent element:', element.tagName, element.className, element.getAttribute('data-targetaction'))

                // Determine the type of interactive element first (for better debugging)
                const elementTypeResult = determineInteractiveElementType(element)
                if (!elementTypeResult) {
                  console.error('❌ [InteractiveClickHandler] Could not determine element type for:', element)
                  return false
                }

                console.log('✅ [InteractiveClickHandler] Element type determined:', elementTypeResult.type)

                // Get the position in the document with multiple fallback strategies
                let pos: number | null | undefined = null
                
                // Strategy 1: Try getting position from the element directly
                pos = view.posAtDOM(element, 0)
                console.log('📌 [InteractiveClickHandler] Position from posAtDOM(element, 0):', pos)
                
                // Strategy 2: If that fails, try with the first child (content wrapper)
                if (pos === null || pos === undefined || pos < 0) {
                  console.warn('⚠️  [InteractiveClickHandler] First strategy failed, trying contentDOM child')
                  const contentWrapper = element.querySelector('[style*="display"]')
                  if (contentWrapper) {
                    pos = view.posAtDOM(contentWrapper as HTMLElement, 0)
                    console.log('📌 [InteractiveClickHandler] Position from contentWrapper:', pos)
                  }
                }
                
                // Strategy 3: Try finding the node by walking the document
                if (pos === null || pos === undefined || pos < 0) {
                  console.warn('⚠️  [InteractiveClickHandler] Second strategy failed, walking document nodes')
                  let foundPos: number | null = null
                  view.state.doc.descendants((node, position) => {
                    const domNode = view.nodeDOM(position)
                    if (domNode === element) {
                      foundPos = position
                      console.log('📌 [InteractiveClickHandler] Found matching node at position:', position)
                      return false // stop iteration
                    }
                  })
                  if (foundPos !== null) {
                    pos = foundPos
                  }
                }
                
                // Strategy 4: For sequence sections, try finding by comparing attributes
                if ((pos === null || pos === undefined || pos < 0) && elementTypeResult.type === 'sequence') {
                  console.warn('⚠️  [InteractiveClickHandler] Third strategy failed, trying attribute matching for sequence')
                  const elementId = element.getAttribute('id')
                  const elementAction = element.getAttribute('data-targetaction')
                  
                  view.state.doc.descendants((node, position) => {
                    if (node.type.name === 'sequenceSection') {
                      const nodeId = node.attrs.id
                      const nodeAction = node.attrs['data-targetaction']
                      if (nodeId && nodeId === elementId || (nodeAction === elementAction && nodeAction === 'sequence')) {
                        pos = position
                        console.log('📌 [InteractiveClickHandler] Found sequence by attributes at position:', position)
                        return false
                      }
                    }
                  })
                }
                
                if (pos === null || pos === undefined || pos < 0) {
                  console.error('❌ [InteractiveClickHandler] Could not determine valid position for element:', element)
                  console.error('   Tried all strategies but all failed')
                  return false
                }

                console.log('✅ [InteractiveClickHandler] Final position:', pos, 'for element type:', elementTypeResult.type)

                // Handle based on element type
                switch (elementTypeResult.type) {
                  case 'listItem':
                    console.log('🎯 [InteractiveClickHandler] Handling listItem click')
                    return handleListItemClick(
                      elementTypeResult.element,
                      pos,
                      options.onEditInteractiveListItem!
                    )

                  case 'sequence':
                    console.log('🎯 [InteractiveClickHandler] Handling sequence click')
                    return handleSequenceSectionClick(
                      elementTypeResult.element,
                      pos,
                      options.onEditSequenceSection!
                    )

                  case 'span':
                    console.log('🎯 [InteractiveClickHandler] Handling span click')
                    return handleInteractiveSpanClick(
                      view,
                      pos,
                      options.onEditInteractiveSpan!
                    )

                  case 'comment':
                    console.log('🎯 [InteractiveClickHandler] Handling comment click')
                    return handleInteractiveCommentClick(
                      view,
                      pos,
                      options.onEditInteractiveComment!
                    )

                  default:
                    console.error('❌ [InteractiveClickHandler] Unknown element type:', elementTypeResult.type)
                    return false
                }
              } catch (error) {
                // Log error but don't crash the editor
                console.error('💥 [InteractiveClickHandler] Exception in click handler:', error)
                return false
              }
            },
          },
        },
      }),
    ]
  },
})

