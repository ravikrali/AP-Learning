// Builds the printable products for each course: textbook, flashcards, practice exams.
//
//   node scripts/books/build.mjs                      all courses, all products
//   node scripts/books/build.mjs --course stats       one course
//   node scripts/books/build.mjs --product textbook   one product
//   node scripts/books/build.mjs --out <dir>          where the PDFs go (default ../marketing/digital-products)
//
// Needs Google Chrome (or set CHROME=path) and Python with PyMuPDF (pip install pymupdf).
// How it works: render HTML → Chrome prints it → read where every anchor landed → print again with
// real page numbers (repeat until stable) → print an overlay with running heads, page numbers and
// the watermark → PyMuPDF merges them and adds bookmarks (finish.py).
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createServer } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))
const app = resolve(here, '../..')
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : fallback
}
const outDir = resolve(app, arg('out', '../marketing/digital-products'))
const work = join(here, '.work')
mkdirSync(work, { recursive: true })

const CHROME =
  process.env.CHROME ??
  ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(
    (p) => existsSync(p),
  )
if (!CHROME) throw new Error('Chrome not found: set CHROME to its path')
const PYTHON = process.env.PYTHON ?? (process.platform === 'win32' ? 'python' : 'python3')

const font = (file, family, style, weight) =>
  `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};src:url(data:font/ttf;base64,${readFileSync(join(here, 'fonts', file)).toString('base64')}) format('truetype');}`
// Static (single-weight) fonts: Chrome turns variable fonts into Type 3 fonts in PDFs, which print
// shops reject. The Nunito weights were cut from the variable font with fontTools' instancer.
const fontCss = [
  ...[400, 600, 700, 800, 900].map((w) => font(`Nunito-${w}.ttf`, 'Nunito', 'normal', w)),
  ...[400, 700].map((w) => font(`Nunito-${w}Italic.ttf`, 'Nunito', 'italic', w)),
  font('SourceSerif4-Regular.ttf', 'Source Serif 4', 'normal', 400),
  font('SourceSerif4-Semibold.ttf', 'Source Serif 4', 'normal', 600),
  font('SourceSerif4-Bold.ttf', 'Source Serif 4', 'normal', 700),
  font('SourceSerif4-It.ttf', 'Source Serif 4', 'italic', 400),
  font('SourceSerif4-SemiboldIt.ttf', 'Source Serif 4', 'italic', 600),
  font('SourceSerif4-BoldIt.ttf', 'Source Serif 4', 'italic', 700),
  // fallbacks for symbols the text fonts lack (⇌ ≫ ∗ ∪ ✓ …), so Chrome never reaches for a system font
  font('NotoSerif-Regular.ttf', 'Noto Serif', 'normal', 400),
  font('NotoSerif-Bold.ttf', 'Noto Serif', 'normal', 700),
  font('NotoSansMath-Regular.ttf', 'Noto Sans Math', 'normal', 400),
  font('NotoSansSymbols2-Regular.ttf', 'Noto Sans Symbols 2', 'normal', 400),
].join('\n')
const markSvg = readFileSync(join(here, 'brand/eziq-mark.svg'), 'utf8')

function print(htmlFile, pdfFile) {
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--hide-scrollbars', `--print-to-pdf=${pdfFile}`, pathToFileURL(htmlFile).href], {
    stdio: ['ignore', 'ignore', 'ignore'],
    timeout: 600_000,
  })
  if (!existsSync(pdfFile)) throw new Error(`Chrome did not write ${pdfFile}`)
}

function anchors(pdfFile) {
  const json = `${pdfFile}.json`
  execFileSync(PYTHON, [join(here, 'finish.py'), 'names', pdfFile, json], { stdio: 'inherit' })
  return JSON.parse(readFileSync(json, 'utf8'))
}

const PRODUCT_LABEL = { textbook: 'Complete Course Textbook', flashcards: 'Flashcards', exam: 'Practice Exams & Answer Keys' }
const FILE = { textbook: 'Textbook', flashcards: 'Flashcards', exam: 'Practice-Exams' }

function overlayHtml(manifest, at, pages, subject, product) {
  const heads = manifest.heads.map((h) => ({ page: at[h.id], text: h.text })).sort((a, b) => a.page - b.page)
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const out = []
  for (let p = 1; p <= pages; p++) {
    const head = [...heads].reverse().find((h) => h.page <= p)?.text ?? ''
    out.push(`<div class="pg">
  <div class="hd"><span class="brand"><span class="m">${markSvg}</span><b>Ez<i>IQ</i></b> ${esc(subject)} · ${esc(PRODUCT_LABEL[product])}</span><span class="rh">${esc(head)}</span></div>
  <div class="wm"><span class="m">${markSvg}</span><b>Ez<i>IQ</i></b></div>
  <div class="ft"><span>© 2026 R2 Digital LLC · Licensed to the purchaser for personal use</span><span class="n">${p}</span><span>eziq.app</span></div>
</div>`)
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;font-synthesis:none}
body{margin:0;font-family:'Nunito',sans-serif;color:#5d6679}
.pg{position:relative;width:8.5in;height:10.99in;break-after:page;overflow:hidden}
.hd{position:absolute;left:0.5in;right:0.5in;top:0.26in;display:flex;justify-content:space-between;align-items:center;font-size:7.6pt;border-bottom:0.6pt solid #dfe3ec;padding-bottom:3px}
.brand{display:flex;align-items:center;gap:5px}
.brand b{color:#26265e;font-weight:900;font-size:8.6pt}.brand b i,.wm b i{font-style:normal;color:#5b5bd6}
.m{display:inline-block;width:12px;height:12px;line-height:0}.m svg{width:100%;height:100%}
.rh{font-weight:800;color:#26265e;max-width:4.6in;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ft{position:absolute;left:0.5in;right:0.5in;bottom:0.24in;display:flex;justify-content:space-between;align-items:center;font-size:7pt}
.ft .n{font-size:9.5pt;font-weight:900;color:#26265e;position:absolute;left:50%;transform:translateX(-50%)}
.wm{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-28deg);display:flex;align-items:center;gap:0.18in;opacity:0.05}
.wm .m{width:1.6in;height:1.6in}.wm b{font-size:96pt;font-weight:900;color:#26265e}
</style></head><body>${out.join('\n')}</body></html>`
}

const vite = await createServer({
  configFile: false,
  root: app,
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
})
try {
  const { render, COURSE_IDS } = await vite.ssrLoadModule('/scripts/books/render.tsx')
  const courses = arg('course') ? [arg('course')] : COURSE_IDS
  const products = arg('product') ? [arg('product')] : ['textbook', 'flashcards', 'exam']
  for (const course of courses) {
    for (const product of products) {
      const t0 = Date.now()
      const name = `${course}-${product}`
      const html = join(work, `${name}.html`)
      const body = join(work, `${name}.pdf`)
      let pages = {}
      let pad = false
      let r, at, count
      for (let pass = 1; ; pass++) {
        r = render(product, course, { pages, pad, fontCss })
        writeFileSync(html, r.html)
        print(html, body)
        ;({ at, pages: count } = anchors(body))
        const firstDeck = r.manifest.outline.find((e) => e.id.startsWith('deck-'))
        const wantPad = product === 'flashcards' && firstDeck ? (at[firstDeck.id] % 2 === 0 ? !pad : pad) : false
        const stable = pass > 1 && wantPad === pad && Object.keys(at).every((k) => pages[k] === at[k])
        if (stable) break
        if (pass >= 5) throw new Error(`${name}: page numbers did not settle after 5 passes`)
        pages = at
        pad = wantPad
      }
      if (product === 'textbook' && !r.hasBook) console.warn(`  ! ${course}: no src/content/${course}/book.ts, so the textbook has no "closer look" sections`)
      const cover = join(work, `${name}-cover.html`)
      writeFileSync(cover, r.coverHtml)
      print(cover, join(work, `${name}-cover.pdf`))
      const subject = r.manifest.title.split(':')[0].replace(/^EzIQ /, '')
      const overlay = join(work, `${name}-overlay.html`)
      writeFileSync(overlay, overlayHtml(r.manifest, at, count, subject, product))
      print(overlay, join(work, `${name}-overlay.pdf`))
      writeFileSync(join(work, `${name}.manifest.json`), JSON.stringify(r.manifest, null, 1))
      const dir = join(outDir, course)
      mkdirSync(dir, { recursive: true })
      const final = join(dir, `EzIQ-${subject}-${FILE[product]}.pdf`)
      execFileSync(PYTHON, [join(here, 'finish.py'), 'stamp', body, join(work, `${name}-cover.pdf`), join(work, `${name}-overlay.pdf`), join(work, `${name}.manifest.json`), final], { stdio: 'inherit' })
      console.log(`✓ ${final} · ${count} pages · ${((Date.now() - t0) / 1000).toFixed(0)} s`)
    }
  }
} finally {
  await vite.close()
}
