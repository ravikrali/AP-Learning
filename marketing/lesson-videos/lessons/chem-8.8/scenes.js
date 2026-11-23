// Pictures for chem-8.8 "Buffers: How They Work". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts): blood at pH 7.4 and its
// H2CO3 / HCO3- buffer; the two buffer kinds (CH3COOH / CH3COO-, NH3 / NH4+); the two neutralization
// equations; HCl + NaCl is not a buffer; the HF / NaF question. Balls show which species is which, not size.
(() => {
  const { lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-lab small{display:block;margin-top:4px;font-size:28px;font-weight:800;color:var(--muted)}
    .x-lg{position:absolute;left:130px;font-size:36px;font-weight:900;line-height:60px;white-space:nowrap}
    .x-lg em{font-style:normal;font-size:30px;font-weight:800;color:var(--muted)}
    .x-ic{position:absolute;left:30px;width:80px;height:60px}
    .x-say{position:absolute;left:0;right:0;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-eqn{position:absolute;left:120px;top:870px;width:1680px;height:110px;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line);text-align:center;font-size:48px;font-weight:900;line-height:106px;white-space:nowrap}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:32px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-bar{position:absolute;height:20px;border-radius:10px;background:#363c54}
    .x-mk{position:absolute;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:28px solid var(--gold)}
    .x-rb{position:absolute;height:44px;border-radius:12px;overflow:hidden}
    .x-row{position:absolute;left:40px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-tile{position:absolute;top:380px;width:390px;height:210px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .x-tile .f{margin-top:100px;font-size:54px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', PRI = '#8d8df0', BAD = '#f0707a'
  const HAC = 'CH<sub>3</sub>COOH', AC = 'CH<sub>3</sub>COO<sup>−</sup>', H3O = 'H<sub>3</sub>O<sup>+</sup>', OH = 'OH<sup>−</sup>'
  const H2O = 'H<sub>2</sub>O', NH3 = 'NH<sub>3</sub>', NH4 = 'NH<sub>4</sub><sup>+</sup>', H2CO3 = 'H<sub>2</sub>CO<sub>3</sub>', HCO3 = 'HCO<sub>3</sub><sup>−</sup>'
  const AM = 'A<sup>−</sup>', HP = 'H<sup>+</sup>'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const S = 1.4
  // a weak acid HA (purple with its gold H) and a conjugate base A- (teal)
  const ha = (x, y, s = S) => `<g transform="translate(${x} ${y})">${ball(0, 0, 17 * s, 'pur')}${ball(20 * s, -13 * s, 10 * s, 'gold')}</g>`
  const am = (x, y, s = S) => ball(x, y, 17 * s, 'teal')
  const icon = (inner) => `<svg class="x-ic" viewBox="-40 -30 80 60">${inner}</svg>`
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)

  // ---------- intro: a faint row of buffer partners ----------
  const IX = Array.from({ length: 13 }, (_, i) => 300 + i * 110)
  EZ.intro = {
    chips: [['1@0.3', 'What a buffer is'], ['1@0.55', 'Acid in, base in'], ['1@0.85', 'Not a buffer']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.28">${IX.map((x, i) => i === 6 ? `<g transform="translate(${x} 890)"><g class="x-ia">${ball(0, 0, 24, 'teal')}</g><g class="x-ih">${ball(0, 0, 14, 'gold')}</g></g>` : i % 2 ? am(x, 890) : ha(x, 890)).join('')}</svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 1.2)
      c.$('.x-ih').setAttribute('transform', `translate(${lerp(28, 60, p)} ${lerp(-18, -38, p)})`)
    },
  }

  // ---------- hook: blood pH stays at 7.4 ----------
  const SX = 200, SW = 720, MID = SX + SW / 2
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Your blood's pH barely moves</h2>
      <div class="card" style="left:120px;top:300px;width:880px;height:520px" data-at="0" data-fx="fade"><h3>Blood pH</h3></div>
      <div class="x-lab gold" style="left:${MID - 150}px;width:300px;top:420px;font-size:64px" data-at="0@0.4" data-fx="pop">7.4</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><rect x="${SX}" y="560" width="${SW}" height="30" rx="15" fill="#363c54"/>
          <rect x="${MID - 30}" y="560" width="60" height="30" fill="#4cc781" opacity=".8"/></g>
        <g data-at="2" data-fx="fade"><rect x="${SX}" y="560" width="200" height="30" rx="15" fill="${BAD}" opacity=".8"/><rect x="${SX + SW - 200}" y="560" width="200" height="30" rx="15" fill="${BAD}" opacity=".8"/>
          <text x="${SX + 100}" y="640" text-anchor="middle" font-size="30" font-weight="900" class="f-bad">serious trouble</text>
          <text x="${SX + SW - 100}" y="640" text-anchor="middle" font-size="30" font-weight="900" class="f-bad">serious trouble</text></g>
        <g data-at="0@0.4" data-fx="fade"><path class="x-hm" d="M-20 -34H20L0 -4Z" fill="${GOLD}" transform="translate(${MID} 556)"/></g>
        <text x="${MID}" y="640" text-anchor="middle" font-size="30" font-weight="900" class="f-good" data-at="0@0.6" data-fx="fade">stays here</text>
      </svg>
      <div class="x-chip warm" style="left:250px;top:700px;background:rgba(243,167,100,.12)" data-at="1@0.1" data-fx="pop">eat lemons</div>
      <div class="x-chip teal" style="left:600px;top:700px;background:rgba(60,199,188,.12)" data-at="1@0.5" data-fx="pop">exercise hard</div>
      <div class="card" style="left:1060px;top:300px;width:740px;height:520px" data-at="4"><h3>Blood's main buffer</h3></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="4@0.2" data-fx="fade">${ball(1250, 540, 70, 'pur')}${ball(1610, 540, 70, 'teal')}
        <text x="1430" y="562" text-anchor="middle" font-size="64" font-weight="900" class="f-muted">+</text></g></svg>
      <div class="x-lab pri" style="left:1100px;width:300px;top:640px" data-at="4@0.3" data-fx="fade">${H2CO3}<small>carbonic acid</small></div>
      <div class="x-lab teal" style="left:1460px;width:300px;top:640px" data-at="4@0.7" data-fx="fade">${HCO3}<small>hydrogen carbonate</small></div>
      <div class="banner" style="top:870px" data-at="3" data-fx="pop">Buffers: chemical <span class="gold">shock absorbers</span></div>`,
    update(c) {
      const b = c.b, d = b[1].end - b[1].start, tau = c.seg(b[1].start, b[1].start + d)
      const x = MID + 26 * Math.sin(tau * Math.PI * 4) * (1 - tau)
      c.$('.x-hm').setAttribute('transform', `translate(${x} 556)`)
    },
  })

  // ---------- what a buffer is ----------
  const POOL = Array.from({ length: 10 }, (_, i) => [230 + (i % 5) * 140, 500 + Math.floor(i / 5) * 110, (i + Math.floor(i / 5)) % 2])
  EZ.scene('what', {
    html: `<div class="kicker" data-at="in" data-fx="left">Definition</div><h2 class="h1" data-at="0">What a buffer is</h2>
      <div class="x-line" style="top:286px" data-at="1">Large amounts of <span class="gold">BOTH</span> members of a conjugate acid–base pair</div>
      <div class="card" style="left:120px;top:380px;width:810px;height:440px" data-at="2"><h3 style="text-align:center;font-size:38px">Weak acid + its conjugate base</h3>
        <div class="x-lab pri" style="left:55px;width:300px;top:300px;font-size:40px">${HAC}<small>weak acid</small></div>
        <div class="x-lab teal" style="left:455px;width:300px;top:300px;font-size:40px">${AC}<small>conjugate base</small></div></div>
      <div class="card" style="left:990px;top:380px;width:810px;height:440px" data-at="3"><h3 style="text-align:center;font-size:38px">Weak base + its conjugate acid</h3>
        <div class="x-lab teal" style="left:55px;width:300px;top:300px;font-size:40px">${NH3}<small>weak base</small></div>
        <div class="x-lab pri" style="left:455px;width:300px;top:300px;font-size:40px">${NH4}<small>conjugate acid</small></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.3" data-fx="fade">${POOL.map(([x, y, k]) => k ? am(x, y) : ha(x, y)).join('')}</g>
        <g data-at="3@0.3" data-fx="fade">${POOL.map(([x, y, k]) => ball(x + 870, y, 26, k ? 'teal' : 'pur')).join('')}</g>
      </svg>
      <div class="banner" style="top:870px" data-at="4" data-out="5-0.35" data-fx="pop"><span class="gold">Both</span> partners, in <span class="gold">large amounts</span></div>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop">Each partner has <span class="gold">one job</span></div>`,
  })

  // ---------- the beaker used for added acid and added base ----------
  const GX = [280, 440, 600, 760], GY = [490, 610, 730]
  const CELLS = GY.flatMap((y, r) => GX.map((x, col) => ({ x, y, teal: (col + r) % 2 === 0 })))
  const BEAKER = `<path d="M163 400H877V780Q877 837 820 837H220Q163 837 163 780Z" fill="rgba(60,199,188,.08)"/><path d="M160 330V780Q160 840 220 840H820Q880 840 880 780V330" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linecap="round"/>
    <text x="190" y="380" font-size="30" font-weight="800" class="f-muted">buffer</text>`
  const cardR = (rows, more) => `<div class="card" style="left:980px;top:320px;width:820px;height:520px" data-at="in+0.4" data-fx="fade">
    ${rows.map(([ic, txt, at], i) => `<div data-at="${at}" data-fx="fade">${icon(ic).replace('class="x-ic"', `class="x-ic" style="top:${36 + i * 70}px"`)}<div class="x-lg" style="top:${36 + i * 70}px">${txt}</div></div>`).join('')}${more}</div>`

  // ---------- added acid ----------
  const AT = [CELLS[0], CELLS[5], CELLS[10]]
  EZ.scene('acid', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Add acid</div><h2 class="h1" data-at="in+0.2">The conjugate base catches it</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.2" data-fx="fade">${BEAKER}
          ${CELLS.filter((k) => !AT.includes(k)).map((k) => k.teal ? am(k.x, k.y) : ha(k.x, k.y)).join('')}
          ${AT.map((k, i) => `<g transform="translate(${k.x} ${k.y})"><g class="x-at${i}">${ball(0, 0, 17 * S, 'teal')}</g><g class="x-ap${i}" style="opacity:0">${ball(0, 0, 17 * S, 'pur')}</g></g>`).join('')}</g>
        <g data-at="1" data-fx="fade">${AT.map((k, i) => `<g class="x-aw${i}">${ball(0, 0, 20, 'red')}</g><g class="x-ah${i}">${ball(0, 0, 14, 'gold')}</g>`).join('')}</g>
      </svg>
      ${cardR([
        [ball(0, 0, 22, 'teal'), `<span class="teal">${AC}</span> <em>conjugate base</em>`, 'in'],
        [`<g transform="translate(-8 4)">${ball(0, 0, 22, 'pur')}${ball(26, -17, 13, 'gold')}</g>`, `<span class="pri">${HAC}</span> <em>weak acid</em>`, 'in'],
        [`<g transform="translate(-6 4)">${ball(0, 0, 18, 'red')}${ball(17, -13, 12, 'gold')}</g>`, `<span class="warm">${H3O}</span> <em>added acid</em>`, '1'],
        [`<g opacity=".4">${ball(0, 0, 18, 'red')}</g>`, `${H2O} <em>left behind</em>`, '2@0.7'],
      ], `<div class="x-say" style="top:340px" data-at="4"><span class="warm">strong acid</span>${ARR}<span class="pri">weak acid</span></div>
         <div class="x-say" style="top:410px;font-size:30px;color:var(--muted)" data-at="4@0.5" data-fx="fade">which hardly ionizes</div>
         <div class="x-say" style="top:450px" data-at="5">pH changes <span class="gold">only slightly</span></div>`)}
      <div class="x-eqn" data-at="3"><span class="teal">${AC}</span>(aq) + <span class="warm">${H3O}</span>(aq) ${ARR} <span class="pri">${HAC}</span>(aq) + ${H2O}(l)</div>`,
    update(c) {
      const b = c.b, d = eo(c.seg(b[1].start, b[1].start + 0.8))
      AT.forEach((k, i) => {
        const t0 = b[2].start + 0.2 + i * 0.5
        const p1 = eio(c.seg(t0, t0 + 0.9)), p2 = eio(c.seg(t0 + 1.0, t0 + 1.5))
        const x = k.x + 60, y = lerp(lerp(300, 350, d), k.y - 50, p1)
        mv(c, '.x-aw' + i, x, y)
        mv(c, '.x-ah' + i, lerp(x + 18, k.x + 28, p2), lerp(y - 14, k.y - 18, p2))
        c.$('.x-ap' + i).style.opacity = p2; c.$('.x-at' + i).style.opacity = 1 - p2
        c.$('.x-aw' + i).style.opacity = 1 - 0.6 * p2
      })
    },
  })

  // ---------- added base ----------
  const BT = [CELLS[1], CELLS[6], CELLS[11]]
  EZ.scene('base', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Add base</div><h2 class="h1" data-at="in+0.2">The weak acid catches it</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.2" data-fx="fade">${BEAKER}
          ${CELLS.filter((k) => !BT.includes(k)).map((k) => k.teal ? am(k.x, k.y) : ha(k.x, k.y)).join('')}
          ${BT.map((k, i) => `<g transform="translate(${k.x} ${k.y})"><g class="x-bp${i}">${ball(0, 0, 17 * S, 'pur')}</g><g class="x-bt${i}" style="opacity:0">${ball(0, 0, 17 * S, 'teal')}</g></g>`).join('')}</g>
        <g data-at="1" data-fx="fade">${BT.map((k, i) => `<g class="x-bo${i}">${ball(0, 0, 20, 'red')}</g>`).join('')}</g>
        <g data-at="in+0.2" data-fx="fade">${BT.map((k, i) => `<g class="x-bh${i}">${ball(0, 0, 14, 'gold')}</g>`).join('')}</g>
      </svg>
      ${cardR([
        [`<g transform="translate(-8 4)">${ball(0, 0, 22, 'pur')}${ball(26, -17, 13, 'gold')}</g>`, `<span class="pri">${HAC}</span> <em>weak acid</em>`, 'in'],
        [ball(0, 0, 22, 'teal'), `<span class="teal">${AC}</span> <em>conjugate base</em>`, 'in'],
        [ball(0, 0, 18, 'red'), `<span class="warm">${OH}</span> <em>added base</em>`, '1'],
        [`<g opacity=".45" transform="translate(-6 4)">${ball(0, 0, 18, 'red')}${ball(17, -13, 12, 'gold')}</g>`, `${H2O} <em>formed</em>`, '2@0.8'],
      ], `<div class="x-say" style="top:340px" data-at="4"><span class="warm">strong base</span>${ARR}<span class="teal">weak base</span></div>
         <div class="x-say" style="top:430px;font-size:36px" data-at="5">a little NaOH <span class="gold">barely moves</span> the pH</div>`)}
      <div class="x-eqn" data-at="3"><span class="pri">${HAC}</span>(aq) + <span class="warm">${OH}</span>(aq) ${ARR} <span class="teal">${AC}</span>(aq) + ${H2O}(l)</div>`,
    update(c) {
      const b = c.b, d = eo(c.seg(b[1].start, b[1].start + 0.8))
      BT.forEach((k, i) => {
        const t0 = b[2].start + 0.2 + i * 0.5
        const p1 = eio(c.seg(t0, t0 + 0.9)), p2 = eio(c.seg(t0 + 1.0, t0 + 1.5)), p3 = eio(c.seg(t0 + 1.7, t0 + 2.3))
        const x = k.x + 62, y = lerp(lerp(300, 350, d), k.y - 46, p1)
        mv(c, '.x-bo' + i, x, y)
        mv(c, '.x-bh' + i, lerp(k.x + 28, x + 17, p2), lerp(k.y - 18, y - 14, p2))
        c.$('.x-bt' + i).style.opacity = p2; c.$('.x-bp' + i).style.opacity = 1 - p2
        const w = 1 - 0.55 * p3
        c.$('.x-bo' + i).style.opacity = w; c.$('.x-bh' + i).style.opacity = w
      })
    },
  })

  // ---------- why: water vs. buffer (no pH numbers: the lesson gives none here) ----------
  const phBar = (L, cls) => `<div class="x-bar" style="left:${L + 105}px;top:700px;width:600px"></div>
    <div class="x-mk ${cls}" style="left:${L + 405 - 18}px;top:664px"></div>
    <div class="x-lab muted" style="left:${L + 45}px;width:120px;top:730px;font-size:28px">lower</div>
    <div class="x-lab muted" style="left:${L + 645}px;width:120px;top:730px;font-size:28px">higher</div>
    <div class="x-lab" style="left:${L + 330}px;width:150px;top:600px;font-size:34px">pH</div>`
  EZ.scene('why', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it works</div><h2 class="h1" data-at="0">Pure water vs. a buffer</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:530px" data-at="0@0.3"><h3>Pure water</h3></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:530px" data-at="0@0.5"><h3>Buffer</h3></div>
      <div data-at="0@0.6" data-fx="fade">${phBar(120, 'x-mkL')}${phBar(990, 'x-mkR')}</div>
      <div class="x-chip warm" style="left:560px;top:322px;background:rgba(243,167,100,.12)" data-at="1" data-fx="pop">+ strong acid</div>
      <div class="x-lab bad" style="left:120px;width:810px;top:770px;font-size:34px" data-at="1@0.6" data-fx="fade">drops by several units</div>
      <div class="x-chip warm" style="left:1430px;top:322px;background:rgba(243,167,100,.12)" data-at="2" data-fx="pop">+ same acid</div>
      <div data-at="2@0.2" data-fx="fade">
        <div class="x-rb" style="left:1095px;top:440px;width:600px;background:${PRI}"><div class="x-rt" style="height:100%;width:300px;background:${TEAL}"></div></div>
        <div class="x-lab teal" style="left:1095px;width:200px;top:494px;font-size:32px;text-align:left">[${AM}]</div>
        <div class="x-lab pri" style="left:1495px;width:200px;top:494px;font-size:32px;text-align:right">[HA]</div>
        <div class="x-lab muted" style="left:1245px;width:300px;top:494px;font-size:28px">ratio shifts a little</div></div>
      <div class="x-lab good" style="left:990px;width:810px;top:770px;font-size:34px" data-at="3@0.3" data-fx="fade">changes only slightly</div>
      <div class="banner" style="top:870px;font-size:46px" data-at="4" data-out="5-0.35" data-fx="pop">Strong acid or base ${ARR} swapped for a <span class="gold">weak one</span></div>
      <div class="banner" style="top:870px;font-size:46px" data-at="5" data-fx="pop">Works until one partner is used up ${ARR} <span class="gold">buffer capacity</span></div>`,
    update(c) {
      const b = c.b
      const pL = eio(c.seg(b[1].start + 0.4, b[1].start + 1.6))
      c.$('.x-mkL').style.left = `${120 + 405 - 18 - 470 * 0.5 * pL}px`
      const pR = eio(c.seg(b[3].start, b[3].start + 0.8))
      c.$('.x-mkR').style.left = `${990 + 405 - 18 - 30 * pR}px`
      const pr = eio(c.seg(b[2].start + 0.5, b[2].start + 1.4))
      c.$('.x-rt').style.width = `${300 - 36 * pr}px`
    },
  })

  // ---------- blood buffer ----------
  const HEX = [[0, 0], [60, 0], [-60, 0], [30, -52], [-30, -52], [30, 52], [-30, 52]]
  EZ.scene('blood', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Back to blood</div><h2 class="h1" data-at="in+0.2">The buffer in your blood</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">${HEX.map(([x, y]) => ball(520 + x, 420 + y, 27, 'pur')).join('')}${HEX.map(([x, y]) => ball(1400 + x, 420 + y, 27, 'teal')).join('')}</g>
        <g data-at="1@0.2" data-fx="fade"><line x1="1290" y1="390" x2="650" y2="390" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/>
          <text x="960" y="370" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">acid enters</text></g>
        <g data-at="2@0.2" data-fx="fade"><line x1="630" y1="450" x2="1270" y2="450" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text x="960" y="500" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">base enters</text></g>
        <g data-at="1" data-fx="fade"><g class="x-gh">${ball(0, 0, 18, 'gold')}</g></g>
        <g data-at="2" data-fx="fade"><g class="x-go">${ball(0, 0, 20, 'red')}</g></g>
      </svg>
      <div class="x-lab pri" style="left:370px;width:300px;top:500px" data-at="in+0.5" data-fx="fade">${H2CO3}<small>carbonic acid</small></div>
      <div class="x-lab teal" style="left:1250px;width:300px;top:500px" data-at="in+0.5" data-fx="fade">${HCO3}<small>hydrogen carbonate</small></div>
      <div class="card" style="left:120px;top:650px;width:810px;height:180px" data-at="1"><div class="x-say" style="top:28px;font-size:36px"><span class="warm">Acid enters:</span></div>
        <div class="x-say" style="top:90px;font-size:36px"><span class="teal">${HCO3}</span> converts it to <span class="pri">${H2CO3}</span></div></div>
      <div class="card" style="left:990px;top:650px;width:810px;height:180px" data-at="2"><div class="x-say" style="top:28px;font-size:36px"><span class="teal">Base enters:</span></div>
        <div class="x-say" style="top:90px;font-size:36px"><span class="pri">${H2CO3}</span> ${ARR} <span class="teal">${HCO3}</span> + ${H2O}</div></div>
      <div class="banner" style="top:870px;font-size:46px" data-at="3" data-out="4-0.35" data-fx="pop">Both in large amounts ${ARR} ratio changes <span class="gold">only slightly</span></div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">pH stays close to <span class="gold">7.4</span></div>`,
    update(c) {
      const b = c.b
      const p = eio(c.seg(b[1].start + 0.3, b[1].start + 1.6))
      mv(c, '.x-gh', lerp(1290, 1440, p), lerp(300, 380, p))
      c.$('.x-gh').style.opacity = 1 - c.seg(b[1].start + 1.6, b[1].start + 2.0)
      const q = eio(c.seg(b[2].start + 0.3, b[2].start + 1.6))
      mv(c, '.x-go', lerp(630, 480, q), lerp(300, 380, q))
      c.$('.x-go').style.opacity = 1 - c.seg(b[2].start + 1.6, b[2].start + 2.0)
    },
  })

  // ---------- ammonia / ammonium buffer meets HCl ----------
  EZ.scene('ammonia', {
    html: `<div class="kicker" data-at="in" data-fx="left">Weak base buffer</div><h2 class="h1" data-at="in+0.2">Same logic, other pair</h2>
      <div class="x-line" style="top:286px" data-at="1">Add a little <span class="warm">HCl</span> to an <span class="teal">${NH3}</span>/<span class="pri">${NH4}</span> buffer</div>
      <div class="card" style="left:120px;top:380px;width:810px;height:460px" data-at="0@0.3"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.5" data-fx="fade"><g transform="translate(360 610)"><g class="x-m1">${ball(0, 0, 70, 'teal')}</g><g class="x-m2" style="opacity:0">${ball(0, 0, 70, 'pur')}</g></g>${ball(700, 610, 70, 'pur')}</g>
        <circle class="x-ring" cx="360" cy="610" r="88" fill="none" stroke="${GOLD}" stroke-width="6" style="opacity:0"/>
        <g data-at="1@0.5" data-fx="fade"><g class="x-nh">${ball(0, 0, 24, 'gold')}</g></g>
        <text x="700" y="510" text-anchor="middle" font-size="30" font-weight="900" class="f-bad" data-at="4@0.2" data-fx="fade">can't catch more acid</text>
      </svg>
      <div class="x-lab teal x-l1" style="left:260px;width:200px;top:700px" data-at="0@0.5" data-fx="fade"><span class="x-l1a">${NH3}</span></div>
      <div class="x-lab pri x-l2" style="left:260px;width:200px;top:700px;opacity:0">${NH4}</div>
      <div class="x-lab pri" style="left:600px;width:200px;top:700px" data-at="0@0.5" data-fx="fade">${NH4}</div>
      <div class="card" style="left:990px;top:380px;width:810px;height:460px" data-at="2">
        <div class="x-row" style="top:60px">Reacts: <span class="teal">${NH3}</span>, the base member</div>
        <div class="x-row" style="top:170px" data-at="4">Not <span class="pri">${NH4}</span>: it is the <span class="bad">acid</span> member</div>
        <div class="x-row" style="top:280px" data-at="5">Added base ${ARR} caught by <span class="pri">${NH4}</span></div></div>
      <div class="x-eqn" data-at="3"><span class="teal">${NH3}</span>(aq) + <span class="warm">${H3O}</span>(aq) ${ARR} <span class="pri">${NH4}</span>(aq) + ${H2O}(l)</div>`,
    update(c) {
      const b = c.b
      const ring = c.seg(b[2].start + 0.2, b[2].start + 0.6) * (1 - c.seg(b[3].start + 1.4, b[3].start + 1.8))
      c.$('.x-ring').style.opacity = ring
      const p = eio(c.seg(b[3].start + 0.2, b[3].start + 1.2)), s = c.seg(b[3].start + 1.1, b[3].start + 1.5)
      mv(c, '.x-nh', lerp(360, 410, p), lerp(460, 552, p))
      c.$('.x-nh').style.opacity = 1 - c.seg(b[3].start + 1.3, b[3].start + 1.8)
      c.$('.x-m2').style.opacity = s; c.$('.x-m1').style.opacity = 1 - s
      c.$('.x-l2').style.opacity = s; c.$('.x-l1a').style.opacity = 1 - s
    },
  })

  // ---------- trick: two bodyguards ----------
  EZ.scene('trick', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trick</div><h2 class="h1" data-at="0">Two bodyguards</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"><h3 style="text-align:center">Buffer: <span class="pri">HA</span> + <span class="teal">${AM}</span></h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="pop">${ball(330, 620, 72, 'teal', sup('A', '−'), 54)}</g>
        <g data-at="1@0.45" data-fx="pop">${ball(720, 620, 72, 'pur', 'HA', 50)}</g>
        <g data-at="2" data-fx="fade"><g class="x-th">${ball(0, 0, 26, 'gold', sup('H', '+'), 22)}</g></g>
        <g data-at="3" data-fx="fade"><g class="x-to">${ball(0, 0, 30, 'red', sup('OH', '−'), 20)}</g></g>
        <g data-at="6@0.2" data-fx="pop">${ball(1395, 620, 72, 'gray', sup('Cl', '−'), 50)}</g>
        <g data-at="7" data-fx="fade"><g class="x-tx">${ball(0, 0, 26, 'gold', sup('H', '+'), 22)}</g></g>
      </svg>
      <div class="x-lab teal" style="left:180px;width:300px;top:720px;font-size:36px" data-at="2@0.6" data-fx="fade">catches ${HP}</div>
      <div class="x-lab pri" style="left:570px;width:300px;top:720px;font-size:36px" data-at="3@0.6" data-fx="fade">catches ${OH}</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="6"><h3 style="text-align:center">HCl + NaCl</h3>
        <div class="x-chip bad" style="left:250px;top:110px;background:rgba(240,112,122,.14)" data-at="6@0.6" data-fx="pop">NOT a buffer</div></div>
      <div class="x-lab bad" style="left:990px;width:810px;top:720px;font-size:36px" data-at="7@0.4" data-fx="fade">Cl<sup>−</sup>: far too weak a base</div>
      <div class="banner" style="top:870px;font-size:46px" data-at="4" data-out="5-0.35" data-fx="pop">Each guard catches <span class="gold">one kind</span> of intruder</div>
      <div class="banner" style="top:870px;font-size:46px" data-at="5" data-fx="pop">Both must be present in <span class="gold">large amounts</span></div>`,
    update(c) {
      const b = c.b
      const p = eio(c.seg(b[2].start + 0.1, b[2].start + 1.0))
      mv(c, '.x-th', lerp(180, 282, p), lerp(420, 556, p))
      const q = eio(c.seg(b[3].start + 0.1, b[3].start + 1.0))
      mv(c, '.x-to', lerp(880, 770, q), lerp(420, 552, q))
      const r = eio(c.seg(b[7].start + 0.1, b[7].start + 1.8))
      mv(c, '.x-tx', lerp(1060, 1740, r), 500 - 40 * Math.sin(Math.PI * r))
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'HCl + NaCl'], ['B', 'HNO<sub>3</sub> + KNO<sub>3</sub>'], ['C', 'HF + NaF'], ['D', 'NaOH + NaCl']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Which pair makes a <span class="teal">buffer</span>?</h2>
      ${OPTS.map(([l, f], i) => `<div class="x-tile x-t${i}" style="left:${120 + i * 430}px" data-at="1@${(0.25 + i * 0.18).toFixed(2)}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok" style="opacity:0">${CHECK}</div>` : ''}<div class="f">${f}</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="770" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="770" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 770)"/>
        <text class="x-num" x="960" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:660px" data-at="4" data-fx="pop"><span class="pri">HF</span> (weak acid) + <span class="teal">F<sup>−</sup></span> (its conjugate base) = a buffer</div>
      <div class="x-line" style="top:820px;font-size:38px;color:var(--muted)" data-at="5">A, B: strong acid + its salt &nbsp;·&nbsp; D: no weak acid at all</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${Array.from({ length: 10 }, (_, i) => { const x = 70 + (i % 5) * 80, y = 50 + Math.floor(i / 5) * 60; return (i + Math.floor(i / 5)) % 2 ? am(x, y, 1.1) : ha(x, y, 1.1) }).join('')}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${ball(110, 85, 40, 'teal', sup('A', '−'), 30)}${ball(160, 45, 18, 'gold')}${ball(340, 85, 40, 'pur', 'HA', 28)}${ball(392, 45, 20, 'red')}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150">${ball(160, 80, 44, 'gray', sup('Cl', '−'), 32)}${ball(300, 70, 20, 'gold')}<path d="M372 40l40 40M412 40l-40 40" stroke="${BAD}" stroke-width="9" stroke-linecap="round"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Buffer = large amounts of<br><span class="pri">weak acid</span> + <span class="teal">conj. base</span><br><span class="muted">(or weak base</span><br><span class="muted">+ conj. acid)</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="teal">Conj. base</span> neutralizes<br>added acid<br><br><span class="pri">Weak acid</span> neutralizes<br>added base</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Strong acid + its salt<br>is <span class="bad">NOT</span> a buffer<br><br><span class="muted">(like HCl + NaCl)</span></p></div>`,
  })
})()
