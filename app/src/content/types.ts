// Content model for courses, units and lessons.
//
// Text fields use a small markup (see src/lib/RichText.tsx):
//   **bold**  *italic*  x^{2}  K_{a}  {{H2SO4}} (auto-formatted formula)
//   [[eq: 2H2(g) + O2(g) -> 2H2O(l)]]  (formatted AND balance-checked by tests)
//   Blank line = new paragraph. Lines starting with "- " = bullet list.

export type Level = 'foundation' | 'core' | 'advanced'

export interface McqQuestion {
  id: string
  type: 'mcq'
  prompt: string
  choices: string[]
  /** index into choices */
  answer: number
  explain: string
  hint?: string
}

export interface NumQuestion {
  id: string
  type: 'num'
  prompt: string
  answer: number
  /** accepted relative error, default 0.02 (2%) */
  tolerance?: number
  unit?: string
  explain: string
  hint?: string
  /** Independent computation of the answer; the test suite checks it matches `answer`. */
  compute?: () => number
}

export type Question = McqQuestion | NumQuestion

export type Card =
  | { kind: 'hook'; title?: string; body: string }
  | { kind: 'concept'; title: string; body: string; diagram?: string }
  | {
      kind: 'example'
      title: string
      problem: string
      steps: string[]
      answer: string
      /** numbers stated in the steps/answer, each re-computed independently by the test suite */
      verify?: { stated: number; compute: () => number; tol?: number }[]
    }
  | { kind: 'try'; question: Question }
  | { kind: 'hack'; title: string; body: string }
  | { kind: 'trap'; title?: string; body: string }
  | { kind: 'frq'; title?: string; body: string }
  | { kind: 'summary'; points: string[] }

export interface Flashcard {
  front: string
  back: string
}

export interface Lesson {
  /** globally unique, e.g. "chem-1.1" */
  id: string
  /** CED topic numbers covered, e.g. ["1.1"]; empty for prerequisite lessons */
  ced: string[]
  title: string
  level: Level
  minutes: number
  cards: Card[]
  check: Question[]
  flashcards: Flashcard[]
}

export interface Unit {
  id: string
  number: number
  title: string
  /** official exam weighting (multiple-choice section) */
  weight?: string
  blurb: string
  badge: { name: string; emoji: string }
  lessons: Lesson[]
  /** extra mixed questions for the unit checkpoint */
  checkpoint: Question[]
}

export interface Course {
  id: string
  title: string
  short: string
  emoji: string
  units: Unit[]
}
