export enum EFFECT {
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
  effect: EFFECT
  aim: boolean
  info: string | null
  args: number
  flags: EFINFO
  description: string
  menuName: string // probably should permit null
}

// list-effects.h
export const EFFECT_DATA: EffectData[] = [
  {
    effect: EFFECT.RANDOM,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'randomly ',
    menuName: ''
  },
  {
    effect: EFFECT.DAMAGE,
    aim: false,
    info: 'hurt',
    args: 1,
    flags: EFINFO.DICE,
    description: 'does %s damage to the player',
    menuName: ''
  },
  {
    effect: EFFECT.HEAL_HP,
    aim: false,
    info: 'heal',
    args: 2,
    flags: EFINFO.HEAL,
    description: 'heals %s hitpoints%s',
    menuName: 'heal self'
  },
  {
    effect: EFFECT.MON_HEAL_HP,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'heals monster hitpoints',
    menuName: ''
  },
  {
    effect: EFFECT.MON_HEAL_KIN,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'heals fellow monster hitpoints',
    menuName: ''
  },
  {
    effect: EFFECT.NOURISH,
    aim: false,
    info: null,
    args: 3,
    flags: EFINFO.FOOD,
    description: '%s for %s turns (%s percent)',
    menuName: '%s %s'
  },
  {
    effect: EFFECT.CRUNCH,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'crunches',
    menuName: ''
  },
  {
    effect: EFFECT.CURE,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.CURE,
    description: 'cures %s',
    menuName: 'cure %s'
  },
  {
    effect: EFFECT.TIMED_SET,
    aim: false,
    info: null,
    args: 2,
    flags: EFINFO.TIMED,
    description: 'administers %s for %s turns',
    menuName: 'administer %s'
  },
  {
    effect: EFFECT.TIMED_INC,
    aim: false,
    info: 'dur',
    args: 2,
    flags: EFINFO.TIMED,
    description: 'extends %s for %s turns',
    menuName: 'extend %s'
  },
  {
    effect: EFFECT.TIMED_INC_NO_RES,
    aim: false,
    info: 'dur',
    args: 2,
    flags: EFINFO.TIMED,
    description: 'extends %s for %s turns (unresistable)',
    menuName: 'extend %s'
  },
  {
    effect: EFFECT.MON_TIMED_INC,
    aim: false,
    info: null,
    args: 2,
    flags: EFINFO.TIMED,
    description: 'increases monster %s by %s turns',
    menuName: ''
  },
  {
    effect: EFFECT.TIMED_DEC,
    aim: false,
    info: null,
    args: 2,
    flags: EFINFO.TIMED,
    description: 'reduces length of %s by %s turns',
    menuName: 'reduce %s'
  },
  {
    effect: EFFECT.GLYPH,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.NONE,
    description: 'inscribes a glyph beneath you',
    menuName: 'inscribe a glyph'
  },
  {
    effect: EFFECT.WEB,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates a web',
    menuName: 'create a web'
  },
  {
    effect: EFFECT.RESTORE_STAT,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.STAT,
    description: 'restores your %s',
    menuName: 'restore %s'
  },
  {
    effect: EFFECT.DRAIN_STAT,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.STAT,
    description: 'reduces your %s',
    menuName: ''
  },
  {
    effect: EFFECT.LOSE_RANDOM_STAT,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.STAT,
    description: 'reduces a stat other than %s',
    menuName: ''
  },
  {
    effect: EFFECT.GAIN_STAT,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.STAT,
    description: 'increases your %s',
    menuName: ''
  },
  {
    effect: EFFECT.RESTORE_EXP,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'restores your experience',
    menuName: 'restore experience'
  },
  {
    effect: EFFECT.GAIN_EXP,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.CONST,
    description: 'grants %d experience points',
    menuName: ''
  },
  {
    effect: EFFECT.DRAIN_LIGHT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'drains your light source',
    menuName: ''
  },
  {
    effect: EFFECT.DRAIN_MANA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'drains some mana',
    menuName: ''
  },
  {
    effect: EFFECT.RESTORE_MANA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'restores some mana',
    menuName: 'restore some mana'
  },
  {
    effect: EFFECT.REMOVE_CURSE,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.DICE,
    description: 'attempts power %s removal of a single curse on an object',
    menuName: 'remove curse'
  },
  {
    effect: EFFECT.RECALL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'returns you from the dungeon or takes you to the dungeon after a short delay',
    menuName: 'recall'
  },
  {
    effect: EFFECT.DEEP_DESCENT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'teleports you up to five dungeon levels lower than the lowest point you have reached so far',
    menuName: 'descend to the depths'
  },
  {
    effect: EFFECT.ALTER_REALITY,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates a new dungeon level',
    menuName: 'alter reality'
  },
  {
    effect: EFFECT.MAP_AREA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'maps the area around you',
    menuName: 'map surroundings'
  },
  {
    effect: EFFECT.READ_MINDS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'maps the area around recently detected monsters',
    menuName: 'read minds'
  },
  {
    effect: EFFECT.DETECT_TRAPS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects traps nearby',
    menuName: 'detect traps'
  },
  {
    effect: EFFECT.DETECT_DOORS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects doors nearby',
    menuName: 'detect doors'
  },
  {
    effect: EFFECT.DETECT_STAIRS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects stairs nearby',
    menuName: 'detect stairs'
  },
  {
    effect: EFFECT.DETECT_ORE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects veins nearby',
    menuName: 'detect veins'
  },
  {
    effect: EFFECT.SENSE_GOLD,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'senses gold nearby',
    menuName: 'sense gold'
  },
  {
    effect: EFFECT.DETECT_GOLD,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects gold nearby',
    menuName: 'detect gold'
  },
  {
    effect: EFFECT.SENSE_OBJECTS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'senses objects nearby',
    menuName: 'sense objects'
  },
  {
    effect: EFFECT.DETECT_OBJECTS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects objects nearby',
    menuName: 'detect objects'
  },
  {
    effect: EFFECT.DETECT_LIVING_MONSTERS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects living creatures nearby',
    menuName: 'detect living'
  },
  {
    effect: EFFECT.DETECT_VISIBLE_MONSTERS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects visible creatures nearby',
    menuName: 'detect visible'
  },
  {
    effect: EFFECT.DETECT_INVISIBLE_MONSTERS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects invisible creatures nearby',
    menuName: 'detect invisible'
  },
  {
    effect: EFFECT.DETECT_FEARFUL_MONSTERS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects creatures nearby which are susceptible to fear',
    menuName: 'detect fearful'
  },
  {
    effect: EFFECT.IDENTIFY,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'identifies a single unknown rune on a selected item',
    menuName: 'identify'
  },
  {
    effect: EFFECT.DETECT_EVIL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects evil creatures nearby',
    menuName: 'detect evil'
  },
  {
    effect: EFFECT.DETECT_SOUL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'detects creatures with a spirit nearby',
    menuName: 'detect souls'
  },
  {
    effect: EFFECT.CREATE_STAIRS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates a staircase beneath your feet',
    menuName: 'create stairs'
  },
  {
    effect: EFFECT.DISENCHANT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'disenchants one of your wielded items',
    menuName: 'disenchant item'
  },
  {
    effect: EFFECT.ENCHANT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'attempts to magically enhance an item',
    menuName: 'enchant item'
  },
  {
    effect: EFFECT.RECHARGE,
    aim: false,
    info: 'power',
    args: 0,
    flags: EFINFO.NONE,
    description: 'tries to recharge a wand or staff, destroying the wand or staff on failure',
    menuName: 'recharge'
  },
  {
    effect: EFFECT.PROJECT_LOS,
    aim: false,
    info: 'power',
    args: 1,
    flags: EFINFO.SEEN,
    description: '%s which are in line of sight',
    menuName: '%s in line of sight'
  },
  {
    effect: EFFECT.PROJECT_LOS_AWARE,
    aim: false,
    info: 'power',
    args: 1,
    flags: EFINFO.SEEN,
    description: '%s which are in line of sight',
    menuName: '%s in line of sight'
  },
  {
    effect: EFFECT.ACQUIRE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates good items nearby',
    menuName: 'create good items'
  },
  {
    effect: EFFECT.WAKE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'awakens all nearby sleeping monsters',
    menuName: 'awaken all'
  },
  {
    effect: EFFECT.SUMMON,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.SUMM,
    description: 'summons %s at the current dungeon level',
    menuName: 'summon %s'
  },
  {
    effect: EFFECT.BANISH,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'removes all of a given creature type from the level',
    menuName: 'banish'
  },
  {
    effect: EFFECT.MASS_BANISH,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'removes all nearby creatures',
    menuName: 'banish all'
  },
  {
    effect: EFFECT.PROBE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'gives you information on the health and abilities of monsters you can see',
    menuName: 'probe'
  },
  {
    effect: EFFECT.TELEPORT,
    aim: false,
    info: 'range',
    args: 2,
    flags: EFINFO.TELE,
    description: 'teleports %s randomly %s',
    menuName: 'teleport %s %s'
  },
  {
    effect: EFFECT.TELEPORT_TO,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'teleports toward a target',
    menuName: 'teleport to target'
  },
  {
    effect: EFFECT.TELEPORT_LEVEL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'teleports you one level up or down',
    menuName: 'teleport level'
  },
  {
    effect: EFFECT.RUBBLE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'causes rubble to fall around you',
    menuName: ''
  },
  {
    effect: EFFECT.GRANITE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'causes a granite wall to fall behind you',
    menuName: ''
  },
  {
    effect: EFFECT.DESTRUCTION,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.QUAKE,
    description: 'destroys an area around you in the shape of a circle radius %d, and blinds you for 1d10+10 turns',
    menuName: 'destroy area'
  },
  {
    effect: EFFECT.EARTHQUAKE,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.QUAKE,
    description: 'causes an earthquake around you of radius %d',
    menuName: 'cause earthquake'
  },
  {
    effect: EFFECT.LIGHT_LEVEL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'completely lights up and magically maps the level',
    menuName: 'light level'
  },
  {
    effect: EFFECT.DARKEN_LEVEL,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'completely darkens up and magically maps the level',
    menuName: 'darken level'
  },
  {
    effect: EFFECT.LIGHT_AREA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'lights up the surrounding area',
    menuName: 'light area'
  },
  {
    effect: EFFECT.DARKEN_AREA,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'darkens the surrounding area',
    menuName: 'darken area'
  },
  {
    effect: EFFECT.SPOT,
    aim: false,
    info: 'dam',
    args: 4,
    flags: EFINFO.SPOT,
    description: 'creates a ball of %s with radius %d, centred on and hitting the player, with full intensity to radius %d, dealing %s damage at the centre',
    menuName: 'engulf with %s'
  },
  {
    effect: EFFECT.SPHERE,
    aim: false,
    info: 'dam',
    args: 4,
    flags: EFINFO.SPOT,
    description: 'creates a ball of %s with radius %d, centred on the player, with full intensity to radius %d, dealing %s damage at the centre',
    menuName: 'project %s'
  },
  {
    effect: EFFECT.BALL,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.BALL,
    description: 'fires a ball of %s with radius %d, dealing %s damage at the centre',
    menuName: 'fire a ball of %s'
  },
  {
    effect: EFFECT.BREATH,
    aim: true,
    info: null,
    args: 3,
    flags: EFINFO.BREATH,
    description: 'breathes a cone of %s with width %d degrees, dealing %s damage at the source',
    menuName: 'breathe a cone of %s'
  },
  {
    effect: EFFECT.ARC,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.BREATH,
    description: 'produces a cone of %s with width %d degrees, dealing %s damage at the source',
    menuName: 'produce a cone of %s'
  },
  {
    effect: EFFECT.SHORT_BEAM,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.SHORT,
    description: 'produces a beam of %s with length %d, dealing %s damage',
    menuName: 'produce a beam of %s'
  },
  {
    effect: EFFECT.LASH,
    aim: true,
    info: null,
    args: 2,
    flags: EFINFO.LASH,
    description: 'fires a beam of %s length %d, dealing damage determined by blows',
    menuName: 'lash with %s'
  },
  {
    effect: EFFECT.SWARM,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.BALL,
    description: 'fires a series of %s balls of radius %d, dealing %s damage at the centre of each',
    menuName: 'fire a swarm of %s balls'
  },
  {
    effect: EFFECT.STRIKE,
    aim: true,
    info: 'dam',
    args: 3,
    flags: EFINFO.BALL,
    description: 'creates a ball of %s with radius %d, dealing %s damage at the centre',
    menuName: 'strike with %s'
  },
  {
    effect: EFFECT.STAR,
    aim: false,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'fires a line of %s in all directions, each dealing %s damage',
    menuName: 'fire a line of %s in all directions'
  },
  {
    effect: EFFECT.STAR_BALL,
    aim: false,
    info: 'dam',
    args: 3,
    flags: EFINFO.BALL,
    description: 'fires balls of %s with radius %d in all directions, dealing %s damage at the centre of each',
    menuName: 'fire balls of %s in all directions'
  },
  {
    effect: EFFECT.BOLT,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'casts a bolt of %s dealing %s damage',
    menuName: 'cast a bolt of %s'
  },
  {
    effect: EFFECT.BEAM,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'casts a beam of %s dealing %s damage',
    menuName: 'cast a beam of %s'
  },
  {
    effect: EFFECT.BOLT_OR_BEAM,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'casts a bolt or beam of %s dealing %s damage',
    menuName: 'cast a bolt or beam of %s'
  },
  {
    effect: EFFECT.LINE,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'creates a line of %s dealing %s damage',
    menuName: 'create a line of %s'
  },
  {
    effect: EFFECT.ALTER,
    aim: true,
    info: null,
    args: 1,
    flags: EFINFO.BOLT,
    description: 'creates a line which %s',
    menuName: 'create a line which %s'
  },
  {
    effect: EFFECT.BOLT_STATUS,
    aim: true,
    info: null,
    args: 1,
    flags: EFINFO.BOLT,
    description: 'casts a bolt which %s',
    menuName: 'cast a bolt which %s'
  },
  {
    effect: EFFECT.BOLT_STATUS_DAM,
    aim: true,
    info: 'dam',
    args: 2,
    flags: EFINFO.BOLTD,
    description: 'casts a bolt which %s, dealing %s damage',
    menuName: 'cast a bolt which %s'
  },
  {
    effect: EFFECT.BOLT_AWARE,
    aim: true,
    info: null,
    args: 1,
    flags: EFINFO.BOLT,
    description: 'creates a bolt which %s',
    menuName: 'create a bolt which %s'
  },
  {
    effect: EFFECT.TOUCH,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.TOUCH,
    description: '%s on all adjacent squares',
    menuName: '%s all adjacent'
  },
  {
    effect: EFFECT.TOUCH_AWARE,
    aim: false,
    info: null,
    args: 1,
    flags: EFINFO.TOUCH,
    description: '%s on all adjacent squares',
    menuName: '%s all adjacent'
  },
  {
    effect: EFFECT.CURSE_ARMOR,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'curses your worn armor',
    menuName: 'curse armor'
  },
  {
    effect: EFFECT.CURSE_WEAPON,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'curses your wielded melee weapon',
    menuName: 'curse weapon'
  },
  {
    effect: EFFECT.BRAND_WEAPON,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'brands your wielded melee weapon',
    menuName: 'brand weapon'
  },
  {
    effect: EFFECT.BRAND_AMMO,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'brands a stack of ammunition',
    menuName: 'brand ammunition'
  },
  {
    effect: EFFECT.BRAND_BOLTS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'brands bolts with fire, in an unbalanced fashion',
    menuName: 'brand bolts'
  },
  {
    effect: EFFECT.CREATE_ARROWS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'uses a staff to create a stack of arrows',
    menuName: 'use staff for arrows'
  },
  {
    effect: EFFECT.TAP_DEVICE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'drains magical energy from a staff or wand',
    menuName: 'tap device'
  },
  {
    effect: EFFECT.TAP_UNLIFE,
    aim: false,
    info: 'dam',
    args: 1,
    flags: EFINFO.DICE,
    description: 'drains %s mana from the closest undead monster, damaging it',
    menuName: 'tap unlife'
  },
  {
    effect: EFFECT.SHAPECHANGE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'changes the player\'s shape',
    menuName: 'change shape'
  },
  {
    effect: EFFECT.CURSE,
    aim: true,
    info: 'dam',
    args: 0,
    flags: EFINFO.NONE,
    description: 'damages a monster directly',
    menuName: 'curse'
  },
  {
    effect: EFFECT.COMMAND,
    aim: true,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'takes control of a monster',
    menuName: 'command'
  },
  {
    effect: EFFECT.JUMP_AND_BITE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'jumps the player to the closest living monster and bites it',
    menuName: 'jump and bite'
  },
  {
    effect: EFFECT.MOVE_ATTACK,
    aim: true,
    info: 'blows',
    args: 1,
    flags: EFINFO.DICE,
    description: 'moves the player up to 4 spaces and executes up to %d melee blows',
    menuName: 'move and attack'
  },
  {
    effect: EFFECT.SINGLE_COMBAT,
    aim: true,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'engages a monster in single combat',
    menuName: 'engage in single combat'
  },
  {
    effect: EFFECT.MELEE_BLOWS,
    aim: true,
    info: 'blows',
    args: 1,
    flags: EFINFO.DICE,
    description: 'strikes %d blows against an adjacent monster',
    menuName: 'pummel'
  },
  {
    effect: EFFECT.SWEEP,
    aim: false,
    info: 'blows',
    args: 1,
    flags: EFINFO.DICE,
    description: 'strikes %d blows against all adjacent monsters',
    menuName: 'sweep'
  },
  {
    effect: EFFECT.BIZARRE,
    aim: true,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'does bizarre things',
    menuName: 'do bizarre things'
  },
  {
    effect: EFFECT.WONDER,
    aim: true,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'creates random and unpredictable effects',
    menuName: 'create random effects'
  },
  {
    effect: EFFECT.SELECT,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: 'selects one of ',
    menuName: ''
  },
  {
    effect: EFFECT.SET_VALUE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: '',
    menuName: ''
  },
  {
    effect: EFFECT.CLEAR_VALUE,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: '',
    menuName: ''
  },
  {
    effect: EFFECT.SCRAMBLE_STATS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: '',
    menuName: ''
  },
  {
    effect: EFFECT.UNSCRAMBLE_STATS,
    aim: false,
    info: null,
    args: 0,
    flags: EFINFO.NONE,
    description: '',
    menuName: ''
  }
]
