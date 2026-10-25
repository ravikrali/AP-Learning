// Prints a course's lesson text (no questions), unit by unit, for writing src/content/<id>/book.ts.
//   node scripts/books/dump.mjs <course> [unitNumber]
import { createServer } from 'vite'
const vite = await createServer({ configFile: false, root: process.cwd(), logLevel: 'error', server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
const { COURSES, plainText } = await vite.ssrLoadModule('/src/content/index.ts')
const [course, unitNo] = process.argv.slice(2)
for (const u of COURSES.find((c) => c.id === course).units) {
  if (unitNo !== undefined && String(u.number) !== unitNo) continue
  console.log(`\n##### UNIT ${u.id} ${u.number}: ${u.title} (${u.weight ?? ''}) — ${u.blurb}`)
  for (const l of u.lessons) {
    console.log(`\n=== ${l.id} [${l.ced.join(',')}] ${l.title} (${l.level})`)
    for (const c of l.cards) {
      if (c.kind === 'try') continue
      if (c.kind === 'summary') console.log(`  [summary] ${c.points.map(plainText).join(' | ')}`)
      else if (c.kind === 'example') console.log(`  [example] ${c.title}: ${plainText(c.problem)} → ${plainText(c.answer)}`)
      else console.log(`  [${c.kind}] ${c.title ? c.title + ': ' : ''}${plainText(c.body)}`)
    }
  }
}
await vite.close()
