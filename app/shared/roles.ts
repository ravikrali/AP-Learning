// Roles and privileges for the admin portal. Shared by the Worker (which enforces them on every
// request) and the portal (which hides what a person may not use).
//
// A privilege is an action (view, edit, delete) on a section of the portal. A role is a named
// set of privileges; "custom" is a hand-picked set. The owner is the Super Admin: every
// privilege, always, and nobody can change or remove them.

export type Action = 'view' | 'edit' | 'delete'
export const ACTIONS: readonly Action[] = ['view', 'edit', 'delete']

export const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', actions: ['view', 'edit'], about: 'Sign-ups, subscriptions, revenue, engagement; edit = enter ad spend' },
  { id: 'audience', label: 'Audience', icon: '🧭', actions: ['view'], about: 'Visitors, where they come from, emails left on the welcome page' },
  { id: 'content', label: 'Content', icon: '📝', actions: ['view', 'edit', 'delete'], about: 'Edit lesson text, quick checks and flashcards; delete = revert an edit' },
  { id: 'videos', label: 'Videos', icon: '🎬', actions: ['view', 'edit', 'delete'], about: 'Lesson videos and YouTube links; delete = remove a video or custom list' },
  { id: 'students', label: 'Students', icon: '👥', actions: ['view', 'edit', 'delete'], about: 'Search students; edit = grant a plan; delete = take a granted plan back' },
  { id: 'feedback', label: 'Feedback', icon: '💬', actions: ['view', 'edit', 'delete'], about: 'Read feedback; edit = mark done or reopen; delete = delete a message' },
  { id: 'team', label: 'Admins', icon: '🔑', actions: ['view', 'edit', 'delete'], about: 'Portal users; edit = add people and change roles; delete = remove people' },
] as const satisfies readonly { id: string; label: string; icon: string; actions: readonly Action[]; about: string }[]

export type Section = (typeof SECTIONS)[number]['id']
export type Privs = Partial<Record<Section, Action[]>>

export const sectionActions = (s: Section): readonly Action[] => SECTIONS.find((x) => x.id === s)!.actions

const all = (...ids: Section[]): Privs => Object.fromEntries(ids.map((s) => [s, [...sectionActions(s)]]))
const viewOnly = (...ids: Section[]): Privs => Object.fromEntries(ids.map((s) => [s, ['view' as Action]]))
const EVERY = SECTIONS.map((s) => s.id)

export const ROLES = {
  super: { name: 'Super Admin', about: 'The owner. Full access to everything; cannot be changed or removed.', privs: all(...EVERY) },
  admin: { name: 'Admin', about: 'Full access to every section, including adding and removing portal users.', privs: all(...EVERY) },
  curator: { name: 'Curator', about: 'View, edit and delete in Content and Videos. Nothing else.', privs: all('content', 'videos') },
  support: {
    name: 'Support',
    about: 'Looks after students: grants plans and works the feedback inbox.',
    privs: { students: ['view', 'edit'], feedback: ['view', 'edit', 'delete'] } as Privs,
  },
  analyst: { name: 'Analyst', about: 'Sees the Dashboard and Audience numbers. Cannot change anything.', privs: viewOnly('dashboard', 'audience') },
  viewer: { name: 'Viewer', about: 'Can look at every section but cannot change anything.', privs: viewOnly(...EVERY) },
  custom: { name: 'Custom', about: 'A hand-picked set of privileges.', privs: {} as Privs },
} as const satisfies Record<string, { name: string; about: string; privs: Privs }>

export type RoleId = keyof typeof ROLES
/** Roles that can be given to someone (Super Admin is the owner only). */
export const ASSIGNABLE_ROLES: readonly RoleId[] = ['admin', 'curator', 'support', 'analyst', 'viewer', 'custom']

export interface Access {
  role: RoleId
  privs: Privs
  /** the owner */
  super: boolean
}

/** Clean up a privilege set from outside: known sections and actions only; edit or delete always includes view. */
export function normalizePrivs(input: unknown): Privs {
  const out: Privs = {}
  if (!input || typeof input !== 'object' || Array.isArray(input)) return out
  for (const s of SECTIONS) {
    const raw = (input as Record<string, unknown>)[s.id]
    if (!Array.isArray(raw)) continue
    const allowed: readonly Action[] = s.actions
    const picked = ACTIONS.filter((a) => allowed.includes(a) && raw.includes(a))
    if (!picked.length) continue
    out[s.id] = picked.includes('view') ? picked : ['view', ...picked]
  }
  return out
}

export const can = (privs: Privs, section: Section, action: Action) => !!privs[section]?.includes(action)

/** True when `mine` includes every privilege in `theirs` (nobody can hand out more than they hold). */
export const covers = (mine: Privs, theirs: Privs) =>
  SECTIONS.every((s) => (theirs[s.id] ?? []).every((a) => can(mine, s.id, a)))

export const samePrivs = (a: Privs, b: Privs) => covers(a, b) && covers(b, a)

/** The privileges in force for a stored role: a named role always means its own set; custom uses the saved set. */
export function privsOf(role: string, saved?: unknown): Privs {
  if (role === 'custom') return normalizePrivs(saved)
  return normalizePrivs((ROLES as Record<string, { privs: Privs }>)[role]?.privs ?? {})
}

/** The role name for a privilege set: the matching named role, otherwise custom. */
export function roleFor(role: string, privs: Privs): RoleId {
  if (role !== 'custom' && role !== 'super' && ASSIGNABLE_ROLES.includes(role as RoleId) && samePrivs(privsOf(role), privs)) return role as RoleId
  return ASSIGNABLE_ROLES.find((r) => r !== 'custom' && samePrivs(privsOf(r), privs)) ?? 'custom'
}

/** Short text such as "Content: view, edit, delete · Videos: view". */
export function describePrivs(privs: Privs): string {
  const parts = SECTIONS.filter((s) => privs[s.id]?.length).map((s) => `${s.label}: ${privs[s.id]!.join(', ')}`)
  return parts.length ? parts.join(' · ') : 'No access'
}
