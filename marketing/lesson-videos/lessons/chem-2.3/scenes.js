// Pictures for chem-2.3 "Structure of Ionic Solids". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u2.ts); the lattice is the lesson's
// 2-D "ionic-lattice" diagram. Ion sizes are in the right order but not to exact scale.
(() => {
  const { clamp, eio, eo, back, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .nt{position:absolute;left:960px;width:840px;padding:22px 30px 24px 116px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .nt small{position:absolute;left:30px;top:50%;margin-top:-31px;width:62px;height:62px;border-radius:50%;background:var(--brand);font-size:36px;font-weight:900;line-height:62px;text-align:center}
    .nt b{display:block;font-size:42px;font-weight:900;line-height:1.15} .nt span{display:block;margin-top:6px;font-size:31px;font-weight:700;line-height:1.3;color:var(--muted)}
    .bn{position:absolute;left:1340px;width:460px;height:116px;padding:16px 26px 0;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .bn b{display:block;font-size:34px;font-weight:900;line-height:1.2} .bn span{display:block;margin-top:4px;font-size:27px;font-weight:700;color:var(--muted);white-space:nowrap}
    .why{left:1120px;top:400px;width:680px;height:400px;padding:36px 48px;font-size:54px;font-weight:800;line-height:1.3}
    .why .lab{display:block;font-size:28px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
    .ft{position:absolute;left:0;right:0;bottom:30px;text-align:center;font-size:35px;font-weight:800;white-space:nowrap}
    .col{top:340px;width:540px;height:450px} .col3{top:320px;width:540px;height:540px}
    .opt{position:absolute;left:120px;width:1680px;height:100px;padding-left:112px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:35px;font-weight:800;white-space:nowrap}
    .opt .l{position:absolute;left:26px;top:20px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:24px;top:16px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const isCat = (r, k) => (r + k) % 2 === 0
  // one ion: small warm cation (+) or larger teal anion (−)
  const ion = (x, y, cat, rc, ra, label) => ball(x, y, cat ? rc : ra, cat ? 'warm' : 'teal', label ?? (cat ? '+' : '−'), label ? Math.max((cat ? rc : ra) * 0.66, 25) : (cat ? rc : ra) * 1.15)
  // a checkerboard slice of the lattice; wrap(r, k, ballHtml) lets a scene tag each ion
  const grid = (cols, rows, x0, y0, pitch, rc, ra, wrap = (r, k, h) => h, flip = 0) => {
    let h = ''
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) h += wrap(r, k, ion(x0 + k * pitch, y0 + r * pitch, isCat(r + flip, k), rc, ra))
    return h
  }

  // ---------- intro artwork: a faint lattice on either side of the title (all above y = 950) ----------
  EZ.intro = {
    chips: [['1@0.28', 'How ions are arranged'], ['1@0.52', 'Why crystals crack'], ['1@0.76', 'When they conduct']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${grid(2, 7, 70, 250, 100, 26, 42)}${grid(2, 7, 1750, 250, 100, 26, 42)}</svg>`,
  }

  // ---------- hook: salt cubes under a magnifying glass ----------
  const cube = (cx, cy, s) => { const w = 0.87 * s, p = (a) => a.map((q) => q.join(',')).join(' ')
    return `<polygon points="${p([[cx, cy - s], [cx + w, cy - s / 2], [cx, cy], [cx - w, cy - s / 2]])}" fill="#f4f6fb"/><polygon points="${p([[cx - w, cy - s / 2], [cx, cy], [cx, cy + s], [cx - w, cy + s / 2]])}" fill="#b4bbcd"/><polygon points="${p([[cx + w, cy - s / 2], [cx, cy], [cx, cy + s], [cx + w, cy + s / 2]])}" fill="#7f88a2"/>` }
  const GRAINS = [[70, 470, 11], [112, 492, 13], [150, 462, 10], [196, 486, 13], [240, 470, 11], [284, 494, 12], [330, 468, 13], [372, 490, 10], [418, 472, 12], [462, 494, 13], [508, 466, 11], [552, 488, 12], [598, 472, 13], [640, 494, 10], [684, 470, 12], [90, 440, 9], [224, 440, 10], [440, 444, 9], [620, 442, 10]]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Look closer</div><h2 class="h1" data-at="0">Why is salt made of tiny cubes?</h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:540px" data-at="0@0.2">
        <svg style="position:absolute;left:0;top:0" width="760" height="540" viewBox="0 0 760 540">
          ${GRAINS.map(([x, y, s]) => cube(x, y, s)).join('')}
          <g data-at="0@0.55" data-fx="pop"><line x1="372" y1="342" x2="520" y2="420" stroke="#8088a0" stroke-width="30" stroke-linecap="round"/>
            <circle cx="240" cy="225" r="178" fill="#161927" stroke="#c9cee0" stroke-width="13"/><circle cx="240" cy="225" r="178" fill="rgba(141,141,240,.12)"/></g>
          <g data-at="1" data-fx="pop">${cube(170, 190, 62)}${cube(310, 230, 54)}${cube(210, 316, 46)}</g>
          <text x="478" y="150" font-size="46" font-weight="900" class="f-warm" data-at="1@0.4" data-fx="fade">tiny cubes</text>
        </svg></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2" data-fx="fade"><line x1="904" y1="590" x2="1000" y2="590" stroke="#8d8df0" stroke-width="12" marker-end="url(#mk-pri)"/></g></svg>
      <div class="card" style="left:1040px;top:320px;width:760px;height:540px" data-at="2"><h3>How the ions stack</h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="540" viewBox="0 0 760 540">
          ${grid(6, 4, 120, 160, 104, 26, 42, (r, k, h) => `<g class="tb i" data-d="${r + k}">${h}</g>`)}</svg></div>
      <div class="banner" style="top:896px" data-at="3" data-fx="pop">One pattern, repeated <span class="teal">trillions</span> of times</div>`,
    update(c) {
      const t0 = c.b[2].start + 0.35
      for (const g of all(c, '.i')) { const p = clamp((c.t - t0 - +g.dataset.d * 0.14) / 0.4); g.style.opacity = Math.min(1, p * 2.5); g.style.transform = `scale(${0.6 + 0.4 * back(p)})` }
    },
  })

  // ---------- the lattice: a 3-D checkerboard ----------
  const LX = 200, LY = 350, LP = 116, CR = 2, CK = 2 // the highlighted cation sits at row 2, column 2
  const role = (r, k) => { const dr = Math.abs(r - CR), dk = Math.abs(k - CK); return dr + dk === 0 ? 'c' : dr + dk === 1 ? 'n' : dr === 1 && dk === 1 ? 'd' : 'o' }
  const NB = [[0, -1], [0, 1], [-1, 0], [1, 0]], DG = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
  const px = (k) => LX + k * LP, py = (r) => LY + r * LP
  EZ.scene('lattice', {
    html: `<div class="kicker" data-at="in" data-fx="left">The lattice</div><h2 class="h1" data-at="0">A 3-D checkerboard</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        ${grid(6, 5, LX, LY, LP, 32, 52, (r, k, h) => `<g class="tb i" data-d="${r + k}" data-role="${role(r, k)}">${h}</g>`)}
        <g data-at="4" data-out="5@0.3" data-fx="fade">${ion(px(CK), py(CR), true, 32, 52, sup('Na', '+'))}${NB.map(([a, b]) => ion(px(CK + b), py(CR + a), false, 32, 52, sup('Cl', '−'))).join('')}</g>
        <g class="ra"><circle cx="${px(CK)}" cy="${py(CR)}" r="40" fill="none" stroke="#fff" stroke-width="6"/>${NB.map(([a, b]) => `<circle cx="${px(CK + b)}" cy="${py(CR + a)}" r="58" fill="none" stroke="#3cc7bc" stroke-width="6"/>`).join('')}</g>
        <g class="rb"><circle cx="${px(CK)}" cy="${py(CR)}" r="40" fill="none" stroke="#f0707a" stroke-width="6"/>${DG.map(([a, b]) => `<circle cx="${px(CK + b)}" cy="${py(CR + a)}" r="40" fill="none" stroke="#f0707a" stroke-width="6"/>
          <line x1="${px(CK) + b * 40}" y1="${py(CR) + a * 40}" x2="${px(CK + b) - b * 40}" y2="${py(CR + a) - a * 40}" stroke="#f0707a" stroke-width="6" stroke-dasharray="10 9"/>`).join('')}</g>
      </svg>
      <div style="position:absolute;left:148px;top:896px;width:690px;text-align:center;font-size:36px;font-weight:800" data-at="4" data-out="5@0.3" data-fx="fade">In solid NaCl: Cl<sup>−</sup> all around each Na<sup>+</sup></div>
      <div style="position:absolute;left:148px;top:896px;width:690px;text-align:center;font-size:36px;font-weight:800" class="bad" data-at="5@0.5" data-fx="fade">same charge: kept apart</div>
      <div class="nt" style="top:330px;padding-left:36px" data-at="1@0.25" data-fx="right"><b class="pri">Lattice</b><span>a systematic, repeating 3-D pattern<br>of cations and anions</span></div>
      <div class="nt" style="top:548px" data-at="3" data-fx="right"><small>1</small><b class="teal">Maximizes attractions</b><span>each ion is surrounded by opposite charges</span></div>
      <div class="nt" style="top:716px" data-at="5" data-fx="right"><small>2</small><b class="bad">Minimizes repulsions</b><span>ions with the same charge are kept apart</span></div>`,
    update(c) {
      const t0 = c.b[0].start + 0.3, A = c.p('3@0.4', 0.5), B = c.p('5@0.4', 0.5), pulse = 0.75 + 0.25 * Math.sin(c.t * 5)
      for (const g of all(c, '.i')) {
        const p = clamp((c.t - t0 - +g.dataset.d * 0.16) / 0.4), ro = g.dataset.role
        const dim = ro === 'c' ? 0 : ro === 'n' ? B : ro === 'd' ? A * (1 - B) : Math.max(A, B)
        g.style.opacity = Math.min(1, p * 2.5) * (1 - 0.68 * dim); g.style.transform = `scale(${0.6 + 0.4 * back(p)})`
      }
      c.$('.ra').style.opacity = A * (1 - B) * pulse; c.$('.rb').style.opacity = B * pulse
    },
  })

  // ---------- property 1: high melting point ----------
  const MX = 200, MY = 400, MP = 130
  const links = () => { let h = ''
    for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) {
      if (k < 6) h += `<line x1="${MX + k * MP}" y1="${MY + r * MP}" x2="${MX + (k + 1) * MP}" y2="${MY + r * MP}"/>`
      if (r < 3) h += `<line x1="${MX + k * MP}" y1="${MY + r * MP}" x2="${MX + k * MP}" y2="${MY + (r + 1) * MP}"/>`
    }
    return h }
  EZ.scene('melt', {
    html: `<div class="kicker" data-at="in" data-fx="left">Structure explains properties</div><h2 class="h1" data-at="1">Property 1: <span class="warm">high melting point</span></h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g class="lk" stroke="#3cc7bc" stroke-width="14" stroke-linecap="round">${links()}</g>
        <g data-at="in" data-fx="fade">${grid(7, 4, MX, MY, MP, 30, 48, (r, k, h) => `<g class="j" data-i="${r * 7 + k}">${h}</g>`)}</g>
        <g data-at="1@0.45" data-fx="fade">${[0, 1, 2, 3, 4, 5].map((i) => `<line class="ha" x1="${MX + 65 + i * MP}" x2="${MX + 65 + i * MP}" y1="968" y2="906" stroke="#f3a764" stroke-width="11" marker-end="url(#mk-warm)"/>`).join('')}
          <text x="1050" y="952" font-size="40" font-weight="900" class="f-warm">heat</text></g>
      </svg>
      <div class="card why" data-at="2" data-fx="right"><span class="lab">Why?</span><span class="teal" style="font-weight:900">Strong attractions</span><br>throughout the<br>whole lattice</div>`,
    update(c) {
      const heat = c.p('1@0.45', 0.8), L = c.p('2@0.15', 0.6)
      c.$('.lk').style.opacity = L * (0.55 + 0.3 * Math.sin(c.t * 4))
      for (const g of all(c, '.j')) { const i = +g.dataset.i; g.setAttribute('transform', `translate(${(2.5 * heat * Math.sin(c.t * 13 + i * 1.7)).toFixed(2)} ${(2.5 * heat * Math.cos(c.t * 11 + i * 2.3)).toFixed(2)})`) }
      all(c, '.ha').forEach((l, i) => { const d = 7 * Math.sin(c.t * 5 + i); l.setAttribute('y1', 968 + d); l.setAttribute('y2', 906 + d) })
    },
  })

  // ---------- property 2: hard but brittle ----------
  const BX = 420, BY = 420, BP = 104, bcr = 26, bar = 42
  const half = (r0, ringRow, k0, k1) => { let h = ''
    for (let r = r0; r < r0 + 2; r++) for (let k = 0; k < 8; k++) h += ion(BX + k * BP, BY + r * BP, isCat(r, k), bcr, bar)
    h += '<g class="glow">'
    for (let k = k0; k <= k1; k++) h += `<circle cx="${BX + k * BP}" cy="${BY + ringRow * BP}" r="${(isCat(ringRow, k) ? bcr : bar) + 7}" fill="none" stroke="#f0707a" stroke-width="6"/>`
    return h + '</g>' }
  EZ.scene('brittle', {
    html: `<div class="kicker" data-at="in" data-fx="left">Structure explains properties</div><h2 class="h1" data-at="0">Property 2: hard, but <span class="bad">brittle</span></h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in" data-fx="fade"><g class="bot">${half(2, 2, 1, 7)}</g><g class="top">${half(0, 1, 0, 6)}</g></g>
        <g class="rep">${[1, 2, 3, 4, 5, 6, 7].map((k) => `<line x1="${BX + k * BP}" x2="${BX + k * BP}" y1="522" y2="570" stroke="#f0707a" stroke-width="5" marker-start="url(#mk-bad)" marker-end="url(#mk-bad)"/>`).join('')}</g>
        <g data-at="2" data-fx="fade"><g class="fa"><line x1="150" y1="472" x2="322" y2="472" stroke="#f3a764" stroke-width="13" marker-end="url(#mk-warm)"/><text x="236" y="436" text-anchor="middle" font-size="42" font-weight="900" class="f-warm">force</text></g></g>
      </svg>
      <div class="bn" style="top:340px" data-at="1" data-fx="right"><b class="teal">Before</b><span>opposite charges side by side</span></div>
      <div class="bn" style="top:474px;border-color:rgba(243,167,100,.7)" data-at="2" data-fx="right"><b class="warm">A force hits</b><span>one layer slides past another</span></div>
      <div class="bn" style="top:608px;border-color:rgba(240,112,122,.7)" data-at="3" data-fx="right"><b class="bad">Like charges line up</b><span>same charge, next to each other</span></div>
      <div class="bn" style="top:742px;border-color:rgba(240,112,122,.7)" data-at="4@0.2" data-fx="right"><b class="bad">They repel</b><span>the crystal cracks</span></div>
      <div class="banner" style="top:890px" data-at="5" data-fx="pop">Salt crystals <span class="warm">shatter</span> rather than bend</div>`,
    update(c) {
      const b = c.b, shift = BP * eio(c.seg(b[2].start + 0.7, b[2].end + 0.1))
      const t4 = b[4].start + 0.3 * (b[4].end - b[4].start), lift = eo(c.seg(t4, t4 + 0.9))
      c.$('.top').setAttribute('transform', `translate(${shift + 10 * lift} ${-62 * lift})`)
      c.$('.bot').setAttribute('transform', `translate(0 ${6 * lift})`)
      c.$('.fa').setAttribute('transform', `translate(${shift * 0.45} 0)`)
      const g = c.p('3@0.2', 0.4) * (0.7 + 0.3 * Math.sin(c.t * 7))
      for (const el of all(c, '.glow')) el.style.opacity = g
      c.$('.rep').style.opacity = clamp((lift - 0.7) / 0.3) * (0.75 + 0.25 * Math.sin(c.t * 7))
    },
  })

  // ---------- property 3: conducts only when the ions can move ----------
  const plates = `<rect x="26" y="8" width="18" height="224" rx="7" fill="#aab1c4"/><rect x="496" y="8" width="18" height="224" rx="7" fill="#aab1c4"/>
    <text x="35" y="262" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">−</text><text x="505" y="262" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">+</text>`
  // ions drifting in lanes: cations toward the − plate (left), anions toward the + plate (right)
  const lanes = (ys, n) => ys.map((y, j) => Array.from({ length: n }, (_, i) => `<g class="mv" data-y="${y}" data-o="${(i * 400) / n + j * 47}" data-cat="${j % 2 === 0 ? 1 : 0}" data-i="${j * n + i}">${ion(0, 0, j % 2 === 0, 13, 21)}</g>`).join('')).join('')
  EZ.scene('conduct', {
    html: `<div class="kicker" data-at="in" data-fx="left">Structure explains properties</div><h2 class="h1" data-at="0">Property 3: when does it <span class="teal">conduct</span>?</h2>
      <div style="position:absolute;left:120px;top:270px;font-size:38px;font-weight:800;color:var(--muted)" data-at="1" data-fx="fade">Conduction needs <span class="teal">charged particles</span> that <span class="teal">can move</span></div>
      <div class="card col" style="left:120px" data-at="2"><h3>Solid</h3>
        <svg style="position:absolute;left:0;top:96px" width="540" height="270">${plates}${grid(5, 3, 146, 58, 62, 14, 23, (r, k, h) => `<g class="sj" data-i="${r * 5 + k}">${h}</g>`)}</svg>
        <div class="ft">ions locked: <span class="bad">no conduction</span></div></div>
      <div class="card col" style="left:690px" data-at="3"><h3>Melted</h3>
        <svg style="position:absolute;left:0;top:96px" width="540" height="270">${plates}${lanes([40, 94, 148, 202], 4)}</svg>
        <div class="ft">ions free to move: <span class="good">conducts</span></div></div>
      <div class="card col" style="left:1260px" data-at="4"><h3>Dissolved in water</h3>
        <svg style="position:absolute;left:0;top:96px" width="540" height="270"><rect x="44" y="8" width="452" height="224" fill="rgba(90,150,255,.16)"/>${plates}${lanes([40, 94, 148, 202], 2)}</svg>
        <div class="ft">ions separate: <span class="good">conducts</span></div></div>
      <div data-at="5" data-out="7-0.45" data-fx="fade">
        <div style="position:absolute;left:0;width:1920px;top:822px;text-align:center;font-size:42px;font-weight:900">KBr solid: <span class="bad">doesn’t conduct</span> &nbsp;·&nbsp; molten KBr: <span class="good">conducts</span></div>
        <div style="position:absolute;left:0;width:1920px;top:890px;text-align:center;font-size:36px;font-weight:800;color:var(--muted)" data-at="6" data-fx="fade">No free electrons: in the liquid, K<sup>+</sup> and Br<sup>−</sup> are free to move</div></div>
      <div class="banner" style="top:840px" data-at="7" data-fx="pop">Ask: charged particles? <span class="teal">Free to move?</span></div>`,
    update(c) {
      for (const g of all(c, '.sj')) { const i = +g.dataset.i; g.setAttribute('transform', `translate(${(1.6 * Math.sin(c.t * 12 + i * 1.9)).toFixed(2)} ${(1.6 * Math.cos(c.t * 10 + i * 2.7)).toFixed(2)})`) }
      for (const g of all(c, '.mv')) {
        const cat = g.dataset.cat === '1', i = +g.dataset.i
        const u = (((+g.dataset.o + (cat ? -42 : 34) * c.t) % 400) + 400) % 400, x = 70 + u
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${(+g.dataset.y + 7 * Math.sin(c.t * 2.2 + i * 1.3)).toFixed(1)})`)
        g.style.opacity = clamp(Math.min(u, 400 - u) / 28)
      }
    },
  })

  // ---------- the drawing trick ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Drawing an ionic solid</h2>
      <div class="card col3" style="left:120px" data-at="1"><h3><small>1</small>Alternate + and −</h3>
        <svg style="position:absolute;left:0;top:120px" width="540" height="320"><g data-at="1@0.3" data-fx="pop">${grid(4, 3, 144, 60, 84, 21, 34)}</g></svg>
        <div class="ft">no two like charges touch</div></div>
      <div class="card col3" style="left:690px" data-at="2"><h3><small>2</small>Reasonable sizes</h3>
        <svg style="position:absolute;left:0;top:120px" width="540" height="320">
          <g data-at="2@0.72" data-fx="pop">${ion(150, 150, true, 46, 84, sup('Na', '+'))}</g><g data-at="2@0.72" data-fx="pop">${ion(350, 150, false, 46, 84, sup('Cl', '−'))}</g>
          <text x="150" y="286" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="2@0.8" data-fx="fade">cation</text>
          <text x="350" y="286" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="2@0.8" data-fx="fade">anion</text></svg>
        <div class="ft" data-at="2@0.4" data-fx="fade">anions are usually <span class="teal">bigger</span></div></div>
      <div class="card col3" style="left:1260px" data-at="3"><h3><small>3</small>Right ratio</h3>
        <svg style="position:absolute;left:0;top:120px" width="540" height="320">
          <text x="270" y="50" text-anchor="middle" font-size="50" font-weight="900" data-at="3@0.3" data-fx="fade">CaCl<tspan dy=".3em" font-size=".62em">2</tspan></text>
          <g data-at="3@0.5" data-fx="pop">${ion(110, 180, true, 44, 64, sup('Ca', '2+'))}</g>
          <g data-at="3@0.62" data-fx="pop">${ion(280, 180, false, 44, 64, sup('Cl', '−'))}</g><g data-at="3@0.7" data-fx="pop">${ion(430, 180, false, 44, 64, sup('Cl', '−'))}</g></svg>
        <div class="ft" data-at="3@0.6" data-fx="fade">twice as many Cl<sup>−</sup> as Ca<sup>2+</sup></div></div>
      <div class="banner" style="top:894px" data-at="4" data-fx="pop">No need to memorize specific crystal structures</div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'The electrons are delocalized', '1@0.13'], ['B', 'Shifting a layer brings ions of the same charge next to each other, and they repel', '1@0.29'],
    ['C', 'Ionic bonds are weaker than covalent bonds', '1@0.7'], ['D', 'The ions are too small', '1@0.9']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Why are ionic crystals <span class="teal">brittle</span>?</h2>
      ${OPTS.map(([l, s, at], i) => `<div class="opt t${i}" style="top:${290 + i * 114}px" data-at="${at}" data-fx="left"><div class="l">${l}</div>${s}
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="862" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="862" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 862)"/>
        <text class="num" x="960" y="886" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="982" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:800px;font-size:46px" data-at="4" data-fx="pop">Layers shift ${ARR} like charges line up ${ARR} <span class="bad">repulsion</span> splits the crystal</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${grid(5, 3, 102, 41, 64, 15, 25)}</svg>`
  const row = (x0, y, r) => [0, 1, 2, 3, 4].map((k) => ion(x0 + k * 52, y, isCat(r, k), 12, 20)).join('')
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${row(152, 20, 0)}${row(152, 72, 1)}${row(100, 142, 2)}${row(100, 194, 3)}
    <polyline points="70,108 130,102 190,111 250,103 310,111 370,103 420,108" fill="none" stroke="#f0707a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210">${[[330, 50, 1], [130, 105, 0], [300, 160, 1], [110, 185, 0], [150, 30, 0]].map(([x, y, cat]) => `${ion(x, y, !!cat, 15, 24)}<line x1="${x + (cat ? -30 : 38)}" x2="${x + (cat ? -78 : 86)}" y1="${y}" y2="${y}" stroke="${cat ? '#f3a764' : '#3cc7bc'}" stroke-width="6" marker-end="url(#mk-${cat ? 'warm' : 'teal'})"/>`).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>The lattice <span class="teal">maximizes</span><br>+/− attractions and<br><span class="bad">minimizes</span> like-charge<br>repulsions</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p><span class="warm">High melting point</span><br>Hard, but <span class="bad">brittle</span></p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Conducts only when<br>the ions can move:<br><span class="teal">melted or dissolved</span></p></div>`,
  })
})()
