import type { Registry } from '../common/core/Registry'
import { ConstantsParams } from '../common/core/constants'

declare global {
  interface Window {
    angband: {
      constants: ConstantsParams
      registries: {
        [key: string]: Registry<any, any, any>
      }
    }
  }
}
