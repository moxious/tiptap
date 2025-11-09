import { type InteractiveFormProps } from './types'
import BaseInteractiveForm from './BaseInteractiveForm'
import { getActionConfig } from '../../config/actionTypes'
import { ACTION_TYPES } from '../../constants'

const MultistepActionForm = (props: InteractiveFormProps) => {
  const config = getActionConfig(ACTION_TYPES.MULTISTEP)
  if (!config) {
    throw new Error(`Action config not found for ${ACTION_TYPES.MULTISTEP}`)
  }
  return <BaseInteractiveForm config={config} {...props} />
}

export default MultistepActionForm

