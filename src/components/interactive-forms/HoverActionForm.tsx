import { type InteractiveFormProps } from './types'
import BaseInteractiveForm from './BaseInteractiveForm'
import { getActionConfig } from '../../config/actionTypes'
import { ACTION_TYPES } from '../../constants'

const HoverActionForm = (props: InteractiveFormProps) => {
  const config = getActionConfig(ACTION_TYPES.HOVER)
  if (!config) {
    throw new Error(`Action config not found for ${ACTION_TYPES.HOVER}`)
  }
  return <BaseInteractiveForm config={config} {...props} />
}

export default HoverActionForm

