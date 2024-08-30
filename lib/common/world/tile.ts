import { Flags } from '../core/flags'
import { Loc } from '../core/loc'

import { Monster } from '../monsters/monster'
import { FEAT, Feature, FeatureRegistry } from './features'
import { SQUARE } from './square'

export class Tile {
  private readonly pt: Loc
  feature: Feature

  light: number = 0
  monster?: Monster

  // TODO: Not space-efficient; bitflag
  private readonly flags: Flags
  readonly objects: any[] = [] // TODO: Type
  // trap
  // noise
  // smell

  constructor(pt: Loc, feature?: Feature, flag?: SQUARE) {
    this.pt = pt
    this.flags = new Flags(SQUARE.MAX)

    this.feature = feature ?? FeatureRegistry.get(FEAT.NONE)
    if (flag) this.turnOn(flag)
  }

  turnOn(flag: SQUARE) {
    this.flags.turnOn(flag)
  }

  turnOff(flag: SQUARE) {
    this.flags.turnOff(flag)
  }

  has(flag: SQUARE): boolean {
    return this.flags.has(flag)
  }

  get glyph(): string {
    return this.feature.glyph
  }

  is(feature: FEAT): boolean {
    return this.feature.code === feature
  }

  // TODO: figure out what "mark" means
  isMark(): boolean {
    return this.flags.has(SQUARE.MARK)
  }

  /**
   * Is the square self-lit
   */
  isGlow(): boolean {
    return this.flags.has(SQUARE.GLOW)
  }

  /**
   * Is the square part of a vault. Vaults cannot be teleportation destinations.
   */
  isVault(): boolean {
    return this.flags.has(SQUARE.VAULT)
  }

  /**
   * Is the square part of a room, for generation and illumination purposes.
   */
  isRoom(): boolean {
    return this.flags.has(SQUARE.ROOM)
  }

  /**
   * Is the square currently in the player's line of sight and illuminated? This
   * is a strict subset of isView
   */
  isSeen(): boolean {
    return this.flags.has(SQUARE.SEEN)
  }

  /**
   * Is the square currently in the player's line of sight
   */
  isView(): boolean {
    return this.flags.has(SQUARE.VIEW)
  }

  wasSeen(): boolean {
    return this.flags.has(SQUARE.WASSEEN)
  }

  isFeel(): boolean {
    return this.flags.has(SQUARE.FEEL)
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
    return this.flags.has(SQUARE.TRAP)
  }

  // generation
  isWallInner(): boolean {
    return this.flags.has(SQUARE.WALL_INNER)
  }

  // generation
  isWallOuter(): boolean {
    return this.flags.has(SQUARE.WALL_OUTER)
  }

  // generation
  isWallSolid(): boolean {
    return this.flags.has(SQUARE.WALL_SOLID)
  }

  // generation
  isMonsterRestricted(): boolean {
    return this.flags.has(SQUARE.MON_RESTRICT)
  }

  isNoTeleport(): boolean {
    return this.flags.has(SQUARE.NO_TELEPORT)
  }

  isNoMap(): boolean {
    return this.flags.has(SQUARE.NO_MAP)
  }

  isNoEsp(): boolean {
    return this.flags.has(SQUARE.NO_ESP)
  }

  isProject(): boolean {
    return this.flags.has(SQUARE.PROJECT)
  }

  /**
   * Has the player cast detect traps in a way that affects this square?
   */
  isTrapDetected(): boolean {
    return this.flags.has(SQUARE.DTRAP)
  }

  // generation
  isNoStairs(): boolean {
    return this.flags.has(SQUARE.NO_STAIRS)
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
