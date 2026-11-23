// Quick structural checks on a lesson's scenes, without rendering:  node audit.mjs chem-1.1 [more ids]
//  - a <sup>/<sub> directly inside a flex or grid box (it would not be raised or lowered)
//  - a lesson <style> that redefines one of the engine's class names
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const RESERVED = ['pill', 'title', 'chips', 'tm', 'url', 'brandcol', 'biglogo', 'mark', 'kicker', 'h1', 'card', 'banner', 'arr', 'scene', 'full', 'crumb', 'name', 'pri', 'teal', 'warm', 'gold', 'good', 'bad', 'muted']
const browser = await chromium.launch({ channel: 'chrome' })
let bad = 0
for (const lesson of process.argv.slice(2)) {
  const src = readFileSync(path.join(here, 'lessons', lesson, 'scenes.js'), 'utf8')
  const css = (src.match(/textContent\s*=\s*`([\s\S]*?)`/) ?? [, ''])[1]
  const clash = RESERVED.filter((c) => new RegExp(`(^|[},])\\s*\\.${c}\\s*[{,]`, 'm').test(css))
  // "AP" on screen or in a caption must carry the ® (the voice line itself has no mark)
  const script = (await import(pathToFileURL(path.join(here, 'lessons', lesson, 'script.mjs')).href)).default
  const caps = script.scenes.flatMap((sc) => sc.beats.map((b) => b.cap ?? b.say))
  const html = src.replace(/<[^>]+>/g, ' ')
  const mark = [...caps, html].flatMap((t) => [...t.matchAll(/\bAP\b(?!®)[^\n]{0,30}/g)].map((m) => `"AP" without ®: ${m[0]}`))
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(pathToFileURL(path.join(here, 'player', 'index.html')).href + `?lesson=${lesson}&capture`)
  await page.waitForTimeout(500)
  const flat = await page.evaluate(() => [...document.querySelectorAll('.scene sup, .scene sub')]
    .filter((el) => /flex|grid/.test(getComputedStyle(el.parentElement).display) && getComputedStyle(el).position === 'static')
    .map((el) => `${el.closest('.scene').id}: "${el.parentElement.textContent.trim().slice(0, 40)}"`))
  await page.close()
  const problems = [...mark, ...clash.map((c) => `redefines .${c}`), ...flat.map((f) => `flat sup/sub in ${f}`), ...errors.map((e) => `page error: ${e}`)]
  bad += problems.length
  console.log(`${lesson}: ${problems.length ? '\n  ' + problems.join('\n  ') : 'ok'}`)
}
await browser.close()
process.exitCode = bad ? 1 : 0
