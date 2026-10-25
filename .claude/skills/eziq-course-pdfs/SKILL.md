---
name: eziq-course-pdfs
description: Build the three sellable EzIQ digital products for a course (Complete Course Textbook, Flashcards, Practice Exams & Answer Keys) as print-quality, fully linked, watermarked PDFs. Use when the user asks to create, update or rebuild the PDF textbook, flashcards, exam book or "digital asset package" for any EzIQ course, including a newly added course.
---

# EzIQ course PDFs

Turns a course that is already built in the app (`app/src/content/<id>/`) into three PDFs:

| Product | File | What is in it |
| Complete Course Textbook | `EzIQ-<Subject>-Textbook.pdf` | cover, notices, linked contents, how-to, exam facts; per unit an opener (overview, lesson map, CED topics), every lesson (hook, concepts, diagrams, worked examples, tips, cautions, exam strategy, "A closer look" prose, key takeaways, key terms, quick recall, review questions), unit review, answers and explanations; appendices: free-response practice + scoring guides, glossary, reference tables |
| Flashcards | `EzIQ-<Subject>-Flashcards.pdf` | every lesson flashcard + every glossary term as 8-up print-and-cut sheets, answers mirrored on the back for long-edge duplex; then the same cards as on-screen review lists |
| Practice Exams & Answer Keys | `EzIQ-<Subject>-Practice-Exams.pdf` | full-length practice exams in the real format (Section I by unit weight, Section II FRQs), bubble sheet, answer key grid, score-by-unit table, every explanation, FRQ scoring guides; then every remaining question as a unit question bank with answers. No question appears twice. |

All three: US Letter, embedded open-license fonts (Nunito, Source Serif 4), vector diagrams, the EzIQ mark as a watermark on every page, running heads that link to the contents, page numbers, PDF bookmarks, clickable cross-references (question ↔ answer, glossary → lesson, contents → page), and the R2 Digital LLC ownership and College Board notices.

## Where things live

- `app/scripts/books/` — the builder. `build.mjs` (entry), `render.tsx`, `textbook.tsx`, `flashcards.tsx`, `exam.tsx`, `shared-sections.tsx` (exam facts, FRQs, reference appendices), `common.tsx` (cover, notices, contents rows, callouts), `book.css` (print styles), `config.ts` (publisher, product names, per-course settings, legal notices), `finish.py` (PyMuPDF: page numbers, cover, watermark, bookmarks), `qa.py` (checks), `dump.mjs` (prints a course's lesson text), `brand/` (EzIQ mark SVGs), `fonts/` (OFL fonts).
- `app/src/content/<id>/book.ts` — the extra textbook prose for a course (unit overviews, a lesson intro and "A closer look" sections). `app/tests/book.test.ts` fails if any unit or lesson is missing from it or an `[[eq: ]]` does not balance.
- Output: `marketing/digital-products/<id>/` (gitignored; the PDFs are products, rebuild them any time).

## Requirements

Google Chrome (or set `CHROME=<path>`), Node, and Python with PyMuPDF (`pip install pymupdf`). Run commands from `app/`. In the user's PowerShell use `npm.cmd`/`npx.cmd`.

## Adding a new course

1. **The course must be built in the app**: registered in `COURSES` in `app/src/content/index.ts`, with `EXAMS` (formats including a `full` one, FRQs, FRQ kind labels), `CEDS` (version, units with weights, topics) and a glossary. The builder reads everything from there.
2. **Add the course to `COURSE_BOOKS` in `app/scripts/books/config.ts`**: `ap` (official exam name with ®, used only in "aligned to" statements), `subject`, `reference` (the back-of-book reference appendix; if the course needs something other than `periodic-table` or `stats-tables`, add a renderer in `shared-sections.tsx` and a title in `referenceTitle`), two cover colors, and the practice-exam sets (`frqs: ['*']` = all FRQs, `'first-of-each-kind'`, `'rest'`, or explicit FRQ ids).
3. **Write `app/src/content/<id>/book.ts`** (export `BOOK: CourseBook`). Work unit by unit:
   - `node scripts/books/dump.mjs <id> <unitNumber>` prints the unit's lessons (concepts, examples, tips, cautions, summaries) so the new prose builds on what the lesson already says instead of repeating it.
   - Per unit: an `overview` of 2–3 paragraphs (what the unit covers, how the ideas connect, where they lead).
   - Per lesson: a one- or two-sentence `intro` and usually two `deeper` sections ("A closer look"), each ~100–180 words: a fully worked example in exam style, the reasoning behind a rule, a common confusion, a link to another unit, or how the exam phrases it.
   - Rules: stay strictly inside the course's CED (check the lesson's topics and any "not tested" notes in the lesson; never add excluded content). Recompute every number you write. Keep the lesson's own values when you reuse its example. Refer to other lessons by title, not number (book lesson numbers are positions, not CED topic numbers). Use the lesson markup: `**bold**`, `*italic*`, `x^{2}`, `x_{i}`, `[[eq: …]]` for balanced equations (tests check them), `- ` bullets, `1. ` steps, `| a | b |` tables; blank line = new paragraph. Template literals are fine; never write `${`. No emoji (they are stripped anyway).
4. `npx vitest run` — must pass (book coverage, equation balance, everything else).
5. Build: `node scripts/books/build.mjs --course <id>` (all three; add `--product textbook|flashcards|exam` for one). Each product takes about 2–5 minutes: the builder prints the HTML with Chrome, reads where every anchor landed, prints again with the real page numbers until they stop changing, prints the cover and an overlay (running head, page number, watermark), and merges them with `finish.py`.
6. **QA**: `python scripts/books/qa.py ../marketing/digital-products/<id>/*.pdf --png <scratch dir> --pages 1,2,3,9,40` then look at the PNGs (cover, notices, contents, a lesson page, an answer page, the flashcard front/back pair, an exam page). `qa.py` must print `ok` for each file: it checks links, unfilled page numbers, embedded fonts, bookmarks, the author field and the copyright line on every page.
7. Tell the user the page counts and where the files are, and send them with SendUserFile.

## Updating an existing course

Content changes in the app flow into the PDFs automatically; just rebuild (step 5) and QA (step 6). Change the edition/date in `PUBLISHER` (`config.ts`) when re-releasing.

## Legal and brand text (keep it)

`notices()` in `config.ts` prints, on the copyright page and the closing page: the course framework (units, topics, weights) comes from the College Board's CED; all other content is written and owned by R2 Digital LLC and published under the EzIQ brand; the AP® trademark notice (not affiliated, does not endorse, not an official College Board publication); no score guarantee; © year R2 Digital LLC, single-purchaser personal-use license, no redistribution; errata contact. The overlay prints "© <year> R2 Digital LLC · Licensed to the purchaser for personal use" and eziq.app on every page. Product titles never put "AP" in the product name: say "aligned to the AP® … course framework". These texts are not lawyer-reviewed; say so if the user asks.

## Gotchas

- Chrome lays out every page at the normal page width, so full-bleed pages shrink: the cover is printed separately and placed by `finish.py`. Don't use `@page` named pages with other margins.
- Chrome records a destination only for anchors that something links to; `render.tsx` adds a 1-pixel link strip for every bookmark target and `finish.py` deletes those links.
- Use only static (single-weight) font files. Chrome embeds variable fonts as Type 3 fonts, which print services reject; `qa.py` flags them. The Nunito weights in `fonts/` were cut from the variable font with `fontTools.varLib.instancer` and renamed; Source Serif 4 statics come from adobe-fonts/source-serif (release branch, `TTF/`). Noto Serif (cut the same way), Noto Sans Math and Noto Sans Symbols 2 are fallbacks for symbols the text fonts lack (⁺ ⁻ ⇌ ≫ ∗ ✓), so no Windows font is ever embedded. `font-synthesis: none` stops Chrome faking bold on fallback glyphs (faked glyphs also become Type 3). If `qa.py` reports a system font or Type 3 font, find the characters with PyMuPDF (`page.get_text('rawdict')`, spans whose font starts with `Type3` or is a system font) and add a fallback that covers them.
- Never give an element the class `front` unless it is a front-matter section (it forces a page break).
- Flashcard sheets must start on an odd page; the builder adds a blank page automatically when needed.
- Two Vite servers at once (e.g. `dump.mjs` while a build runs) are fine: both use `hmr: false`.
