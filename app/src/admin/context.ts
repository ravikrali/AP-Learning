import { createContext, useContext } from 'react'
import type { User } from '../lib/auth'

export const AdminContext = createContext<{ user: User; signOut: () => void } | null>(null)

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin outside the admin app')
  return ctx
}
