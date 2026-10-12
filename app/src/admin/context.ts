import { createContext, useContext } from 'react'
import type { User } from '../lib/auth'
import type { Access, Action, Section } from '../../shared/roles'

export interface AdminCtx {
  user: User
  signOut: () => void
  /** this person's role and privileges (the server checks them again on every request) */
  access: Access
  can: (section: Section, action: Action) => boolean
}

export const AdminContext = createContext<AdminCtx | null>(null)

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin outside the admin app')
  return ctx
}
