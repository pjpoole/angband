import type { ConstantsParams } from '../core/constants'
import type { Registry } from '../core/Registry'

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
