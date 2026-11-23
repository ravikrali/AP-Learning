// Pictures for chem-2.6 "Resonance & Formal Charge". One EZ.scene per scene id in script.mjs.
// Numbers shown are the lesson's own (app/src/content/chem/u2.ts). Sizes are not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em}
    .cc{position:absolute;top:280px;width:810px;height:590px;text-align:center}
    .cc h3{padding:22px 20px 0;font-size:52px}
    .big{position:absolute;left:120px;width:1680px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center;font-weight:900}
    .tile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:58px;font-size:104px;font-weight:900;line-height:1}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .work{position:absolute;left:120px;top:650px;width:1680px;height:250px;text-align:center;font-size:58px;font-weight:900;padding-top:38px;line-height:1.45}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
    .rule2{position:absolute;top:280px;width:810px;height:210px;border-radius:30px;border:3px solid;text-align:center;font-weight:900}
    .rule2 b{display:block;margin-top:22px;font-size:34px;color:var(--muted);font-weight:800} .rule2 span.t{display:block;margin-top:10px;font-size:50px;line-height:1.2}
  `
  document.head.appendChild(css)

  const rad = (a) => (a * Math.PI) / 180
  const DOT = '#3cc7bc'
  const WH = '#eef0f7'
  const pair = (cx, cy, r, a, k = 1) => { const d = r + 26 * k, x = cx + d * Math.cos(rad(a)), y = cy - d * Math.sin(rad(a)), dx = 13 * k * Math.sin(rad(a)), dy = 13 * k * Math.cos(rad(a))
    return `<circle cx="${x + dx}" cy="${y + dy}" r="${9 * k}" fill="${DOT}"/><circle cx="${x - dx}" cy="${y - dy}" r="${9 * k}" fill="${DOT}"/>` }
  /** n parallel bond lines between two points (horizontal or any angle) */
  const bond = (x1, y1, x2, y2, n, w = 8, gap = 13) => { const L = Math.hypot(x2 - x1, y2 - y1), px = -(y2 - y1) / L, py = (x2 - x1) / L
    return Array.from({ length: n }, (_, i) => { const o = (i - (n - 1) / 2) * gap
      return `<line x1="${x1 + px * o}" y1="${y1 + py * o}" x2="${x2 + px * o}" y2="${y2 + py * o}" stroke="${WH}" stroke-width="${w}" stroke-linecap="round"/>` }).join('') }
  /** the nitrate ion; dbl = which O has the double bond (0..2), or 'h' for the hybrid (dashed overlay on every bond) */
  const nit = (cx, cy, R, dbl) => { const ro = R * 0.3, rn = R * 0.28, an = [90, 210, 330]; let s = ''
    an.forEach((a, i) => { const x = cx + R * Math.cos(rad(a)), y = cy - R * Math.sin(rad(a))
      if (dbl === 'h') s += bond(cx, cy, x, y, 1, R * 0.05) + `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${DOT}" stroke-width="${R * 0.05}" stroke-dasharray="${R * 0.09} ${R * 0.09}"/>`
      else s += bond(cx, cy, x, y, i === dbl ? 2 : 1, R * 0.05, R * 0.09) })
    an.forEach((a) => { s += ball(cx + R * Math.cos(rad(a)), cy - R * Math.sin(rad(a)), ro, 'red', 'O') })
    return s + ball(cx, cy, rn, 'pur', 'N') }

  // ---------- intro artwork: faint nitrate ions at the far left and right ----------
  EZ.intro = {
    chips: [['1@0.3', 'Resonance'], ['1@0.6', 'Formal charge'], ['1@0.86', 'Best Lewis diagram']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.14">${nit(230, 860, 72, 0)}${nit(1690, 860, 72, 'h')}</svg>`,
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Which structure is right?</h2>
      ${[0, 1, 2].map((i) => `<div class="card" style="left:${120 + i * 585}px;top:300px;width:550px;height:430px" data-at="0@${(0.3 + i * 0.25).toFixed(2)}" data-out="3" data-fx="pop"></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080">
        ${[0, 1, 2].map((i) => `<g data-at="0@${(0.35 + i * 0.25).toFixed(2)}" data-out="3" data-fx="pop">${nit(395 + i * 585, 520, 140, i)}</g>`).join('')}
        ${[0, 1, 2].map((i) => `<g data-at="0@${(0.4 + i * 0.25).toFixed(2)}" data-out="3" data-fx="fade"><text x="${395 + i * 585}" y="702" text-anchor="middle" font-size="38" font-weight="900" class="f-muted">${sup('NO<tspan dy="8" font-size="24">3</tspan>', '−')}</text></g>`).join('')}
        <g data-at="1" data-out="3" data-fx="pop"><text x="960" y="815" text-anchor="middle" font-size="92" font-weight="900" class="f-warm">?</text></g>
        <g data-at="3@0.1" data-fx="pop">${nit(960, 560, 210, 'h')}</g>
        <g data-at="3@0.5" data-fx="fade"><text x="960" y="880" text-anchor="middle" font-size="44" font-weight="900" class="f-teal">one blended structure</text></g>
      </svg>
      <div class="banner" style="top:150px;display:none"></div>
      <div class="banner" style="top:850px;font-size:52px" data-at="2" data-out="3" data-fx="pop"><span class="warm">None of them alone</span></div>`,
  })

  // ---------- resonance ----------
  const hy3 = `<g>${nit(0, 0, 1, 'h')}</g>` // (unused helper kept simple)
  void hy3
  const barRow = (y, w, cls, label, at) => `<g data-at="${at}" data-out="6" data-fx="fade"><rect x="1080" y="${y}" width="${w}" height="46" rx="23" class="${cls}"/><text x="1060" y="${y + 34}" text-anchor="end" font-size="34" font-weight="800" class="f-muted">${label}</text></g>`
  EZ.scene('resonance', {
    html: `<div class="kicker" data-at="in" data-fx="left">Resonance</div><h2 class="h1" data-at="0">The resonance hybrid</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        ${[0, 1, 2].map((i) => `<g data-at="0@${(0.3 + i * 0.25).toFixed(2)}" data-out="3" data-fx="pop">${nit(330 + i * 630, 400, 100, i)}</g>`).join('')}
        ${[0, 1].map((i) => `<g data-at="0@${(0.6 + i * 0.25).toFixed(2)}" data-out="3" data-fx="fade"><text x="${645 + i * 630}" y="425" text-anchor="middle" font-size="90" font-weight="900" class="f-teal">↔</text></g>`).join('')}
        <g data-at="0@0.7" data-out="3" data-fx="fade"><text x="960" y="580" text-anchor="middle" font-size="40" font-weight="800" class="f-muted">same atoms, only the electrons move</text></g>
        <g data-at="3@0.1" data-out="6" data-fx="pop">${nit(520, 590, 230, 'h')}</g>
        <g data-at="3@0.4" data-fx="fade" data-out="6"><text x="520" y="900" text-anchor="middle" font-size="44" font-weight="900" class="f-teal">3 identical N–O bonds</text></g>
        <g data-at="6@0.1" data-fx="pop" data-out="7"><g></g></g>
        ${barRow(660, 330, 'bar-d', 'double bond', '5@0.1')}
        ${barRow(740, 470, 'bar-h', 'in between', '5@0.4')}
        ${barRow(820, 640, 'bar-s', 'single bond', '5@0.7')}
        <g data-at="5" data-out="6" data-fx="fade"><text x="1440" y="640" text-anchor="middle" font-size="34" font-weight="900" class="f-pri">Bond length</text></g>
        <g data-at="6" data-fx="fade"><rect x="0" y="0" width="0" height="0"/></g>
      </svg>
      <style>.bar-d{fill:#8d8df0}.bar-h{fill:#3cc7bc}.bar-s{fill:#f3a764}</style>
      <div class="banner" style="top:630px;font-size:50px" data-at="1" data-out="3" data-fx="pop">The real structure is a <span class="teal">resonance hybrid</span><br><span style="font-size:40px;color:var(--muted)">an average of them all</span></div>
      <div class="banner" style="top:850px;font-size:50px" data-at="2" data-out="3" data-fx="pop"><span class="warm">NO<sub>3</sub><sup>−</sup></span> has 3 resonance structures</div>
      <div class="big" style="left:1000px;top:300px;width:800px;height:210px;font-size:56px;padding-top:24px" data-at="4" data-out="6" data-fx="pop"><span class="teal">1⅓</span> bonds each<div style="font-size:36px;font-weight:800;color:var(--muted);margin-top:8px">4 bonds shared over 3 positions</div></div>
      <div class="card" style="left:1000px;top:545px;width:800px;height:360px" data-at="5" data-out="6"></div>
      <div class="card" style="left:260px;top:310px;width:1400px;height:470px" data-at="6"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="6@0.1" data-fx="pop">
          ${bond(620, 650, 960, 410, 1, 8)}${bond(960, 410, 1300, 650, 1, 8)}
          <line x1="620" y1="650" x2="960" y2="410" stroke="${DOT}" stroke-width="8" stroke-dasharray="14 14"/><line x1="960" y1="410" x2="1300" y2="650" stroke="${DOT}" stroke-width="8" stroke-dasharray="14 14"/>
          ${ball(620, 650, 70, 'red', 'O')}${ball(960, 410, 70, 'red', 'O')}${ball(1300, 650, 70, 'red', 'O')}
          <text x="740" y="500" text-anchor="end" font-size="44" font-weight="900" class="f-teal">1½</text><text x="1180" y="500" font-size="44" font-weight="900" class="f-teal">1½</text></g>
        <g data-at="6@0.5" data-fx="fade"><text x="960" y="752" text-anchor="middle" font-size="40" font-weight="800" class="f-muted">ozone, O<tspan dy="8" font-size="26">3</tspan>: two identical O–O bonds</text></g>
      </svg>
      <div class="banner" style="top:830px;font-size:46px" data-at="7" data-fx="pop">A <span class="teal">refinement</span> of the Lewis model: predicts bond lengths &amp; properties</div>`,
  })

  // ---------- formal charge ----------
  EZ.scene('formal', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Bookkeeping</div><h2 class="h1" data-at="0">Formal charge</h2>
      <div class="banner" style="top:290px;font-size:46px" data-at="0@0.4" data-fx="pop">A <span class="warm">bookkeeping tool</span> for comparing Lewis diagrams</div>
      <div class="big" style="top:440px;height:210px;font-size:64px;line-height:210px" data-at="1">
        FC = <span data-at="1@0.3" data-fx="fade" class="pri">valence e<sup>−</sup></span> <span data-at="1@0.55" data-fx="fade">− <span class="teal">lone-pair e<sup>−</sup></span></span> <span data-at="1@0.8" data-fx="fade">− <span class="warm">½ bonding e<sup>−</sup></span></span></div>
      <div class="big" style="top:720px;height:200px;font-size:60px;line-height:200px;border-color:rgba(60,199,188,.7)" data-at="2">
        <span class="muted" style="font-size:38px">Quicker:</span> &nbsp;FC = <span class="pri">valence e<sup>−</sup></span> − (<span class="teal">dots</span> + <span class="warm">lines</span>)</div>`,
  })

  // ---------- dots plus sticks ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">“Dots plus sticks”</h2>
      <div class="banner" style="top:280px;font-size:54px" data-at="1" data-fx="pop">FC = <span class="pri">group number</span> − (<span class="teal">dots</span> + <span class="warm">sticks</span>)</div>
      <div class="card" style="left:120px;top:440px;width:760px;height:480px" data-at="1@0.6"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.7" data-fx="pop">${bond(190, 690, 500, 690, 1, 9)}${bond(500, 690, 810, 690, 1, 9)}${ball(500, 690, 78, 'red', 'O')}</g>
        <g data-at="2@0.1" data-fx="pop">${pair(500, 690, 78, 90, 1.2)}${pair(500, 690, 78, 270, 1.2)}</g>
        <g data-at="3@0.1" data-fx="fade"><text x="500" y="520" text-anchor="middle" font-size="36" font-weight="800" class="f-muted">oxygen: 2 lone pairs, 2 bonds</text></g>
      </svg>
      <div class="big" style="left:960px;top:440px;width:840px;height:130px;font-size:52px;line-height:130px;border-color:rgba(60,199,188,.7)" data-at="2"><span class="teal">dots</span>: 2 + 2 = 4 <span style="font-size:32px;color:var(--muted)">(a pair = 2 dots)</span></div>
      <div class="big" style="left:960px;top:610px;width:840px;height:130px;font-size:52px;line-height:130px;border-color:rgba(243,167,100,.7)" data-at="3"><span class="warm">sticks</span>: 2 <span style="font-size:32px;color:var(--muted)">(each line once)</span></div>
      <div class="big" style="left:960px;top:780px;width:840px;height:140px;font-size:62px;line-height:140px;border-color:rgba(76,199,129,.8)" data-at="4" data-fx="pop">6 − (4 + 2) = <span class="good">0</span></div>`,
  })

  // ---------- what makes the best diagram + NH4+ ----------
  const star = (cx, cy, n, R, rc, ro, cl, ol, rot = 90) => { let lines = '', outs = ''
    for (let i = 0; i < n; i++) { const a = rad(rot + (360 / n) * i), ux = Math.cos(a), uy = -Math.sin(a)
      lines += `<line x1="${cx}" y1="${cy}" x2="${cx + R * ux}" y2="${cy + R * uy}" stroke="${WH}" stroke-width="6"/>`
      outs += ball(cx + R * ux, cy + R * uy, ro, 'warm', ol) }
    return lines + outs + ball(cx, cy, rc, 'pur', cl) }
  EZ.scene('rules', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Pick the best one</div><h2 class="h1" data-at="0">The best Lewis diagram</h2>
      <div class="rule2 teal" style="left:120px;border-color:rgba(60,199,188,.7);background:rgba(60,199,188,.12)" data-at="1" data-fx="pop"><b>1</b><span class="t">Formal charges as<br>close to <span class="good">zero</span> as possible</span></div>
      <div class="rule2 warm" style="left:990px;border-color:rgba(243,167,100,.7);background:rgba(243,167,100,.12)" data-at="2" data-fx="pop"><b>2</b><span class="t">Any <span class="bad">negative</span> FC on the<br>most electronegative atom</span></div>
      <div class="banner" style="top:530px;font-size:44px" data-at="3" data-fx="pop">Formal charges always add up to the <span class="teal">overall charge</span></div>
      <div class="card" style="left:120px;top:680px;width:1680px;height:290px" data-at="4"></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="4@0.2" data-fx="pop">${star(340, 825, 4, 100, 42, 30, 'N', 'H', 45)}</g>
        <g data-at="4@0.2" data-fx="fade"><text x="520" y="800" font-size="44" font-weight="900" class="f-muted">${sup('NH<tspan dy="8" font-size="28">4</tspan>', '+')}: N has 5 valence e<tspan dy="-12" font-size="28">−</tspan></text><text x="520" y="860" font-size="44" font-weight="900" class="f-muted">4 bonds, no lone pairs</text></g></svg>
      <div style="position:absolute;left:1160px;top:760px;font-size:64px;font-weight:900;white-space:nowrap" data-at="5" data-fx="pop">5 − 4 = <span class="warm">+1</span></div>
      <div style="position:absolute;left:1160px;top:860px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap" data-at="5@0.5" data-fx="fade">matches the ion's +1 (each H is 0)</div>`,
  })

  // ---------- which CO2 is best ----------
  const fc = (x, y, txt, cls, at) => `<g data-at="${at}" data-fx="pop"><text x="${x}" y="${y}" text-anchor="middle" font-size="54" font-weight="900" class="${cls}">${txt}</text></g>`
  const LX = 525, RX = 1395, CY = 585, S = 235
  EZ.scene('co2', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Which CO<sub>2</sub> is best?</h2>
      <div class="card cc co-l" style="left:120px" data-at="1"><h3 class="pri">O=C=O</h3></div>
      <div class="card cc co-r" style="left:990px" data-at="1@0.3"><h3 class="warm">O≡C–O</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade">${bond(LX - S, CY, LX, CY, 2, 8, 22)}${bond(LX, CY, LX + S, CY, 2, 8, 22)}
          ${ball(LX - S, CY, 64, 'red', 'O')}${ball(LX, CY, 58, 'gray', 'C')}${ball(LX + S, CY, 64, 'red', 'O')}
          ${pair(LX - S, CY, 64, 135, 0.9)}${pair(LX - S, CY, 64, 225, 0.9)}${pair(LX + S, CY, 64, 45, 0.9)}${pair(LX + S, CY, 64, -45, 0.9)}</g>
        <g data-at="1@0.6" data-fx="fade">${bond(RX - S, CY, RX, CY, 3, 8, 22)}${bond(RX, CY, RX + S, CY, 1, 8)}
          ${ball(RX - S, CY, 64, 'red', 'O')}${ball(RX, CY, 58, 'gray', 'C')}${ball(RX + S, CY, 64, 'red', 'O')}
          ${pair(RX - S, CY, 64, 180, 0.9)}${pair(RX + S, CY, 64, 90, 0.9)}${pair(RX + S, CY, 64, 270, 0.9)}${pair(RX + S, CY, 64, 0, 0.9)}</g>
        ${[LX - S, LX, LX + S].map((x) => fc(x, CY + 175, '0', 'f-good', '2@0.3')).join('')}
        ${fc(RX - S, CY + 175, '+1', 'f-warm', '3@0.5')}${fc(RX + S, CY + 175, '−1', 'f-bad', '4@0.35')}${fc(RX, CY + 175, '0', 'f-good', '4@0.8')}
      </svg>
      <div class="banner" style="top:900px;font-size:48px;border-color:rgba(76,199,129,.8)" data-at="5" data-fx="pop"><span class="good">O=C=O</span> wins: all formal charges are zero</div>`,
    update(c) {
      const win = eo(c.seg(c.at('5'), c.at('5') + 0.6))
      const l = c.$('.co-l'), r = c.$('.co-r')
      l.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; l.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.45 * win})`
      r.style.filter = `brightness(${1 - 0.4 * win})`
    },
  })

  // ---------- the traps ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Two traps</h2>
      <div class="card cc" style="left:120px;height:600px" data-at="1"><h3 class="warm">Not a light switch</h3></div>
      <div class="card cc" style="left:990px;height:600px" data-at="3"><h3 class="warm">Not a real charge</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.2" data-fx="pop"><rect x="460" y="395" width="130" height="170" rx="20" fill="#2a2f45" stroke="#363c54" stroke-width="4"/><rect class="tog" x="490" y="415" width="70" height="60" rx="14" fill="#a3abbd"/></g>
        <g data-at="1@0.6" data-fx="pop"><path d="M610 400 L700 490 M700 400 L610 490" stroke="#f0707a" stroke-width="14" stroke-linecap="round"/></g>
        <g data-at="2@0.1" data-fx="pop">${nit(525, 705, 85, 'h')}</g>
        <g data-at="2@0.5" data-fx="fade"><text x="525" y="850" text-anchor="middle" font-size="40" font-weight="900" class="f-teal">one blended structure, always</text></g>
        <g data-at="3@0.3" data-fx="fade"><text x="1395" y="430" text-anchor="middle" font-size="46" font-weight="900" class="f-pri">formal charge</text>
          <text x="1395" y="515" text-anchor="middle" font-size="60" font-weight="900" class="f-bad">≠</text>
          <text x="1395" y="590" text-anchor="middle" font-size="46" font-weight="900" class="f-muted">a real charge</text>
          <text x="1395" y="670" text-anchor="middle" font-size="60" font-weight="900" class="f-bad">≠</text>
          <text x="1395" y="745" text-anchor="middle" font-size="46" font-weight="900" class="f-muted">an oxidation number</text></g>
      </svg>
      <div class="banner" style="top:910px;font-size:46px" data-at="4" data-fx="pop">Formal charge is a tool for <span class="teal">comparing Lewis diagrams</span></div>`,
    update(c) {
      const t = c.at('1@0.2'), tg = c.$('.tog'), p = c.seg(t, c.at('1@0.7'))
      tg.setAttribute('y', 415 + 80 * (p < 1 ? (Math.sin((c.t - t) * 9) > 0 ? 1 : 0) : 0.5))
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', '1'], ['B', '1⅓'], ['C', '1½'], ['D', '2']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px" data-at="1">The carbonate ion, CO<sub>3</sub><sup>2−</sup>, has 3 resonance structures.<br>What is the average <span class="teal">C–O bond order</span>?</h2>
      ${OPTS.map(([l, f], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="760" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="760" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 760)"/>
        <text class="num" x="960" y="786" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="890" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card work" data-at="4-0.1">
        <span data-at="4@0.05" data-fx="fade">1 double + 2 single = <span class="pri">4 bonds</span></span><span data-at="4@0.6" data-fx="fade"> &nbsp;shared over <span class="pri">3 positions</span></span><br>
        <span data-at="5@0.1" data-fx="fade">4 ÷ 3 = <span class="good">1⅓</span> &nbsp;<span style="font-size:42px;color:var(--muted)">all three C–O bonds identical</span></span></div>`,
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
  const r1 = `<svg width="460" height="170" viewBox="0 0 460 170">${nit(230, 98, 62, 'h')}</svg>`
  const r2 = `<svg width="460" height="170" viewBox="0 0 460 170"><text x="230" y="70" text-anchor="middle" font-size="46" font-weight="900" class="f-pri">FC = valence e<tspan dy="-14" font-size="28">−</tspan></text><text x="230" y="134" text-anchor="middle" font-size="46" font-weight="900" class="f-teal">− (dots + sticks)</text></svg>`
  const r3 = `<svg width="460" height="170" viewBox="0 0 460 170">${bond(100, 90, 230, 90, 2, 6, 14)}${bond(230, 90, 360, 90, 2, 6, 14)}${ball(100, 90, 36, 'red', 'O')}${ball(230, 90, 34, 'gray', 'C')}${ball(360, 90, 36, 'red', 'O')}
    <text x="100" y="160" text-anchor="middle" font-size="30" font-weight="900" class="f-good">0</text><text x="230" y="160" text-anchor="middle" font-size="30" font-weight="900" class="f-good">0</text><text x="360" y="160" text-anchor="middle" font-size="30" font-weight="900" class="f-good">0</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="teal">Resonance:</span> valid diagrams<br>(only electrons move)<br>blend into one structure<br>with averaged bonds</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Formal charge =<br><span class="pri">valence e<sup>−</sup></span> − (dots + sticks)</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Best structure: FCs<br>closest to <span class="good">0</span>, any negative<br>FC on the most<br>electronegative atom</p></div>`,
  })
})()
