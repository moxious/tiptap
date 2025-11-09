import { Node, mergeAttributes } from '@tiptap/core'
import { createClassAttribute } from './shared/attributes'
import { createSpanNodeView } from './shared/nodeViewFactory'

export interface InteractiveCommentOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    interactiveComment: {
      setInteractiveComment: () => ReturnType
      toggleInteractiveComment: () => ReturnType
      unsetInteractiveComment: () => ReturnType
    }
  }
}

export const InteractiveComment = Node.create<InteractiveCommentOptions>({
  name: 'interactiveComment',

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
      class: createClassAttribute('interactive-comment'),
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.interactive-comment',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addNodeView() {
    return ({ HTMLAttributes }) => {
      return createSpanNodeView(HTMLAttributes, true)
    }
  },

  addCommands() {
    return {
      setInteractiveComment:
        () =>
        ({ commands, state }) => {
          const { from, to } = state.selection
          // If there's a selection, wrap it in an interactive comment
          if (from !== to) {
            return commands.insertContentAt(
              { from, to },
              {
                type: this.name,
                attrs: { class: 'interactive-comment' },
                content: state.doc.slice(from, to).content.toJSON(),
              }
            )
          }
          // Otherwise insert an empty interactive comment
          return commands.insertContent({
            type: this.name,
            attrs: { class: 'interactive-comment' },
            content: [{ type: 'text', text: 'Comment text' }],
          })
        },
      toggleInteractiveComment:
        () =>
        ({ commands, state, chain }) => {
          const { from, to, $from } = state.selection
          
          // Check if we're inside an interactive comment
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth)
            if (node.type.name === this.name) {
              // We're inside an interactive comment, so unwrap it
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
          
          // Not inside an interactive comment, so wrap the selection
          if (from !== to) {
            return commands.insertContentAt(
              { from, to },
              {
                type: this.name,
                attrs: { class: 'interactive-comment' },
                content: state.doc.slice(from, to).content.toJSON(),
              }
            )
          }
          
          return false
        },
      unsetInteractiveComment:
        () =>
        ({ state, chain }) => {
          const { $from } = state.selection
          
          // Find if we're inside an interactive comment
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

