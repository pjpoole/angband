import { JsonObject } from '../utilities/json'
import { ZodObject } from 'zod'

interface Serializable {
  toJSON(): JsonObject
}

interface Deserializable<T> {
  schema: ZodObject<any>
  fromJSON(data: JsonObject): T
}

// TODO: get this safety elsewhere
export type SerializableClass<T> = {
  new (...args: any[]): T & Serializable
} & Deserializable<T>

export class SerializableBase implements Serializable {
  static schema: ZodObject<any>
  static _id: number = 0

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

  static fromJSON(data: JsonObject): any {
    const params = this.schema.parse(data)

    return new this(params)
  }
}
