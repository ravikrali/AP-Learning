import { describe, expect, it } from 'vitest'
import { checkBalanced, molarMass, parseFormula } from '../src/lib/chem'

describe('chem helpers', () => {
  it('parses formulas', () => {
    expect(parseFormula('Ca(OH)2')).toEqual({ Ca: 1, O: 2, H: 2 })
    expect(parseFormula('CuSO4·5H2O')).toEqual({ Cu: 1, S: 1, O: 9, H: 10 })
    expect(parseFormula('[Cu(NH3)4]')).toEqual({ Cu: 1, N: 4, H: 12 })
  })
  it('computes molar mass', () => {
    expect(molarMass('H2O')).toBeCloseTo(18.015, 2)
    expect(molarMass('NaCl')).toBeCloseTo(58.44, 2)
  })
  it('checks balance including charge', () => {
    expect(checkBalanced('2H2(g) + O2(g) -> 2H2O(l)').ok).toBe(true)
    expect(checkBalanced('H2(g) + O2(g) -> H2O(l)').ok).toBe(false)
    expect(checkBalanced('Cu(s) + 2Ag^+(aq) -> Cu^2+(aq) + 2Ag(s)').ok).toBe(true)
    expect(checkBalanced('Cu(s) + Ag^+(aq) -> Cu^2+(aq) + Ag(s)').ok).toBe(false)
    expect(checkBalanced('MnO4^-(aq) + 8H^+(aq) + 5e^- -> Mn^2+(aq) + 4H2O(l)').ok).toBe(true)
    expect(checkBalanced('CH3COOH(aq) + H2O(l) <=> CH3COO^-(aq) + H3O^+(aq)').ok).toBe(true)
  })
})
