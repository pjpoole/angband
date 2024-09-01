import { timed } from '../utilities/diagnostic'

import * as Activation from './Activation'
import * as Artifact from './Artifact'
import * as Blow from './Blow'
import * as BlowEffect from './BlowEffect'
import * as Brand from './Brand'
import * as Constants from './Constants'
import * as Curse from './Curse'
import * as DungeonProfile from './DungeonProfile'
import * as EgoItem from './EgoItem'
import * as Feature from './Feature'
import * as Monster from './Monster'
import * as MonsterBase from './MonsterBase'
import * as MonsterSpell from './MonsterSpell'
import * as Names from './Names'
import * as Object from './Object'
import * as ObjectBase from './ObjectBase'
import * as Pain from './Pain'
import * as Pit from './Pit'
import * as PlayerProperty from './PlayerProperty'
import * as Projection from './Projection'
import * as Quest from './Quest'
import * as RoomTemplate from './RoomTemplate'
import * as Shape from './Shape'
import * as Slay from './Slay'
import * as Summon from './Summon'
import * as Vault from './Vault'
import * as World from './World'

const INITIALIZERS = [
  Activation.init,
  Artifact.init,
  Blow.init,
  BlowEffect.init,
  Brand.init,
  Constants.init,
  Curse.init,
  DungeonProfile.init,
  EgoItem.init,
  Feature.init,
  Monster.init,
  MonsterBase.init,
  MonsterSpell.init,
  Names.init,
  Object.init,
  ObjectBase.init,
  Pain.init,
  Pit.init,
  PlayerProperty.init,
  Projection.init,
  Quest.init,
  RoomTemplate.init,
  Shape.init,
  Slay.init,
  Summon.init,
  Vault.init,
  World.init,
]

export function init() {
  timed(() => {
    for (const initializer of INITIALIZERS) {
      initializer()
    }
  },`loaded all initializers in %d ms`)
}
