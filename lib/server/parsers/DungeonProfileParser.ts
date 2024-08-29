import { Parser } from './Parser'
import {
  asBoolean,
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'

import {
  DungeonProfile,
  DungeonProfileJSON,
} from '../../common/world/dungeonProfiles'

import { isValidRoomName } from '../../common/world/roomGenerators'

type DungeonProfileFields = 'name' | 'params' | 'tunnel' | 'streamer' | 'alloc'
  | 'min-level' | 'room'

export class DungeonProfileParser extends Parser<DungeonProfileFields, DungeonProfileJSON> {
  static readonly fileName = 'dungeon_profile'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('params', this.handleParams.bind(this))
    this.register('tunnel', this.handleTunnel.bind(this))
    this.register('streamer', this.handleStreamer.bind(this))
    this.register('alloc', this.keyToInteger('allocation'))
    this.register('min-level', this.keyToInteger('minLevel'))
    this.register('room', this.handleRoom.bind(this))
  }

  _finalizeItem(obj: DungeonProfileJSON) {
    DungeonProfile.fromJSON(obj).register()
  }

  handleParams(values: ParserValues) {
    const current = this.current
    const [blockSize, rooms, unusual, rarity] = asTokens(values, 4).map(asInteger)

    current.blockSize = blockSize
    current.rooms = rooms
    current.unusual = unusual
    current.maxRarity = rarity
  }

  handleTunnel(values: ParserValues) {
    const current = this.current
    const [rnd, chg, con, pen, jct] = asTokens(values, 5).map(asInteger)

    current.tunnel = { rnd, chg, con, pen, jct, }
  }

  handleStreamer(values: ParserValues) {
    const current = this.current
    const [den, rng, mag, mc, qua, qc] = asTokens(values, 6).map(asInteger)

    current.streamer = { den, rng, mag, mc, qua, qc }
  }

  handleRoom(values: ParserValues) {
    const current = this.current
    current.allowedRooms ??= []

    const [name, ...rest] = asTokens(values, 8)
    const [rating, height, width, level, pit, rarity, cutoff] = rest.map(asInteger)

    if (!isValidRoomName(name)) throw new Error('invalid room name')

    const currentRoom = {
      name,
      rating,
      height,
      width,
      level,
      pit: pit === 1,
      rarity,
      cutoff,
    }

    current.allowedRooms.push(currentRoom)
  }
}
