// Pictures for chem-8.6 "Structure & Acid Strength". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts). Molecules are
// schematic: atoms are drawn in the right size order (Cl < Br < I, F < Cl < Br < I), not to scale,
// and no shape or bond angle is implied.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-tag{position:absolute;height:64px;padding:0 30px;border-radius:32px;font-size:36px;font-weight:900;line-height:58px;border:3px solid;white-space:nowrap;text-align:center}
    .x-big{position:absolute;text-align:center;white-space:nowrap;font-weight:900}
    .x-nt{position:absolute;left:990px;width:810px;height:150px;border-radius:26px;background:rgba(36,40,56,.88);border:2px solid var(--line)}
    .x-nt svg{position:absolute;left:24px;top:25px} .x-nt b{position:absolute;left:150px;top:22px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-nt span{position:absolute;left:150px;top:84px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-row{position:absolute;left:120px;width:740px;height:96px;border-radius:22px;background:rgba(36,40,56,.8);border:3px solid var(--line);font-size:52px;font-weight:900;line-height:90px;white-space:nowrap}
    .x-row .fm{position:absolute;left:40px} .x-row .oc{position:absolute;right:34px;font-size:36px;color:var(--muted)}
    .x-cl{position:absolute;left:0;right:0;text-align:center;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-it{position:absolute;left:40px;right:30px;font-size:38px;font-weight:900;line-height:1.3;white-space:nowrap}
    .x-it small{display:block;font-size:32px;font-weight:800;color:var(--muted)}
    .x-tx{position:absolute;font-size:40px;font-weight:900;white-space:nowrap}
    .x-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .x-tile .f{margin-top:96px;font-size:72px;font-weight:900;line-height:1}
    .x-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .x-ans{left:120px;top:320px;width:1680px;height:470px;padding:34px 56px;font-size:50px;font-weight:700;line-height:1.5}
    .x-ans .lab{display:block;font-size:26px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:10px} .x-ans b{font-weight:900}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.32;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', BAD = '#f0707a', BOND = '#c9cee0'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const F = { ClO4: 'HClO<sub>4</sub>', ClO3: 'HClO<sub>3</sub>', ClO2: 'HClO<sub>2</sub>', ClO: 'HClO' }
  const bond = (x1, y1, x2, y2, w = 9, cls = '') => `<line ${cls ? `class="${cls}"` : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${BOND}" stroke-width="${w}" stroke-linecap="round" opacity=".8"/>`
  const cloud = (x, y, r, cls = '') => `<circle ${cls ? `class="${cls}"` : ''} cx="${x}" cy="${y}" r="${r}" fill="url(#g-cloud)"/>`

  // a chlorine oxyacid, schematic: Cl in the middle, n O around it, the H on the left O
  const DIRS = [[-1, 0], [0, -1], [1, 0], [0, 1]]
  const oxyPts = (cx, cy, n, s) => DIRS.slice(0, n).map(([dx, dy]) => [cx + dx * 95 * s, cy + dy * 95 * s])
  const oxy = (cx, cy, n, s = 1, o = {}) => {
    const O = oxyPts(cx, cy, n, s), hx = O[0][0] - 70 * s, hy = O[0][1] - 36 * s
    return `${O.map(([x, y]) => bond(cx, cy, x, y, 10 * s)).join('')}${bond(O[0][0], O[0][1], hx, hy, 9 * s, o.h ? o.h + 'b' : '')}
      ${o.clouds ? O.map(([x, y]) => cloud(x, y, 58 * s, o.clouds)).join('') : ''}
      ${O.map(([x, y]) => ball(x, y, 31 * s, 'red', 'O', 26 * s)).join('')}${ball(cx, cy, 40 * s, 'green', 'Cl', 30 * s)}
      <g ${o.h ? `class="${o.h}"` : ''}>${ball(hx, hy, 19 * s, 'gold', 'H', 18 * s)}</g>`
  }

  // a carboxylic acid, schematic: X3C–C(=O)–O–H, X = H or Cl; or R–C(=O)–O–H; or the carboxylate R–COO−
  const acid = (cx, cy, sub, o = {}) => {
    const c1 = [cx - 150, cy], c2 = [cx - 20, cy], od = [cx + 55, cy - 78], os = [cx + 62, cy + 58], h = [cx + 145, cy + 58]
    const subs = sub === 'R' ? [] : [[c1[0] - 80, c1[1]], [c1[0], c1[1] - 80], [c1[0], c1[1] + 80]]
    const big = sub === 'Cl', rs = big ? 34 : 20
    const anion = !!o.anion
    return `${subs.map(([x, y]) => bond(c1[0], c1[1], x, y)).join('')}${bond(c1[0], c1[1], c2[0], c2[1])}
      ${anion ? bond(c2[0], c2[1], od[0], od[1]) : `${bond(c2[0] - 7, c2[1] - 5, od[0] - 7, od[1] - 5, 7)}${bond(c2[0] + 7, c2[1] + 5, od[0] + 7, od[1] + 5, 7)}`}
      ${bond(c2[0], c2[1], os[0], os[1])}${anion ? '' : bond(os[0], os[1], h[0], h[1])}
      ${anion ? cloud(od[0], od[1], 62) + cloud(os[0], os[1], 62) : ''}
      ${subs.map(([x, y], i) => `<g class="${o.subCls ? o.subCls + i : ''}">${ball(x, y, rs, big ? 'green' : 'gold', big ? 'Cl' : 'H', big ? 26 : 18)}</g>`).join('')}
      ${sub === 'R' ? ball(c1[0], c1[1], 36, 'gray', 'R', 30) : ball(c1[0], c1[1], 32, 'gray', 'C', 26)}${ball(c2[0], c2[1], 32, 'gray', 'C', 26)}
      ${ball(od[0], od[1], 31, 'red', 'O', 26)}${ball(os[0], os[1], 31, 'red', 'O', 26)}${anion ? '' : ball(h[0], h[1], 19, 'gold', 'H', 18)}`
  }

  // ---------- intro: a faint row of chlorine oxyacids, one H gently tugging ----------
  const INX = [260, 500, 740, 980, 1220, 1460, 1700], INN = [1, 2, 3, 3, 2, 1, 2]
  EZ.intro = {
    chips: [['1@0.3', 'The big idea'], ['1@0.55', 'Three patterns'], ['1@0.82', 'One trap']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.26">${INX.map((x, i) => `<g>${oxy(x, 905, INN[i], 0.48, i === 3 ? { h: 'x-ih' } : {})}</g>`).join('')}</svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 1.1)
      c.$('.x-ih').setAttribute('transform', `translate(${lerp(0, -22, p)} ${lerp(0, -12, p)})`)
    },
  }

  // ---------- hook: same atoms, different numbers of O ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Same atoms?</div><h2 class="h1" data-at="in+0.2">One strong, one weak</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:520px" data-at="0@0.3"><h3 style="text-align:center">${F.ClO4}</h3></div>
      <div class="card" style="left:1020px;top:300px;width:780px;height:520px" data-at="0@0.75"><h3 style="text-align:center">${F.ClO}</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.4" data-fx="fade">${oxy(530, 575, 4, 1.05)}</g>
        <g data-at="0@0.85" data-fx="fade">${oxy(1500, 575, 1, 1.05)}</g>
        <g data-at="1@0.3" data-fx="fade"><text x="760" y="420" text-anchor="middle" font-size="40" font-weight="900" class="f-gold">4 O</text><text x="1700" y="420" text-anchor="middle" font-size="40" font-weight="900" class="f-gold">1 O</text></g>
      </svg>
      <div class="x-tag teal" style="left:385px;top:730px;width:250px;border-color:var(--accent);background:rgba(60,199,188,.14)" data-at="2@0.2" data-fx="pop">strong acid</div>
      <div class="x-tag muted" style="left:1285px;top:730px;width:250px;border-color:var(--muted);background:rgba(163,171,189,.12)" data-at="2@0.7" data-fx="pop">weak acid</div>
      <div class="x-big gold" style="left:900px;width:120px;top:470px;font-size:130px" data-at="3" data-fx="pop">?</div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">The secret: how <span class="gold">stable the conjugate base</span> is</div>`,
  })

  // ---------- the big idea: HA -> H+ + A-, and what makes A- stable ----------
  const AP0 = [430, 590], HP0 = [430 + 64, 590 - 50], HP1 = [780, 420]
  const icon1 = `<svg width="100" height="100" viewBox="-50 -50 100 100">${ball(0, 0, 34, 'teal', sup('A', '−'), 26)}<circle r="44" fill="none" stroke="${GOLD}" stroke-width="5"/></svg>`
  const icon2 = `<svg width="100" height="100" viewBox="-50 -50 100 100">${bond(-30, 0, 30, 0)}${ball(-30, 0, 20, 'red', 'O', 17)}${ball(30, 0, 14, 'gold', 'H', 13)}<path d="M8 -26 H-40" stroke="${WARM}" stroke-width="6" marker-end="url(#mk-warm)"/></svg>`
  const icon3 = `<svg width="100" height="100" viewBox="-50 -50 100 100">${cloud(-22, 0, 34)}${cloud(22, 0, 34)}${ball(-22, 0, 18, 'red', 'O', 15)}${ball(22, 0, 18, 'red', 'O', 15)}</svg>`
  EZ.scene('idea', {
    html: `<div class="kicker" data-at="in" data-fx="left">The big idea</div><h2 class="h1" data-at="0">A stable conjugate base</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:520px" data-at="1"><h3 style="text-align:center"><span class="x-n1">HA</span><span class="x-n2" style="opacity:0"> ${ARR} H<sup>+</sup> + A<sup>−</sup></span></h3></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1+0.2" data-fx="fade">
        <g transform="translate(${AP0[0]} ${AP0[1]})"><circle class="x-glow" r="120" fill="url(#g-cloud)" style="opacity:0"/><g class="x-a1">${ball(0, 0, 76, 'pur', 'A', 56)}</g><g class="x-a2" style="opacity:0">${ball(0, 0, 76, 'teal', sup('A', '−'), 56)}</g></g>
        <g class="x-hp">${ball(0, 0, 32, 'gold', 'H', 28)}</g>
      </g>
        <text x="${AP0[0]}" y="760" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="1@0.75" data-fx="fade">conjugate base</text>
        <text x="${HP1[0]}" y="${HP1[1] + 80}" text-anchor="middle" font-size="34" font-weight="900" class="f-gold" data-at="1@0.75" data-fx="fade">proton</text>
        <text x="${AP0[0]}" y="462" text-anchor="middle" font-size="32" font-weight="900" class="f-gold" data-at="2@0.4" data-fx="fade">stable, "happy" charge</text>
      </svg>
      <div class="x-nt" style="top:300px" data-at="5" data-fx="right">${icon1}<b class="pri">Electronegativity</b><span>holds the negative charge well</span></div>
      <div class="x-nt" style="top:470px" data-at="6" data-fx="right">${icon2}<b class="warm">Inductive effect</b><span>nearby atoms pull density from O–H</span></div>
      <div class="x-nt" style="top:640px" data-at="7" data-fx="right">${icon3}<b class="teal">Resonance</b><span>charge spreads over several atoms</span></div>
      <div class="x-big muted" style="left:990px;width:810px;top:520px;font-size:44px" data-at="4" data-out="5" data-fx="fade">Three things stabilize A<sup>−</sup></div>
      <div class="banner" style="top:870px" data-at="3" data-out="8" data-fx="pop">More stable conjugate base ${ARR} <span class="gold">stronger acid</span></div>
      <div class="banner" style="top:870px;font-size:46px" data-at="8" data-fx="pop">Strong acids ${ARR} very weak conjugate bases: <span class="teal">Cl<sup>−</sup>, NO<sub>3</sub><sup>−</sup>, ClO<sub>4</sub><sup>−</sup></span></div>`,
    update(c) {
      const b = c.b, d1 = b[1].end - b[1].start, s = eio(c.seg(b[1].start + 0.45 * d1, b[1].start + 0.45 * d1 + 0.9))
      const x = lerp(HP0[0], HP1[0], s), y = lerp(HP0[1], HP1[1], s) - 60 * Math.sin(Math.PI * s)
      c.$('.x-hp').setAttribute('transform', `translate(${x} ${y})`)
      c.$('.x-a2').style.opacity = s; c.$('.x-a1').style.opacity = 1 - s
      c.$('.x-n2').style.opacity = s
      c.$('.x-glow').style.opacity = eo(c.seg(b[2].start + 0.2, b[2].start + 1.2))
    },
  })

  // ---------- pattern 1: more O atoms ----------
  const OXC = [1400, 590], OXS = 1.1
  const oxArrows = oxyPts(OXC[0], OXC[1], 4, OXS).slice(1).map(([x, y], i) => {
    const [dx, dy] = DIRS[i + 1], px = -dy * 34, py = dx * 34
    return `<line x1="${OXC[0] + dx * 30 + px}" y1="${OXC[1] + dy * 30 + py}" x2="${x - dx * 34 + px}" y2="${y - dy * 34 + py}" stroke="${WARM}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-warm)"/>`
  }).join('')
  EZ.scene('oxy', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Pattern 1</div><h2 class="h1" data-at="0">More oxygen atoms</h2>
      ${[[F.ClO4, 4], [F.ClO3, 3], [F.ClO2, 2], [F.ClO, 1]].map(([f, n], i) => `<div class="x-row x-r${i}" style="top:${330 + i * 120}px" data-at="1@${(0.3 + i * 0.16).toFixed(2)}" data-fx="left"><span class="fm">${f}</span><span class="oc">${n} O</span></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade"><line x1="905" y1="780" x2="905" y2="345" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text transform="translate(955 562) rotate(-90)" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">stronger</text></g>
      </svg>
      <div class="card" style="left:1010px;top:300px;width:790px;height:540px" data-at="3-0.3"><h3 style="text-align:center"><span class="x-o1">Inside ${F.ClO4}</span><span class="x-o2" style="position:absolute;left:0;right:0;opacity:0">The anion: ClO<sub>4</sub><sup>−</sup></span></h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3-0.2" data-fx="fade">${oxy(OXC[0], OXC[1], 4, OXS, { h: 'x-oh', clouds: 'x-ocl' })}</g>
        <g data-at="3@0.35" data-out="4" data-fx="fade">${oxArrows}</g>
        <text x="1405" y="808" text-anchor="middle" font-size="32" font-weight="900" class="f-warm" data-at="3@0.4" data-out="4" data-fx="fade">extra O atoms pull electron density</text>
        <text x="1405" y="808" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="4@0.5" data-fx="fade">resonance: charge spread over the O atoms</text>
      </svg>
      <div class="banner" style="top:880px" data-at="5" data-fx="pop">More O ${ARR} <span class="gold">stronger acid</span></div>`,
    update(c) {
      const b = c.b, s = eio(c.seg(b[4].start, b[4].start + 0.9))
      c.$('.x-oh').setAttribute('transform', `translate(${-150 * s} ${-110 * s})`)
      c.$('.x-oh').style.opacity = 1 - 0.75 * s
      c.$('.x-ohb').style.opacity = 0.8 * (1 - s)
      c.root.querySelectorAll('.x-ocl').forEach((e) => (e.style.opacity = eo(c.seg(b[4].start + 0.6, b[4].start + 1.6))))
      c.$('.x-o2').style.opacity = s; c.$('.x-o1').style.opacity = 1 - s
      const w = eo(c.seg(b[2].start + 0.2, b[2].start + 0.7)), el = c.$('.x-r0')
      el.style.borderColor = w ? `rgba(242,196,67,${w})` : ''
      el.style.boxShadow = `0 0 ${46 * w}px rgba(242,196,67,${0.4 * w})`
    },
  })

  // ---------- pattern 2: more electronegative central atom ----------
  const HAL = [['HOCl', 'Cl', 'green', 38, 12], ['HOBr', 'Br', 'warm', 46, 8], ['HOI', 'I', 'pur', 54, 4]]
  EZ.scene('central', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Pattern 2</div><h2 class="h1" data-at="0">A more electronegative central atom</h2>
      ${HAL.map(([f], i) => `<div class="card" style="left:${120 + i * 580}px;top:300px;width:520px;height:460px" data-at="1@${(0.25 + i * 0.25).toFixed(2)}"><h3 style="text-align:center">${f}</h3></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080">
        ${HAL.map(([, x, g, r], i) => { const cx = 380 + i * 580, cy = 560, ox = cx - 60, xx = ox + 60 + r
          return `<g data-at="1@${(0.3 + i * 0.25).toFixed(2)}" data-fx="fade">${bond(cx - 150, cy, ox, cy)}${bond(ox, cy, xx, cy)}${ball(cx - 150, cy, 22, 'gold', 'H', 20)}${ball(ox, cy, 34, 'red', 'O', 28)}${ball(xx, cy, r, g, x, Math.min(34, r * 0.8))}</g>` }).join('')}
        ${HAL.map(([, , , , w], i) => { const cx = 380 + i * 580
          return `<g data-at="3@${(0.2 + i * 0.1).toFixed(2)}" data-fx="fade"><line x1="${cx - 150}" y1="480" x2="${cx + 30}" y2="480" stroke="${WARM}" stroke-width="${w}" stroke-linecap="round" marker-end="url(#mk-warm)"/></g>` }).join('')}
        <text x="380" y="438" text-anchor="middle" font-size="28" font-weight="900" class="f-warm" data-at="3@0.2" data-fx="fade">strongest pull on O–H</text>
      </svg>
      <div class="x-tag gold" style="left:150px;top:660px;width:460px;border-color:var(--gold);background:rgba(242,196,67,.12)" data-at="2@0.5" data-fx="pop">most electronegative</div>
      <div class="banner" style="top:830px" data-at="4" data-fx="pop"><span class="gold">HOCl</span> &gt; HOBr &gt; HOI &nbsp;<span class="muted" style="font-size:40px">(strongest to weakest)</span></div>`,
  })

  // ---------- trap: binary acids down a group ----------
  const HX = [['HF', 'F', 'teal', 28, 66], ['HCl', 'Cl', 'green', 36, 86], ['HBr', 'Br', 'warm', 42, 102], ['HI', 'I', 'pur', 48, 118]]
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="0">Binary acids down a group</h2>
      <div class="card" style="left:120px;top:300px;width:880px;height:540px" data-at="0@0.5"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        ${HX.map(([f, x, g, r, d], i) => { const y = 380 + i * 122
          return `<g data-at="0@${(0.55 + i * 0.1).toFixed(2)}" data-fx="fade"><text x="220" y="${y + 15}" text-anchor="middle" font-size="44" font-weight="900">${f}</text>
            ${bond(360, y, 360 + d, y)}${ball(360, y, 20, 'gold', 'H', 18)}${ball(360 + d, y, r, g, x, Math.min(30, r * 0.8))}</g>
            <g data-at="4@${(0.3 + i * 0.08).toFixed(2)}" data-fx="fade"><line x1="360" y1="${y + 54}" x2="${360 + d}" y2="${y + 54}" stroke="${WARM}" stroke-width="5" stroke-linecap="round"/><line x1="360" y1="${y + 46}" x2="360" y2="${y + 62}" stroke="${WARM}" stroke-width="5"/><line x1="${360 + d}" y1="${y + 46}" x2="${360 + d}" y2="${y + 62}" stroke="${WARM}" stroke-width="5"/></g>` }).join('')}
        <g data-at="2@0.3" data-fx="fade"><line x1="640" y1="365" x2="640" y2="770" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <text x="680" y="580" font-size="36" font-weight="900" class="f-teal">stronger acid</text></g>
        <text x="680" y="790" font-size="28" font-weight="900" class="f-warm" data-at="4@0.6" data-fx="fade">longer bond</text>
      </svg>
      <div class="card" style="left:1060px;top:300px;width:740px;height:540px" data-at="1">
        <div class="x-it" style="top:40px">Electronegativity: <span class="bad">not the winner</span><small>F is most electronegative, yet HF is weakest</small></div>
        <div class="x-it gold" style="top:190px" data-at="3">Bond strength and size win</div>
        <div class="x-it" style="top:280px" data-at="4"><span class="warm">Larger atom</span><small>longer, weaker bond: H<sup>+</sup> leaves easily</small></div>
        <div class="x-it" style="top:410px" data-at="5"><span class="teal">Larger anion</span><small>charge spread over a greater volume</small></div></div>
      <div class="banner" style="top:880px" data-at="2" data-fx="pop">HF &lt; HCl &lt; HBr &lt; <span class="gold">HI</span></div>`,
  })

  // ---------- pattern 3: electronegative substituents; carboxylic acids ----------
  EZ.scene('inductive', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Pattern 3</div><h2 class="h1" data-at="0">Electronegative substituents</h2>
      <div data-at="in" data-out="6" data-fx="fade">
        <div class="card" style="left:120px;top:300px;width:820px;height:500px" data-at="1@0.1"><h3 style="text-align:center">Acetic acid · CH<sub>3</sub>COOH</h3></div>
        <div class="card" style="left:980px;top:300px;width:820px;height:500px" data-at="1@0.5"><h3 style="text-align:center">Trichloroacetic acid · CCl<sub>3</sub>COOH</h3></div>
        <svg class="full" viewBox="0 0 1920 1080">
          <g data-at="1@0.2" data-fx="fade">${acid(530, 590, 'H')}</g>
          <g data-at="1@0.6" data-fx="fade">${acid(1390, 590, 'Cl')}</g>
          ${[[1160, 590], [1240, 510], [1240, 670]].map(([x, y], i) => `<circle class="x-ring${i}" cx="${x}" cy="${y}" r="48" fill="none" stroke="${GOLD}" stroke-width="5" style="opacity:0"/>`).join('')}
          <text x="1240" y="440" text-anchor="middle" font-size="30" font-weight="900" class="f-gold" data-at="2@0.5" data-fx="fade">3 H swapped for 3 Cl</text>
          <g data-at="3@0.2" data-fx="fade"><line x1="1450" y1="722" x2="1290" y2="722" stroke="${WARM}" stroke-width="8" stroke-linecap="round" marker-end="url(#mk-warm)"/>
            <text x="1390" y="770" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">electron density pulled away</text></g>
        </svg>
        <div class="banner" style="top:850px" data-at="3@0.6" data-out="5" data-fx="pop"><span class="warm">Inductive effect</span> ${ARR} CCl<sub>3</sub>COOH is <span class="gold" data-at="4" data-fx="fade">much stronger</span></div>
        <div class="banner" style="top:850px;font-size:46px" data-at="5" data-fx="pop">Farther from the –COOH group ${ARR} <span class="muted">smaller effect</span></div>
      </div>
      <div class="card" style="left:120px;top:300px;width:820px;height:500px" data-at="6"><h3 style="text-align:center">Carboxylic acids · R–COOH</h3></div>
      <div class="card" style="left:980px;top:300px;width:820px;height:500px" data-at="7"><h3 style="text-align:center">Carboxylate ion · R–COO<sup>−</sup></h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="6@0.1" data-fx="fade">${acid(560, 570, 'R')}</g>
        <g data-at="7@0.1" data-fx="fade">${acid(1420, 570, 'R', { anion: true })}</g>
        <text x="530" y="750" text-anchor="middle" font-size="36" font-weight="900" class="f-warm" data-at="6@0.4" data-fx="fade">a common class of weak acid</text>
        <text x="1390" y="750" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="7@0.5" data-fx="fade">resonance: charge shared by both O</text>
      </svg>`,
    update(c) {
      const b = c.b, t = c.t - b[2].start, p = c.seg(b[2].start, b[2].start + 2.2)
      const o = p > 0 && p < 1 ? 0.5 + 0.5 * Math.sin(t * 6) : 0
      for (let i = 0; i < 3; i++) c.$('.x-ring' + i).style.opacity = o
    },
  })

  // ---------- common bases ----------
  const nh3 = (x, y, s = 1) => `${[[-58, 46], [0, 66], [58, 46]].map(([dx, dy]) => bond(x, y, x + dx * s, y + dy * s, 9 * s)).join('')}
    ${[[-58, 46], [0, 66], [58, 46]].map(([dx, dy]) => ball(x + dx * s, y + dy * s, 20 * s, 'gold', 'H', 18 * s)).join('')}${ball(x, y, 40 * s, 'pur', 'N', 32 * s)}
    <circle cx="${x - 11 * s}" cy="${y - 56 * s}" r="${7 * s}" fill="${GOLD}"/><circle cx="${x + 11 * s}" cy="${y - 56 * s}" r="${7 * s}" fill="${GOLD}"/>`
  EZ.scene('bases', {
    html: `<div class="kicker" data-at="in" data-fx="left">Common bases</div><h2 class="h1" data-at="0">Strong and weak bases</h2>
      <div class="card" style="left:120px;top:300px;width:820px;height:540px" data-at="1"><h3 class="warm" style="text-align:center">Strong</h3>
        <div class="x-cl" style="top:95px;font-size:40px;color:var(--text);font-weight:900">Group 1 hydroxides</div><div class="x-cl" style="top:150px;font-size:34px;color:var(--text);font-weight:700">and Group 2 like Ca(OH)<sub>2</sub>, Ba(OH)<sub>2</sub></div>
        <div class="x-cl" style="top:420px;font-size:36px" data-at="2">conjugate acid: H<sub>2</sub>O, <span class="warm">very weak</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1@0.4" data-fx="fade">${bond(500, 610, 590, 610)}${ball(500, 610, 46, 'red', 'O', 38)}${ball(590, 610, 26, 'gold', 'H', 22)}
        <text x="400" y="624" text-anchor="end" font-size="40" font-weight="900">OH<tspan dy="-.5em" font-size=".62em">−</tspan></text></g></svg>
      <div class="card" style="left:980px;top:300px;width:820px;height:540px" data-at="3"><h3 class="teal" style="text-align:center">Weak</h3>
        <div class="x-tx" style="left:270px;top:120px" data-at="3@0.3">ammonia, NH<sub>3</sub></div>
        <div class="x-tx" style="left:270px;top:185px" data-at="3@0.75">amines, CH<sub>3</sub>NH<sub>2</sub></div>
        <div class="x-tx muted" style="left:270px;top:255px;font-size:32px" data-at="3@0.5">lone pair on N</div>
        <div style="position:absolute;left:40px;right:40px;top:340px;height:2px;background:var(--line)" data-at="4" data-fx="fade"></div>
        <div class="x-cl" style="top:370px;font-size:42px;color:var(--text);font-weight:900" data-at="4">carboxylate ions, CH<sub>3</sub>COO<sup>−</sup></div>
        <div class="x-cl" style="top:440px;font-size:34px" data-at="4@0.5">like acetate</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3@0.2" data-fx="fade">${nh3(1120, 500)}</g></svg>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'HOI'], ['B', 'HOBr'], ['C', 'HOCl'], ['D', '<span style="font-size:46px">All are equal</span>']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Which is the <span class="teal">strongest</span> acid?</h2>
      ${OPTS.map(([l, f], i) => `<div class="x-tile x-t${i}" style="left:${120 + i * 430}px" data-at="1@${(0.35 + i * 0.12).toFixed(2)}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok" style="opacity:0">${CHECK}</div>` : ''}<div class="f">${f}</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="820" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="x-num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:760px;font-size:46px" data-at="4" data-fx="pop">Cl is most electronegative ${ARR} <span class="teal">most stable conjugate base</span></div>`,
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

  // ---------- free-response tip ----------
  EZ.scene('frq', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="1">Explain through the <span class="teal">conjugate base</span></h2>
      <div class="card x-ans" data-at="2-0.2"><span class="lab">Model answer</span>
        <span data-at="2@0.05" data-fx="fade">The additional <b class="pri">electronegative oxygen atoms</b> in HClO<sub>3</sub></span>
        <span data-at="2@0.6" data-fx="fade"> <b class="warm">withdraw electron density</b></span>
        <span data-at="3" data-fx="fade"> and <b class="teal">delocalize the negative charge</b> on ClO<sub>3</sub><sup>−</sup> through resonance,</span>
        <span data-at="4" data-fx="fade"> stabilizing the conjugate base, so <b class="gold">HClO<sub>3</sub> is a stronger acid</b> than HClO<sub>2</sub>.</span></div>
      <div class="banner" style="top:850px;font-size:44px" data-at="4@0.7" data-fx="pop">structure ${ARR} stable conjugate base ${ARR} <span class="gold">stronger acid</span></div>`,
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${cloud(230, 75, 74)}${ball(230, 75, 50, 'teal', sup('A', '−'), 38)}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${oxy(240, 98, 3, 0.62)}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150">${nh3(230, 70, 0.95)}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>A more stable<br>conjugate base<br>means a<br><span class="gold">stronger acid</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>More O atoms,<br>a more electronegative<br>central atom, and<br>electronegative<br>substituents ${ARR} <span class="gold">stronger</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Carboxylic acids:<br><span class="warm">weak acids</span><br>Ammonia, amines,<br>carboxylates:<br><span class="teal">weak bases</span></p></div>`,
  })
  void clamp; void BAD
})()
