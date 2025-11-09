import { type InteractiveFormProps } from './types'
import BaseInteractiveForm from './BaseInteractiveForm'
import { getActionConfig } from '../../config/actionTypes'
import { ACTION_TYPES } from '../../constants'

const ButtonActionForm = (props: InteractiveFormProps) => {
  const config = getActionConfig(ACTION_TYPES.BUTTON)
  if (!config) {
    throw new Error(`Action config not found for ${ACTION_TYPES.BUTTON}`)
  }
  return <BaseInteractiveForm config={config} {...props} />
}

export default ButtonActionForm

