/**
 * Centralized constants for the Tiptap Interactive Editor
 * This module contains all magic strings and configuration values used throughout the application
 */

/**
 * CSS class names used for interactive elements
 */
export const CSS_CLASSES = {
  INTERACTIVE: 'interactive',
  INTERACTIVE_COMMENT: 'interactive-comment',
  INTERACTIVE_LIGHTNING: 'interactive-lightning',
} as const

/**
 * HTML data attribute keys
 */
export const DATA_ATTRIBUTES = {
  TARGET_ACTION: 'data-targetaction',
  REF_TARGET: 'data-reftarget',
  REQUIREMENTS: 'data-requirements',
  DO_IT: 'data-doit',
} as const

/**
 * Tiptap node and mark type names
 */
export const NODE_TYPES = {
  LIST_ITEM: 'listItem',
  INTERACTIVE_SPAN: 'interactiveSpan',
  INTERACTIVE_COMMENT: 'interactiveComment',
  SEQUENCE_SECTION: 'sequenceSection',
} as const

/**
 * HTML element tag names
 */
export const HTML_TAGS = {
  LIST_ITEM: 'li',
  SPAN: 'span',
  DIV: 'div',
} as const

/**
 * Interactive action types
 */
export const ACTION_TYPES = {
  BUTTON: 'button',
  HIGHLIGHT: 'highlight',
  FORM_FILL: 'formfill',
  NAVIGATE: 'navigate',
  HOVER: 'hover',
  MULTISTEP: 'multistep',
  SEQUENCE: 'sequence',
} as const

/**
 * Default attribute values
 */
export const DEFAULT_VALUES = {
  CLASS: CSS_CLASSES.INTERACTIVE,
  REQUIREMENT: 'exists-reftarget',
  DO_IT_FALSE: 'false',
} as const

/**
 * Common requirement options available across interactive elements
 */
export const COMMON_REQUIREMENTS = [
  'exists-reftarget',
  'navmenu-open',
  'on-page:',
  'is-admin',
  'has-datasource:',
  'has-plugin:',
  'section-completed:',
] as const

// Type exports for type safety
export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES]
export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES]
export type CssClass = typeof CSS_CLASSES[keyof typeof CSS_CLASSES]
export type CommonRequirement = typeof COMMON_REQUIREMENTS[number]

