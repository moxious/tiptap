/**
 * Action Type Registry
 * Single source of truth for all interactive action configurations
 */

import { ACTION_TYPES, DEFAULT_VALUES } from '../constants'
import type { BaseInteractiveFormConfig } from '../components/interactive-forms/BaseInteractiveForm'

/**
 * Action metadata for UI display
 */
export interface ActionMetadata {
  type: string
  icon: string
  name: string
  description: string
}

/**
 * Complete action configuration including metadata and form fields
 */
export interface ActionConfig extends ActionMetadata {
  formConfig: BaseInteractiveFormConfig
}

/**
 * All action metadata (used in ActionSelector)
 */
export const ACTION_METADATA: ActionMetadata[] = [
  {
    type: ACTION_TYPES.BUTTON,
    icon: '🔘',
    name: 'Button',
    description: 'Click a button',
  },
  {
    type: ACTION_TYPES.HIGHLIGHT,
    icon: '✨',
    name: 'Highlight',
    description: 'Highlight an element',
  },
  {
    type: ACTION_TYPES.FORM_FILL,
    icon: '📝',
    name: 'Form Fill',
    description: 'Fill an input field',
  },
  {
    type: ACTION_TYPES.NAVIGATE,
    icon: '🧭',
    name: 'Navigate',
    description: 'Go to a page',
  },
  {
    type: ACTION_TYPES.HOVER,
    icon: '👆',
    name: 'Hover',
    description: 'Reveal on hover',
  },
  {
    type: ACTION_TYPES.MULTISTEP,
    icon: '📋',
    name: 'Multistep',
    description: 'Multiple actions',
  },
]

/**
 * Complete registry of all action configurations
 */
export const ACTION_CONFIGS: Record<string, BaseInteractiveFormConfig> = {
  [ACTION_TYPES.BUTTON]: {
    title: 'Button Click Action',
    description: 'Click a button with specific text',
    actionType: ACTION_TYPES.BUTTON,
    fields: [
      {
        id: DATA_ATTRIBUTES.REF_TARGET,
        label: 'Button Text:',
        type: 'text',
        placeholder: 'e.g., Save, Create, Submit',
        hint: 'The exact text displayed on the button',
        required: true,
        autoFocus: true,
      },
      {
        id: DATA_ATTRIBUTES.REQUIREMENTS,
        label: 'Requirements:',
        type: 'text',
        placeholder: `e.g., ${DEFAULT_VALUES.REQUIREMENT}`,
        defaultValue: DEFAULT_VALUES.REQUIREMENT,
        showCommonOptions: true,
      },
    ],
    buildAttributes: (values) => ({
      [DATA_ATTRIBUTES.TARGET_ACTION]: ACTION_TYPES.BUTTON,
      [DATA_ATTRIBUTES.REF_TARGET]: values[DATA_ATTRIBUTES.REF_TARGET],
      [DATA_ATTRIBUTES.REQUIREMENTS]: values[DATA_ATTRIBUTES.REQUIREMENTS],
      class: DEFAULT_VALUES.CLASS,
    }),
  },

  [ACTION_TYPES.HIGHLIGHT]: {
    title: 'Highlight Element Action',
    description: 'Highlight a specific UI element',
    actionType: ACTION_TYPES.HIGHLIGHT,
    fields: [
      {
        id: DATA_ATTRIBUTES.REF_TARGET,
        label: 'CSS Selector:',
        type: 'text',
        placeholder: 'e.g., [data-testid="panel"], .my-class',
        hint: 'CSS selector for the element to highlight',
        required: true,
        autoFocus: true,
      },
      {
        id: DATA_ATTRIBUTES.REQUIREMENTS,
        label: 'Requirements:',
        type: 'text',
        placeholder: `e.g., ${DEFAULT_VALUES.REQUIREMENT}`,
        defaultValue: DEFAULT_VALUES.REQUIREMENT,
        showCommonOptions: true,
      },
      {
        id: DATA_ATTRIBUTES.DO_IT,
        label: 'Show-only (educational, no interaction required)',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
    buildAttributes: (values) => ({
      [DATA_ATTRIBUTES.TARGET_ACTION]: ACTION_TYPES.HIGHLIGHT,
      [DATA_ATTRIBUTES.REF_TARGET]: values[DATA_ATTRIBUTES.REF_TARGET],
      [DATA_ATTRIBUTES.REQUIREMENTS]: values[DATA_ATTRIBUTES.REQUIREMENTS],
      [DATA_ATTRIBUTES.DO_IT]: values[DATA_ATTRIBUTES.DO_IT] ? DEFAULT_VALUES.DO_IT_FALSE : null,
      class: DEFAULT_VALUES.CLASS,
    }),
  },

  [ACTION_TYPES.FORM_FILL]: {
    title: 'Form Fill Action',
    description: 'Fill a form input field',
    actionType: ACTION_TYPES.FORM_FILL,
    fields: [
      {
        id: DATA_ATTRIBUTES.REF_TARGET,
        label: 'Input Selector:',
        type: 'text',
        placeholder: 'e.g., input[name="title"], #query',
        hint: 'CSS selector for the input field',
        required: true,
        autoFocus: true,
      },
      {
        id: DATA_ATTRIBUTES.REQUIREMENTS,
        label: 'Requirements:',
        type: 'text',
        placeholder: `e.g., ${DEFAULT_VALUES.REQUIREMENT}`,
        defaultValue: DEFAULT_VALUES.REQUIREMENT,
        showCommonOptions: true,
      },
    ],
    buildAttributes: (values) => ({
      [DATA_ATTRIBUTES.TARGET_ACTION]: ACTION_TYPES.FORM_FILL,
      [DATA_ATTRIBUTES.REF_TARGET]: values[DATA_ATTRIBUTES.REF_TARGET],
      [DATA_ATTRIBUTES.REQUIREMENTS]: values[DATA_ATTRIBUTES.REQUIREMENTS],
      class: DEFAULT_VALUES.CLASS,
    }),
  },

  [ACTION_TYPES.NAVIGATE]: {
    title: 'Navigate Action',
    description: 'Navigate to a specific page',
    actionType: ACTION_TYPES.NAVIGATE,
    fields: [
      {
        id: DATA_ATTRIBUTES.REF_TARGET,
        label: 'Page Path:',
        type: 'text',
        placeholder: 'e.g., /dashboards, /datasources',
        hint: 'The URL path to navigate to',
        required: true,
        autoFocus: true,
      },
      {
        id: DATA_ATTRIBUTES.REQUIREMENTS,
        label: 'Requirements:',
        type: 'text',
        placeholder: 'Auto: on-page:/path',
        hint: 'Leave blank to auto-generate on-page requirement',
      },
    ],
    buildAttributes: (values) => ({
      [DATA_ATTRIBUTES.TARGET_ACTION]: ACTION_TYPES.NAVIGATE,
      [DATA_ATTRIBUTES.REF_TARGET]: values[DATA_ATTRIBUTES.REF_TARGET],
      [DATA_ATTRIBUTES.REQUIREMENTS]: values[DATA_ATTRIBUTES.REQUIREMENTS] || `on-page:${values[DATA_ATTRIBUTES.REF_TARGET]}`,
      class: DEFAULT_VALUES.CLASS,
    }),
  },

  [ACTION_TYPES.HOVER]: {
    title: 'Hover Action',
    description: 'Reveal hover-hidden UI elements',
    actionType: ACTION_TYPES.HOVER,
    fields: [
      {
        id: DATA_ATTRIBUTES.REF_TARGET,
        label: 'Element Selector:',
        type: 'text',
        placeholder: 'e.g., div[data-cy="item"]:has(p:contains("name"))',
        hint: 'CSS selector for the element to hover over',
        required: true,
        autoFocus: true,
      },
      {
        id: DATA_ATTRIBUTES.REQUIREMENTS,
        label: 'Requirements:',
        type: 'text',
        placeholder: `e.g., ${DEFAULT_VALUES.REQUIREMENT}`,
        defaultValue: DEFAULT_VALUES.REQUIREMENT,
        showCommonOptions: true,
      },
    ],
    buildAttributes: (values) => ({
      [DATA_ATTRIBUTES.TARGET_ACTION]: ACTION_TYPES.HOVER,
      [DATA_ATTRIBUTES.REF_TARGET]: values[DATA_ATTRIBUTES.REF_TARGET],
      [DATA_ATTRIBUTES.REQUIREMENTS]: values[DATA_ATTRIBUTES.REQUIREMENTS],
      class: DEFAULT_VALUES.CLASS,
    }),
  },

  [ACTION_TYPES.MULTISTEP]: {
    title: 'Multistep Action',
    description: 'Multiple related actions in sequence (typically contains nested interactive spans)',
    actionType: ACTION_TYPES.MULTISTEP,
    fields: [
      {
        id: DATA_ATTRIBUTES.REQUIREMENTS,
        label: 'Requirements:',
        type: 'text',
        placeholder: `e.g., ${DEFAULT_VALUES.REQUIREMENT} (optional)`,
        hint: 'Requirements are usually set on child interactive spans',
        autoFocus: true,
        showCommonOptions: true,
      },
    ],
    infoBox: 'Multistep actions typically contain nested interactive spans. After applying, add child elements with their own interactive markup inside this list item.',
    buildAttributes: (values) => ({
      [DATA_ATTRIBUTES.TARGET_ACTION]: ACTION_TYPES.MULTISTEP,
      [DATA_ATTRIBUTES.REQUIREMENTS]: values[DATA_ATTRIBUTES.REQUIREMENTS],
      class: DEFAULT_VALUES.CLASS,
    }),
  },
}

// Import for type safety - needs to be after ACTION_CONFIGS definition
import { DATA_ATTRIBUTES } from '../constants'

/**
 * Get action configuration by type
 */
export function getActionConfig(actionType: string): BaseInteractiveFormConfig | undefined {
  return ACTION_CONFIGS[actionType]
}

/**
 * Get action metadata by type
 */
export function getActionMetadata(actionType: string): ActionMetadata | undefined {
  return ACTION_METADATA.find(m => m.type === actionType)
}

