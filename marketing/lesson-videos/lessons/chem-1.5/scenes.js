// Pictures for chem-1.5 "Atomic Structure & Electron Configuration". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u1.ts). Atoms are schematic: no sizes or
// electron counts are claimed except those the lesson gives.
(() => {
  const { clamp, eio, eo, back, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .zn{position:absolute;left:1180px;width:620px;padding:20px 30px 22px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .zn b{display:block;font-size:40px;font-weight:900;line-height:1.15} .zn span{display:block;margin-top:6px;font-size:30px;font-weight:700;line-height:1.3;color:var(--muted)}
    .ft{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:35px;font-weight:800;white-space:nowrap}
    .sub{position:absolute;width:400px;height:210px;top:320px;text-align:center}
    .sub .big{display:block;margin-top:14px;font-size:104px;font-weight:900;line-height:1}
    .sub .sm{display:block;margin-top:6px;font-size:36px;font-weight:800;color:var(--muted)}
    .ord{position:absolute;top:610px;width:140px;height:96px;border-radius:20px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center;font-size:44px;font-weight:900;line-height:90px}
    .ob{position:absolute;top:400px;width:300px;height:190px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .ob .nm{display:block;margin-top:22px;font-size:76px;font-weight:900;line-height:1}
    .ob .ct{display:block;margin-top:10px;font-size:34px;font-weight:800;color:var(--muted)}
    .tot{position:absolute;top:610px;width:300px;text-align:center;font-size:40px;font-weight:900}
    .ln{position:absolute;left:0;width:1920px;text-align:center;font-weight:900;white-space:nowrap}
    .ic{position:absolute;left:0;top:0;width:100%;text-align:center}
    .cx{position:absolute;left:120px;width:1680px;padding:22px 40px 24px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:50px;font-weight:900;line-height:1.35;white-space:nowrap}
    .cx small{display:block;font-size:30px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
    .opt{position:absolute;left:120px;width:1680px;height:100px;padding-left:112px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:40px;font-weight:800;white-space:nowrap}
    .opt .l{position:absolute;left:26px;top:20px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:24px;top:16px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
    .nb{position:absolute;top:320px;width:540px;height:470px;text-align:center}
    .nb svg{display:block;margin:26px auto 0} .nb p{margin:6px 24px 0;font-size:38px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)
  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', BAD = '#f0707a', MUTED = '#a3abbd'

  // a schematic atom: nucleus (+), electron cloud
  const nucleus = (x, y, r = 34) => ball(x, y, r, 'warm', '+', r * 1.2)
  const electron = (x, y, r = 16, g = 'teal') => ball(x, y, r, g, '−', r * 1.3)

  // ---------- intro artwork: faint atoms on the left and right edges (all above y = 950) ----------
  const orbitArt = (x, y) => `<g>${[70, 130, 190].map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#8d8df0" stroke-width="3"/>`).join('')}${nucleus(x, y, 28)}${electron(x + 130, y, 14)}${electron(x - 92, y - 92, 14)}${electron(x + 190 * 0.7, y + 190 * 0.7, 14)}</g>`
  EZ.intro = {
    chips: [['1@0.28', "Coulomb's law"], ['1@0.52', 'Filling shells'], ['1@0.76', 'Writing configurations']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${orbitArt(40, 400)}${orbitArt(1880, 620)}</svg>`,
  }

  // ---------- hook: sodium vs neon ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Sodium reacts. Neon doesn’t.</h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:520px" data-at="0@0.3"><h3>Sodium</h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="520" viewBox="0 0 760 520">
          <circle cx="330" cy="290" r="150" fill="url(#g-cloud)"/>${nucleus(330, 290, 44)}
          <g data-at="1" data-fx="pop">${electron(560, 200, 26, 'warm')}</g>
          <text x="560" y="262" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="1@0.3" data-fx="fade">one more</text></svg>
        <div class="ft"><span class="bad">wildly reactive</span></div></div>
      <div class="card" style="left:1040px;top:320px;width:760px;height:520px" data-at="0@0.6"><h3>Neon</h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="520" viewBox="0 0 760 520">
          <circle cx="380" cy="290" r="150" fill="url(#g-cloud)"/>${nucleus(380, 290, 44)}</svg>
        <div class="ft"><span class="teal">does nothing at all</span></div></div>
      <div class="banner" style="top:896px" data-at="2" data-fx="pop">Where electrons sit, and how <span class="teal">tightly they are held</span></div>`,
  })

  // ---------- Coulomb's law ----------
  const CX = 280, CY = 250
  EZ.scene('coulomb', {
    html: `<div class="kicker" data-at="in" data-fx="left">The force behind everything</div><h2 class="h1" data-at="0">Coulomb’s law</h2>
      <div class="card" style="left:120px;top:320px;width:980px;height:560px" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:0" width="980" height="560" viewBox="0 0 980 560">
          <g class="fr"><line class="fa" x1="0" y1="0" x2="0" y2="0" stroke="#f3a764" stroke-width="10" marker-end="url(#mk-warm)"/></g>
          <g class="nu"></g><g class="el"></g>
          <line class="rl" x1="0" y1="0" x2="0" y2="0" stroke="#a3abbd" stroke-width="4" stroke-dasharray="10 9"/>
          <text class="rt" font-size="40" font-weight="900" text-anchor="middle" class="f-muted" style="fill:#a3abbd">r</text>
          <text class="qt" x="${CX}" y="${CY - 76}" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" style="fill:#f3a764">nucleus (+)</text>
          <text class="et" font-size="34" font-weight="900" text-anchor="middle" style="fill:#3cc7bc">electron (−)</text>
        </svg></div>
      <div class="banner" style="top:900px;font-size:50px" data-at="2" data-fx="pop">F ∝ q₁q₂ / r²</div>
      <div class="zn" style="top:320px" data-at="1" data-fx="right"><b class="pri">Opposite charges attract</b><span>positive nucleus, negative electrons</span></div>
      <div class="zn" style="top:480px" data-at="3" data-fx="right"><b class="teal">Bigger charges</b><span>stronger attraction</span></div>
      <div class="zn" style="top:640px" data-at="4" data-fx="right"><b class="bad">Bigger distance, r</b><span>much weaker attraction</span></div>
      <div class="zn" style="top:790px;padding-top:14px;padding-bottom:16px" data-at="5" data-fx="right"><b class="warm">Double r: force is ¼</b></div>`,
    update(c) {
      const q = 1 + 0.55 * c.p('3', 0.5) - 0.55 * c.p('4', 0.5)
      const rad = 150 + 80 * eio(c.p('4@0.2', 0.8)) - 80 * eio(c.p('5', 0.5)) + 150 * eio(c.p('5@0.45', 1.0))
      const a = c.t * 1.1
      const ex = CX + rad, ey = CY
      const w = 10 * q / Math.pow(rad / 150, 2)
      c.$('.nu').innerHTML = nucleus(CX, CY, 40 + 14 * (q - 1))
      c.$('.el').innerHTML = electron(ex, ey + 6 * Math.sin(a * 3), 22)
      const fa = c.$('.fa'); fa.setAttribute('x1', ex - 30); fa.setAttribute('x2', ex - 30 - Math.min(rad - 100, 120 * Math.max(0.15, q / Math.pow(rad / 150, 2) * 0.8))); fa.setAttribute('y1', ey); fa.setAttribute('y2', ey); fa.setAttribute('stroke-width', Math.max(3, w))
      const rl = c.$('.rl'); rl.setAttribute('x1', CX); rl.setAttribute('x2', ex); rl.setAttribute('y1', CY + 70); rl.setAttribute('y2', CY + 70)
      c.$('.rt').setAttribute('x', (CX + ex) / 2); c.$('.rt').setAttribute('y', CY + 130 - 30)
      c.$('.et').setAttribute('x', ex); c.$('.et').setAttribute('y', CY - 112)
      const vis = clamp((c.t - c.b[0].start) / 0.8)
      c.$('.rl').style.opacity = vis; c.$('.rt').style.opacity = vis; c.$('.qt').style.opacity = vis; c.$('.et').style.opacity = vis
    },
  })

  // ---------- shells and subshells ----------
  const ORDER = [['1s', 's'], ['2s', 's'], ['2p', 'p'], ['3s', 's'], ['3p', 'p'], ['4s', 's'], ['3d', 'd'], ['4p', 'p'], ['5s', 's'], ['4d', 'd'], ['5p', 'p']]
  const BCOL = { s: 'warm', p: 'teal', d: 'pri' }
  EZ.scene('shells', {
    html: `<div class="kicker" data-at="in" data-fx="left">Shells and subshells</div><h2 class="h1" data-at="0">Where electrons sit</h2>
      ${[['s', 2, 'warm'], ['p', 6, 'teal'], ['d', 10, 'pri'], ['f', 14, 'gold']].map(([n, m, col], i) => `<div class="card sub" style="left:${120 + i * 426}px" data-at="2@${(0.08 + i * 0.22).toFixed(2)}" data-fx="up"><span class="big ${col}">${n}</span><span class="sm">up to <b style="color:var(--text)">${m}</b> electrons</span></div>`).join('')}
      <div style="position:absolute;left:120px;top:555px;font-size:30px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)" data-at="3" data-fx="fade">Aufbau: lowest energy first</div>
      ${ORDER.map(([n, k], i) => `<div class="ord o ${BCOL[k]}" data-i="${i}" style="left:${120 + i * 154}px;opacity:0">${n}</div>`).join('')}
      <div class="bad" style="position:absolute;left:${120 + 5 * 154 - 10}px;top:722px;width:${154 * 2 + 20}px;text-align:center;font-size:32px;font-weight:900" data-at="4@0.62" data-fx="fade">4s before 3d</div>
      <div class="card" style="left:120px;top:800px;width:820px;height:140px;padding:26px 36px" data-at="5@0.1" data-fx="right"><b class="pri" style="font-size:40px">Core</b><span style="display:block;font-size:31px;font-weight:700;color:var(--muted)">electrons in the inner shells</span></div>
      <div class="card" style="left:980px;top:800px;width:820px;height:140px;padding:26px 36px" data-at="5@0.5" data-fx="right"><b class="teal" style="font-size:40px">Valence</b><span style="display:block;font-size:31px;font-weight:700;color:var(--muted)">outermost shell: they do the chemistry</span></div>`,
    update(c) {
      const t0 = c.at('4@0.05'), t1 = c.at('4@0.8')
      for (const g of all(c, '.o')) {
        const i = +g.dataset.i, p = clamp((c.t - (t0 + (i / ORDER.length) * (t1 - t0))) / 0.35)
        const hi = (i === 5 || i === 6) ? clamp((c.t - c.at('4@0.55')) / 0.4) : 0
        g.style.opacity = Math.min(1, p * 2.5); g.style.transform = `translateY(${(1 - eo(p)) * 18}px) scale(${0.85 + 0.15 * back(p)})`
        g.style.borderColor = hi ? `rgba(240,112,122,${hi})` : ''
      }
    },
  })

  // ---------- the trick: the periodic table is the filling order ----------
  const PX = 215, PY = 380, PP = 48
  const cellKind = (row, col) => (col <= 2 ? 's' : col >= 13 ? 'p' : row === 4 ? 'd' : '')
  const cellLabel = (row, k) => (k === 's' ? `${row}s` : k === 'p' ? `${row}p` : `${row - 1}d`)
  const CFILL = { s: 'rgba(243,167,100,.32)', p: 'rgba(60,199,188,.32)', d: 'rgba(141,141,240,.34)' }
  const CSTR = { s: WARM, p: TEAL, d: PUR }
  let cells = ''
  for (let row = 2; row <= 4; row++) for (let col = 1; col <= 18; col++) {
    const k = cellKind(row, col); if (!k) continue
    cells += `<g class="${k}b" data-k="${k}"><rect x="${PX + (col - 1) * PP}" y="${PY + (row - 2) * PP}" width="${PP - 5}" height="${PP - 5}" rx="9" fill="${CFILL[k]}" stroke="${CSTR[k]}" stroke-width="3"/><text x="${PX + (col - 1) * PP + (PP - 5) / 2}" y="${PY + (row - 2) * PP + 31}" text-anchor="middle" font-size="20" font-weight="900" style="fill:#eef0f7">${cellLabel(row, k)}</text></g>`
  }
  const rowLabels = [2, 3, 4].map((r) => `<text x="${PX - 14}" y="${PY + (r - 2) * PP + 34}" text-anchor="end" font-size="24" font-weight="800" style="fill:#a3abbd">Row ${r}</text>`).join('')
  const grpLabels = [[1, '1'], [2, '2'], [13, '13'], [18, '18']].map(([g, t]) => `<text x="${PX + (g - 1) * PP + 24}" y="${PY - 14}" text-anchor="middle" font-size="22" font-weight="800" style="fill:#a3abbd">${t}</text>`).join('')
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">The table is the filling order</h2>
      <div class="card" style="left:120px;top:300px;width:1010px;height:340px" data-at="0@0.3"></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.5" data-fx="fade">${rowLabels}${grpLabels}${cells}</g>
        <g class="walk" style="opacity:0"><circle r="14" fill="#fff" stroke="#8d8df0" stroke-width="5"/></g></svg>
      <div style="position:absolute;left:120px;top:668px;width:1010px;text-align:center;font-size:36px;font-weight:800" data-at="1" data-fx="fade">Read it <span class="pri">left to right</span>, <span class="pri">top to bottom</span></div>
      <div class="zn" style="top:300px" data-at="2" data-fx="right"><b class="warm">Groups 1–2 = s block</b></div>
      <div class="zn" style="top:410px;padding-top:20px" data-at="2@0.6" data-fx="right"><b class="teal">Groups 13–18 = p block</b></div>
      <div class="zn" style="top:520px" data-at="3" data-fx="right"><b class="pri">Transition metals = d block</b><span>shell number is one less than the row: row 4 fills 3d</span></div>
      <div class="banner" style="top:860px;font-size:44px" data-at="4" data-fx="pop">Walk across to your element, <span class="teal">writing each block</span> as you pass it</div>`,
    update(c) {
      const t0 = c.at('1@0.15'), t1 = c.at('2'), p = clamp((c.t - t0) / Math.max(0.5, t1 - t0 - 0.2))
      const g = c.$('.walk')
      const rowP = p * 3, row = Math.min(2, Math.floor(rowP)), f = rowP - row
      g.setAttribute('transform', `translate(${PX + 24 + f * (17 * PP)} ${PY + 24 + row * PP})`)
      g.style.opacity = p > 0 && p < 1 ? 1 : 0
    },
  })

  // ---------- worked example: sulfur ----------
  const SB = [['1s', '2', '2', 'warm'], ['2s', '2', '4', 'warm'], ['2p', '6', '10', 'teal'], ['3s', '2', '12', 'warm'], ['3p', '4', '16', 'teal']]
  const SUP = { 2: '²', 4: '⁴', 6: '⁶' }
  EZ.scene('sulfur', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Sulfur: 16 electrons</h2>
      <div style="position:absolute;left:130px;top:330px;width:1000px;height:56px" class="br" data-at="3" data-fx="fade"><svg width="1000" height="56"><path d="M4 50 V14 H${300 * 3 + 80 - 4} V50" fill="none" stroke="#8d8df0" stroke-width="6" stroke-linejoin="round"/></svg></div>
      <div class="pri" style="position:absolute;left:1180px;top:326px;font-size:36px;font-weight:900" data-at="3" data-fx="fade">[Ne] covers the first 10</div>
      ${SB.map(([n, k, t, col], i) => `<div class="ob sb" style="left:${130 + i * 340}px" data-at="1@${(i * 0.19 + 0.02).toFixed(2)}" data-fx="up"><span class="nm ${col}">${n}<sup style="font-size:.55em;vertical-align:.5em">${k}</sup></span><span class="ct">${k} electrons</span></div>
        <div class="tot" style="left:${130 + i * 340}px" data-at="1@${(i * 0.19 + 0.1).toFixed(2)}" data-fx="fade"><span class="muted" style="font-size:30px">total </span>${t}</div>`).join('')}
      <div class="ln" style="top:690px;font-size:56px" data-at="2" data-fx="up"><span style="color:var(--muted);font-size:34px">Full form &nbsp;</span>1s² 2s² 2p⁶ 3s² 3p⁴</div>
      <div class="ln" style="top:770px;font-size:56px" data-at="3@0.4" data-fx="up"><span style="color:var(--muted);font-size:34px">Shorthand &nbsp;</span><span class="pri">[Ne]</span> 3s² 3p⁴</div>
      <div class="banner" style="top:880px" data-at="4" data-fx="pop">3s² 3p⁴ = <span class="teal">6 valence electrons</span></div>`,
    update(c) {
      const hi = c.p('4', 0.5)
      all(c, '.sb').forEach((el, i) => { el.style.borderColor = hi && i >= 3 ? `rgba(60,199,188,${hi})` : '' })
    },
  })

  // ---------- ions ----------
  EZ.scene('ions', {
    html: `<div class="kicker" data-at="in" data-fx="left">Electron configurations of ions</div><h2 class="h1" data-at="0">Adding and removing electrons</h2>
      <div class="card" style="left:120px;top:310px;width:840px;height:230px;padding:24px 36px" data-at="1" data-fx="right"><b class="teal" style="font-size:44px">Anions: add electrons</b><div style="margin-top:12px;font-size:36px;font-weight:800;color:var(--muted)">to the next open spot</div><div style="margin-top:10px;font-size:46px;font-weight:900">Cl⁻ = [Ne] 3s² 3p⁶ <span class="muted" style="font-size:34px">same as argon</span></div></div>
      <div class="card" style="left:1000px;top:310px;width:800px;height:230px;padding:24px 36px" data-at="2" data-fx="right"><b class="warm" style="font-size:44px">Cations: remove electrons</b><div style="margin-top:12px;font-size:36px;font-weight:800;color:var(--muted)">from the</div><div style="margin-top:6px;font-size:50px;font-weight:900"><span class="warm">highest shell (n)</span> first</div></div>
      <div class="cx" style="top:580px;border-color:rgba(240,112,122,.7)" data-at="3" data-fx="up"><small class="bad" style="color:var(--bad)">Watch out: transition metals</small>lose <span class="warm">4s</span> before <span class="pri">3d</span>, even though 4s filled first</div>
      <div class="ln" style="top:770px;font-size:54px" data-at="4" data-fx="up">Fe = [Ar] <span class="warm">4s²</span> 3d⁶ &nbsp;<span class="arr"></span>&nbsp; <span class="good">Fe²⁺ = [Ar] 3d⁶</span></div>
      <div class="ln" style="top:858px;font-size:40px;color:var(--muted)" data-at="4@0.6" data-fx="fade"><span class="bad">Not</span> [Ar] 4s² 3d⁴</div>`,
  })

  // ---------- ionization energy ----------
  const IX = 380, IY = 290
  EZ.scene('ie', {
    html: `<div class="kicker" data-at="in" data-fx="left">Ionization energy</div><h2 class="h1" data-at="0">Energy to <span class="warm">remove an electron</span></h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:560px" data-at="0@0.5">
        <svg style="position:absolute;left:0;top:0" width="760" height="560" viewBox="0 0 760 560">
          <circle cx="${IX}" cy="${IY + 30}" r="96" fill="none" stroke="#8d8df0" stroke-width="3" stroke-dasharray="8 8"/>
          <circle cx="${IX}" cy="${IY + 30}" r="220" fill="none" stroke="#3cc7bc" stroke-width="3" stroke-dasharray="8 8"/>
          <g class="nu2">${nucleus(IX, IY + 30, 38)}</g><g class="ce"></g><g class="ve"></g>
          <text x="${IX}" y="${IY + 30 + 96 + 34}" text-anchor="middle" font-size="28" font-weight="900" style="fill:#8d8df0" data-at="3" data-fx="fade">core</text>
          <text x="${IX}" y="${IY + 30 - 220 - 14}" text-anchor="middle" font-size="28" font-weight="900" style="fill:#3cc7bc" data-at="4" data-fx="fade">valence</text>
        </svg></div>
      <div class="zn" style="top:320px" data-at="0@0.7" data-fx="right"><b class="warm">Ionization energy</b><span>the energy needed to remove an electron</span></div>
      <div class="zn" style="top:510px" data-at="1" data-fx="right"><b class="teal">Closer to the nucleus</b><span>smaller r: larger ionization energy</span></div>
      <div class="zn" style="top:665px;padding-bottom:14px" data-at="2" data-fx="right"><b class="pri">Larger effective nuclear charge</b><span class="ef" data-at="3" data-fx="fade">= nuclear charge − shielding from core electrons</span></div>
      <div class="banner" style="top:900px;font-size:46px" data-at="4" data-fx="pop"><span class="pri">Core</span> electrons need far more energy than <span class="teal">valence</span></div>`,
    update(c) {
      const a = c.t * 1.3
      c.$('.ce').innerHTML = [0, Math.PI].map((o) => electron(IX + 96 * Math.cos(a + o), IY + 30 + 96 * Math.sin(a + o), 15, 'pur')).join('')
      c.$('.ve').innerHTML = electron(IX + 220 * Math.cos(-a * 0.6 + 1), IY + 30 + 220 * Math.sin(-a * 0.6 + 1), 17)
    },
  })

  // ---------- good news (what the exam does not test) ----------
  const cross = (col) => `<svg width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="50" fill="none" stroke="${col}" stroke-width="7"/><path d="M36 36L74 74M74 36L36 74" stroke="${col}" stroke-width="9" stroke-linecap="round"/></svg>`
  const tick = '<svg width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="52" fill="#4cc781"/><path d="M30 57l17 17 33-37" fill="none" stroke="#10131c" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Good news</div><h2 class="h1" data-at="0">What the exam skips</h2>
      <div class="card nb" style="left:120px" data-at="1" data-fx="up">${cross(BAD)}<p><span class="bad">Not tested</span></p><p style="font-size:44px;margin-top:20px">Quantum numbers</p><p style="font-size:40px;margin-top:14px;color:var(--muted)">n, l, mₗ, mₛ</p></div>
      <div class="card nb" style="left:690px" data-at="2" data-fx="up">${cross(BAD)}<p><span class="bad">Not asked</span></p><p style="font-size:44px;margin-top:20px">The “exception”<br>elements</p><p style="font-size:40px;margin-top:14px;color:var(--muted)">like Cr and Cu</p></div>
      <div class="card nb" style="left:1260px" data-at="3" data-fx="up">${tick}<p><span class="good">Focus on</span></p><p style="font-size:42px;margin-top:20px;line-height:1.45">Aufbau<br>Noble-gas shorthand<br>Ions</p></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', '[Ar] 4s²', '1@0.3'], ['B', '[Ar]', '1@0.5'], ['C', '[Ar] 4s² 3d²', '1@0.66'], ['D', '[Ne] 3s²', '1@0.86']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What is the configuration of <span class="teal">Ca²⁺</span>?</h2>
      ${OPTS.map(([l, s, at], i) => `<div class="opt t${i}" style="top:${290 + i * 114}px" data-at="${at}" data-fx="left"><div class="l">${l}</div>${s}
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="862" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="862" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 862)"/>
        <text class="num" x="960" y="886" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="982" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:775px;font-size:46px" data-at="4" data-fx="pop">Ca = [Ar] 4s² ${ARR} lose both <span class="warm">4s</span> ${ARR} <span class="teal">[Ar]</span></div>
      <div class="ln" style="top:895px;font-size:42px;color:var(--muted)" data-at="5" data-fx="fade">[Ar] = 1s² 2s² 2p⁶ 3s² 3p⁶</div>`,
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
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${nucleus(110, 105, 34)}${electron(350, 105, 18)}<line x1="320" y1="105" x2="170" y2="105" stroke="#f3a764" stroke-width="9" marker-end="url(#mk-warm)"/></svg>`
  const chip = (x, t, col) => `<rect x="${x}" y="70" width="120" height="70" rx="16" fill="rgba(36,40,56,.95)" stroke="${col}" stroke-width="4"/><text x="${x + 60}" y="118" text-anchor="middle" font-size="40" font-weight="900" style="fill:${col}">${t}</text>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${chip(20, 's 2', WARM)}${chip(170, 'p 6', TEAL)}${chip(320, 'd 10', PUR)}</svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="40" y="80" font-size="40" font-weight="900" style="fill:#eef0f7">Fe [Ar] <tspan style="fill:#f3a764">4s²</tspan> 3d⁶</text><path d="M230 100V140" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/><text x="40" y="190" font-size="40" font-weight="900" style="fill:#4cc781">Fe²⁺ [Ar] 3d⁶</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>F ∝ q₁q₂ / r²<br><span class="teal">More charge</span>: stronger pull<br><span class="bad">More distance</span>: weaker pull</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Fill subshells in order<br>Use the <span class="pri">periodic table</span><br>as your map</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Cations lose electrons<br>from the <span class="warm">highest n</span> first:<br>4s before 3d</p></div>`,
  })
})()
