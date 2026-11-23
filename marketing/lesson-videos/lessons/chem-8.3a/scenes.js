// Pictures for chem-8.3a "Weak Acids & Ka". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts): fewer than 1% of
// vinegar's molecules ionize; 0.10 M CH3COOH, Ka 1.8 x 10^-5 -> x = 1.34 x 10^-3 M, pH 2.87, 1.3%;
// the 5% check; 0.050 M HA at pH 3.00 -> Ka 2.0 x 10^-5; pH 1.00 from the strong-acid shortcut;
// the four Ka values from the quick check. Bars and balls show order only, not a scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:52px;font-weight:900;white-space:nowrap}
    .x-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;margin:0 .2em}
    .x-fr>span:first-child{border-bottom:5px solid currentColor;padding:0 12px 6px} .x-fr>span:last-child{padding-top:6px}
    .x-rt>span{display:inline-block;line-height:1.08;border-top:5px solid currentColor;padding:4px 8px 0;margin-left:2px}
    .x-lab{position:absolute;width:300px;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-big{position:absolute;left:1270px;width:540px;text-align:center;white-space:nowrap}
    .x-pl{position:absolute;top:300px;width:810px;height:160px;text-align:center;white-space:nowrap}
    .x-pl .a{margin-top:22px;font-size:50px;font-weight:900} .x-pl .b{margin-top:6px;font-size:38px;font-weight:800;color:var(--muted)}
    .x-row{position:absolute;left:120px;width:1480px;height:80px;border-radius:22px;background:rgba(36,40,56,.8);border:3px solid var(--line);font-size:46px;font-weight:900;line-height:74px;white-space:nowrap}
    .x-row .fm{position:absolute;left:40px} .x-row .kv{position:absolute;left:560px} .x-row .tg{position:absolute;right:30px;font-size:36px}
    .x-ice{position:absolute;left:120px;top:370px;width:900px;height:470px}
    .x-c{position:absolute;height:90px;line-height:90px;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-st{position:absolute;left:1070px;width:730px;height:100px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:42px;font-weight:900;line-height:96px;text-align:center;white-space:nowrap}
    .x-step{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.85);border:2px solid var(--line);font-size:48px;font-weight:900;line-height:116px;white-space:nowrap}
    .x-step .n{display:inline-block;width:70px;height:70px;margin:0 30px 0 30px;border-radius:50%;background:var(--brand);text-align:center;line-height:70px;font-size:38px;vertical-align:middle}
    .x-tc{position:absolute;top:400px;width:810px;height:380px}
    .x-tc h3{text-align:center} .x-tc .k{position:absolute;left:0;right:0;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-verd{position:absolute;left:205px;width:400px;top:286px;height:66px;border-radius:33px;text-align:center;font-size:40px;font-weight:900;line-height:62px;border:3px solid}
    .x-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .x-tile .f{margin-top:74px;font-size:66px;font-weight:900;line-height:1} .x-tile .ch{margin-top:26px;font-size:36px;font-weight:800;color:var(--muted)}
    .x-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', PRI = '#8d8df0', MUTED = '#a3abbd', BAD = '#f0707a'
  const EQ = '<i class="x-eq"></i>'
  const H3O = 'H<sub>3</sub>O<sup>+</sup>', AM = 'A<sup>−</sup>', KA = 'K<sub>a</sub>', PKA = 'pK<sub>a</sub>'
  const HAC = 'CH<sub>3</sub>COOH'
  const ROOT = `√(${KA} · C)`
  const FRAC = `<span class="x-fr"><span>[${H3O}][${AM}]</span><span>[HA]</span></span>`
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  // a small HA molecule (no labels): A purple, its H gold
  const ha = (x, y, s = 1) => `<g transform="translate(${x} ${y})">${ball(0, 0, 17 * s, 'pur')}${ball(20 * s, -13 * s, 10 * s, 'gold')}</g>`

  // ---------- intro: a faint row of HA molecules, one letting go of its proton ----------
  const IX = Array.from({ length: 13 }, (_, i) => 300 + i * 110)
  EZ.intro = {
    chips: [['1@0.4', 'What K<sub>a</sub> tells you'], ['1@0.62', 'pH of a weak acid'], ['1@0.85', 'Back from pH']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.28">${IX.map((x, i) => i === 6 ? `<g transform="translate(${x} 900)"><g class="x-ia">${ball(0, 0, 22, 'pur')}</g><g class="x-ih">${ball(0, 0, 13, 'gold')}</g></g>` : ha(x, 900, 1.3)).join('')}</svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 1.2)
      c.$('.x-ih').setAttribute('transform', `translate(${lerp(26, 58, p)} ${lerp(-17, -36, p)})`)
    },
  }

  // ---------- hook: vinegar, 120 molecules, one gives up its proton ----------
  const COLS = 15, ROWS = 8, K = 4 * COLS + 9
  const gx = (i) => 196 + (i % COLS) * 68, gy = (i) => 358 + Math.floor(i / COLS) * 58
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why weak?</div><h2 class="h1" data-at="in+0.2">Vinegar on a salad</h2>
      <div class="card" style="left:120px;top:300px;width:1100px;height:560px" data-at="0" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.3" data-fx="fade">
        ${Array.from({ length: COLS * ROWS }, (_, i) => i === K ? '' : ha(gx(i), gy(i))).join('')}
        <g transform="translate(${gx(K)} ${gy(K)})"><g class="x-ka">${ball(0, 0, 17, 'pur')}</g><g class="x-kt" style="opacity:0">${ball(0, 0, 17, 'teal')}</g><g class="x-kh">${ball(0, 0, 10, 'gold')}</g>
          <circle class="x-kr" r="40" fill="none" stroke="${GOLD}" stroke-width="5" style="opacity:0"/></g></g>
        <text x="670" y="838" text-anchor="middle" font-size="30" font-weight="800" class="f-muted" data-at="0@0.6" data-fx="fade">acetic acid molecules</text>
      </svg>
      <div class="x-big gold" style="top:330px;font-size:150px;font-weight:900" data-at="2@0.3" data-fx="pop">&lt; 1%</div>
      <div class="x-big" style="top:520px;font-size:44px;font-weight:900" data-at="2@0.5" data-fx="fade">give up a proton</div>
      <div class="x-big muted" style="top:620px;font-size:44px;font-weight:900" data-at="3" data-fx="fade">the rest stay whole</div>
      <div class="banner" style="top:890px" data-at="4" data-fx="pop">Weak acids are mostly <span class="gold">shy</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[2].start + 0.3, b[2].start + 1.2))
      c.$('.x-kh').setAttribute('transform', `translate(${lerp(20, 44, p)} ${lerp(-13, -34, p)})`)
      c.$('.x-kt').style.opacity = p; c.$('.x-ka').style.opacity = 1 - p
      const ring = c.seg(b[2].start, b[2].start + 0.3)
      c.$('.x-kr').style.opacity = ring
    },
  })

  // ---------- the equilibrium and Ka ----------
  const HAp = [300, 600], WP = [720, 600], P0 = [352, 562], P1 = [720, 538]
  EZ.scene('ka', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equilibrium</div><h2 class="h1" data-at="in+0.2">What a weak acid does in water</h2>
      <div class="x-line" style="top:296px" data-at="1"><span class="pri">HA(aq)</span> + H<sub>2</sub>O(l)<span class="gold">${EQ}</span><span class="warm">${H3O}(aq)</span> + <span class="teal">${AM}(aq)</span></div>
      <div data-at="in" data-out="5" data-fx="fade">
        <div class="card" style="left:120px;top:400px;width:810px;height:440px" data-at="in+0.3" data-fx="fade"></div>
        <svg class="full" viewBox="0 0 1920 1080"><g data-at="in+0.4" data-fx="fade">
          <g transform="translate(${HAp[0]} ${HAp[1]})"><g class="x-a1">${ball(0, 0, 54, 'pur', 'A', 44)}</g><g class="x-a2">${ball(0, 0, 54, 'teal', sup('A', '−'), 44)}</g></g>
          ${ball(WP[0] - 46, WP[1] + 42, 28, 'gray', 'H', 26)}${ball(WP[0] + 46, WP[1] + 42, 28, 'gray', 'H', 26)}${ball(WP[0], WP[1], 50, 'red', 'O', 40)}
          <g class="x-hp">${ball(0, 0, 28, 'gold', 'H', 26)}</g>
          <text x="510" y="610" text-anchor="middle" font-size="60" font-weight="900" class="f-muted">+</text>
        </g></svg>
        <div class="x-lab x-l1 pri" style="left:150px;top:690px">HA</div><div class="x-lab x-l2 teal" style="left:150px;top:690px">${AM}</div>
        <div class="x-lab x-l3 muted" style="left:570px;top:690px">H<sub>2</sub>O</div><div class="x-lab x-l4 warm" style="left:570px;top:690px">${H3O}</div>
        <div class="x-lab gold" style="left:375px;top:770px;width:400px;font-size:36px" data-at="2@0.2" data-fx="fade">both ways: equilibrium</div>
      </div>
      <div class="card" style="left:120px;top:400px;width:810px;height:440px" data-at="5">
        <h3 style="text-align:center">Most HA stays as molecules</h3>
        <div style="position:absolute;left:200px;top:120px;width:130px;height:220px;border-radius:14px 14px 4px 4px;background:linear-gradient(180deg,#c9c9ff,#5b5bd6)" data-at="5@0.2" data-fx="grow"></div>
        <div style="position:absolute;left:480px;top:334px;width:130px;height:6px;border-radius:3px;background:${WARM}" data-at="5@0.4" data-fx="fade"></div>
        <div class="x-lab pri" style="left:115px;top:350px;font-size:38px">[HA]</div><div class="x-lab warm" style="left:395px;top:350px;font-size:38px">[${H3O}]</div>
        <div style="position:absolute;right:30px;top:96px;font-size:24px;font-weight:800;color:var(--muted)">bars not to scale</div></div>
      <div class="card" style="left:990px;top:400px;width:810px;height:440px" data-at="3">
        <h3 style="text-align:center">${KA}: acid dissociation constant</h3>
        <div style="position:absolute;left:0;right:0;top:150px;text-align:center;font-size:64px;font-weight:900;white-space:nowrap" data-at="4" data-fx="fade">${KA} = ${FRAC}</div></div>
      <div class="banner" style="top:880px;font-size:48px" data-at="6" data-fx="pop">[${H3O}] ≪ [HA]<sub>initial</sub></div>`,
    update(c) {
      const b = c.b, d1 = b[1].end - b[1].start
      // s: 0 = HA + H2O, 1 = ions. Forward on sentence 1, back and forward again on sentence 2.
      let s = eio(c.seg(b[1].start + 0.45 * d1, b[1].start + 0.45 * d1 + 0.8))
      const s2 = b[2].start
      if (c.t > s2 + 0.3) s = 1 - eio(c.seg(s2 + 0.3, s2 + 1.0))
      if (c.t > s2 + 1.4) s = eio(c.seg(s2 + 1.4, s2 + 2.1))
      const x = lerp(P0[0], P1[0], s), y = lerp(P0[1], P1[1], s) - 90 * Math.sin(Math.PI * s)
      c.$('.x-hp').setAttribute('transform', `translate(${x} ${y})`)
      c.$('.x-a2').style.opacity = s; c.$('.x-a1').style.opacity = 1 - s
      c.$('.x-l2').style.opacity = s; c.$('.x-l1').style.opacity = 1 - s
      c.$('.x-l4').style.opacity = s; c.$('.x-l3').style.opacity = 1 - s
    },
  })

  // ---------- comparing acids ----------
  const ACIDS = [['HF', '6.8 × 10<sup>−4</sup>'], ['HNO<sub>2</sub>', '4.0 × 10<sup>−4</sup>'], [HAC, '1.8 × 10<sup>−5</sup>'], ['HCN', '6.2 × 10<sup>−10</sup>']]
  EZ.scene('strength', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Comparing acids</div><h2 class="h1" data-at="0">Which acid is stronger?</h2>
      <div class="card x-pl" style="left:120px" data-at="1"><div class="a">Larger ${KA} ${ARR} <span class="teal">stronger acid</span></div></div>
      <div class="card x-pl" style="left:990px" data-at="2"><div class="a">${PKA} = −log ${KA}</div><div class="b" data-at="3" data-fx="fade">smaller ${PKA} ${ARR} <span class="teal">stronger acid</span></div></div>
      <div style="position:absolute;left:680px;top:476px;font-size:34px;font-weight:900;color:var(--muted)" data-at="4" data-fx="fade">${KA}</div>
      ${ACIDS.map(([f, k], i) => `<div class="x-row x-r${i}" style="top:${530 + i * 92}px" data-at="4@${(0.35 + i * 0.13).toFixed(2)}" data-fx="left">
        <span class="fm">${f}</span><span class="kv ${i === 0 ? 'gold' : ''}">${k}</span>${i === 0 ? '<span class="tg gold" data-at="5@0.4" data-fx="pop">strongest</span>' : ''}</div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="4@0.9" data-fx="fade">
        <line x1="1700" y1="890" x2="1700" y2="540" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
        <text transform="translate(1760 715) rotate(-90)" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">stronger</text></g></svg>`,
    update(c) {
      const w = eo(c.seg(c.b[5].start + 0.2, c.b[5].start + 0.6))
      const el = c.$('.x-r0')
      el.style.borderColor = w ? `rgba(242,196,67,${w})` : ''
      el.style.boxShadow = `0 0 ${50 * w}px rgba(242,196,67,${0.45 * w})`
    },
  })

  // ---------- worked example: ICE table ----------
  const COLX = [[30, 110], [140, 330], [470, 200], [670, 200]]
  const cell = (col, row, html, at, cls = '') => `<div class="x-c ${cls}" style="left:${COLX[col][0]}px;width:${COLX[col][1]}px;top:${20 + row * 104}px" data-at="${at}" data-fx="fade">${html}</div>`
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">pH of a weak acid</h2>
      <div style="position:absolute;left:120px;top:282px;font-size:46px;font-weight:900;white-space:nowrap" data-at="1">0.10 M <span class="pri">${HAC}</span> &nbsp;·&nbsp; ${KA} = <span class="gold">1.8 × 10<sup>−5</sup></span></div>
      <div class="card x-ice" data-at="2">
        ${cell(1, 0, '<span class="pri">HA</span>', 'in')}${cell(2, 0, `<span class="warm">${H3O}</span>`, 'in')}${cell(3, 0, `<span class="teal">${AM}</span>`, 'in')}
        ${cell(0, 1, 'I', 'in', 'muted')}${cell(1, 1, '0.10', 'in')}${cell(2, 1, '≈ 0', 'in')}${cell(3, 1, '0', 'in')}
        ${cell(0, 2, 'C', 'in', 'muted')}${cell(1, 2, '−x', '2@0.3')}${cell(2, 2, '+x', '2@0.3')}${cell(3, 2, '+x', '2@0.3')}
        ${cell(0, 3, 'E', 'in', 'muted')}${cell(1, 3, '0.10 − x <span class="gold" data-at="3@0.55" data-fx="fade">≈ 0.10</span>', '3')}${cell(2, 3, '<span class="warm">x</span>', '2@0.6')}${cell(3, 3, '<span class="teal">x</span>', '2@0.6')}
        <div style="position:absolute;left:30px;right:30px;top:113px;height:2px;background:var(--line)"></div>
        <div style="position:absolute;left:150px;top:110px;bottom:24px;width:2px;background:var(--line)"></div></div>
      <div class="x-st" style="top:370px" data-at="4">x<sup>2</sup> / 0.10 = 1.8 × 10<sup>−5</sup></div>
      <div class="x-st" style="top:490px" data-at="5">x = <span class="warm">1.34 × 10<sup>−3</sup> M</span></div>
      <div class="x-st" style="top:610px" data-at="6">pH = −log(1.34 × 10<sup>−3</sup>) = <span class="gold">2.87</span></div>
      <div class="x-st" style="top:730px;font-size:38px" data-at="7">% ionization = x / 0.10 × 100 = <span class="gold">1.3%</span></div>
      <div class="banner" style="top:880px;font-size:46px" data-at="7@0.6" data-fx="pop">pH = <span class="gold">2.87</span> &nbsp;·&nbsp; only <span class="gold">1.3%</span> ionized</div>`,
  })

  // ---------- the shortcut and the 5% check ----------
  const PX = (p) => 260 + p * 140 // percent -> px (0..10 %)
  EZ.scene('shortcut', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Shortcut</div><h2 class="h1" data-at="0">Skip the full algebra</h2>
      <div class="card" style="left:360px;top:300px;width:1200px;height:170px;text-align:center;font-size:76px;font-weight:900;line-height:166px;white-space:nowrap" data-at="1">[<span class="warm">${H3O}</span>] ≈ ${ROOT}</div>
      <div class="card" style="left:120px;top:510px;width:1680px;height:320px" data-at="2"><h3>Is x small? Check x / C</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.3" data-fx="fade">
          <rect x="${PX(0)}" y="690" width="${PX(5) - PX(0)}" height="40" rx="8" fill="#4cc781" opacity=".75"/>
          <rect x="${PX(5)}" y="690" width="${PX(10) - PX(5)}" height="40" rx="8" fill="${WARM}" opacity=".35"/>
          ${[0, 5, 10].map((p) => `<text x="${PX(p)}" y="780" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">${p}%</text>`).join('')}
          <line x1="${PX(5)}" y1="672" x2="${PX(5)}" y2="748" stroke="#fff" stroke-width="5"/>
          <text x="${PX(2.5)}" y="721" text-anchor="middle" font-size="30" font-weight="900" class="f-dark">under about 5%: shortcut OK</text></g>
        <g data-at="3@0.45" data-fx="pop"><path d="M${PX(1.3) - 18} 640 L${PX(1.3)} 684 L${PX(1.3) + 18} 640Z" fill="${GOLD}"/>
          <text x="${PX(1.3) + 30}" y="626" font-size="30" font-weight="900" class="f-gold">our acetic acid: 1.3%</text></g>
        <text x="${PX(2.5)}" y="814" text-anchor="middle" font-size="30" font-weight="900" class="f-muted" data-at="3@0.1" data-fx="fade">most AP® problems land here</text>
      </svg>
      <div class="banner" style="top:870px;font-size:46px" data-at="4" data-fx="pop">Free response: <span class="gold">show the ICE setup</span> and <span class="gold">state the assumption</span></div>`,
  })

  // ---------- from pH back to Ka ----------
  EZ.scene('reverse', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Work backward</div><h2 class="h1" data-at="0">From pH to ${KA}</h2>
      <div style="position:absolute;left:120px;top:282px;font-size:46px;font-weight:900;white-space:nowrap" data-at="1">0.050 M weak acid <span class="pri">HA</span> &nbsp;·&nbsp; pH = <span class="gold">3.00</span></div>
      <div class="x-step" style="top:380px" data-at="2"><span class="n">1</span>[<span class="warm">${H3O}</span>] = [<span class="teal">${AM}</span>] = 10<sup>−3.00</sup> = <span class="warm">1.0 × 10<sup>−3</sup> M</span></div>
      <div class="x-step" style="top:530px" data-at="3"><span class="n">2</span>[<span class="pri">HA</span>] = 0.050 − 0.0010 = <span class="pri">0.049 M</span></div>
      <div class="x-step" style="top:680px" data-at="4"><span class="n">3</span>${KA} = (1.0 × 10<sup>−3</sup>)<sup>2</sup> / 0.049</div>
      <div class="banner" style="top:850px" data-at="5" data-fx="pop">${KA} = <span class="gold">2.0 × 10<sup>−5</sup></span></div>`,
  })

  // ---------- trap: [H3O+] is not [HA]initial ----------
  const PH = (p) => 400 + p * 160
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="0">Is [H<sub>3</sub>O<sup>+</sup>] the acid concentration?</h2>
      <div class="x-line" style="top:300px;font-size:50px" data-at="1">For a weak acid: [<span class="warm">${H3O}</span>] <span class="bad">≠</span> [HA]<sub>initial</sub></div>
      <div class="card x-tc" style="left:120px" data-at="2"><h3 class="muted">Strong-acid shortcut</h3>
        <div class="k" style="top:110px">[${H3O}] = 0.10 M</div>
        <div class="k" style="top:190px" data-at="3">pH = <span class="bad">1.00</span></div>
        <div class="x-verd bad" style="border-color:var(--bad);background:rgba(240,112,122,.14)" data-at="3@0.6" data-fx="pop">wrong here</div></div>
      <div class="card x-tc" style="left:990px" data-at="4"><h3 class="teal">Weak acid: real answer</h3>
        <div class="k" style="top:110px">[${H3O}] = 1.34 × 10<sup>−3</sup> M</div>
        <div class="k" style="top:190px">pH = <span class="good">2.87</span></div>
        <div class="x-verd good" style="border-color:var(--good);background:rgba(76,199,129,.14)" data-at="4@0.4" data-fx="pop">correct</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3" data-fx="fade"><rect x="${PH(0)}" y="880" width="${PH(7) - PH(0)}" height="20" rx="10" fill="#363c54"/>
          ${[0, 1, 2, 3, 4, 5, 6, 7].map((p) => `<text x="${PH(p)}" y="940" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">${p}</text>`).join('')}
          <text x="${PH(0) - 30}" y="898" text-anchor="end" font-size="30" font-weight="900" class="f-muted">pH</text></g>
        <g data-at="3@0.3" data-fx="pop"><circle cx="${PH(1)}" cy="890" r="20" fill="${BAD}"/><text x="${PH(1)}" y="858" text-anchor="middle" font-size="30" font-weight="900" class="f-bad">1.00</text></g>
        <g data-at="4@0.3" data-fx="pop"><circle cx="${PH(2.87)}" cy="890" r="20" fill="#4cc781"/><text x="${PH(2.87)}" y="858" text-anchor="middle" font-size="30" font-weight="900" class="f-good">2.87</text></g>
      </svg>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', H3O, 'hydronium'], ['B', 'CH<sub>3</sub>COO<sup>−</sup>', 'acetate'], ['C', HAC, 'acetic acid'], ['D', 'OH<sup>−</sup>', 'hydroxide']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which species has the <span class="teal">highest concentration</span>?</h2>
      <div style="position:absolute;left:120px;top:278px;font-size:42px;font-weight:800;color:var(--muted);white-space:nowrap" data-at="1@0.05">In 0.10 M <b class="pri">${HAC}</b> &nbsp;·&nbsp; besides water</div>
      ${OPTS.map(([l, f, w], i) => `<div class="x-tile x-t${i}" style="left:${120 + i * 430}px" data-at="1@${(0.6 + i * 0.08).toFixed(2)}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok" style="opacity:0">${CHECK}</div>` : ''}
        <div class="f">${f}</div><div class="ch">${w}</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="820" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="x-num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:760px" data-at="4" data-fx="pop">Only about 1% ionizes ${ARR} un-ionized <span class="teal">${HAC}</span> dominates</div>`,
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
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">
    <g transform="translate(70 80)">${ball(0, 0, 34, 'pur', 'A', 28)}${ball(40, -26, 20, 'gold', 'H', 18)}</g>
    <path d="M150 66h120l-18-12M270 92H150l18 12" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    ${ball(330, 80, 34, 'teal', sup('A', '−'), 28)}${ball(410, 80, 22, 'gold', sup('H', '+'), 18)}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${Array.from({ length: 12 }, (_, i) => i === 8 ? '' : ha(70 + (i % 6) * 64, 50 + Math.floor(i / 6) * 60, 1.1)).join('')}
    ${ball(70 + 2 * 64, 110, 19, 'teal')}${ball(70 + 2 * 64 + 34, 80, 11, 'gold')}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><rect x="40" y="50" width="380" height="50" rx="12" fill="url(#g-pur)"/><rect x="408" y="50" width="12" height="50" fill="${GOLD}"/>
    <text x="230" y="134" text-anchor="middle" font-size="28" font-weight="900" class="f-muted">a small slice ionizes</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>${KA} = [${H3O}][${AM}] / [HA]<br><br>Bigger ${KA} =<br><span class="teal">stronger acid</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Weak acid:<br>[${H3O}] ≈ <span class="warm">${ROOT}</span><br><br>Most HA stays<br><span class="pri">un-ionized</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="gold">% ionization</span> =<br>[${H3O}]<sub>eq</sub> / [HA]<sub>initial</sub><br>× 100</p></div>`,
  })
  void clamp; void PRI
})()
