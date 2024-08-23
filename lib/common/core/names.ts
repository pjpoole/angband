import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

export const NameSchema = z.object({
  section: z.number(),
  words: z.array(z.string()),
})

export type NameJSON = z.input<typeof NameSchema>
export type NameParams = z.output<typeof NameSchema>

export class Name extends SerializableBase {
  static readonly schema = NameSchema

  readonly section: number
  readonly words: string[]

  constructor(params: NameParams) {
    super(params)

    this.section = params.section
    this.words = params.words
  }

  register() {
    NamesRegistry.add(this.section, this)
  }

  toJSON(): NameJSON {
    return {
      section: this.section,
      words: this.words,
    }
  }
}

export const NamesRegistry = new IdRegistry(Name)
