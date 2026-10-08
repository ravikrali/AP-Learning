import type { Course } from '../types'
import { unit0 } from './u0'
import { unit1 } from './u1'
import { unit2 } from './u2'
import { unit3 } from './u3'
import { unit4 } from './u4'
import { unit5 } from './u5'
import { unit6 } from './u6'
import { unit7 } from './u7'
import { unit8 } from './u8'
import { unit9 } from './u9'

export const chemistry: Course = {
  id: 'chem',
  title: 'AP Chemistry',
  short: 'AP Chem',
  emoji: '⚗️',
  units: [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9],
}
