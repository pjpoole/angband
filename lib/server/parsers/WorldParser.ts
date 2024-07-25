import { Parser, ParserValues } from './Parser'
import { asInteger } from './parsers'
import { LevelRegistry } from '../../common/game/registries'
import { LevelParams } from '../../common/world/level'

type WorldFields = 'level'

export class WorldParser extends Parser<WorldFields, LevelParams> {
  constructor() {
    super()

    this.register('level', this.handleLevel.bind(this))
  }

  finalize() {
    for (const obj of this.objects) {
      LevelRegistry.build(obj.name, obj)
    }
  }

  handleLevel(value: ParserValues) {
    const current = this.newCurrent()
    const [rawDepth, name, up, down] = value.split(':')
    const depth = asInteger(rawDepth)

    current.depth = depth
    current.name = name
    current.up = up === "None" ? undefined : up
    current.down = down === "None" ? undefined : up
  }
}
