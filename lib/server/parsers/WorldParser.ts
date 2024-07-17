import { GameObject } from '../../common/GameObject'
import { Parser, ParserValues } from './Parser'
import { valueAsInteger } from './parsers'
import { LevelRegistry } from '../../common/game/registries'

interface WorldSpec extends GameObject {
  level: WorldEntry
}

interface WorldEntry {
  depth: number
  name: string
  up: string | undefined
  down: string | undefined
}

export class WorldParser extends Parser<WorldSpec> {
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
    const depth = valueAsInteger(rawDepth)

    current.depth = depth
    current.name = name
    current.up = up === "None" ? undefined : up
    current.down = down === "None" ? undefined : up
  }
}
