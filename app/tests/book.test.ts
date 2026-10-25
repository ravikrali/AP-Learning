// The printed course books (scripts/books): every unit and lesson has its textbook prose, and the
// prose follows the same notation rules as the lessons.
import { describe, expect, it } from 'vitest'
import { COURSES } from '../src/content'
import type { CourseBook } from '../src/content/types'
import { checkBalanced } from '../src/lib/chem'

const BOOKS = import.meta.glob<{ BOOK: CourseBook }>('../src/content/*/book.ts', { eager: true })
const bookFor = (id: string) => BOOKS[`../src/content/${id}/book.ts`]?.BOOK

describe('course books', () => {
  for (const course of COURSES) {
    const book = bookFor(course.id)
    it(`${course.id}: has a book with an overview for every unit and prose for every lesson`, () => {
      expect(book, `src/content/${course.id}/book.ts is missing`).toBeTruthy()
      const units = course.units.map((u) => u.id)
      const lessons = course.units.flatMap((u) => u.lessons.map((l) => l.id))
      expect(units.filter((id) => !book!.units[id]?.overview.trim())).toEqual([])
      expect(lessons.filter((id) => !book!.lessons[id] || book!.lessons[id].deeper.length === 0)).toEqual([])
      // no entries for units or lessons that do not exist
      expect(Object.keys(book!.units).filter((id) => !units.includes(id))).toEqual([])
      expect(Object.keys(book!.lessons).filter((id) => !lessons.includes(id))).toEqual([])
    })
    it(`${course.id}: every [[eq: ...]] in the book is balanced`, () => {
      if (!book) return
      const texts = [
        ...Object.values(book.units).map((u) => u.overview),
        ...Object.values(book.lessons).flatMap((l) => [l.intro ?? '', ...l.deeper.flatMap((d) => [d.title, d.body])]),
      ]
      const problems: string[] = []
      for (const t of texts)
        for (const m of t.matchAll(/\[\[eq:([^\]]+)\]\]/g)) {
          const r = checkBalanced(m[1].trim())
          if (!r.ok) problems.push(m[1])
        }
      expect(problems).toEqual([])
    })
  }
})
