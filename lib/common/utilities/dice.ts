import { isDigit, isSpace, isUpper, stricmp } from './string'
import { Expression } from '../spells/expressions'

const DICE_MAX_EXPRESSIONS = 4
type DiceParam = number | Expression | null

interface DiceParams {
  expressions: Expression[]
  b: DiceParam
  x: DiceParam
  y: DiceParam
  m: DiceParam
}

export type DiceString = string & { __brand: 'dice'}

export function isDiceString(str: string): str is DiceString {
  // numbers are dice strings
  if (isNumber(str)) return true

  // clumsy for now
  const [num, sides] = str.split('d')
  if (isNumber(num) && isNumber(sides)) return true

  // TODO:
  // Modifier case
  // Expression case

  return false
}

function isNumber(str: string): boolean {
  return str === String(parseInt(str))
}

// dice input
enum DI {
  AMP,
  MINUS,
  BASE,
  DICE,
  BONUS,
  VAR,
  DIGIT,
  UPPER,
  NULL,
  MAX,
}

// dice state
enum DS {
  START,
  BASE_DIGIT,
  FLUSH_BASE,
  DICE_DIGIT,
  FLUSH_DICE,
  SIDE_DIGIT,
  FLUSH_SIDE,
  BONUS,
  BONUS_DIGIT,
  FLUSH_BONUS,
  VAR,
  VAR_CHAR,
  FLUSH_ALL,
  MAX,
}

// dice last seen
enum DLS {
  NONE,
  BASE,
  DICE,
  SIDE,
  BONUS,
}

const LAST_SEEN_TO_PARAM_NAME: Record<Exclude<DLS, DLS.NONE>, keyof Omit<DiceParams, 'expressions'>> = {
  [DLS.BASE]: 'b',
  [DLS.DICE]: 'x',
  [DLS.SIDE]: 'y',
  [DLS.BONUS]: 'm'
}

// z-dice.c, dice_parse_state_transition
// translated to values to reduce overall magic
const DICE_STATE_TABLE: Record<Exclude<DS, DS.MAX>, DS[]> = {
 [DS.START]:   [DS.MAX, DS.BASE_DIGIT, DS.MAX, DS.FLUSH_DICE, DS.BONUS, DS.VAR, DS.BASE_DIGIT, DS.MAX, DS.MAX],
 [DS.BASE_DIGIT]:   [DS.MAX, DS.MAX, DS.FLUSH_BASE, DS.FLUSH_DICE, DS.MAX, DS.MAX, DS.BASE_DIGIT, DS.MAX, DS.FLUSH_BASE],
 [DS.FLUSH_BASE]:   [DS.MAX, DS.MAX, DS.MAX, DS.FLUSH_DICE, DS.BONUS, DS.VAR, DS.DICE_DIGIT, DS.MAX, DS.MAX],
 [DS.DICE_DIGIT]:   [DS.MAX, DS.MAX, DS.MAX, DS.FLUSH_DICE, DS.MAX, DS.MAX, DS.DICE_DIGIT, DS.MAX, DS.MAX],
 [DS.FLUSH_DICE]:   [DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.VAR, DS.SIDE_DIGIT, DS.MAX, DS.MAX],
 [DS.SIDE_DIGIT]:   [DS.FLUSH_SIDE, DS.MAX, DS.MAX, DS.MAX, DS.BONUS, DS.MAX, DS.SIDE_DIGIT, DS.MAX, DS.FLUSH_SIDE],
 [DS.FLUSH_SIDE]:   [DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.BONUS, DS.MAX, DS.MAX, DS.MAX, DS.MAX],
 [DS.BONUS]:   [DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.VAR, DS.BONUS_DIGIT, DS.MAX, DS.MAX],
 [DS.BONUS_DIGIT]:   [DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.BONUS_DIGIT, DS.MAX, DS.FLUSH_BONUS],
 [DS.FLUSH_BONUS]:   [DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX],
 [DS.VAR]:   [DS.MAX, DS.MAX,  DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.VAR_CHAR, DS.MAX],
 [DS.VAR_CHAR]:   [DS.FLUSH_SIDE, DS.MAX, DS.FLUSH_BASE, DS.FLUSH_DICE, DS.BONUS, DS.MAX, DS.MAX, DS.VAR_CHAR, DS.FLUSH_ALL],
 [DS.FLUSH_ALL]:   [DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX, DS.MAX],
}

export function parseDice(str: string): Dice {
  const params: DiceParams = {
    expressions: [],
    // TODO: verify these are valid default values
    b: 0,
    x: 0,
    y: 0,
    m: 0,
  }

  let state: DS = DS.START
  let lastSeen: DLS = DLS.NONE
  let token: string[] = []

  for (const char of str) {
    if (isSpace(char)) continue

    state = getNextStateAndUpdateToken(char, state, token)

    const lastSeenAndFlush = getLastSeen(state, lastSeen, token)
    lastSeen = lastSeenAndFlush[0]
    const flush = lastSeenAndFlush[1]

    if (flush && token.length > 0) {
      updateParams(params, lastSeen, token)

      token = []
    }
  }

  return new Dice(params)
}

function getNextStateAndUpdateToken(char: string, state: DS, token: string[]) {
  const input = diceInputForChar(char)

  switch (input) {
    case DI.AMP:
    case DI.BASE:
    case DI.DICE:
    case DI.VAR:
      state = parseStateTransition(input, state)
      break

    case DI.MINUS:
    case DI.DIGIT:
    case DI.UPPER:
      // original enforces a max length of 16 here
      token.push(char)

      state = parseStateTransition(input, state)
      break
  }

  // Allow M for both bonus rolls and variable names
  if (char === 'M') {
    if (state === DS.VAR || state === DS.VAR_CHAR) {
      token.push(char)

      state = parseStateTransition(DI.UPPER, state)
    } else {
      state = parseStateTransition(DI.BONUS, state)
    }
  } else if (char === 'm') {
    state = parseStateTransition(DI.BONUS, state)
  }

  return state
}

function getLastSeen(state: DS, lastSeen: DLS, token: string[]): [DLS, boolean] {
  let flush = true

  switch (state) {
    case DS.FLUSH_BASE:
      lastSeen = DLS.BASE
      break

    case DS.FLUSH_DICE:
      lastSeen = DLS.DICE
      if (token.length === 0) token.push('1')
      break;

    case DS.FLUSH_SIDE:
      lastSeen = DLS.SIDE
      break;

    case DS.FLUSH_BONUS:
      lastSeen = DLS.BONUS
      break;

    case DS.FLUSH_ALL:
      if (lastSeen < DLS.BONUS) lastSeen++
      break

    case DS.BONUS:
      lastSeen = (lastSeen === DLS.DICE) ? DLS.SIDE : DLS.BONUS
      break

    default:
      flush = false
  }

  return [lastSeen, flush]
}

function updateParams(params: DiceParams, lastSeen: DLS, token: string[]) {
  const str = token.join('')
  const value: DiceParam = (isUpper(token[0]))
    ? diceParamsAddExpression(params, str)
    : parseInt(str)

  if (lastSeen === DLS.NONE) throw new Error('invalid state in dice parser')

  const paramsKey = LAST_SEEN_TO_PARAM_NAME[lastSeen]
  params[paramsKey] = value
}

function parseStateTransition(input: DI, state: DS): DS {
  if (input === DI.MAX || state === DS.MAX) return DS.MAX

  return DICE_STATE_TABLE[state][input]
}

function diceInputForChar(char: string): DI | undefined {
  switch (char) {
    case '&':
      return DI.AMP
    case '-':
      return DI.MINUS
    case '+':
      return DI.BASE
    case 'd':
      return DI.DICE
    case 'm':
    case 'M':
      return DI.BONUS
    case '$':
      return DI.VAR
    default:
      break
  }

  if (isDigit(char)) return DI.DIGIT
  if (isUpper(char)) return DI.UPPER
}

function diceParamsAddExpression(diceParams: DiceParams, str: string): Expression | null {
  let expressionCount = 0
  for (const expression of diceParams.expressions) {
    expressionCount++
    if (stricmp(expression.name, str)) {
      return expression
    }
  }

  if (expressionCount > DICE_MAX_EXPRESSIONS) return null

  const expression: Expression = { name: str }
  diceParams.expressions.push(expression)
  return expression
}

export class Dice {
  readonly expressions: Expression[]
  readonly b: DiceParam
  readonly x: DiceParam
  readonly y: DiceParam
  readonly m: DiceParam

  constructor(params: DiceParams) {
    this.expressions = params.expressions
    this.b = params.b
    this.x = params.x
    this.y = params.y
    this.m = params.m
  }
}
