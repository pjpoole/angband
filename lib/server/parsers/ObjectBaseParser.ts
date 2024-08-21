import { Parser } from './Parser'
import { ObjectBase, ObjectBaseJSON } from '../../common/objects/objectBase'
import { ObjectBaseRegistry } from '../../common/game/registries'
import {
  asFlags,
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsers'
import { arrayUnion } from '../../common/utilities/array'
import { TV_NAMES } from '../../common/objects/tval'

type ObjectBaseFields = 'name' | 'graphics' | 'max-stack' | 'break' | 'flags'
  | 'default'

const DEFAULT_KEYS = ['max-stack', 'break-chance'] as const

export class ObjectBaseParser extends Parser<ObjectBaseFields, ObjectBaseJSON> {
  static readonly fileName = 'object_base'
  static readonly registry = ObjectBaseRegistry

  private readonly defaults: Partial<Record<'break' | 'max-stack', number>> = {}

  constructor() {
    super()

    this.register('default', this.handleDefault.bind(this))
    this.register('name', this.handleName.bind(this))
    this.register('graphics', this.keyToColor('graphics'))
    this.register('break', this.keyToInteger('break'))
    this.register('flags', this.handleFlags.bind(this))
  }

  _finalize(obj: ObjectBaseJSON) {
    const objectBase = ObjectBase.fromJSON(obj)
    // TODO: Check on how ObjectBases are referenced from elsewhere
    ObjectBaseRegistry.add(objectBase.typeName, objectBase)
  }

  // Weird custom code
  handleDefault(values: ParserValues) {
    const [key, value] = asTokens(values, 2)

    if (key === DEFAULT_KEYS[0]) {
      this.defaults.break = asInteger(value)
    } else if (key === DEFAULT_KEYS[1]) {
      this.defaults['max-stack'] = asInteger(value)
    } else {
      throw new Error('unknown default key')
    }
  }

  handleName(values: ParserValues) {
    const current = this.newCurrent(this.defaults)
    const [tvName, name] = asTokens(values, 1, 2)

    if (TV_NAMES[tvName] == null) throw new Error('invalid object type')

    current.name = name
    current.type = tvName
  }

  handleFlags(values: ParserValues) {
    const current = this.current
    current.flags = arrayUnion(current.flags ?? [], asFlags(values))
  }
}
