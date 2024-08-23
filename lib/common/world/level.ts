import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

export const LevelSchema = z.object({
  depth: z.number(),
  name: z.string(),
  up: z.string().optional(),
  down: z.string().optional()
})

export type LevelJSON = z.input<typeof LevelSchema>
export type LevelParams = z.output<typeof LevelSchema>

export class Level extends SerializableBase {
  static schema = LevelSchema

  readonly depth: number
  readonly name: string
  readonly up: string | undefined
  readonly down: string | undefined

  constructor(params: LevelParams) {
    super(params)

    this.depth = params.depth
    this.name = params.name
    this.up = params.up
    this.down = params.down
  }

  register() {
    LevelRegistry.add(this.depth, this)
  }

  toJSON(): LevelJSON {
    return {
      depth: this.depth,
      name: this.name,
      up: this.up,
      down: this.down
    }
  }
}

class LevelNameRegistry extends IdRegistry<Level, LevelParams> {
  override finalize() {
    const findByName = (name: string) => {
      for (const level of this.data.values()) {
        if (level.name === name) return true
      }
      return false
    }

    for (const level of this.data.values()) {
      const { up, down } = level
      if ((up && !findByName(up)) || (down && !findByName(down))) {
        throw new Error(
          'level not found',
          { cause: { up: up, down: down } }
        )
      }
    }

    super.finalize()
  }
}

export const LevelRegistry = new LevelNameRegistry(Level)
