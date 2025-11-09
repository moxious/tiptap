import { Editor } from '@tiptap/react'

// Shared interface for all interactive form components
export interface InteractiveFormProps {
  editor: Editor
  onApply: (attributes: InteractiveAttributes) => void
  onCancel: () => void
  initialValues?: Partial<InteractiveAttributes>
}

// All possible attributes for interactive elements
export interface InteractiveAttributes {
  'data-targetaction'?: string
  'data-reftarget'?: string
  'data-requirements'?: string
  'data-doit'?: 'false' | null
  class?: string
  id?: string
}

// Action types
export type ActionType = 
  | 'button'
  | 'highlight'
  | 'formfill'
  | 'navigate'
  | 'hover'
  | 'multistep'
  | 'sequence'

// Common requirement options
export const COMMON_REQUIREMENTS = [
  'exists-reftarget',
  'navmenu-open',
  'on-page:',
  'is-admin',
  'has-datasource:',
  'has-plugin:',
  'section-completed:',
] as const

export type CommonRequirement = typeof COMMON_REQUIREMENTS[number]

