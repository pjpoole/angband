import {
  DungeonProfile,
  DungeonProfileJSON
} from '../../common/world/dungeonProfiles'
import { isValidRoomName } from '../../common/world/room'
import { DungeonProfileRegistry } from '../../common/game/registries'
import {
  asBoolean,
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsers'
import { Parser } from './Parser'

type DungeonProfileFields = 'name' | 'params' | 'tunnel' | 'streamer' | 'alloc'
  | 'min-level' | 'room'

export class DungeonProfileParser extends Parser<DungeonProfileFields, DungeonProfileJSON> {
  static readonly fileName = 'dungeon_profile'
  static readonly registry = DungeonProfileRegistry

  constructor() {
    super()

    this.register('name', this.handleName.bind(this))
    this.register('params', this.handleParams.bind(this))
    this.register('tunnel', this.handleTunnel.bind(this))
    this.register('streamer', this.handleStreamer.bind(this))
    this.register('alloc', this.keyToInteger('allocation'))
    this.register('min-level', this.keyToInteger('minLevel'))
    this.register('room', this.handleRoom.bind(this))
  }

  finalize() {
    for (const obj of this.objects) {
      const dungeonProfile = DungeonProfile.fromJSON(obj)
      DungeonProfileRegistry.add(dungeonProfile.name, dungeonProfile)
    }
  }

  handleName(values: ParserValues) {
    const current = this.newCurrent()
    current.name = values
  }

  handleParams(values: ParserValues) {
    const current = this.current
    const [blockSize, rooms, unusual, rarity] = asTokens(values, 4)

    current.blockSize = asInteger(blockSize)
    current.rooms = asInteger(rooms)
    current.unusual = asInteger(unusual)
    current.rarity = asInteger(rarity)
  }

  handleTunnel(values: ParserValues) {
    const current = this.current
    const [rnd, chg, con, pen, jct] = asTokens(values, 5)

    current.tunnel = {
      rnd: asInteger(rnd),
      chg: asInteger(chg),
      con: asInteger(con),
      pen: asInteger(pen),
      jct: asInteger(jct)
    }
  }

  handleStreamer(values: ParserValues) {
    const current = this.current
    const [den, rng, mag, mc, qua, qc] = asTokens(values, 6)

    current.streamer = {
      den: asInteger(den),
      rng: asInteger(rng),
      mag: asInteger(mag),
      mc: asInteger(mc),
      qua: asInteger(qua),
      qc: asInteger(qc)
    }
  }

  handleRoom(values: ParserValues) {
    const current = this.current
    current.allowedRooms ??= []

    const [name, rating, height, width, level, pit, rarity, cutoff] = asTokens(values, 8)

    if (!isValidRoomName(name)) throw new Error('invalid room name')

    const currentRoom = {
      name,
      rating: asInteger(rating),
      height: asInteger(height),
      width: asInteger(width),
      level: asInteger(level),
      pit: asBoolean(pit),
      rarity: asInteger(rarity),
      cutoff: asInteger(cutoff)
    }

    current.allowedRooms.push(currentRoom)
  }
}
