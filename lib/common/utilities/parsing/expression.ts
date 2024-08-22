import { asTokens, ParserValues } from './primitives'
import { asEnum } from './enums'

import { zExpressionJSON } from '../zod/expression'
import { EX } from '../../spells/expressions'

export function parseExpression(values: ParserValues): zExpressionJSON {
  const [variable, type, expression] = asTokens(values, 3)
  return { variable, type: asEnum(type, EX), expression }
}
