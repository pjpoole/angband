import type { Registry } from '../common/core/Registry'

declare global {
  interface Window {
    angband: {
      registries: {
        [key: string]: Registry<any, any>
      }
    }
  }
}
