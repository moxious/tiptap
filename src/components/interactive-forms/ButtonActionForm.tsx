import { type InteractiveFormProps } from './types'
import BaseInteractiveForm, { type BaseInteractiveFormConfig } from './BaseInteractiveForm'

const config: BaseInteractiveFormConfig = {
  title: 'Button Click Action',
  description: 'Click a button with specific text',
  actionType: 'button',
  fields: [
    {
      id: 'data-reftarget',
      label: 'Button Text:',
      type: 'text',
      placeholder: 'e.g., Save, Create, Submit',
      hint: 'The exact text displayed on the button',
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
    'data-targetaction': 'button',
    'data-reftarget': values['data-reftarget'],
    'data-requirements': values['data-requirements'],
    class: 'interactive',
  }),
}

const ButtonActionForm = (props: InteractiveFormProps) => {
  return <BaseInteractiveForm config={config} {...props} />
}

export default ButtonActionForm

