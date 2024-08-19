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
const DICE_STATE_TABLE: Record<Exclude<DS, DS.MAX>, Partial<Record<DI, DS>>> = {
  [DS.START]: {
    [DI.MINUS]: DS.BASE_DIGIT,
    [DI.DICE]: DS.FLUSH_DICE,
    [DI.BONUS]: DS.BONUS,
    [DI.VAR]: DS.VAR,
    [DI.DIGIT]: DS.BASE_DIGIT,
  },
  [DS.BASE_DIGIT]: {
    [DI.BASE]: DS.FLUSH_BASE,
    [DI.DICE]: DS.FLUSH_DICE,
    [DI.DIGIT]: DS.BASE_DIGIT,
    [DI.NULL]: DS.FLUSH_BASE,
  },
  [DS.FLUSH_BASE]: {
    [DI.DICE]: DS.FLUSH_DICE,
    [DI.BONUS]: DS.BONUS,
    [DI.VAR]: DS.VAR,
    [DI.DIGIT]: DS.DICE_DIGIT,
  },
  [DS.DICE_DIGIT]: {
    [DI.DICE]: DS.FLUSH_DICE,
    [DI.DIGIT]: DS.DICE_DIGIT,
  },
  [DS.FLUSH_DICE]: {
    [DI.VAR]: DS.VAR,
    [DI.DIGIT]: DS.SIDE_DIGIT,
  },
  [DS.SIDE_DIGIT]: {
    [DI.AMP]: DS.FLUSH_SIDE,
    [DI.BONUS]: DS.BONUS,
    [DI.DIGIT]: DS.SIDE_DIGIT,
    [DI.NULL]: DS.FLUSH_SIDE,
  },
  [DS.FLUSH_SIDE]: {
    [DI.BONUS]: DS.BONUS,
  },
  [DS.BONUS]: {
    [DI.VAR]: DS.VAR,
    [DI.DIGIT]: DS.BONUS_DIGIT,
  },
  [DS.BONUS_DIGIT]: {
    [DI.DIGIT]: DS.BONUS_DIGIT,
    [DI.NULL]: DS.FLUSH_BONUS,
  },
  [DS.FLUSH_BONUS]: {},
  [DS.VAR]: {
    [DI.BASE]: DS.MAX,
    [DI.UPPER]: DS.VAR_CHAR,
  },
  [DS.VAR_CHAR]: {
    [DI.AMP]: DS.FLUSH_SIDE,
    [DI.BASE]: DS.FLUSH_BASE,
    [DI.DICE]: DS.FLUSH_DICE,
    [DI.BONUS]: DS.BONUS,
    [DI.UPPER]: DS.VAR_CHAR,
    [DI.NULL]: DS.FLUSH_ALL,
  },
  [DS.FLUSH_ALL]: {}
}

// TODO: exhaustive tests
export function stringToDice(str: string): Dice {
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

  // DELIBERATE out of bounds to trigger DS.NULL state transition
  for (let i = 0; i < str.length + 1; i++) {
    const char: string | undefined = str[i]
    if (isSpace(char)) continue

    state = getNextStateAndUpdateToken(char, state, token)

    if (state === DS.MAX) {
      throw new Error('invalid dice expression')
    }

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

function getNextStateAndUpdateToken(char: string | undefined, state: DS, token: string[]) {
  const input: DI = diceInputForChar(char)

  if (
    input === DI.MINUS ||
    input === DI.DIGIT ||
    input === DI.UPPER
  ) {
    // original enforces a max length of 16 here
    //
    // winnowing out undefined chars (should never happen, but we code
    // defensively)
    if (char) token.push(char)
  }

  if (input !== DI.MAX && input !== DI.BONUS) {
    state = parseStateTransition(input, state)
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

  return DICE_STATE_TABLE[state][input] ?? DS.MAX
}

function diceInputForChar(char: string | undefined): DI {
  if (char == null) return DI.NULL

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
  }

  if (isDigit(char)) return DI.DIGIT
  if (isUpper(char)) return DI.UPPER

  return DI.MAX
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

  isEqual(dice: Dice): boolean {
    return (
      this.b === dice.b &&
      this.x === dice.x &&
      this.y === dice.y &&
      this.m === dice.m
    )
  }

  // TODO: test two-way
  toJSON(): string {
    return ''
  }
}
