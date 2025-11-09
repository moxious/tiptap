import { type InteractiveFormProps } from './types'
import BaseInteractiveForm, { type BaseInteractiveFormConfig } from './BaseInteractiveForm'

const config: BaseInteractiveFormConfig = {
  title: 'Multistep Action',
  description: 'Multiple related actions in sequence (typically contains nested interactive spans)',
  actionType: 'multistep',
  fields: [
    {
      id: 'data-requirements',
      label: 'Requirements:',
      type: 'text',
      placeholder: 'e.g., exists-reftarget (optional)',
      hint: 'Requirements are usually set on child interactive spans',
      autoFocus: true,
      showCommonOptions: true,
    },
  ],
  infoBox: 'Multistep actions typically contain nested interactive spans. After applying, add child elements with their own interactive markup inside this list item.',
  buildAttributes: (values) => ({
    'data-targetaction': 'multistep',
    'data-requirements': values['data-requirements'],
    class: 'interactive',
  }),
}

const MultistepActionForm = (props: InteractiveFormProps) => {
  return <BaseInteractiveForm config={config} {...props} />
}

export default MultistepActionForm

