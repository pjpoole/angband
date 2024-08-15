// Monster flag types
import { EnumValueOnly } from '../utilities/enum'

export enum RFT {
  // placeholder flag
  NONE,
  // an obvious property
  OBV,
  // for display purposes
  DISP,
  // related to generation
  GEN,
  // especially noteworthy for lore
  NOTE,
  // behaviour-related
  BEHAV,
  // drop details
  DROP,
  // detection properties
  DET,
  // environment shaping
  ALTER,
  // types of monster (noun)
  RACE_N,
  // types of monster (adjective)
  RACE_A,
  // vulnerabilities with no corresponding resistance
  VULN,
  // vulnerabilities with a corresponding resistance
  VULN_I,
  // elemental resistances
  RES,
  // immunity from status effects
  PROT
}

// Monster flags
export enum RF {
  NONE,
  UNIQUE,
  QUESTOR,
  MALE,
  FEMALE,
  GROUP_AI,
  NAME_COMMA,
  CHAR_CLEAR,
  ATTR_RAND,
  ATTR_CLEAR,
  ATTR_MULTI,
  ATTR_FLICKER,
  FORCE_DEPTH,
  FORCE_SLEEP,
  FORCE_EXTRA,
  SEASONAL,
  UNAWARE,
  MULTIPLY,
  REGENERATE,
  FRIGHTENED,
  NEVER_BLOW,
  NEVER_MOVE,
  RAND_25,
  RAND_50,
  MIMIC_INV,
  STUPID,
  SMART,
  SPIRIT,
  POWERFUL,
  ONLY_GOLD,
  ONLY_ITEM,
  DROP_1,
  DROP_2,
  DROP_3,
  DROP_4,
  DROP_20,
  DROP_40,
  DROP_60,
  DROP_GOOD,
  DROP_GREAT,
  INVISIBLE,
  COLD_BLOOD,
  EMPTY_MIND,
  WEIRD_MIND,
  OPEN_DOOR,
  BASH_DOOR,
  PASS_WALL,
  KILL_WALL,
  SMASH_WALL,
  MOVE_BODY,
  KILL_BODY,
  TAKE_ITEM,
  KILL_ITEM,
  CLEAR_WEB,
  PASS_WEB,
  ORC,
  TROLL,
  GIANT,
  DRAGON,
  DEMON,
  ANIMAL,
  EVIL,
  UNDEAD,
  NONLIVING,
  METAL,
  HURT_LIGHT,
  HURT_ROCK,
  HURT_FIRE,
  HURT_COLD,
  IM_ACID,
  IM_ELEC,
  IM_FIRE,
  IM_COLD,
  IM_POIS,
  IM_NETHER,
  IM_WATER,
  IM_PLASMA,
  IM_NEXUS,
  IM_DISEN,
  NO_FEAR,
  NO_STUN,
  NO_CONF,
  NO_SLEEP,
  NO_HOLD,
  NO_SLOW
}

export type RF_VALUE = EnumValueOnly<typeof RF>

// TODO: description I18n
export const MonsterFlagsTable: [RF, RFT, string][] = [
  [RF.NONE, RFT.NONE, ''],
  [RF.UNIQUE, RFT.OBV, ''],
  [RF.QUESTOR, RFT.OBV, ''],
  [RF.MALE, RFT.OBV, ''],
  [RF.FEMALE, RFT.OBV, ''],
  [RF.GROUP_AI, RFT.OBV, ''],
  [RF.NAME_COMMA, RFT.OBV, ''],
  [RF.CHAR_CLEAR, RFT.DISP, ''],
  [RF.ATTR_RAND, RFT.DISP, ''],
  [RF.ATTR_CLEAR, RFT.DISP, ''],
  [RF.ATTR_MULTI, RFT.DISP, ''],
  [RF.ATTR_FLICKER, RFT.DISP, ''],
  [RF.FORCE_DEPTH, RFT.GEN, ''],
  [RF.FORCE_SLEEP, RFT.GEN, ''],
  [RF.FORCE_EXTRA, RFT.GEN, ''],
  [RF.SEASONAL, RFT.GEN, ''],
  [RF.UNAWARE, RFT.NOTE, ''],
  [RF.MULTIPLY, RFT.NOTE, ''],
  [RF.REGENERATE, RFT.NOTE, ''],
  [RF.FRIGHTENED, RFT.BEHAV, ''],
  [RF.NEVER_BLOW, RFT.BEHAV, ''],
  [RF.NEVER_MOVE, RFT.BEHAV, ''],
  [RF.RAND_25, RFT.BEHAV, ''],
  [RF.RAND_50, RFT.BEHAV, ''],
  [RF.MIMIC_INV, RFT.BEHAV, ''],
  [RF.STUPID, RFT.BEHAV, ''],
  [RF.SMART, RFT.BEHAV, ''],
  [RF.SPIRIT, RFT.BEHAV, ''],
  [RF.POWERFUL, RFT.BEHAV, ''],
  [RF.ONLY_GOLD, RFT.DROP, ''],
  [RF.ONLY_ITEM, RFT.DROP, ''],
  [RF.DROP_40, RFT.DROP, ''],
  [RF.DROP_60, RFT.DROP, ''],
  [RF.DROP_1, RFT.DROP, ''],
  [RF.DROP_2, RFT.DROP, ''],
  [RF.DROP_3, RFT.DROP, ''],
  [RF.DROP_4, RFT.DROP, ''],
  [RF.DROP_GOOD, RFT.DROP, ''],
  [RF.DROP_GREAT, RFT.DROP, ''],
  [RF.DROP_20, RFT.DROP, ''],
  [RF.INVISIBLE, RFT.DET, 'invisible'],
  [RF.COLD_BLOOD, RFT.DET, 'cold blooded'],
  [RF.EMPTY_MIND, RFT.DET, 'not detected by telepathy'],
  [RF.WEIRD_MIND, RFT.DET, 'rarely detected by telepathy'],
  [RF.OPEN_DOOR, RFT.ALTER, 'open doors'],
  [RF.BASH_DOOR, RFT.ALTER, 'bash down doors'],
  [RF.PASS_WALL, RFT.ALTER, 'pass through walls'],
  [RF.KILL_WALL, RFT.ALTER, 'bore through walls'],
  [RF.SMASH_WALL, RFT.ALTER, 'smash walls'],
  [RF.MOVE_BODY, RFT.ALTER, 'push past weaker monsters'],
  [RF.KILL_BODY, RFT.ALTER, 'destroy weaker monsters'],
  [RF.TAKE_ITEM, RFT.ALTER, 'pick up objects'],
  [RF.KILL_ITEM, RFT.ALTER, 'destroy objects'],
  [RF.CLEAR_WEB, RFT.ALTER, 'clear webs'],
  [RF.PASS_WEB, RFT.ALTER, 'pass through webs'],
  [RF.ORC, RFT.RACE_N, 'orc'],
  [RF.TROLL, RFT.RACE_N, 'troll'],
  [RF.GIANT, RFT.RACE_N, 'giant'],
  [RF.DRAGON, RFT.RACE_N, 'dragon'],
  [RF.DEMON, RFT.RACE_N, 'demon'],
  [RF.ANIMAL, RFT.RACE_N, 'natural'],
  [RF.EVIL, RFT.RACE_A, 'evil'],
  [RF.UNDEAD, RFT.RACE_A, 'undead'],
  [RF.NONLIVING, RFT.RACE_A, 'nonliving'],
  [RF.METAL, RFT.RACE_A, 'metal'],
  [RF.HURT_LIGHT, RFT.VULN, 'bright light'],
  [RF.HURT_ROCK, RFT.VULN, 'rock remover'],
  [RF.HURT_FIRE, RFT.VULN_I, 'fire'],
  [RF.HURT_COLD, RFT.VULN_I, 'cold'],
  [RF.IM_ACID, RFT.RES, 'acid'],
  [RF.IM_ELEC, RFT.RES, 'lightning'],
  [RF.IM_FIRE, RFT.RES, 'fire'],
  [RF.IM_COLD, RFT.RES, 'cold'],
  [RF.IM_POIS, RFT.RES, 'poison'],
  [RF.IM_NETHER, RFT.RES, 'nether'],
  [RF.IM_WATER, RFT.RES, 'water'],
  [RF.IM_PLASMA, RFT.RES, 'plasma'],
  [RF.IM_NEXUS, RFT.RES, 'nexus'],
  [RF.IM_DISEN, RFT.RES, 'disenchantment'],
  [RF.NO_FEAR, RFT.PROT, 'frightened'],
  [RF.NO_STUN, RFT.PROT, 'stunned'],
  [RF.NO_CONF, RFT.PROT, 'confused'],
  [RF.NO_SLEEP, RFT.PROT, 'slept'],
  [RF.NO_HOLD, RFT.PROT, 'held'],
  [RF.NO_SLOW, RFT.PROT, 'slowed']
]
