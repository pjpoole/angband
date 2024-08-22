import { z } from 'zod'

import { OF } from '../../objects/flags'
import {
  HATES_ELEM,
  IGNORE_ELEM,
  isHatesElem,
  isIgnoreElem
} from '../../spells/elements'

export type CurseFlag = keyof typeof OF | HATES_ELEM | IGNORE_ELEM

// TODO: Branded objects?
export const z_curseFlag = z.string().transform((str, ctx): CurseFlag => {
  if (Object.keys(OF).includes(str)) {
    return str as keyof typeof OF
  } else {
    if (isHatesElem(str)) return str
    else if (isIgnoreElem(str)) return str
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid flag type'
  })
  return z.NEVER
})
