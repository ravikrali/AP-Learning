import { describe, expect, test } from 'vitest'
import { ASSIGNABLE_ROLES, can, covers, describePrivs, normalizePrivs, privsOf, roleFor, ROLES, SECTIONS } from '../shared/roles'

describe('roles & privileges', () => {
  test('Super Admin and Admin hold every privilege of every section', () => {
    for (const r of ['super', 'admin'] as const)
      for (const s of SECTIONS) for (const a of s.actions) expect(can(privsOf(r), s.id, a)).toBe(true)
    expect(ASSIGNABLE_ROLES).not.toContain('super')
  })

  test('Curator: view, edit and delete in Content and Videos only', () => {
    const p = privsOf('curator')
    expect(p).toEqual({ content: ['view', 'edit', 'delete'], videos: ['view', 'edit', 'delete'] })
    for (const s of ['dashboard', 'audience', 'students', 'feedback', 'team'] as const) expect(can(p, s, 'view')).toBe(false)
  })

  test('read-only roles cannot change anything', () => {
    for (const r of ['analyst', 'viewer'] as const)
      for (const s of SECTIONS) {
        expect(can(privsOf(r), s.id, 'edit')).toBe(false)
        expect(can(privsOf(r), s.id, 'delete')).toBe(false)
      }
    expect(can(privsOf('support'), 'team', 'view')).toBe(false)
  })

  test('every named role only uses actions its sections have', () => {
    for (const r of Object.keys(ROLES)) expect(normalizePrivs(ROLES[r as keyof typeof ROLES].privs)).toEqual(ROLES[r as keyof typeof ROLES].privs)
  })

  test('input from outside is cleaned up', () => {
    expect(normalizePrivs({ content: ['delete'], dashboard: ['view', 'edit'], bogus: ['view'], videos: 'view', feedback: [] })).toEqual({
      content: ['view', 'delete'], // delete needs view
      dashboard: ['view'], // nothing to edit on the dashboard
    })
    expect(normalizePrivs(null)).toEqual({})
    expect(normalizePrivs('["view"]')).toEqual({})
  })

  test('a named role always means its own set; custom uses the saved set', () => {
    expect(privsOf('curator', { team: ['view', 'edit', 'delete'] })).toEqual(privsOf('curator'))
    expect(privsOf('custom', { feedback: ['view'] })).toEqual({ feedback: ['view'] })
    expect(privsOf('no-such-role')).toEqual({})
  })

  test('role name follows the privileges', () => {
    expect(roleFor('curator', privsOf('curator'))).toBe('curator')
    expect(roleFor('curator', { content: ['view'] })).toBe('custom')
    expect(roleFor('custom', privsOf('support'))).toBe('support')
    expect(roleFor('super', privsOf('super'))).toBe('admin') // Super Admin cannot be handed out
  })

  test('nobody can hand out more than they hold', () => {
    expect(covers(privsOf('admin'), privsOf('curator'))).toBe(true)
    expect(covers(privsOf('curator'), privsOf('admin'))).toBe(false)
    expect(covers(privsOf('viewer'), { content: ['view', 'edit'] })).toBe(false)
    expect(covers({}, {})).toBe(true)
  })

  test('summary text', () => {
    expect(describePrivs(privsOf('curator'))).toBe('Content: view, edit, delete · Videos: view, edit, delete')
    expect(describePrivs({})).toBe('No access')
  })
})
