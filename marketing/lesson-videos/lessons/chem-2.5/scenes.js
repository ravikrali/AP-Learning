// Pictures for chem-2.5 "Lewis Diagrams". One EZ.scene per scene id in script.mjs.
// Numbers shown are the lesson's own (app/src/content/chem/u2.ts). Atoms are drawn as labelled
// balls with bonds as lines and lone pairs as dots; sizes are not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em}
    .lbl{position:absolute;font-size:40px;font-weight:900;white-space:nowrap}
    .chip3{position:absolute;top:700px;width:380px;height:110px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center;font-size:46px;font-weight:900;line-height:104px}
    .srow{position:absolute;left:120px;width:1680px;height:118px;border-radius:26px;background:rgba(36,40,56,.8);border:2px solid var(--line)}
    .srow .n{position:absolute;left:26px;top:27px;width:64px;height:64px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:64px;text-align:center}
    .srow .t{position:absolute;left:112px;top:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .srow .d{position:absolute;left:500px;top:38px;font-size:29px;font-weight:700;color:var(--muted);white-space:nowrap}
    .srow svg{position:absolute;left:1420px;top:0}
    .note{position:absolute;left:1290px;width:520px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .note i{position:absolute;left:22px;top:26px;width:46px;height:46px;border-radius:50%}
    .note b{display:block;font-size:30px;font-weight:900;line-height:1.15;white-space:nowrap} .note span{display:block;font-size:25px;font-weight:700;color:var(--muted);white-space:nowrap}
    .counter{position:absolute;left:300px;top:810px;width:700px;height:116px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid rgba(60,199,188,.6);font-size:36px;font-weight:800;color:var(--muted);line-height:110px;padding-left:40px}
    .counter b{position:absolute;right:40px;top:0;font-size:72px;font-weight:900;color:var(--accent)}
    .xc{top:310px;width:540px;height:600px;text-align:center}
    .xc h3{padding:26px 20px 0}
    .xc .s{font-size:30px;font-weight:800;color:var(--muted);margin-top:4px}
    .xc svg{position:absolute;left:0;top:140px}
    .xc .foot{position:absolute;left:20px;right:20px;bottom:28px;font-size:40px;font-weight:900}
    .tile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:58px;font-size:104px;font-weight:900;line-height:1}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .htile{position:absolute;top:350px;width:390px;height:400px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .htile .v{position:absolute;left:0;right:0;bottom:26px;font-size:60px;font-weight:900}
    .rule{position:absolute;top:320px;width:810px;height:200px;border-radius:30px;border:3px solid;display:flex;align-items:center;justify-content:center;gap:10px;font-size:48px;font-weight:900}
    .sum{position:absolute;left:120px;top:570px;width:1680px;height:340px}
    .sum .ion{position:absolute;left:60px;top:104px;font-size:96px;font-weight:900}
    .term{position:absolute;top:70px;width:230px;text-align:center}
    .term b{display:block;font-size:110px;font-weight:900;line-height:1.1} .term span{display:block;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .work{position:absolute;left:120px;top:650px;width:1680px;height:250px;text-align:center;font-size:58px;font-weight:900;padding-top:38px;line-height:1.45}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const rad = (a) => (a * Math.PI) / 180
  const DOT = '#3cc7bc'
  /** a lone pair: two dots just outside an atom of radius r, at angle a (degrees, 0 = right, 90 = up) */
  const pair = (cx, cy, r, a, k = 1) => { const d = r + 26 * k, x = cx + d * Math.cos(rad(a)), y = cy - d * Math.sin(rad(a)), dx = 13 * k * Math.sin(rad(a)), dy = 13 * k * Math.cos(rad(a))
    return `<circle cx="${x + dx}" cy="${y + dy}" r="${9 * k}" fill="${DOT}"/><circle cx="${x - dx}" cy="${y - dy}" r="${9 * k}" fill="${DOT}"/>` }
  /** the finished CO2 diagram, O=C=O with two lone pairs on each O, centred on (cx, cy), k = scale */
  const co2 = (cx, cy, k = 1) => { const s = 300 * k, ro = 76 * k, rc = 70 * k
    return `${[-14, 14].map((o) => `<line x1="${cx - s}" x2="${cx + s}" y1="${cy + o * k}" y2="${cy + o * k}" stroke="#eef0f7" stroke-width="${9 * k}"/>`).join('')}
      ${ball(cx - s, cy, ro, 'red', 'O')}${ball(cx, cy, rc, 'gray', 'C')}${ball(cx + s, cy, ro, 'red', 'O')}
      ${pair(cx - s, cy, ro, 135, k)}${pair(cx - s, cy, ro, 225, k)}${pair(cx + s, cy, ro, 45, k)}${pair(cx + s, cy, ro, -45, k)}` }
  /** a central atom with n bonded outer atoms; each bond carries its two electrons as dots */
  const star = (cx, cy, n, R, rc, ro, cl, ol, rot = 90, fs) => { let lines = '', outs = '', dots = ''
    for (let i = 0; i < n; i++) { const a = rad(rot + (360 / n) * i), ux = Math.cos(a), uy = -Math.sin(a)
      lines += `<line x1="${cx}" y1="${cy}" x2="${cx + R * ux}" y2="${cy + R * uy}" stroke="#eef0f7" stroke-width="6"/>`
      const m0 = rc + (R - rc - ro) * 0.5
      dots += [-9, 9].map((o) => `<circle cx="${cx + (m0 + o) * ux}" cy="${cy + (m0 + o) * uy}" r="7" fill="${DOT}" stroke="#10131c" stroke-width="2"/>`).join('')
      outs += ball(cx + R * ux, cy + R * uy, ro, 'pur', ol, fs ?? ro * 0.78) }
    return lines + dots + outs + ball(cx, cy, rc, 'warm', cl) }

  // ---------- intro artwork: the finished CO2 diagram, faintly, behind the title ----------
  EZ.intro = {
    chips: [['1@0.3', '5-step recipe'], ['1@0.6', 'Octet exceptions'], ['1@0.86', '#1 mistake']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.13">${co2(960, 560, 1.7)}</svg>`,
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">A map of valence electrons</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.3" data-fx="pop">${co2(960, 500)}</g>
        <g data-at="1@0.2" data-fx="fade"><text x="960" y="372" text-anchor="middle" font-size="40" font-weight="900" class="f-pri">bonds = lines</text></g>
        <g data-at="1@0.6" data-fx="fade"><text x="520" y="514" text-anchor="end" font-size="40" font-weight="900" class="f-teal">lone pairs = dots</text>
          <text x="1400" y="514" font-size="40" font-weight="900" class="f-teal">lone pairs = dots</text></g></svg>
      ${[['Shape', 'pri', 0.42], ['Polarity', 'teal', 0.62], ['Boiling point', 'warm', 0.84]].map(([t, cl, f], i) => `<div class="chip3 ${cl}" style="left:${340 + i * 430}px" data-at="2@${f}" data-fx="pop">${t}</div>`).join('')}
      <div style="position:absolute;left:0;top:640px;width:1920px;text-align:center;font-size:32px;font-weight:800;color:var(--muted)" data-at="2" data-fx="fade">Draw it, then predict:</div>
      <div class="banner" style="top:860px" data-at="3" data-fx="pop">The <span class="teal">most-used drawing</span> in the whole course</div>`,
    update(c) {
      const k = 1 + 0.02 * Math.sin(c.t * 2.2); void k
    },
  })

  // ---------- the 5-step recipe ----------
  const g3 = (bond, extra = '') => `${bond}${ball(60, 59, 20, 'pur')}${ball(120, 59, 22, 'gray')}${ball(180, 59, 20, 'pur')}${extra}`
  const sb = `<line x1="60" x2="180" y1="59" y2="59" stroke="#eef0f7" stroke-width="6"/>`
  const db = `<line x1="60" x2="180" y1="53" y2="53" stroke="#eef0f7" stroke-width="5"/><line x1="60" x2="180" y1="65" y2="65" stroke="#eef0f7" stroke-width="5"/>`
  const outer = [60, 180].map((x) => [90, 270, x === 60 ? 180 : 0].map((a) => pair(x, 59, 20, a, 0.5)).join('')).join('')
  const PICS = [
    Array.from({ length: 8 }, (_, i) => `<circle cx="${50 + (i % 4) * 46}" cy="${40 + Math.floor(i / 4) * 40}" r="11" fill="${DOT}"/>`).join(''),
    `<g data-at="3" data-fx="fade">${sb}</g>${g3('')}`,
    g3(sb, outer),
    g3(sb, pair(120, 59, 22, 90, 0.5)),
    g3(db),
  ]
  const STEPS = [
    ['Count', 'pri', 'total valence e<sup>−</sup>: +1 per − charge, −1 per + charge', '1'],
    ['Skeleton', 'teal', 'least electronegative atom in the center (never H)', '2'],
    ['Outer atoms first', 'warm', 'a full octet for each outer atom (H gets just 2)', '4'],
    ['Leftovers', 'pri', 'go on the central atom as lone pairs', '5'],
    ['Short of an octet?', 'teal', 'turn outer lone pairs into double or triple bonds', '6'],
  ]
  EZ.scene('recipe', {
    html: `<div class="kicker" data-at="in" data-fx="left">The method</div><h2 class="h1" data-at="0">The 5-step recipe</h2>
      ${STEPS.map(([t, cl, d, at], i) => `<div class="srow" style="top:${300 + i * 132}px" data-at="${at}"><div class="n">${i + 1}</div><div class="t ${cl}">${t}</div><div class="d">${d}</div>
        <svg width="240" height="118">${PICS[i]}</svg></div>`).join('')}`,
  })

  // ---------- worked example: CO2 ----------
  const CX = [330, 650, 970], CY = 560, RO = 76, RC = 70
  // [atom, start angle, end angle | 'b' = moves into the bond]
  const LP = [[0, 180, 135], [0, 90, 'b'], [0, 270, 225], [2, 0, -45], [2, 90, 45], [2, 270, 'b']]
  const note = (i, at, color, a, b) => `<div class="note" style="top:${300 + i * 124}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`
  const under = (x, txt, cls, at, out) => `<g data-at="${at}"${out ? ` data-out="${out}"` : ''} data-fx="fade"><text x="${x}" y="${CY + 168}" text-anchor="middle" font-size="40" font-weight="900" class="${cls}">${txt}</text></g>`
  const over = (x, txt, at) => `<g data-at="${at}" data-out="2" data-fx="fade"><text x="${x}" y="${CY - 118}" text-anchor="middle" font-size="40" font-weight="900" class="f-teal">${txt}</text></g>`
  EZ.scene('co2', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Carbon dioxide, CO<sub>2</sub></h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.3" data-fx="fade">
          <line class="l1a" x1="${CX[0]}" x2="${CX[1]}" y1="${CY}" y2="${CY}" stroke="#eef0f7" stroke-width="9"/><line class="l1b" x1="${CX[0]}" x2="${CX[1]}" y1="${CY}" y2="${CY}" stroke="#eef0f7" stroke-width="9"/>
          <line class="l2a" x1="${CX[1]}" x2="${CX[2]}" y1="${CY}" y2="${CY}" stroke="#eef0f7" stroke-width="9"/><line class="l2b" x1="${CX[1]}" x2="${CX[2]}" y1="${CY}" y2="${CY}" stroke="#eef0f7" stroke-width="9"/></g>
        <g data-at="0@0.5" data-fx="pop">${ball(CX[0], CY, RO, 'red', 'O')}</g><g data-at="0@0.35" data-fx="pop">${ball(CX[1], CY, RC, 'gray', 'C')}</g><g data-at="0@0.65" data-fx="pop">${ball(CX[2], CY, RO, 'red', 'O')}</g>
        ${LP.map((_, i) => `<g class="lp${i}" style="opacity:0"><circle r="9" fill="${DOT}"/><circle r="9" fill="${DOT}"/></g>`).join('')}
        ${over(CX[1], sup('4 e', '−'), '1@0.1')}${over(CX[0], sup('6 e', '−'), '1@0.35')}${over(CX[2], sup('6 e', '−'), '1@0.35')}
        ${under(CX[1], sup('only 4 e', '−'), 'f-bad', '4@0.45', '5@0.7')}
        ${CX.map((x) => under(x, sup('8 e', '−'), 'f-good', '7@0.15')).join('')}
      </svg>
      <div class="counter" data-at="1@0.75" data-fx="pop">Electrons left to place<b class="left">16</b></div>
      ${note(0, '1', '#8d8df0', 'Count', 'C 4 + O 6 × 2 = 16 e<sup>−</sup>')}
      ${note(1, '2', '#3cc7bc', 'Skeleton O–C–O', 'uses 4 e<sup>−</sup>, leaving 12')}
      ${note(2, '3', '#f3a764', 'Outer octets', '3 lone pairs on each O: 12 used')}
      ${note(3, '4', '#f0707a', 'C has only 4 e<sup>−</sup>', 'move a lone pair from each O')}
      ${note(4, '7', '#4cc781', 'Check', '8 e<sup>−</sup> on each atom, total 16')}`,
    update(c) {
      const b = c.b, D = RO + 26
      const pm = eio(c.seg(b[5].start + 0.4, b[5].end - 0.1))
      const t3 = b[3].start + 0.25 * (b[3].end - b[3].start), step = 0.4
      LP.forEach(([ai, a0, a1], i) => {
        const g = c.$('.lp' + i), cx = CX[ai], ap = c.seg(t3 + i * step, t3 + i * step + 0.3)
        let x, y, dx, dy, op = ap
        if (a1 === 'b') {
          const x0 = cx + D * Math.cos(rad(a0)), y0 = CY - D * Math.sin(rad(a0))
          x = lerp(x0, (cx + CX[1]) / 2, pm); y = lerp(y0, CY + (a0 === 90 ? -14 : 14), pm); dx = 13; dy = 0
          op = ap * (1 - clamp((pm - 0.7) / 0.3))
        } else {
          const a = rad(lerp(a0, a1, pm)); x = cx + D * Math.cos(a); y = CY - D * Math.sin(a); dx = 13 * Math.sin(a); dy = 13 * Math.cos(a)
        }
        g.style.opacity = op
        g.children[0].setAttribute('cx', x + dx); g.children[0].setAttribute('cy', y + dy)
        g.children[1].setAttribute('cx', x - dx); g.children[1].setAttribute('cy', y - dy)
      })
      const nb = clamp((pm - 0.6) / 0.4)
      c.$('.l1a').setAttribute('y1', CY + 14 * pm); c.$('.l1a').setAttribute('y2', CY + 14 * pm)
      c.$('.l1b').setAttribute('y1', CY - 14 * pm); c.$('.l1b').setAttribute('y2', CY - 14 * pm); c.$('.l1b').style.opacity = nb
      c.$('.l2a').setAttribute('y1', CY - 14 * pm); c.$('.l2a').setAttribute('y2', CY - 14 * pm)
      c.$('.l2b').setAttribute('y1', CY + 14 * pm); c.$('.l2b').setAttribute('y2', CY + 14 * pm); c.$('.l2b').style.opacity = nb
      const p2 = c.seg(c.at('2@0.6'), c.at('2@0.6') + 0.6), placed = LP.filter((_, i) => c.t >= t3 + i * step + 0.1).length
      c.$('.left').textContent = 16 - 2 * Math.round(2 * p2) - 2 * placed
    },
  })

  // ---------- exceptions to the octet rule ----------
  EZ.scene('exceptions', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Exceptions</div><h2 class="h1" data-at="0">Bending the octet rule</h2>
      <div class="card xc" style="left:120px" data-at="1"><h3 class="pri">Fewer than 8</h3><div class="s">BF<sub>3</sub></div>
        <svg width="540" height="340"><g data-at="1@0.4" data-fx="pop">${star(270, 185, 3, 125, 46, 38, 'B', 'F')}</g></svg>
        <div class="foot pri" data-at="1@0.7" data-fx="pop">6 e<sup>−</sup> on B</div></div>
      <div class="card xc" style="left:690px" data-at="2"><h3 class="teal">More than 8</h3><div class="s">period 3 or below: expanded octet</div>
        <svg width="540" height="340">
          <g data-at="3@0.05" data-fx="pop">${star(140, 130, 6, 96, 32, 23, 'S', 'F', 90)}</g><g data-at="3@0.3" data-fx="fade"><text x="140" y="282" text-anchor="middle" font-size="38" font-weight="900" class="f-teal">${sup('S: 12 e', '−')}</text><text x="140" y="322" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">in SF<tspan dy="7" font-size="19">6</tspan></text></g>
          <g data-at="3@0.55" data-fx="pop">${star(400, 130, 5, 96, 32, 25, 'P', 'Cl', 90, 17)}</g><g data-at="3@0.8" data-fx="fade"><text x="400" y="282" text-anchor="middle" font-size="38" font-weight="900" class="f-teal">${sup('P: 10 e', '−')}</text><text x="400" y="322" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">in PCl<tspan dy="7" font-size="19">5</tspan></text></g>
        </svg>
        <div class="foot muted" style="font-size:32px" data-at="3@0.95" data-fx="fade">also Xe in XeF<sub>4</sub></div></div>
      <div class="card xc" style="left:1260px" data-at="4"><h3 class="warm">Odd number</h3><div class="s">NO</div>
        <svg width="540" height="340"><g data-at="4@0.35" data-fx="pop">${ball(214, 120, 56, 'pur', 'N')}${ball(326, 120, 56, 'red', 'O')}</g>
          <g data-at="4@0.5" data-fx="fade"><text x="270" y="250" text-anchor="middle" font-size="44" font-weight="900" class="f-warm">${sup('11 valence e', '−')}</text></g>
          <g data-at="4@0.75" data-fx="fade"><text x="270" y="304" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">not every atom gets an octet</text></g></svg>
        <div class="foot warm" style="font-size:34px" data-at="5" data-fx="pop">Lewis model has limitations</div></div>`,
  })

  // ---------- HONC 1234 ----------
  const HONC = [['H', 1, 'warm', [0]], ['O', 2, 'red', [180, 0]], ['N', 3, 'pur', [180, 0, 90]], ['C', 4, 'gray', [0, 90, 180, 270]]]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Count bonds: “HONC 1234”</h2>
      <div style="position:absolute;left:120px;top:274px;font-size:34px;font-weight:800;color:var(--muted)" data-at="1" data-fx="fade">Usual number of bonds in neutral, organic-style molecules</div>
      ${HONC.map(([el, n, g, angs], i) => `<div class="htile" style="left:${120 + i * 430}px" data-at="2@${(i * 0.26).toFixed(2)}" data-fx="pop">
        <svg width="390" height="290">${angs.map((a) => `<line x1="195" y1="150" x2="${195 + 128 * Math.cos(rad(a))}" y2="${150 - 128 * Math.sin(rad(a))}" stroke="#eef0f7" stroke-width="10" stroke-linecap="round"/>`).join('')}${ball(195, 150, 62, g, el)}</svg>
        <div class="v">${el} = <span class="teal">${n}</span></div></div>`).join('')}
      <div class="banner" style="top:800px;font-size:44px" data-at="3" data-fx="pop">C with <span class="warm">5 bonds</span>, or O with <span class="warm">3</span>? Recheck it, or expect a formal charge</div>`,
  })

  // ---------- the trap: forgetting the charge ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">The #1 mistake: forgetting the charge</h2>
      <div class="rule teal" style="left:120px;border-color:rgba(60,199,188,.7);background:rgba(60,199,188,.12)" data-at="1" data-fx="pop">Negative ${ARR} add electrons</div>
      <div class="rule warm" style="left:990px;border-color:rgba(243,167,100,.7);background:rgba(243,167,100,.12)" data-at="1@0.55" data-fx="pop">Positive ${ARR} subtract</div>
      <div class="card sum" data-at="2-0.2">
        <div class="ion" data-at="2@0.05" data-fx="fade">NH<sub>4</sub><sup>+</sup></div>
        <div class="term" style="left:420px" data-at="2@0.28" data-fx="pop"><b class="pri">5</b><span>from N</span></div>
        <div class="term" style="left:700px" data-at="2@0.5" data-fx="pop"><b class="pri">+ 4</b><span>from four H</span></div>
        <div class="term" style="left:980px" data-at="2@0.75" data-fx="pop"><b class="warm">− 1</b><span>for the + charge</span></div>
        <div class="term" style="left:1260px;width:340px" data-at="3@0.55" data-fx="pop"><b class="good">= 8 e<sup>−</sup></b><span>total valence electrons</span></div>
      </div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', '22'], ['B', '23'], ['C', '24'], ['D', '25']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">How many total <span class="teal">valence electrons</span><br>are in the nitrate ion, NO<sub>3</sub><sup>−</sup>?</h2>
      ${OPTS.map(([l, f], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="760" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="760" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 760)"/>
        <text class="num" x="960" y="786" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="890" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card work" data-at="4-0.1">
        <span data-at="4@0.05" data-fx="fade"><span class="pri">5</span> from N</span><span data-at="4@0.3" data-fx="fade"> &nbsp;+&nbsp; <span class="pri">3 × 6 = 18</span> from O</span><span data-at="4@0.75" data-fx="fade"> &nbsp;=&nbsp; 23</span><br>
        <span data-at="5@0.1" data-fx="fade"><span class="warm">+ 1</span> for the − charge &nbsp;=&nbsp; <span class="good">24 valence electrons</span></span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="170" viewBox="0 0 460 170">${co2(230, 85, 0.5)}</svg>`
  const r2 = `<svg width="460" height="170" viewBox="0 0 460 170"><line x1="110" x2="350" y1="85" y2="85" stroke="#eef0f7" stroke-width="7"/><circle cx="230" cy="85" r="56" fill="none" stroke="#8d8df0" stroke-width="5" stroke-dasharray="8 8"/>${ball(110, 85, 34, 'pur')}${ball(230, 85, 40, 'gray')}${ball(350, 85, 34, 'pur')}</svg>`
  const r3 = `<svg width="460" height="170" viewBox="0 0 460 170">${star(230, 96, 3, 72, 28, 22, 'B', 'F')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="teal">Count valence e<sup>−</sup></span><br>(adjust for charge),<br>skeleton, outer octets,<br>leftovers, multiple bonds</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Least electronegative<br>atom in the <span class="pri">center</span><br>(never H)</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="warm">Exceptions:</span><br>BF<sub>3</sub> (6 e<sup>−</sup> on B),<br>expanded octets<br>(period 3+),<br>odd-electron molecules</p></div>`,
  })
})()
