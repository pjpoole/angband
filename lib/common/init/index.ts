import { init as initActivation } from './Activation'
import { init as initArtifact } from './Artifact'
import { init as initBlow } from './Blow'
import { init as initBlowEffect } from './BlowEffect'
import { init as initBrand } from './Brand'
import { init as initConstants } from './Constants'
import { init as initCurse } from './Curse'
import { init as initDungeonProfile } from './DungeonProfile'
import { init as initEgoItem } from './EgoItem'
import { init as initFeature } from './Feature'
import { init as initMonster } from './Monster'
import { init as initMonsterBase } from './MonsterBase'
import { init as initMonsterSpell } from './MonsterSpell'
import { init as initNames } from './Names'
import { init as initObject } from './Object'
import { init as initObjectBase } from './ObjectBase'
import { init as initPain } from './Pain'
import { init as initPit } from './Pit'
import { init as initPlayerProperty } from './PlayerProperty'
import { init as initProjection } from './Projection'
import { init as initQuest } from './Quest'
import { init as initRoomTemplate } from './RoomTemplate'
import { init as initShape } from './Shape'
import { init as initSlay } from './Slay'
import { init as initSummon } from './Summon'
import { init as initVault } from './Vault'
import { init as initWorld } from './World'

const INITIALIZERS = [
  initActivation,
  initArtifact,
  initBlow,
  initBlowEffect,
  initBrand,
  initConstants,
  initCurse,
  initDungeonProfile,
  initEgoItem,
  initFeature,
  initMonster,
  initMonsterBase,
  initMonsterSpell,
  initNames,
  initObject,
  initObjectBase,
  initPain,
  initPit,
  initPlayerProperty,
  initProjection,
  initQuest,
  initRoomTemplate,
  initShape,
  initSlay,
  initSummon,
  initVault,
  initWorld,
]

export function init() {
  for (const initializer of INITIALIZERS) {
    initializer()
  }
}
