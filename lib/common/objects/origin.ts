// list-origins.h
export enum ORIGIN {
  NONE,
  FLOOR,
  CHEST,
  SPECIAL,
  PIT,
  VAULT,
  LABYRINTH,
  CAVERN,
  RUBBLE,
  MIXED,
  DROP,
  DROP_SPECIAL,
  DROP_PIT,
  DROP_VAULT,
  STATS,
  ACQUIRE,
  STORE,
  STOLEN,
  BIRTH,
  CHEAT,
  DROP_BREED,
  DROP_SUMMON,
  DROP_UNKNOWN,
  DROP_POLY,
  DROP_MIMIC,
  DROP_WIZARD,
}

export const ORIGIN_DATA = [
  { type: ORIGIN.NONE, args: -1, description: '' },
  { type: ORIGIN.FLOOR, args: 1, description: 'Found lying on the floor %s' },
  { type: ORIGIN.CHEST, args: 1, description: 'Taken from a chest found %s' },
  { type: ORIGIN.SPECIAL, args: 1, description: 'Found lying on the floor of a special room %s' },
  { type: ORIGIN.PIT, args: 1, description: 'Found lying on the floor in a pit %s' },
  { type: ORIGIN.VAULT, args: 1, description: 'Found lying on the floor in a vault %s' },
  { type: ORIGIN.LABYRINTH, args: 1, description: 'Found lying on the floor of a labyrinth %s' },
  { type: ORIGIN.CAVERN, args: 1, description: 'Found lying on the floor of a cavern %s' },
  { type: ORIGIN.RUBBLE, args: 1, description: 'Found under some rubble %s' },
  // stack with mixed origins
  { type: ORIGIN.MIXED, args: -1, description: '' },
  // normal monster drops
  { type: ORIGIN.DROP, args: 2, description: 'Dropped by %s %s' },
  // from monsters in special rooms
  { type: ORIGIN.DROP_SPECIAL, args: 2, description: 'Dropped by %s %s' },
  // from monsters in pits/nests
  { type: ORIGIN.DROP_PIT, args: 2, description: 'Dropped by %s %s' },
  // from monsters in vaults
  { type: ORIGIN.DROP_VAULT, args: 2, description: 'Dropped by %s %s' },
  // ^ only the above are considered by main-stats
  { type: ORIGIN.STATS, args: -1, description: '' },
  { type: ORIGIN.ACQUIRE, args: 1, description: 'Conjured forth by magic %s' },
  { type: ORIGIN.STORE, args: 0, description: 'Bought from a store' },
  { type: ORIGIN.STOLEN, args: -1, description: '' },
  { type: ORIGIN.BIRTH, args: 0, description: 'An inheritance from your family' },
  { type: ORIGIN.CHEAT, args: 0, description: 'Created by debug option' },
  // from breeders
  { type: ORIGIN.DROP_BREED, args: 2, description: 'Dropped by %s %s' },
  // from combat summons
  { type: ORIGIN.DROP_SUMMON, args: 2, description: 'Dropped by %s %s' },
  { type: ORIGIN.DROP_UNKNOWN, args: 1, description: 'Dropped by an unknown monster %s' },
  // from polymorphees
  { type: ORIGIN.DROP_POLY, args: 2, description: 'Dropped by %s %s' },
  // from mimics
  { type: ORIGIN.DROP_MIMIC, args: 2, description: 'Dropped by %s %s' },
  // from wizard mode summons
  { type: ORIGIN.DROP_WIZARD, args: 2, description: 'Dropped by %s %s' },
]
