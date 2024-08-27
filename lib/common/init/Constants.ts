import constants from '../../gamedata/constants.json'
import { Constants, ConstantsParams } from '../core/constants'

let _constants: ConstantsParams | undefined

// side-effects only
export function init() {
  load()
}

function load(): ConstantsParams {
  return Constants.fromJSON(constants).data
}

export function get() {
  _constants ??= load()
  return _constants
}
