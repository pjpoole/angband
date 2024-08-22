import { zExpressionJSON, zExpressionParams } from '../zod/expression'
import { enumValueToKey } from './enum'
import { EX } from '../../spells/expressions'

export function expressionToJson(expression?: zExpressionParams): zExpressionJSON | undefined {
  return expression == null ? undefined : {
    variable: expression.variable,
    type: enumValueToKey(expression.type, EX),
    expression: expression.expression,
  }
}
