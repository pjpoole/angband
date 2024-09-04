import { Entity } from '../../common/game/Entity'
import { GameMap } from '../../common/game/Map'

let _player: Entity
let _map: GameMap

export function setMap(map: GameMap) {
  _map = map
}

export function getMap(): GameMap {
  return _map
}

export function setPlayer(player: Entity) {
  _player = player
}

export function getPlayer(): Entity {
  return _player
}
