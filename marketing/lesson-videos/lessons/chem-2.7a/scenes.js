// Pictures for chem-2.7a "VSEPR: Shapes of Molecules". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u2.ts): the shape table, the "lone pairs
// are fat" angles, the NH3 example, the CO2 / H2O trap and the SO2 question. Atoms are schematic.
(() => {
  const { clamp, eio, eo, back, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .nt{position:absolute;left:1000px;width:820px;height:128px;padding:20px 30px 0 116px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .nt small{position:absolute;left:30px;top:50%;margin-top:-31px;width:62px;height:62px;border-radius:50%;background:var(--brand);font-size:36px;font-weight:900;line-height:62px;text-align:center}
    .nt b{display:block;font-size:38px;font-weight:900;line-height:1.15} .nt span{display:block;margin-top:6px;font-size:30px;font-weight:700;line-height:1.25;color:var(--muted)}
    .ft{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:35px;font-weight:800;white-space:nowrap;line-height:1.25}
    .col3{top:320px;width:540px;height:560px}
    .tb2{position:absolute;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);overflow:hidden}
    .tr{display:grid;align-items:center;white-space:nowrap;font-weight:800;padding:0 24px;border-top:2px solid rgba(255,255,255,.06)}
    .tr.hd{font-size:26px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);border-top:0;height:58px}
    .tl{grid-template-columns:90px 90px 160px 340px 150px 1fr;height:88px;font-size:33px}
    .tr2{grid-template-columns:90px 90px 400px 1fr;height:76px;font-size:31px}
    .tr sub{font-size:.62em}
    .ch{display:inline-block;margin:0 14px;padding:14px 30px;border-radius:40px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:38px;font-weight:900}
    .opt{position:absolute;left:120px;width:1680px;height:100px;padding-left:112px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:35px;font-weight:800;white-space:nowrap}
    .opt .l{position:absolute;left:26px;top:20px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:24px;top:16px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const rad = (a) => (a * Math.PI) / 180
  const pt = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))]
  const LOBE = '#f2c443'
  // a lone-pair lobe pointing at screen angle a (degrees, 0 = right, 90 = up)
  const lobe = (cx, cy, d, a, rx, ry, cls = 'lp', op = 0.6) => { const [x, y] = pt(cx, cy, d, a)
    return `<ellipse class="${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx}" ry="${ry}" transform="rotate(${-a} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${LOBE}" fill-opacity="${op}" stroke="${LOBE}" stroke-width="3"/>` }
  // a molecule: central atom at (cx, cy), bonded atoms at angles `atoms` (a number, or [angle, dim]), lone pairs at `lps`
  const mol = (cx, cy, R, atoms, lps = [], o = {}) => {
    const cr = o.cr ?? R * 0.3, ar = o.ar ?? R * 0.2, lw = o.lw ?? Math.max(3, R * 0.05)
    const L = lps.map((a) => lobe(cx, cy, R * 0.62, a, o.lrx ?? R * 0.46, o.lry ?? R * 0.3, 'lp', o.lop ?? 0.6)).join('')
    const B = atoms.map((e) => { const [a, dim] = Array.isArray(e) ? e : [e, false], [x, y] = pt(cx, cy, R, a)
      return `<g opacity="${dim ? 0.38 : 1}"><line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#dfe3ee" stroke-width="${lw}" stroke-linecap="round"/>${ball(x.toFixed(1), y.toFixed(1), ar, 'teal', o.al ?? '', ar * 0.9)}</g>` }).join('')
    return `${B}${L}${ball(cx, cy, cr, 'pur', o.cl ?? '', cr * 0.9)}` }
  const sub = (s) => `<sub>${s}</sub>`

  // ---------- intro artwork ----------
  EZ.intro = {
    chips: [['1@0.28', 'Electron domains'], ['1@0.52', 'The shape table'], ['1@0.76', 'Lone pairs squeeze angles']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.25">${mol(230, 260, 90, [215, 325], [60, 120])}${mol(1690, 260, 90, [135, 45, 225, 315])}</svg>`,
  }

  // ---------- hook: bent water ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Shape is destiny</div><h2 class="h1" data-at="0">Why is water <span class="teal">bent</span>?</h2>
      <div class="card" style="left:120px;top:300px;width:800px;height:460px" data-at="0@0.6"><h3>If it were straight</h3>
        <svg style="position:absolute;left:0;top:90px" width="800" height="350" viewBox="0 0 800 350">
          ${mol(400, 150, 190, [180, 0], [], { cl: 'O', al: 'H', cr: 62, ar: 42 })}
          <g data-at="1@0.3" data-fx="pop"><text x="400" y="300" text-anchor="middle" font-size="50" font-weight="900" class="f-bad">nonpolar</text></g></svg></div>
      <div class="card" style="left:1000px;top:300px;width:800px;height:460px" data-at="0"><h3>Real water</h3>
        <svg style="position:absolute;left:0;top:90px" width="800" height="350" viewBox="0 0 800 350">
          ${mol(400, 165, 150, [230, 310], [60, 120], { cl: 'O', al: 'H', cr: 62, ar: 42 })}
          <text x="660" y="190" text-anchor="middle" font-size="54" font-weight="900" class="f-teal">bent</text></svg></div>
      <div style="position:absolute;left:0;right:0;top:790px;text-align:center">
        <span class="ch" data-at="2@0.05" data-fx="pop">dissolves salt</span><span class="ch" data-at="2@0.42" data-fx="pop">forms oceans</span><span class="ch" data-at="2@0.74" data-fx="pop">keeps you alive</span></div>
      <div class="banner" style="top:900px" data-at="3" data-fx="pop">Shape is <span class="warm">destiny</span> in chemistry</div>`,
    update(c) { for (const e of c.root.querySelectorAll('.lp')) e.style.opacity = 0.75 + 0.25 * Math.sin(c.t * 4) },
  })

  // ---------- VSEPR in one sentence ----------
  const DOM = [['Lone pair', 'dots'], ['Single bond', 1], ['Double bond', 2], ['Triple bond', 3]]
  const glyph = (k) => k === 'dots' ? `<svg width="190" height="64" viewBox="0 0 190 64"><ellipse cx="95" cy="32" rx="60" ry="24" fill="${LOBE}" fill-opacity=".6" stroke="${LOBE}" stroke-width="3"/><circle cx="76" cy="32" r="7" fill="#10131c"/><circle cx="114" cy="32" r="7" fill="#10131c"/></svg>`
    : `<svg width="190" height="64" viewBox="0 0 190 64">${[...Array(k)].map((_, i) => `<line x1="40" x2="150" y1="${32 + (i - (k - 1) / 2) * 13}" y2="${32 + (i - (k - 1) / 2) * 13}" stroke="#dfe3ee" stroke-width="7" stroke-linecap="round"/>`).join('')}${ball(30, 32, 22, 'pur')}${ball(160, 32, 22, 'teal')}</svg>`
  const VC = [500, 590]
  EZ.scene('vsepr', {
    html: `<div class="kicker" data-at="in" data-fx="left">The idea</div><h2 class="h1" data-at="0">Domains spread <span class="teal">as far apart as possible</span></h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">${[0, 1, 2, 3].map((i) => `<g><line class="sl" data-i="${i}" x1="${VC[0]}" y1="${VC[1]}" x2="${VC[0]}" y2="${VC[1]}" stroke="#dfe3ee" stroke-width="9" stroke-linecap="round"/><ellipse class="se" data-i="${i}" rx="62" ry="38" fill="${LOBE}" fill-opacity=".6" stroke="${LOBE}" stroke-width="3"/></g>`).join('')}
          ${ball(VC[0], VC[1], 60, 'pur', 'A', 54)}</g>
        <text x="${VC[0]}" y="870" text-anchor="middle" font-size="34" font-weight="800" class="f-muted" data-at="1@0.3" data-fx="fade">electron pairs repel</text>
      </svg>
      ${DOM.map(([t, k], i) => `<div class="card" style="left:1000px;top:${300 + i * 116}px;width:820px;height:100px;display:flex;align-items:center;padding:0 34px;gap:26px" data-at="2@${[0.12, 0.38, 0.6, 0.8][i]}" data-fx="right">
        <div style="width:190px;height:64px">${glyph(k)}</div><div style="font-size:38px;font-weight:900;flex:1">${t}</div><div class="teal" style="font-size:36px;font-weight:900">1 domain</div></div>`).join('')}
      <div class="banner" style="top:790px;left:1000px;right:auto;width:820px;font-size:38px" data-at="3" data-out="4" data-fx="pop">A multiple bond counts as <span class="warm">ONE</span> domain</div>
      <div class="nt" style="left:120px;top:900px;width:880px;height:100px;padding:14px 20px 0 100px" data-at="4"><small style="width:52px;height:52px;line-height:52px;margin-top:-26px;font-size:30px">1</small><b style="font-size:34px">Count domains</b><span style="font-size:26px;margin-top:0">gives the electron geometry</span></div>
      <div class="nt" style="left:1040px;top:900px;width:760px;height:100px;padding:14px 20px 0 100px" data-at="5"><small style="width:52px;height:52px;line-height:52px;margin-top:-26px;font-size:30px">2</small><b style="font-size:34px">Atoms only</b><span style="font-size:26px;margin-top:0">names the molecular shape</span></div>`,
    update(c) {
      const sp = eio(c.p('1', 1.6)), from = [78, 90, 102, 114], to = [45, 135, 225, 315]
      for (let i = 0; i < 4; i++) {
        const a = from[i] + (to[i] - from[i]) * sp, [x, y] = pt(VC[0], VC[1], 200, a), l = c.$(`.sl[data-i="${i}"]`), e = c.$(`.se[data-i="${i}"]`)
        l.setAttribute('x2', x.toFixed(1)); l.setAttribute('y2', y.toFixed(1))
        e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); e.setAttribute('transform', `rotate(${-a.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`)
      }
    },
  })

  // ---------- the shape table ----------
  const LEFT = [
    [2, 0, 'linear', '180°', `CO${sub(2)}`, [180, 0], []],
    [3, 0, 'trigonal planar', '120°', `BF${sub(3)}`, [90, 210, 330], []],
    [3, 1, 'bent', '&lt;120°', `SO${sub(2)}`, [215, 325], [90]],
    [4, 0, 'tetrahedral', '109.5°', `CH${sub(4)}`, [135, 45, 225, 315], []],
    [4, 1, 'trigonal pyramidal', '~107°', `NH${sub(3)}`, [215, 270, 325], [90]],
    [4, 2, 'bent', '~104.5°', `H${sub(2)}O`, [230, 310], [60, 120]],
  ]
  const RIGHT = [[5, 0, 'trigonal bipyramidal', `PCl${sub(5)}`], [5, 1, 'seesaw', `SF${sub(4)}`], [5, 2, 'T-shaped', `ClF${sub(3)}`], [5, 3, 'linear', `XeF${sub(2)}`],
    [6, 0, 'octahedral', `SF${sub(6)}`], [6, 1, 'square pyramidal', `BrF${sub(5)}`], [6, 2, 'square planar', `XeF${sub(4)}`]]
  const LAT = ['1', '2', '3', '4', '5@0.1', '5@0.6']
  EZ.scene('shapes', {
    html: `<div class="kicker" data-at="in" data-fx="left">The shape table</div><h2 class="h1" data-at="0">Domains + lone pairs = <span class="teal">shape</span></h2>
      <div class="tb2" style="left:60px;top:290px;width:1020px;height:${58 + 6 * 88}px" data-at="0@0.5">
        <div class="tr tl hd"><span>Dom.</span><span>Lone</span><span></span><span>Shape</span><span>Angle</span><span>Ex.</span></div>
        ${LEFT.map(([d, l, s, a, e, at, lp], i) => `<div class="tr tl" data-at="${LAT[i]}" data-fx="right"><span>${d}</span><span>${l}</span>
          <svg width="150" height="76" viewBox="0 0 150 76">${mol(75, 40, 30, at, lp, { cr: 11, ar: 8, lw: 3.5, lrx: 14, lry: 9 })}</svg>
          <span class="${s === 'bent' || s === 'trigonal pyramidal' ? 'warm' : 'teal'}">${s}</span><span>${a}</span><span>${e}</span></div>`).join('')}</div>
      <div class="tb2" style="left:1110px;top:290px;width:750px;height:${58 + 7 * 76}px" data-at="6">
        <div class="tr tr2 hd"><span>Dom.</span><span>Lone</span><span>Shape</span><span>Ex.</span></div>
        ${RIGHT.map(([d, l, s, e], i) => `<div class="tr tr2" data-at="6@${(0.08 + i * 0.1).toFixed(2)}" data-fx="right"><span>${d}</span><span>${l}</span><span class="teal">${s}</span><span>${e}</span></div>`).join('')}</div>`,
  })

  // ---------- lone pairs are fat ----------
  const FAT = [['CH', 4, '109.5°', 'no lone pairs', [[55, true], [125, true]], []], ['NH', 3, '~107°', 'one lone pair', [[55, true]], [125]], ['H', 2, '~104.5°', 'two lone pairs', [], [55, 125]]]
  const arc = (cx, cy, r, half) => { const [x1, y1] = pt(cx, cy, r, 270 - half), [x2, y2] = pt(cx, cy, r, 270 + half); return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)}` }
  EZ.scene('fat', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Lone pairs are <span class="warm">“fat”</span></h2>
      <div data-at="1" data-out="3-0.3" data-fx="fade">
        <svg class="full" viewBox="0 0 1920 1080">
          ${ball(500, 520, 52, 'pur', 'A', 46)}${ball(640, 520, 0.1, 'pur')}
          <ellipse cx="660" cy="520" rx="96" ry="30" fill="${LOBE}" fill-opacity=".6" stroke="${LOBE}" stroke-width="3"/>
          <text x="590" y="640" text-anchor="middle" font-size="42" font-weight="900" class="f-teal">bonding pair</text><text x="590" y="690" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">less space</text>
          ${ball(1160, 520, 52, 'pur', 'A', 46)}
          <ellipse class="lp" cx="1372" cy="520" rx="150" ry="96" fill="${LOBE}" fill-opacity=".6" stroke="${LOBE}" stroke-width="3"/>
          <text x="1290" y="700" text-anchor="middle" font-size="42" font-weight="900" class="f-warm">lone pair</text><text x="1290" y="750" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">more space</text></svg>
        <div class="banner" style="top:830px" data-at="2" data-fx="pop">They <span class="warm">squeeze</span> the bond angles smaller</div></div>
      ${FAT.map(([a, n, ang, lab, atoms, lps], i) => `<div class="card col3" style="left:${120 + i * 570}px" data-at="${3 + i}"><h3>${i === 2 ? `H${sub(2)}O` : `${a}${sub(n)}`}</h3>
        <svg style="position:absolute;left:0;top:96px;overflow:visible" width="540" height="330" viewBox="0 0 540 330">
          ${mol(270, 165, 135, [[270 - (54.75 - i * 1.25), false], [270 + (54.75 - i * 1.25), false], ...atoms], lps, { cr: 44, ar: 30, lrx: 62, lry: 42 })}
          <path d="${arc(270, 165, 78, 54.75 - i * 1.25)}" fill="none" stroke="#f0707a" stroke-width="7" stroke-linecap="round"/></svg>
        <div class="ft"><span class="warm" style="font-size:54px;font-weight:900">${ang}</span><br><span class="${i ? 'warm' : 'teal'}">${lab}</span></div></div>`).join('')}
      <div class="banner" style="top:900px;font-size:40px" data-at="6" data-fx="pop">Each extra lone pair <span class="warm">squeezes</span> the angle a bit more</div>`,
    update(c) { for (const e of c.root.querySelectorAll('.lp')) e.style.opacity = 0.8 + 0.2 * Math.sin(c.t * 4) },
  })

  // ---------- worked example: NH3 ----------
  const NC = [480, 520], H1 = [260, 760], H2 = [490, 830], H3 = [720, 750], LT = [480, 270]
  EZ.scene('nh3', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Shape of <span class="teal">NH${sub(3)}</span></h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g class="td" data-at="2" data-fx="fade" fill="none" stroke="#8d8df0" stroke-width="5" stroke-dasharray="14 10" stroke-linejoin="round">
          <polygon points="${H1} ${H2} ${H3}"/><polyline points="${H1} ${LT} ${H3}"/><line x1="${LT[0]}" y1="${LT[1]}" x2="${H2[0]}" y2="${H2[1]}"/></g>
        <g class="py" data-at="3" data-fx="fade"><polygon points="${H1} ${H2} ${H3} ${NC}" fill="rgba(60,199,188,.16)" stroke="#3cc7bc" stroke-width="6" stroke-linejoin="round"/></g>
        <g data-at="1" data-fx="fade">
          ${[H1, H2, H3].map(([x, y]) => `<line x1="${NC[0]}" y1="${NC[1]}" x2="${x}" y2="${y}" stroke="#dfe3ee" stroke-width="9" stroke-linecap="round"/>`).join('')}
          <g class="lpg"><ellipse class="lp" cx="${NC[0]}" cy="400" rx="78" ry="125" fill="${LOBE}" fill-opacity=".6" stroke="${LOBE}" stroke-width="3"/></g>
          ${[H1, H2, H3].map(([x, y]) => ball(x, y, 38, 'teal', 'H', 36)).join('')}${ball(NC[0], NC[1], 62, 'pur', 'N', 56)}</g>
        <text x="${NC[0] + 150}" y="330" font-size="38" font-weight="900" class="f-warm" data-at="1@0.55" data-fx="fade">lone pair</text>
        <text x="260" y="940" font-size="38" font-weight="900" class="f-pri" data-at="2@0.5" data-fx="fade">tetrahedral electron geometry</text>
        <text x="260" y="995" font-size="38" font-weight="900" class="f-teal" data-at="3@0.4" data-fx="fade">trigonal pyramidal shape</text>
      </svg>
      <div class="nt" style="top:290px" data-at="1" data-fx="right"><small>1</small><b>Lewis diagram</b><span>N: 3 bonds to H, 1 lone pair</span></div>
      <div class="nt" style="top:442px" data-at="2" data-fx="right"><small>2</small><b class="pri">3 bonds + 1 lone pair = 4 domains</b><span>tetrahedral electron geometry</span></div>
      <div class="nt" style="top:594px" data-at="3" data-fx="right"><small>3</small><b class="teal">Atoms only: a pyramid</b><span>trigonal pyramidal</span></div>
      <div class="nt" style="top:746px" data-at="4" data-fx="right"><small>4</small><b class="warm">The lone pair squeezes</b><span>about 107°, a bit less than 109.5°</span></div>`,
    update(c) {
      c.$('.lpg').style.opacity = (0.8 + 0.2 * Math.sin(c.t * 4)) * (1 - 0.72 * c.p('3', 0.8))
      c.$('.td').style.opacity = c.p('2', 0.5) * (1 - 0.6 * c.p('3', 0.8))
    },
  })

  // ---------- the trap ----------
  const bondLines = (x1, x2, y, n) => [...Array(n)].map((_, i) => `<line x1="${x1}" x2="${x2}" y1="${y + (i - (n - 1) / 2) * 16}" y2="${y + (i - (n - 1) / 2) * 16}" stroke="#dfe3ee" stroke-width="8" stroke-linecap="round"/>`).join('')
  EZ.scene('trap', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Same formula type, <span class="bad">different shape</span></h2>
      <div style="position:absolute;left:0;right:0;top:262px;text-align:center" data-at="1" data-fx="fade"><span class="ch">CO${sub(2)} = AX${sub(2)}</span><span class="ch">H${sub(2)}O = AX${sub(2)}</span></div>
      <div class="card" style="left:100px;top:380px;width:820px;height:490px" data-at="3"><h3>CO${sub(2)}</h3>
        <svg style="position:absolute;left:0;top:90px" width="820" height="250" viewBox="0 0 820 250">
          ${bondLines(220, 410, 120, 2)}${bondLines(410, 600, 120, 2)}${ball(190, 120, 52, 'teal', 'O', 48)}${ball(630, 120, 52, 'teal', 'O', 48)}${ball(410, 120, 60, 'pur', 'C', 54)}</svg>
        <div class="ft"><span class="teal" style="font-size:48px;font-weight:900">linear</span><br>2 domains, no lone pairs</div></div>
      <div class="card" style="left:1000px;top:380px;width:820px;height:490px" data-at="2"><h3>H${sub(2)}O</h3>
        <svg style="position:absolute;left:0;top:70px;overflow:visible" width="820" height="270" viewBox="0 0 820 270">
          ${mol(410, 150, 125, [228, 312], [60, 120], { cl: 'O', al: 'H', cr: 50, ar: 34, lrx: 58, lry: 38 })}</svg>
        <div class="ft"><span class="warm" style="font-size:48px;font-weight:900">bent</span><br>4 domains, 2 lone pairs</div></div>
      <div class="banner" style="top:904px" data-at="4" data-fx="pop">Always draw the <span class="teal">Lewis diagram</span> first</div>`,
    update(c) { for (const e of c.root.querySelectorAll('.lp')) e.style.opacity = 0.75 + 0.25 * Math.sin(c.t * 4) },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'linear', '1@0.12'], ['B', 'bent', '1@0.3'], ['C', 'trigonal planar', '1@0.55'], ['D', 'tetrahedral', '1@0.8']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Molecular shape of <span class="teal">SO${sub(2)}</span>?</h2>
      <div style="position:absolute;left:0;right:0;text-align:center;top:748px;font-size:34px;font-weight:800;color:var(--muted)" data-at="1@0.2" data-fx="fade">The S has one lone pair and is bonded to two O atoms</div>
      ${OPTS.map(([l, s, at], i) => `<div class="opt t${i}" style="top:${290 + i * 114}px" data-at="${at}" data-fx="left"><div class="l">${l}</div>${s}
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="862" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="862" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 862)"/>
        <text class="num" x="960" y="886" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="982" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:800px;font-size:44px" data-at="4" data-out="5" data-fx="pop">2 bonds + 1 lone pair = 3 domains ${ARR} <span class="teal">trigonal planar</span></div>
      <div class="banner" style="top:800px;font-size:44px" data-at="5" data-fx="pop">Atoms only ${ARR} <span class="warm">bent</span>, a little under 120°</div>`,
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
  const m1 = `<svg width="460" height="230" viewBox="0 0 460 230">${mol(230, 115, 90, [45, 135, 225, 315], [], { cr: 26, ar: 18 })}</svg>`
  const m2 = `<svg width="460" height="230" viewBox="0 0 460 230"><ellipse cx="230" cy="48" rx="34" ry="52" fill="${LOBE}" fill-opacity=".12" stroke="${LOBE}" stroke-width="3" stroke-dasharray="7 7"/>
    ${[[120, 175], [235, 200], [345, 170]].map(([x, y]) => `<line x1="230" y1="110" x2="${x}" y2="${y}" stroke="#dfe3ee" stroke-width="6" stroke-linecap="round"/>${ball(x, y, 20, 'teal')}`).join('')}${ball(230, 110, 32, 'pur')}</svg>`
  const m3 = `<svg width="460" height="230" viewBox="0 0 460 230">${['109.5°', '107°', '104.5°'].map((t, i) => `<text x="${i * 154 + 76}" y="${116}" text-anchor="middle" font-size="34" font-weight="900" class="${i === 0 ? 'f-teal' : 'f-warm'}">${t}</text>`).join('')}
    <line x1="138" x2="162" y1="106" y2="106" stroke="#a3abbd" stroke-width="5" marker-end="url(#mk-muted)"/><line x1="292" x2="316" y1="106" y2="106" stroke="#a3abbd" stroke-width="5" marker-end="url(#mk-muted)"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p><span class="teal">Count</span> electron domains<br>(a multiple bond = 1)<br>They spread out</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Name the shape by<br><span class="teal">atoms only</span><br>Lone pairs: invisible,<br>but they take space</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Lone pairs <span class="warm">shrink</span><br>bond angles</p></div>`,
  })
})()
