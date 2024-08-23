import {
  zObjectActivationJson,
  zObjectActivationParams,
} from '../zod/activation'

export function activationToJson(obj: zObjectActivationParams): zObjectActivationJson {
  return {
    activation: obj.activation.name,
    time: obj.time?.toString(),
    message: obj.message,
  }
}
