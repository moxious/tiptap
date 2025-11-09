import { Node, mergeAttributes } from '@tiptap/core'
import {
  createIdAttribute,
  createClassAttribute,
  createTargetActionAttribute,
  createRefTargetAttribute,
  createRequirementsAttribute,
} from './shared/attributes'
import { createSequenceSectionNodeView } from './shared/nodeViewFactory'

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
      id: createIdAttribute(),
      class: createClassAttribute('interactive'),
      'data-targetaction': createTargetActionAttribute('sequence'),
      'data-reftarget': createRefTargetAttribute(),
      'data-requirements': createRequirementsAttribute(),
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
      return createSequenceSectionNodeView(HTMLAttributes)
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

