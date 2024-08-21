import { kebabToPascal } from '../utilities/string'

// All possible skill fields
export type SkillFields = 'skill-device' | 'skill-dig' | 'skill-disarm-magic'
  | 'skill-disarm-phys' | 'skill-disarm' | 'skill-melee' | 'skill-save'
  | 'skill-search' | 'skill-shoot' | 'skill-stealth' | 'skill-throw'

export function skillNameToKey(name: SkillFields): keyof SkillData {
  if (name === 'skill-disarm-phys') return 'disarmPhysical'
  return kebabToPascal(name.replace('skill-', '')) as keyof SkillData
}

export interface SkillData {
  device?: number
  dig?: number
  disarm?: number
  disarmMagic?: number
  disarmPhysical?: number
  melee?: number
  save?: number
  search?: number
  shoot?: number
  stealth?: number
  throw?: number
}
