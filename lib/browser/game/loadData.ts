import constants from '../../gamedata/constants.json'
import world from '../../gamedata/world.json'
import terrain from '../../gamedata/terrain.json'

import { Constants } from '../../common/core/constants'
import { Registry } from '../../common/core/Registry'
import { FeatureRegistry, LevelRegistry } from '../../common/game/registries'
import { Feature } from '../../common/world/features'
import { Level } from '../../common/world/level'
import { JsonArray } from '../../common/utilities/json'

const Loaders: [string, string, JsonArray, any, Registry<any, any>][] = [
  ['level', 'depth', world, Level, LevelRegistry],
  ['feature', 'code', terrain, Feature, FeatureRegistry ]
]

export function loadConstants(): void {
  // @ts-ignore
  window.angband ??= {}

  // just parsing
  const instance = Constants.fromJSON(constants)

  window.angband.constants = instance.data
}

export function loadGameObjects(): void {
  // @ts-ignore
  window.angband ??= {}
  window.angband.registries = {}

  for (const [str, key, dataFile, ctor, registry] of Loaders) {
    window.angband.registries[str] = registry

    for (const obj of dataFile) {
      try {
        const instance = ctor.fromJSON(obj)
        registry.add(instance[key], instance)
      } catch (e) {
        console.log(`error loading ${str}: ${JSON.stringify(obj)}`)
        console.log(e)
        throw (e)
      }
    }
  }
}
