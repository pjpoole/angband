import { JsonObject } from '../utilities/json'
import { ZodObject } from 'zod'

interface Serializable {
  toJSON(): JsonObject
}

interface Deserializable<T> {
  fromJSON(data: JsonObject): T
}

type SerializableClass<T> = {
  new (...args: any[]): T & Serializable
} & Deserializable<T>

export class SerializableBase implements Serializable {
  static schema: ZodObject<any>

  constructor(params: JsonObject) {}

  toJSON(): JsonObject {
    throw new Error('not implemented')
  }

  static fromJSON(data: JsonObject): any {
    const params = this.schema.parse(data)

    return new this(params)
  }
}
