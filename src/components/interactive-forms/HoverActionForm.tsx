import { type InteractiveFormProps } from './types'
import BaseInteractiveForm, { type BaseInteractiveFormConfig } from './BaseInteractiveForm'

const config: BaseInteractiveFormConfig = {
  title: 'Hover Action',
  description: 'Reveal hover-hidden UI elements',
  actionType: 'hover',
  fields: [
    {
      id: 'data-reftarget',
      label: 'Element Selector:',
      type: 'text',
      placeholder: 'e.g., div[data-cy="item"]:has(p:contains("name"))',
      hint: 'CSS selector for the element to hover over',
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
  ],
  buildAttributes: (values) => ({
    'data-targetaction': 'hover',
    'data-reftarget': values['data-reftarget'],
    'data-requirements': values['data-requirements'],
    class: 'interactive',
  }),
}

const HoverActionForm = (props: InteractiveFormProps) => {
  return <BaseInteractiveForm config={config} {...props} />
}

export default HoverActionForm

