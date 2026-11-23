// prints lesson ids: done count, started-but-unpublished, and the next unstarted ones
import { readFileSync, existsSync } from 'node:fs'
const root = 'C:/Users/PC3/OneDrive/01Projects/AP Learning/'
const order = [['chem', [2, 0, 1, 3, 4, 5, 6, 7, 8, 9]], ['stats', [1, 0, 2, 3, 4, 5]]]
const ids = []
for (const [c, us] of order) for (const u of us) {
  const src = readFileSync(`${root}app/src/content/${c}/u${u}.ts`, 'utf8')
  for (const m of src.matchAll(new RegExp(`^[ 	]+id: '(${c}-[0-9]+[.][0-9]+[a-z]?)'`, 'gm'))) if (!ids.includes(m[1])) ids.push(m[1])
}
const done = JSON.parse(readFileSync(root + 'app/public/videos.json', 'utf8'))
const isDone = (i) => done[i]?.src?.startsWith('media/')
const started = ids.filter((i) => !isDone(i) && existsSync(`${root}marketing/lesson-videos/lessons/${i}`))
const next = ids.filter((i) => !isDone(i) && !started.includes(i))
console.log(`total ${ids.length} done ${ids.filter(isDone).length}\nstarted, unpublished: ${started.join(' ') || '-'}\nnext: ${next.slice(0, +(process.argv[2] ?? 6)).join(' ')}\nremaining unstarted: ${next.length}`)
