// What each printable product says about itself: titles, the publisher, the legal notices.
// To add a course, add an entry to COURSE_BOOKS (and write src/content/<id>/book.ts; see SKILL.md).
import { BRAND, TRADEMARK_NOTICE } from '../../shared/brand.ts'

export const PUBLISHER = {
  name: 'R2 Digital LLC',
  year: 2026,
  edition: 'First Edition',
  /** month and year printed on the copyright page */
  date: 'October 2026',
}

export interface CourseBookInfo {
  /** official exam name, used only to say what the book is aligned to */
  ap: string
  /** subject as it appears on the covers (no "AP") */
  subject: string
  /** reference appendix printed at the back of the textbook and the exam book */
  reference: 'periodic-table' | 'stats-tables'
  /** cover gradient, two colors */
  cover: [string, string]
  /** full-length practice exams: how many Section I sets and which FRQ ids go with each */
  exams: { name: string; frqs: string[] }[]
}

export const COURSE_BOOKS: Record<string, CourseBookInfo> = {
  chem: {
    ap: 'AP® Chemistry',
    subject: 'Chemistry',
    reference: 'periodic-table',
    cover: ['#3f3fb8', '#13a89e'],
    exams: [
      { name: 'Practice Exam 1', frqs: ['*'] },
      { name: 'Practice Exam 2', frqs: [] },
    ],
  },
  stats: {
    ap: 'AP® Statistics',
    subject: 'Statistics',
    reference: 'stats-tables',
    cover: ['#4b3fb8', '#e0a400'],
    exams: [
      { name: 'Practice Exam 1', frqs: ['first-of-each-kind'] },
      { name: 'Practice Exam 2', frqs: ['rest'] },
    ],
  },
}

export type Product = 'textbook' | 'flashcards' | 'exam'

export const PRODUCT_NAMES: Record<Product, { title: string; tagline: string; file: string }> = {
  textbook: { title: 'Complete Course Textbook', tagline: 'Every unit and topic explained, with worked examples, tips, cautions and review questions', file: 'Textbook' },
  flashcards: { title: 'Flashcards', tagline: 'Print-and-cut study cards for every lesson and every key term', file: 'Flashcards' },
  exam: { title: 'Practice Exams & Answer Keys', tagline: 'Full-length practice exams and a topic-by-topic question bank, with every answer explained', file: 'Practice-Exams' },
}

export const BRAND_INFO = { name: BRAND.name, domain: BRAND.domain, email: BRAND.email }

/** The notices printed on the copyright page of every product, and in short form on the last page. */
export function notices(info: CourseBookInfo, cedVersion: string) {
  return {
    framework: `The course framework used in this book (the list of units and topics, and the exam weightings) is taken from the College Board's ${info.ap} Course and Exam Description (CED), effective ${cedVersion}.`,
    ownership: `All other content in this book, including every explanation, worked example, tip, caution, diagram, question, answer, explanation, flashcard and glossary entry, was written by and is owned by ${PUBLISHER.name}. It is published under the ${BRAND.name} brand.`,
    trademark: `${TRADEMARK_NOTICE.replace(`${BRAND.name}.`, `${BRAND.name} or ${PUBLISHER.name}.`)} This is not an official College Board publication.`,
    noPromise: 'This book is a study aid. It does not guarantee any particular exam score.',
    copyright: `© ${PUBLISHER.year} ${PUBLISHER.name}. All rights reserved.`,
    license: `This digital edition is licensed to the purchaser for personal, non-commercial study. You may print copies for your own use. You may not resell, share, upload, or redistribute this file or any part of it, in any form, without written permission from ${PUBLISHER.name}.`,
    errata: `Found a mistake? Please tell us at ${BRAND.email}. Corrections are listed in the ${BRAND.name} app at ${BRAND.domain}.`,
  }
}
