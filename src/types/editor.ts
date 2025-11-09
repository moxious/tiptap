/**
 * Type of interactive element being edited
 */
export type InteractiveElementType = 'listItem' | 'sequence' | 'span' | 'comment'

/**
 * State representing an interactive element being edited
 * All fields are required when state exists; use null for no edit state
 */
export interface EditState {
  type: InteractiveElementType
  attrs: Record<string, string>
  pos: number
}

/**
 * Edit state that may be null when no element is being edited
 */
export type EditStateOrNull = EditState | null

