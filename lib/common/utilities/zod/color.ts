import { z } from 'zod'
import {
  ColorId,
  ColorName,
  colorStringToAttribute,
  isColorString
} from '../colors'

export const z_color = z
  .custom<ColorId | ColorName>(isColorString)
  .transform(colorStringToAttribute)
