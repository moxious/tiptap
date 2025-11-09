/**
 * Types for editor operations
 * Provides type safety for Tiptap editor commands and attribute operations
 */

import type { Editor } from '@tiptap/react'
import type { InteractiveElementType } from './editor'
import type { InteractiveAttributesOutput } from '../components/interactive-forms/types'

/**
 * Attribute update operation
 */
export interface AttributeUpdateOperation {
  nodeType: string
  attributes: InteractiveAttributesOutput
  pos?: number
}

/**
 * Node creation operation
 */
export interface NodeCreationOperation {
  nodeType: string
  attributes: InteractiveAttributesOutput
  content?: any
}

/**
 * Result of an editor command
 */
export interface CommandResult {
  success: boolean
  error?: string
}

/**
 * Parameters for applying interactive attributes
 */
export interface ApplyAttributesParams {
  editor: Editor
  elementType: InteractiveElementType
  attributes: InteractiveAttributesOutput
  pos?: number
}

/**
 * Parameters for converting to interactive element
 */
export interface ConvertToInteractiveParams {
  editor: Editor
  targetType: InteractiveElementType
  attributes: InteractiveAttributesOutput
}

/**
 * Parameters for updating element attributes
 */
export interface UpdateAttributesParams {
  editor: Editor
  nodeType: string
  attributes: Record<string, any>
  pos?: number
}

