import * as constants from '../../gamedata/constants.json'
import { Constants, ConstantsParams } from './constants'

let _constants: ConstantsParams

export function getConstants(): ConstantsParams {
  if (_constants == null) {
    const constantObj = Constants.fromJSON(constants)
    _constants = constantObj.data
  }

  return _constants
}
