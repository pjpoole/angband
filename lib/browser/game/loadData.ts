import terrain from '../../gamedata/terrain.json'
import { FeatureRegistry } from '../../common/game/registries'
import { FEAT, Feature } from '../../common/world/features'
import type { Registry } from '../../common/core/Registry'



export function loadGameObjects(): void {
  window.angband.registries = {}
  loadTerrain()
}

function loadTerrain() {
  window.angband.registries.features = FeatureRegistry
  for (const terrainObj of terrain) {
    try {
      const feature = Feature.fromJSON(terrainObj)
      FeatureRegistry.add(FEAT[feature.code], feature)
    } catch (e) {
      console.log(`error loading ${JSON.stringify(terrainObj)}`)
      console.log(e)
      throw e
    }
  }
}
