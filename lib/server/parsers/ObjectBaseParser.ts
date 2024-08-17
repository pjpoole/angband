import { Parser } from './Parser'
import { ObjectBase, ObjectBaseJSON } from '../../common/objects/objectBase'
import { ObjectBaseRegistry } from '../../common/game/registries'
import { asTokens, ParserValues } from '../../common/utilities/parsers'
import { arrayUnion } from '../../common/utilities/array'

type ObjectBaseFields = 'name' | 'graphics' | 'break' | 'flags'

export class ObjectBaseParser extends Parser<ObjectBaseFields, ObjectBaseJSON> {
  static readonly fileName = 'object_base'
  static readonly registry = ObjectBaseRegistry

  constructor() {
    super()

    this.register('name', this.handleName.bind(this))
    this.register('graphics', this.keyToColor('graphics'))
    this.register('break', this.keyToInteger('break'))
    this.register('flags', this.handleFlags.bind(this))
  }

  finalize() {
    this.finalizeCurrent()

    for (const obj of this.objects) {
      const objectBase = ObjectBase.fromJSON(obj)
      // TODO: Check on how ObjectBases are referenced from elsewhere
      ObjectBaseRegistry.add(objectBase.name, objectBase)
    }
  }

  handleName(values: ParserValues) {
    const current = this.newCurrent()
    const [tvName, name] = asTokens(values, 2)

    current.name = name
    current.type = tvName
  }

  handleFlags(values: ParserValues) {
    const current = this.current
    current.flags = arrayUnion(current.flags ?? [], values.split('|').map(el => el.trim()))
  }
}
