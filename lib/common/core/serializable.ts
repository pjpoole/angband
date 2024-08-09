import { JsonObject } from '../utilities/json'

interface Serializable {
  toJSON(): JsonObject
}

interface Deserializable<T> {
  fromJSON(data: JsonObject): T
}

type SerializableClass<T> = {
  new (...args: any[]): T & Serializable
} & Deserializable<T>

export abstract class SerializableBase implements Serializable {
  abstract toJSON(): JsonObject

  static fromJSON(data: JsonObject): any {
    throw new Error('fromJSON method must be implemented')
  }
}
