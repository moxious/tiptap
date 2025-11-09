/**
 * Type of interactive element being edited
 */
export type InteractiveElementType = 'listItem' | 'sequence' | 'span' | 'comment'

/**
 * State representing an interactive element being edited
 */
export interface EditState {
  type: InteractiveElementType | null
  attrs: Record<string, any>
  pos: number
}

/**
 * Partial edit state for components that only handle certain types
 */
export type PartialEditState = EditState | null

