import type { Registry } from '../common/core/Registry'

declare global {
  interface Window {
    angband: {
      registries: Record<string, Registry<any, any>>
    }
  }
}
