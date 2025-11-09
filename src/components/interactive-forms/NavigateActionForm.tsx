import { type InteractiveFormProps } from './types'
import BaseInteractiveForm, { type BaseInteractiveFormConfig } from './BaseInteractiveForm'

const config: BaseInteractiveFormConfig = {
  title: 'Navigate Action',
  description: 'Navigate to a specific page',
  actionType: 'navigate',
  fields: [
    {
      id: 'data-reftarget',
      label: 'Page Path:',
      type: 'text',
      placeholder: 'e.g., /dashboards, /datasources',
      hint: 'The URL path to navigate to',
      required: true,
      autoFocus: true,
    },
    {
      id: 'data-requirements',
      label: 'Requirements:',
      type: 'text',
      placeholder: 'Auto: on-page:/path',
      hint: 'Leave blank to auto-generate on-page requirement',
    },
  ],
  buildAttributes: (values) => ({
    'data-targetaction': 'navigate',
    'data-reftarget': values['data-reftarget'],
    'data-requirements': values['data-requirements'] || `on-page:${values['data-reftarget']}`,
    class: 'interactive',
  }),
}

const NavigateActionForm = (props: InteractiveFormProps) => {
  return <BaseInteractiveForm config={config} {...props} />
}

export default NavigateActionForm

