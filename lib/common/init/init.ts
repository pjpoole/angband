import { isBrowser } from '../utilities/environment'
import { JsonArray } from '../utilities/json'

import { Registry } from '../core/Registry'
import { Loadable, SerializableBase } from '../core/serializable'

import { get } from './Constants'

const _loading: Record<string, boolean> = {}

export function doInit<T extends SerializableBase>(
  registry: Registry<T, any, any>, cls: Loadable<T>, ary: JsonArray
): void {
  if (registry.loaded) return

  const name = cls.name
  if (_loading[name]) throw new Error(
    'circular dependency detected',
    { cause: { class: name } }
  )
  _loading[name] = true

  console.log(`Loading ${name}...`)
  try {
    for (const entry of ary) {
      cls.fromJSON(entry).register()
    }
    registry.finalize()

    console.log(`... done loading ${name}.`)
    if (isBrowser) {
      window.angband ??= { constants: get(), registries: {} }
      window.angband.registries[cls.name] = registry
    }
  } catch(e) {
    console.error(`failed to load ${name}!`)
    console.error(e)
    throw e
  }
  _loading[name] = false
}
