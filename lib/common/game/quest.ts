import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { z_monster } from '../utilities/zod/monster'

import { Monster } from '../monsters/monster'

export const QuestSchema = z.object({
  name: z.string(),
  level: z.number(),
  race: z_monster,
  number: z.number(),
})

export type QuestJSON = z.input<typeof QuestSchema>
export type QuestParams = z.output<typeof QuestSchema>

export class Quest extends SerializableBase {
  static readonly schema = QuestSchema

  readonly name: string
  readonly level: number
  readonly race: Monster
  readonly number: number

  constructor(params: QuestParams) {
    super(params)

    this.name = params.name
    this.level = params.level
    this.race = params.race
    this.number = params.number
  }

  register() {
    QuestRegistry.add(this.level, this)
  }

  toJSON(): QuestJSON {
    return {
      name: this.name,
      level: this.level,
      race: this.race.name,
      number: this.number,
    }
  }
}

export const QuestRegistry = new IdRegistry(Quest)
