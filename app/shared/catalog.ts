// Every course the app will offer. Shared by the app and the Worker. Plans and prices are in
// shared/pricing.ts.
//
// Course names do not carry the AP® mark (it belongs to the College Board); `ap` is the official
// exam name, for sentences that describe which exam a course prepares for.
// A course listed here but not built yet shows as "coming soon"; the app decides which are built
// (src/content/index.ts COURSES).

export type Category = 'History and Social Sciences' | 'Math and Computer Science' | 'Sciences'

export interface CatalogCourse {
  id: string
  title: string
  short: string
  /** the official exam name, e.g. "AP® Chemistry" */
  ap: string
  emoji: string
  category: Category
  /** 2027 regular exam date and start time (local), from College Board's AP Central exam calendar */
  exam: { date: string; time: '08:00' | '12:00' }
}

const H: Category = 'History and Social Sciences'
const M: Category = 'Math and Computer Science'
const S: Category = 'Sciences'

export const CATEGORIES: Category[] = [H, M, S]

export const CATALOG: CatalogCourse[] = [
  { id: 'afam', title: 'African American Studies', short: 'African Am. Studies', ap: 'AP® African American Studies', emoji: '✊🏾', category: H, exam: { date: '2027-05-06', time: '12:00' } },
  { id: 'hug', title: 'Human Geography', short: 'Human Geo', ap: 'AP® Human Geography', emoji: '🗺️', category: H, exam: { date: '2027-05-03', time: '08:00' } },
  { id: 'macro', title: 'Macroeconomics', short: 'Macro', ap: 'AP® Macroeconomics', emoji: '🏦', category: H, exam: { date: '2027-05-07', time: '12:00' } },
  { id: 'micro', title: 'Microeconomics', short: 'Micro', ap: 'AP® Microeconomics', emoji: '🛒', category: H, exam: { date: '2027-05-04', time: '12:00' } },
  { id: 'psych', title: 'Psychology', short: 'Psych', ap: 'AP® Psychology', emoji: '🧠', category: H, exam: { date: '2027-05-14', time: '12:00' } },
  { id: 'usgov', title: 'US Government and Politics', short: 'US Gov', ap: 'AP® United States Government and Politics', emoji: '🏛️', category: H, exam: { date: '2027-05-04', time: '08:00' } },
  { id: 'apush', title: 'US History', short: 'US History', ap: 'AP® United States History', emoji: '🦅', category: H, exam: { date: '2027-05-07', time: '08:00' } },
  { id: 'world', title: 'World History: Modern', short: 'World History', ap: 'AP® World History: Modern', emoji: '🌍', category: H, exam: { date: '2027-05-06', time: '08:00' } },
  { id: 'calcab', title: 'Calculus AB', short: 'Calc AB', ap: 'AP® Calculus AB', emoji: '∫', category: M, exam: { date: '2027-05-10', time: '08:00' } },
  { id: 'calcbc', title: 'Calculus BC', short: 'Calc BC', ap: 'AP® Calculus BC', emoji: '∑', category: M, exam: { date: '2027-05-10', time: '08:00' } },
  { id: 'csa', title: 'Computer Science A', short: 'CS A', ap: 'AP® Computer Science A', emoji: '☕', category: M, exam: { date: '2027-05-12', time: '12:00' } },
  { id: 'csp', title: 'Computer Science Principles', short: 'CS Principles', ap: 'AP® Computer Science Principles', emoji: '💻', category: M, exam: { date: '2027-05-14', time: '08:00' } },
  { id: 'precalc', title: 'Precalculus', short: 'Precalc', ap: 'AP® Precalculus', emoji: '📐', category: M, exam: { date: '2027-05-11', time: '08:00' } },
  { id: 'stats', title: 'Statistics', short: 'Stats', ap: 'AP® Statistics', emoji: '📊', category: M, exam: { date: '2027-05-11', time: '12:00' } },
  { id: 'chem', title: 'Chemistry', short: 'Chem', ap: 'AP® Chemistry', emoji: '⚗️', category: S, exam: { date: '2027-05-06', time: '12:00' } },
  { id: 'bio', title: 'Biology', short: 'Bio', ap: 'AP® Biology', emoji: '🧬', category: S, exam: { date: '2027-05-03', time: '12:00' } },
  { id: 'apes', title: 'Environmental Science', short: 'Env Science', ap: 'AP® Environmental Science', emoji: '🌱', category: S, exam: { date: '2027-05-13', time: '12:00' } },
  { id: 'phys1', title: 'Physics 1: Algebra-Based', short: 'Physics 1', ap: 'AP® Physics 1: Algebra-Based', emoji: '🎢', category: S, exam: { date: '2027-05-05', time: '12:00' } },
  { id: 'phys2', title: 'Physics 2: Algebra-Based', short: 'Physics 2', ap: 'AP® Physics 2: Algebra-Based', emoji: '💡', category: S, exam: { date: '2027-05-06', time: '08:00' } },
  { id: 'physcem', title: 'Physics C: Electricity and Magnetism', short: 'Physics C: E&M', ap: 'AP® Physics C: Electricity and Magnetism', emoji: '🧲', category: S, exam: { date: '2027-05-05', time: '12:00' } },
  { id: 'physcm', title: 'Physics C: Mechanics', short: 'Physics C: Mech', ap: 'AP® Physics C: Mechanics', emoji: '⚙️', category: S, exam: { date: '2027-05-03', time: '08:00' } },
]

export const CATALOG_IDS = new Set(CATALOG.map((c) => c.id))
export const catalogCourse = (id: string) => CATALOG.find((c) => c.id === id)
