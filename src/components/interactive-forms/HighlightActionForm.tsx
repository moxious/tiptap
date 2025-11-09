import { type InteractiveFormProps } from './types'
import BaseInteractiveForm, { type BaseInteractiveFormConfig } from './BaseInteractiveForm'

const config: BaseInteractiveFormConfig = {
  title: 'Highlight Element Action',
  description: 'Highlight a specific UI element',
  actionType: 'highlight',
  fields: [
    {
      id: 'data-reftarget',
      label: 'CSS Selector:',
      type: 'text',
      placeholder: 'e.g., [data-testid="panel"], .my-class',
      hint: 'CSS selector for the element to highlight',
      required: true,
      autoFocus: true,
    },
    {
      id: 'data-requirements',
      label: 'Requirements:',
      type: 'text',
      placeholder: 'e.g., exists-reftarget',
      defaultValue: 'exists-reftarget',
      showCommonOptions: true,
    },
    {
      id: 'data-doit',
      label: 'Show-only (educational, no interaction required)',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  buildAttributes: (values) => ({
    'data-targetaction': 'highlight',
    'data-reftarget': values['data-reftarget'],
    'data-requirements': values['data-requirements'],
    'data-doit': values['data-doit'] ? 'false' : null,
    class: 'interactive',
  }),
}

const HighlightActionForm = (props: InteractiveFormProps) => {
  return <BaseInteractiveForm config={config} {...props} />
}

export default HighlightActionForm

