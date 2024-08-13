import terrain from '../../gamedata/terrain.json'
import { FeatureRegistry } from '../../common/game/registries'
import { FEAT, Feature } from '../../common/world/features'

export function loadGameObjects(): void {
  loadTerrain()
}

function loadTerrain() {
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
