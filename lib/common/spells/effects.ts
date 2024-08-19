// list-effects.h
// Effect
export enum EF {
  RANDOM,
  DAMAGE,
  HEAL_HP,
  MON_HEAL_HP,
  MON_HEAL_KIN,
  NOURISH,
  CRUNCH,
  CURE,
  TIMED_SET,
  TIMED_INC,
  TIMED_INC_NO_RES,
  MON_TIMED_INC,
  TIMED_DEC,
  GLYPH,
  WEB,
  RESTORE_STAT,
  DRAIN_STAT,
  LOSE_RANDOM_STAT,
  GAIN_STAT,
  RESTORE_EXP,
  GAIN_EXP,
  DRAIN_LIGHT,
  DRAIN_MANA,
  RESTORE_MANA,
  REMOVE_CURSE,
  RECALL,
  DEEP_DESCENT,
  ALTER_REALITY,
  MAP_AREA,
  READ_MINDS,
  DETECT_TRAPS,
  DETECT_DOORS,
  DETECT_STAIRS,
  DETECT_ORE,
  SENSE_GOLD,
  DETECT_GOLD,
  SENSE_OBJECTS,
  DETECT_OBJECTS,
  DETECT_LIVING_MONSTERS,
  DETECT_VISIBLE_MONSTERS,
  DETECT_INVISIBLE_MONSTERS,
  DETECT_FEARFUL_MONSTERS,
  IDENTIFY,
  DETECT_EVIL,
  DETECT_SOUL,
  CREATE_STAIRS,
  DISENCHANT,
  ENCHANT,
  RECHARGE,
  PROJECT_LOS,
  PROJECT_LOS_AWARE,
  ACQUIRE,
  WAKE,
  SUMMON,
  BANISH,
  MASS_BANISH,
  PROBE,
  TELEPORT,
  TELEPORT_TO,
  TELEPORT_LEVEL,
  RUBBLE,
  GRANITE,
  DESTRUCTION,
  EARTHQUAKE,
  LIGHT_LEVEL,
  DARKEN_LEVEL,
  LIGHT_AREA,
  DARKEN_AREA,
  SPOT,
  SPHERE,
  BALL,
  BREATH,
  ARC,
  SHORT_BEAM,
  LASH,
  SWARM,
  STRIKE,
  STAR,
  STAR_BALL,
  BOLT,
  BEAM,
  BOLT_OR_BEAM,
  LINE,
  ALTER,
  BOLT_STATUS,
  BOLT_STATUS_DAM,
  BOLT_AWARE,
  TOUCH,
  TOUCH_AWARE,
  CURSE_ARMOR,
  CURSE_WEAPON,
  BRAND_WEAPON,
  BRAND_AMMO,
  BRAND_BOLTS,
  CREATE_ARROWS,
  TAP_DEVICE,
  TAP_UNLIFE,
  SHAPECHANGE,
  CURSE,
  COMMAND,
  JUMP_AND_BITE,
  MOVE_ATTACK,
  SINGLE_COMBAT,
  MELEE_BLOWS,
  SWEEP,
  BIZARRE,
  WONDER,
  SELECT,
  SET_VALUE,
  CLEAR_VALUE,
  SCRAMBLE_STATS,
  UNSCRAMBLE_STATS,
}

// effects-info.h
enum EFINFO {
  NONE,
  DICE,
  HEAL,
  CONST,
  FOOD,
  CURE,
  TIMED,
  STAT,
  SEEN,
  SUMM,
  TELE,
  QUAKE,
  BALL,
  SPOT,
  BREATH,
  SHORT,
  LASH,
  BOLT,
  BOLTD,
  TOUCH,
}

interface EffectData {
  effect: EF
  aim: boolean
  info: string | null
  args: number
  flags: EFINFO
  description: string
  menuName: string // probably should permit null
}

// list-effects.h
export const EF_DATA: EffectData[] = [
  {
    effect: EF.RANDOM,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'randomly ',
    menuName: ''
  },
  {
    effect: EF.DAMAGE,
    aim: false,
    info: 'hurt',
    args: 1,
    flags: EFINFO.DICE,
    description: 'does %s damage to the player',
    menuName: ''
  },
  {
    effect: EF.HEAL_HP,
    aim: false,
    info: 'heal',
    args: 2,
    flags: EFINFO.HEAL,
    description: 'heals %s hitpoints%s',
    menuName: 'heal self'
  },
  {
    effect: EF.MON_HEAL_HP,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'heals monster hitpoints',
    menuName: ''
  },
  {
    effect: EF.MON_HEAL_KIN,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'heals fellow monster hitpoints',
    menuName: ''
  },
  {
    effect: EF.NOURISH,
    aim: false,
    info: null,
    args: 3,
    flags: EFINFO.FOOD,
    description: '%s for %s turns (%s percent)',
    menuName: '%s %s'
  },
  {
    effect: EF.CRUNCH,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'crunches',
    menuName: ''
  },
  {
    effect: EF.CURE,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.CURE,
    description: 'cures %s',
    menuName: 'cure %s'
  },
  {
    effect: EF.TIMED_SET,
    aim: false,
    info: null,
    args: 2,
    flags: EFINFO.TIMED,
    description: 'administers %s for %s turns',
    menuName: 'administer %s'
  },
  {
    effect: EF.TIMED_INC,
    aim: false,
    info: 'dur',
    args: 2,
    flags: EFINFO.TIMED,
    description: 'extends %s for %s turns',
    menuName: 'extend %s'
  },
  {
    effect: EF.TIMED_INC_NO_RES,
    aim: false,
    info: 'dur',
    args: 2,
    flags: EFINFO.TIMED,
    description: 'extends %s for %s turns (unresistable)',
    menuName: 'extend %s'
  },
  {
    effect: EF.MON_TIMED_INC,
    aim: false,
    info: null,
    args: 2,
    flags: EFINFO.TIMED,
    description: 'increases monster %s by %s turns',
    menuName: ''
  },
  {
    effect: EF.TIMED_DEC,
    aim: false,
    info: null,
    args: 2,
    flags: EFINFO.TIMED,
    description: 'reduces length of %s by %s turns',
    menuName: 'reduce %s'
  },
  {
    effect: EF.GLYPH,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.NONE,
    description: 'inscribes a glyph beneath you',
    menuName: 'inscribe a glyph'
  },
  {
    effect: EF.WEB,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates a web',
    menuName: 'create a web'
  },
  {
    effect: EF.RESTORE_STAT,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.STAT,
    description: 'restores your %s',
    menuName: 'restore %s'
  },
  {
    effect: EF.DRAIN_STAT,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.STAT,
    description: 'reduces your %s',
    menuName: ''
  },
  {
    effect: EF.LOSE_RANDOM_STAT,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.STAT,
    description: 'reduces a stat other than %s',
    menuName: ''
  },
  {
    effect: EF.GAIN_STAT,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.STAT,
    description: 'increases your %s',
    menuName: ''
  },
  {
    effect: EF.RESTORE_EXP,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'restores your experience',
    menuName: 'restore experience'
  },
  {
    effect: EF.GAIN_EXP,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.CONST,
    description: 'grants %d experience points',
    menuName: ''
  },
  {
    effect: EF.DRAIN_LIGHT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'drains your light source',
    menuName: ''
  },
  {
    effect: EF.DRAIN_MANA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'drains some mana',
    menuName: ''
  },
  {
    effect: EF.RESTORE_MANA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'restores some mana',
    menuName: 'restore some mana'
  },
  {
    effect: EF.REMOVE_CURSE,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.DICE,
    description: 'attempts power %s removal of a single curse on an object',
    menuName: 'remove curse'
  },
  {
    effect: EF.RECALL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'returns you from the dungeon or takes you to the dungeon after a short delay',
    menuName: 'recall'
  },
  {
    effect: EF.DEEP_DESCENT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'teleports you up to five dungeon levels lower than the lowest point you have reached so far',
    menuName: 'descend to the depths'
  },
  {
    effect: EF.ALTER_REALITY,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates a new dungeon level',
    menuName: 'alter reality'
  },
  {
    effect: EF.MAP_AREA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'maps the area around you',
    menuName: 'map surroundings'
  },
  {
    effect: EF.READ_MINDS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'maps the area around recently detected monsters',
    menuName: 'read minds'
  },
  {
    effect: EF.DETECT_TRAPS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects traps nearby',
    menuName: 'detect traps'
  },
  {
    effect: EF.DETECT_DOORS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects doors nearby',
    menuName: 'detect doors'
  },
  {
    effect: EF.DETECT_STAIRS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects stairs nearby',
    menuName: 'detect stairs'
  },
  {
    effect: EF.DETECT_ORE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects veins nearby',
    menuName: 'detect veins'
  },
  {
    effect: EF.SENSE_GOLD,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'senses gold nearby',
    menuName: 'sense gold'
  },
  {
    effect: EF.DETECT_GOLD,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects gold nearby',
    menuName: 'detect gold'
  },
  {
    effect: EF.SENSE_OBJECTS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'senses objects nearby',
    menuName: 'sense objects'
  },
  {
    effect: EF.DETECT_OBJECTS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects objects nearby',
    menuName: 'detect objects'
  },
  {
    effect: EF.DETECT_LIVING_MONSTERS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects living creatures nearby',
    menuName: 'detect living'
  },
  {
    effect: EF.DETECT_VISIBLE_MONSTERS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects visible creatures nearby',
    menuName: 'detect visible'
  },
  {
    effect: EF.DETECT_INVISIBLE_MONSTERS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects invisible creatures nearby',
    menuName: 'detect invisible'
  },
  {
    effect: EF.DETECT_FEARFUL_MONSTERS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects creatures nearby which are susceptible to fear',
    menuName: 'detect fearful'
  },
  {
    effect: EF.IDENTIFY,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'identifies a single unknown rune on a selected item',
    menuName: 'identify'
  },
  {
    effect: EF.DETECT_EVIL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects evil creatures nearby',
    menuName: 'detect evil'
  },
  {
    effect: EF.DETECT_SOUL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects creatures with a spirit nearby',
    menuName: 'detect souls'
  },
  {
    effect: EF.CREATE_STAIRS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates a staircase beneath your feet',
    menuName: 'create stairs'
  },
  {
    effect: EF.DISENCHANT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'disenchants one of your wielded items',
    menuName: 'disenchant item'
  },
  {
    effect: EF.ENCHANT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'attempts to magically enhance an item',
    menuName: 'enchant item'
  },
  {
    effect: EF.RECHARGE,
    aim: false,
    info: 'power',
    args: 0,
    flags: EFINFO.NONE,
    description: 'tries to recharge a wand or staff, destroying the wand or staff on failure',
    menuName: 'recharge'
  },
  {
    effect: EF.PROJECT_LOS,
    aim: false,
    info: 'power',
    args: 1,
    flags: EFINFO.SEEN,
    description: '%s which are in line of sight',
    menuName: '%s in line of sight'
  },
  {
    effect: EF.PROJECT_LOS_AWARE,
    aim: false,
    info: 'power',
    args: 1,
    flags: EFINFO.SEEN,
    description: '%s which are in line of sight',
    menuName: '%s in line of sight'
  },
  {
    effect: EF.ACQUIRE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates good items nearby',
    menuName: 'create good items'
  },
  {
    effect: EF.WAKE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'awakens all nearby sleeping monsters',
    menuName: 'awaken all'
  },
  {
    effect: EF.SUMMON,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.SUMM,
    description: 'summons %s at the current dungeon level',
    menuName: 'summon %s'
  },
  {
    effect: EF.BANISH,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'removes all of a given creature type from the level',
    menuName: 'banish'
  },
  {
    effect: EF.MASS_BANISH,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'removes all nearby creatures',
    menuName: 'banish all'
  },
  {
    effect: EF.PROBE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'gives you information on the health and abilities of monsters you can see',
    menuName: 'probe'
  },
  {
    effect: EF.TELEPORT,
    aim: false,
    info: 'range',
    args: 2,
    flags: EFINFO.TELE,
    description: 'teleports %s randomly %s',
    menuName: 'teleport %s %s'
  },
  {
    effect: EF.TELEPORT_TO,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'teleports toward a target',
    menuName: 'teleport to target'
  },
  {
    effect: EF.TELEPORT_LEVEL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'teleports you one level up or down',
    menuName: 'teleport level'
  },
  {
    effect: EF.RUBBLE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'causes rubble to fall around you',
    menuName: ''
  },
  {
    effect: EF.GRANITE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'causes a granite wall to fall behind you',
    menuName: ''
  },
  {
    effect: EF.DESTRUCTION,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.QUAKE,
    description: 'destroys an area around you in the shape of a circle radius %d, and blinds you for 1d10+10 turns',
    menuName: 'destroy area'
  },
  {
    effect: EF.EARTHQUAKE,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.QUAKE,
    description: 'causes an earthquake around you of radius %d',
    menuName: 'cause earthquake'
  },
  {
    effect: EF.LIGHT_LEVEL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'completely lights up and magically maps the level',
    menuName: 'light level'
  },
  {
    effect: EF.DARKEN_LEVEL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'completely darkens up and magically maps the level',
    menuName: 'darken level'
  },
  {
    effect: EF.LIGHT_AREA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'lights up the surrounding area',
    menuName: 'light area'
  },
  {
    effect: EF.DARKEN_AREA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'darkens the surrounding area',
    menuName: 'darken area'
  },
  {
    effect: EF.SPOT,
    aim: false,
    info: 'dam',
    args: 4,
    flags: EFINFO.SPOT,
    description: 'creates a ball of %s with radius %d, centred on and hitting the player, with full intensity to radius %d, dealing %s damage at the centre',
    menuName: 'engulf with %s'
  },
  {
    effect: EF.SPHERE,
    aim: false,
    info: 'dam',
    args: 4,
    flags: EFINFO.SPOT,
    description: 'creates a ball of %s with radius %d, centred on the player, with full intensity to radius %d, dealing %s damage at the centre',
    menuName: 'project %s'
  },
  {
    effect: EF.BALL,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.BALL,
    description: 'fires a ball of %s with radius %d, dealing %s damage at the centre',
    menuName: 'fire a ball of %s'
  },
  {
    effect: EF.BREATH,
    aim: true,
    info: null,
    args: 3,
    flags: EFINFO.BREATH,
    description: 'breathes a cone of %s with width %d degrees, dealing %s damage at the source',
    menuName: 'breathe a cone of %s'
  },
  {
    effect: EF.ARC,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.BREATH,
    description: 'produces a cone of %s with width %d degrees, dealing %s damage at the source',
    menuName: 'produce a cone of %s'
  },
  {
    effect: EF.SHORT_BEAM,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.SHORT,
    description: 'produces a beam of %s with length %d, dealing %s damage',
    menuName: 'produce a beam of %s'
  },
  {
    effect: EF.LASH,
    aim: true,
    info: null,
    args: 2,
    flags: EFINFO.LASH,
    description: 'fires a beam of %s length %d, dealing damage determined by blows',
    menuName: 'lash with %s'
  },
  {
    effect: EF.SWARM,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.BALL,
    description: 'fires a series of %s balls of radius %d, dealing %s damage at the centre of each',
    menuName: 'fire a swarm of %s balls'
  },
  {
    effect: EF.STRIKE,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.BALL,
    description: 'creates a ball of %s with radius %d, dealing %s damage at the centre',
    menuName: 'strike with %s'
  },
  {
    effect: EF.STAR,
    aim: false,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'fires a line of %s in all directions, each dealing %s damage',
    menuName: 'fire a line of %s in all directions'
  },
  {
    effect: EF.STAR_BALL,
    aim: false,
    info: 'dam',
    args: 3,
    flags: EFINFO.BALL,
    description: 'fires balls of %s with radius %d in all directions, dealing %s damage at the centre of each',
    menuName: 'fire balls of %s in all directions'
  },
  {
    effect: EF.BOLT,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'casts a bolt of %s dealing %s damage',
    menuName: 'cast a bolt of %s'
  },
  {
    effect: EF.BEAM,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'casts a beam of %s dealing %s damage',
    menuName: 'cast a beam of %s'
  },
  {
    effect: EF.BOLT_OR_BEAM,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'casts a bolt or beam of %s dealing %s damage',
    menuName: 'cast a bolt or beam of %s'
  },
  {
    effect: EF.LINE,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'creates a line of %s dealing %s damage',
    menuName: 'create a line of %s'
  },
  {
    effect: EF.ALTER,
    aim: true,
    info: null,
    args: 1,
    flags: EFINFO.BOLT,
    description: 'creates a line which %s',
    menuName: 'create a line which %s'
  },
  {
    effect: EF.BOLT_STATUS,
    aim: true,
    info: null,
    args: 1,
    flags: EFINFO.BOLT,
    description: 'casts a bolt which %s',
    menuName: 'cast a bolt which %s'
  },
  {
    effect: EF.BOLT_STATUS_DAM,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'casts a bolt which %s, dealing %s damage',
    menuName: 'cast a bolt which %s'
  },
  {
    effect: EF.BOLT_AWARE,
    aim: true,
    info: null,
    args: 1,
    flags: EFINFO.BOLT,
    description: 'creates a bolt which %s',
    menuName: 'create a bolt which %s'
  },
  {
    effect: EF.TOUCH,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.TOUCH,
    description: '%s on all adjacent squares',
    menuName: '%s all adjacent'
  },
  {
    effect: EF.TOUCH_AWARE,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.TOUCH,
    description: '%s on all adjacent squares',
    menuName: '%s all adjacent'
  },
  {
    effect: EF.CURSE_ARMOR,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'curses your worn armor',
    menuName: 'curse armor'
  },
  {
    effect: EF.CURSE_WEAPON,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'curses your wielded melee weapon',
    menuName: 'curse weapon'
  },
  {
    effect: EF.BRAND_WEAPON,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'brands your wielded melee weapon',
    menuName: 'brand weapon'
  },
  {
    effect: EF.BRAND_AMMO,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'brands a stack of ammunition',
    menuName: 'brand ammunition'
  },
  {
    effect: EF.BRAND_BOLTS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'brands bolts with fire, in an unbalanced fashion',
    menuName: 'brand bolts'
  },
  {
    effect: EF.CREATE_ARROWS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'uses a staff to create a stack of arrows',
    menuName: 'use staff for arrows'
  },
  {
    effect: EF.TAP_DEVICE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'drains magical energy from a staff or wand',
    menuName: 'tap device'
  },
  {
    effect: EF.TAP_UNLIFE,
    aim: false,
    info: 'dam',
    args: 1,
    flags: EFINFO.DICE,
    description: 'drains %s mana from the closest undead monster, damaging it',
    menuName: 'tap unlife'
  },
  {
    effect: EF.SHAPECHANGE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'changes the player\'s shape',
    menuName: 'change shape'
  },
  {
    effect: EF.CURSE,
    aim: true,
    info: 'dam',
    args: 0,
    flags: EFINFO.NONE,
    description: 'damages a monster directly',
    menuName: 'curse'
  },
  {
    effect: EF.COMMAND,
    aim: true,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'takes control of a monster',
    menuName: 'command'
  },
  {
    effect: EF.JUMP_AND_BITE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'jumps the player to the closest living monster and bites it',
    menuName: 'jump and bite'
  },
  {
    effect: EF.MOVE_ATTACK,
    aim: true,
    info: 'blows',
    args: 1,
    flags: EFINFO.DICE,
    description: 'moves the player up to 4 spaces and executes up to %d melee blows',
    menuName: 'move and attack'
  },
  {
    effect: EF.SINGLE_COMBAT,
    aim: true,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'engages a monster in single combat',
    menuName: 'engage in single combat'
  },
  {
    effect: EF.MELEE_BLOWS,
    aim: true,
    info: 'blows',
    args: 1,
    flags: EFINFO.DICE,
    description: 'strikes %d blows against an adjacent monster',
    menuName: 'pummel'
  },
  {
    effect: EF.SWEEP,
    aim: false,
    info: 'blows',
    args: 1,
    flags: EFINFO.DICE,
    description: 'strikes %d blows against all adjacent monsters',
    menuName: 'sweep'
  },
  {
    effect: EF.BIZARRE,
    aim: true,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'does bizarre things',
    menuName: 'do bizarre things'
  },
  {
    effect: EF.WONDER,
    aim: true,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates random and unpredictable effects',
    menuName: 'create random effects'
  },
  {
    effect: EF.SELECT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'selects one of ',
    menuName: ''
  },
  {
    effect: EF.SET_VALUE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: '',
    menuName: ''
  },
  {
    effect: EF.CLEAR_VALUE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: '',
    menuName: ''
  },
  {
    effect: EF.SCRAMBLE_STATS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: '',
    menuName: ''
  },
  {
    effect: EF.UNSCRAMBLE_STATS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: '',
    menuName: ''
  }
]
