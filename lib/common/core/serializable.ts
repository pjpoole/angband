import { JsonObject, JsonValue } from '../utilities/json'

interface Serializable {
  toJSON(): JsonObject
  register(): void
}

type Parsable = {
  schema: { parse: (args: any) => any }
}

type Deserializable<T> = {
  fromJSON: (data: JsonValue) => T
}

export type Buildable<T> = (new (...args: any[]) => T) & Parsable
export type Loadable<T> = Buildable<T> & Deserializable<T>

export class SerializableBase implements Serializable {
  // THIS IS NOT UNUSED DESPITE SYNTAX HIGHLIGHTING
  static _id = 0

  readonly id: number

  constructor(params: any) {
    // auto-incrementing ids aren't properly the domain of serializables
    const that = this

    type HasId = {
      constructor: HasId
      _id: number
    } & typeof that

    this.id = (this as HasId).constructor._id
    ;(this as HasId).constructor._id++
  }

  toJSON(): JsonObject {
    throw new Error('implement in subclass')
  }

  register() {
    throw new Error('implement in subclass')
  }

  static fromJSON<T extends SerializableBase>(this: Buildable<T>, data: JsonValue): T {
    const params = this.schema.parse(data)

    return new this(params)
  }
}
