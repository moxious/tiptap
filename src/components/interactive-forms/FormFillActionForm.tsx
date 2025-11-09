import { type InteractiveFormProps } from './types'
import BaseInteractiveForm, { type BaseInteractiveFormConfig } from './BaseInteractiveForm'

const config: BaseInteractiveFormConfig = {
  title: 'Form Fill Action',
  description: 'Fill a form input field',
  actionType: 'formfill',
  fields: [
    {
      id: 'data-reftarget',
      label: 'Input Selector:',
      type: 'text',
      placeholder: 'e.g., input[name="title"], #query',
      hint: 'CSS selector for the input field',
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
    'data-targetaction': 'formfill',
    'data-reftarget': values['data-reftarget'],
    'data-requirements': values['data-requirements'],
    class: 'interactive',
  }),
}

const FormFillActionForm = (props: InteractiveFormProps) => {
  return <BaseInteractiveForm config={config} {...props} />
}

export default FormFillActionForm

