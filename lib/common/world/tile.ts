import { FEAT, Feature, TF } from './features'
import { FeatureRegistry } from '../game/registries'
import { Monster } from '../monsters/monster'
import { SQUARE } from './square'

export class Tile {
  private readonly x: number
  private readonly y: number
  private feature: Feature

  light: number = 0
  monster?: Monster

  // TODO: Not space-efficient; bitflag
  private readonly flags: Partial<Record<SQUARE, boolean>> = {}
  readonly objects: any[] = [] // TODO: Type
  // trap
  // noise
  // smell

  constructor(x: number, y: number, feature: FEAT) {
    this.x = x
    this.y = y

    this.feature = FeatureRegistry.get(feature)
  }

  get glyph(): string {
    return this.feature.glyph
  }

  turnOn(flag: SQUARE) {
    this.flags[flag] = true
  }

  turnOff(flag: SQUARE) {
    this.flags[flag] = false
  }

  isMark(): boolean {
    return this.flags[SQUARE.MARK] === true
  }

  isGlow(): boolean {
    return this.flags[SQUARE.GLOW] === true
  }

  isVault(): boolean {
    return this.flags[SQUARE.VAULT] === true
  }

  isRoom(): boolean {
    return this.flags[SQUARE.ROOM] === true
  }

  isSeen(): boolean {
    return this.flags[SQUARE.SEEN] === true
  }

  isView(): boolean {
    return this.flags[SQUARE.VIEW] === true
  }

  wasSeen(): boolean {
    return this.flags[SQUARE.WASSEEN] === true
  }

  isFeel(): boolean {
    return this.flags[SQUARE.FEEL] === true
  }

  // Potentially allows other sources of damage than magma
  isDamaging(): boolean {
    return this.feature.isFiery()
  }

  // generation, probably
  allowsFeel(): boolean {
    return this.isPassable() && !this.isDamaging()
  }

  isInteresting(): boolean {
    return this.feature.isInteresting()
  }

  isTrap(): boolean {
    return this.flags[SQUARE.TRAP] === true
  }

  // generation
  isWallInner(): boolean {
    return this.flags[SQUARE.WALL_INNER] === true
  }

  // generation
  isWallOuter(): boolean {
    return this.flags[SQUARE.WALL_OUTER] === true
  }

  // generation
  isWallSolid(): boolean {
    return this.flags[SQUARE.WALL_SOLID] === true
  }

  // generation
  isMonsterRestricted(): boolean {
    return this.flags[SQUARE.MON_RESTRICT] === true
  }

  isNoTeleport(): boolean {
    return this.flags[SQUARE.NO_TELEPORT] === true
  }

  isNoMap(): boolean {
    return this.flags[SQUARE.NO_MAP] === true
  }

  isNoEsp(): boolean {
    return this.flags[SQUARE.NO_ESP] === true
  }

  isProject(): boolean {
    return this.flags[SQUARE.PROJECT] === true
  }

  isTrapDetected(): boolean {
    return this.flags[SQUARE.DTRAP] === true
  }

  // generation
  isNoStairs(): boolean {
    return this.flags[SQUARE.NO_STAIRS] === true
  }

  isOpen(): boolean {
    return this.isFloor() && this.monster == null
  }

  isEmpty(): boolean {
    // TODO: Trap flags, trap code
    return this.isOpen() && this.objects.length === 0
  }

  isArrivable(): boolean {
    if (this.monster) return false
    // TODO: traps
    if (this.isFloor()) return true
    if (this.isStair()) return true
    return false
  }

  canPutItem(): boolean {
    if (!this.isObjectHolding()) return false
    // TODO: traps
    // TODO: stackable objects??
    return this.objects.length === 0
  }


  // TODO: how do we represent the player
  isPlayer() {

  }

  isMonster(): boolean {
    return this.monster != null
  }

  isPermanent(): boolean {
    return this.feature.isPermanent()
  }

  isStair(): boolean {
    return this.feature.isStair()
  }

  isUpStair(): boolean {
    return this.feature.isUpStair()
  }

  isDownStair(): boolean {
    return this.feature.isDownStair()
  }

  isDoor(): boolean {
    return this.feature.isDoorish()
  }

  isSecretDoor(): boolean {
    return this.feature.isDoorish() && this.feature.isRock()
  }

  isDiggable(): boolean {
    return (
      this.isMineral() ||
      this.isSecretDoor() ||
      this.isRubble()
    )
  }

  isRock(): boolean {
    return this.feature.isGranite() && !this.feature.isDoorish()
  }

  isMagma(): boolean {
    return this.feature.isMagma()
  }

  isQuartz(): boolean {
    return this.feature.isQuartz()
  }

  isGranite(): boolean {
    return this.feature.isGranite()
  }

  isMineral(): boolean {
    return this.isRock() || this.isMagma() || this.isQuartz()
  }

  hasGoldVein(): boolean {
    return this.feature.isTreasure()
  }

  // TODO: Tile and feature isRock differ in definition
  isRubble(): boolean {
    return !this.feature.isWall() && this.feature.isRock()
  }

  isWall(): boolean {
    return this.feature.isWall()
  }

  seemsLikeWall(): boolean {
    return this.feature.isRock()
  }

  isFloor(): boolean {
    return this.feature.isFloor()
  }

  isTrapHolding(): boolean {
    return this.feature.isTrapHolding()
  }

  isObjectHolding(): boolean {
    return this.feature.isObjectHolding()
  }

  isMonsterWalkable(): boolean {
    return this.feature.isMonsterWalkable()
  }

  isShop(): boolean {
    return this.feature.isShop()
  }

  isLineOfSight(): boolean {
    return this.feature.isLineOfSight()
  }

  isPassable(): boolean {
    return this.feature.isPassable()
  }

  isProjectable(): boolean {
    return this.feature.isProjectable()
  }

  isLightable(): boolean {
    return this.feature.isLightable()
  }

  isBright(): boolean {
    return this.feature.isBright()
  }

  isNoFlow(): boolean {
    return this.feature.isNoFlow()
  }

  isNoScent(): boolean {
    return this.feature.isNoScent()
  }

  isSmooth(): boolean {
    return this.feature.isSmooth()
  }
}
