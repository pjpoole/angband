import { JsonObject } from '../utilities/json'
import { ZodObject } from 'zod'

interface Serializable {
  toJSON(): JsonObject
}

type Deserializable = {
  schema: ZodObject<any>
}

type Buildable<T> = (new (...args: any[]) => T) & Deserializable

export class SerializableBase implements Serializable {
  static schema: ZodObject<any>

  readonly id: number

  constructor(params: any) {
    // auto-incrementing ids aren't properly the domain of serializables
    const that = this

    type HasId = {
      constructor: HasId
      _id: number
    } & typeof that;

    this.id = (this as HasId).constructor._id
    ;(this as HasId).constructor._id++
  }

  toJSON(): JsonObject {
    throw new Error('not implemented')
  }

  static fromJSON<T extends SerializableBase>(this: Buildable<T>, data: JsonObject): T {
    const params = this.schema.parse(data)

    return new this(params)
  }
}
