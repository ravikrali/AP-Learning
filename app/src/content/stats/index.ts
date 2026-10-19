import type { Course } from '../types'
import { CED_VERSION } from './ced'
import './diagrams'
import { unit0 } from './u0'
import { unit1 } from './u1'
import { unit2 } from './u2'
import { unit3 } from './u3'
import { unit4 } from './u4'
import { unit5 } from './u5'

export const statistics: Course = {
  id: 'stats',
  title: 'AP® Statistics',
  short: 'AP® Stats',
  emoji: '📊',
  cedVersion: CED_VERSION,
  units: [unit0, unit1, unit2, unit3, unit4, unit5],
}
