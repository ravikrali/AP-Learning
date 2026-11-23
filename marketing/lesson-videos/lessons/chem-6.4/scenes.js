// Pictures for chem-6.4 "Heat Capacity & Calorimetry". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u6.ts): water 4.18 J/(g·°C), the
// aluminum/iron quick check, the metal worked example and the 50.0 g try question. Thermometer
// levels show direction and relative size only, never a reading.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{position:absolute;left:0;width:1920px;top:290px;text-align:center;font-size:140px;font-weight:900;letter-spacing:2px;line-height:1}
    .x-eq span{display:inline-block;transform-origin:50% 70%}
    .x-tile{position:absolute;top:480px;width:390px;height:330px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-tile .L{margin-top:22px;font-size:92px;font-weight:900;line-height:1}
    .x-tile .N{margin-top:14px;font-size:36px;font-weight:900;line-height:1.15}
    .x-tile .D{margin-top:10px;font-size:28px;font-weight:700;color:var(--muted);line-height:1.3}
    .x-chip{position:absolute;height:90px;padding:0 34px;border-radius:22px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:40px;font-weight:800;line-height:86px;white-space:nowrap}
    .x-big{position:absolute;padding:20px 30px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-big b{display:block;font-size:38px;font-weight:900;line-height:1.2;white-space:nowrap} .x-big b em{font-style:normal;margin-left:10px} .x-big span{display:block;margin-top:6px;font-size:28px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-step{position:absolute;left:820px;width:980px;padding:18px 32px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-step .H{font-size:34px;font-weight:900;color:var(--muted)} .x-step .H i{display:inline-block;width:46px;height:46px;margin-right:14px;border-radius:50%;background:var(--brand);color:#fff;font-style:normal;text-align:center;line-height:46px;font-size:28px}
    .x-step .B{margin-top:8px;font-size:40px;font-weight:900;line-height:1.3;white-space:nowrap}
    .x-lab{font-size:32px;font-weight:900}
    .x-gv{position:absolute;top:310px;width:530px;height:190px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-gv .N{margin-top:26px;font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .x-gv .V{margin-top:16px;font-size:58px;font-weight:900;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:560px;width:1680px;height:330px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(76,199,129,.8)}
    .x-ans .ok{position:absolute;left:44px;top:44px;width:84px;height:84px}
    .x-ans .A{position:absolute;left:156px;top:30px;font-size:96px;font-weight:900}
    .x-ans .W{position:absolute;left:60px;top:170px;font-size:46px;font-weight:800;white-space:nowrap}
    .x-ans .K{position:absolute;left:60px;top:240px;font-size:40px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
    .x-foot{position:absolute;left:0;width:1920px;text-align:center;font-size:40px;font-weight:800;color:var(--muted)}
  `
  document.head.appendChild(css)

  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', RED = '#f0707a'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // a thermometer: tube from y0 down h px, bulb below it; the liquid column has class `cls`
  const thermo = (x, y0, h, cls, col = RED) => `<rect x="${x - 18}" y="${y0}" width="36" height="${h}" rx="18" fill="rgba(255,255,255,.06)" stroke="#c9cee0" stroke-width="4"/>
    <rect class="${cls}" x="${x - 9}" y="${y0 + h - 30}" width="18" height="60" rx="9" fill="${col}"/>
    <circle cx="${x}" cy="${y0 + h + 22}" r="32" fill="${col}" stroke="#c9cee0" stroke-width="4"/>`
  // set the liquid level (0..1) of a thermometer drawn with thermo()
  const level = (c, sel, y0, h, f) => {
    const el = c.$(sel), top = y0 + 14 + (h - 28) * (1 - clamp(f))
    el.setAttribute('y', top); el.setAttribute('height', y0 + h + 20 - top)
  }

  // ---------- intro artwork: two faint thermometers at the far edges ----------
  EZ.intro = {
    chips: [['1@0.4', 'q = mcΔT'], ['1@0.6', 'Specific heat'], ['1@0.8', 'Calorimetry']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${thermo(90, 330, 470, 'x-i1')}${thermo(1830, 330, 470, 'x-i2', TEAL)}</svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.3, c.sc.start + 3))
      level(c, '.x-i1', 330, 470, lerp(0.1, 0.85, p)); level(c, '.x-i2', 330, 470, lerp(0.1, 0.4, p))
    },
  }

  // ---------- hook: the beach ----------
  const rays = Array.from({ length: 12 }, (_, i) => { const a = (i * 30 * Math.PI) / 180
    return `<line x1="${960 + 84 * Math.cos(a)}" y1="${400 + 84 * Math.sin(a)}" x2="${960 + 118 * Math.cos(a)}" y2="${400 + 118 * Math.sin(a)}" stroke="#f2c443" stroke-width="9" stroke-linecap="round"/>` }).join('')
  const dunes = 'M160 800 L160 600 C260 560 360 560 460 590 C560 620 660 570 760 560 C800 556 840 560 860 566 L860 800 Z'
  const sea = (dy) => `M1060 800 L1060 ${600 + dy} C1120 ${580 + dy} 1180 ${620 + dy} 1240 ${600 + dy} C1300 ${580 + dy} 1360 ${620 + dy} 1420 ${600 + dy} C1480 ${580 + dy} 1540 ${620 + dy} 1600 ${600 + dy} C1660 ${580 + dy} 1720 ${620 + dy} 1760 ${600 + dy} L1760 800 Z`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Picture it</div><h2 class="h1" data-at="0">Same sunshine, different warming</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><linearGradient id="x-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3a764"/><stop offset="1" stop-color="#8a5422"/></linearGradient>
          <linearGradient id="x-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3cc7bc"/><stop offset="1" stop-color="#145d57"/></linearGradient></defs>
        <g data-at="0@0.3" data-fx="pop"><circle cx="960" cy="400" r="64" fill="url(#g-gold)"/>${rays}</g>
        <g data-at="0@0.5" data-fx="fade"><path d="${dunes}" fill="url(#x-sand)" opacity=".85"/><path d="${sea(0)}" fill="url(#x-sea)" opacity=".85"/><path d="${sea(36)}" fill="none" stroke="#b4f3ec" stroke-width="4" opacity=".5"/>
          ${thermo(250, 340, 300, 'x-ht1')}${thermo(1680, 340, 300, 'x-ht2', TEAL)}</g>
        <g class="x-sun"><line x1="900" y1="460" x2="560" y2="560" stroke="#f2c443" stroke-width="7" stroke-dasharray="16 14" marker-end="url(#mk-gold)"/><line x1="1020" y1="460" x2="1360" y2="560" stroke="#f2c443" stroke-width="7" stroke-dasharray="16 14" marker-end="url(#mk-gold)"/></g>
        <text x="510" y="866" text-anchor="middle" class="x-lab f-warm" data-at="1@0.1" data-fx="fade">sand: burns your feet</text>
        <text x="1410" y="866" text-anchor="middle" class="x-lab f-teal" data-at="1@0.5" data-fx="fade">water: stays cool</text>
        <text x="1104" y="330" font-size="40" font-weight="900" class="f-gold" data-at="2" data-fx="fade">same sunshine</text>
        <g data-at="3" data-out="4" data-fx="pop"><text x="960" y="720" text-anchor="middle" font-size="130" font-weight="900" class="f-pri">?</text></g>
      </svg>
      <div class="banner" style="top:900px" data-at="4" data-out="5" data-fx="pop">Water needs <span class="teal">much more energy</span> to warm up</div>
      <div class="banner" style="top:900px" data-at="5" data-fx="pop">That property: <span class="gold">specific heat capacity</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[1].start, b[1].end + 0.3))
      level(c, '.x-ht1', 340, 300, lerp(0.15, 0.92, p)); level(c, '.x-ht2', 340, 300, lerp(0.15, 0.3, p))
      const s = c.$('.x-sun'), on = c.seg(b[2].start, b[2].start + 0.3)
      s.style.opacity = on
      s.querySelectorAll('line').forEach((l) => l.setAttribute('stroke-dashoffset', -30 * clamp(c.t - b[2].start, 0, b[3].start - b[2].start + 1.5)))
    },
  })

  // ---------- the equation ----------
  const tile = (i, at, col, L, N, D) => `<div class="x-tile" style="left:${120 + i * 430}px;border-color:${col}" data-at="${at}" data-fx="pop"><div class="L" style="color:${col}">${L}</div><div class="N">${N}</div><div class="D">${D}</div></div>`
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equation</div><h2 class="h1" data-at="in+0.2">Heat and temperature</h2>
      <div class="x-eq" data-at="0@0.35" data-fx="pop"><span class="x-e0 gold">q</span> = <span class="x-e1 pri">m</span><span class="x-e2 teal">c</span><span class="x-e3 warm">ΔT</span></div>
      ${tile(0, '1', '#f2c443', 'q', 'heat', 'in joules (J)')}
      ${tile(1, '2', PUR, 'm', 'mass', 'in grams (g)')}
      ${tile(2, '3', TEAL, 'c', 'specific heat<br>capacity', 'raise 1 g by 1 °C<br>J/(g·°C)')}
      ${tile(3, '5', WARM, 'ΔT', 'temperature<br>change', 'T<sub>final</sub> − T<sub>initial</sub>')}
      <div class="x-chip" style="left:120px;top:860px;border-color:rgba(60,199,188,.7)" data-at="4" data-fx="pop">Water: <span class="teal">c = 4.18 J/(g·°C)</span></div>
      <div class="x-chip" style="left:990px;top:860px;border-color:rgba(243,167,100,.7)" data-at="6" data-fx="pop">A change of 1 °C = a change of 1 K</div>`,
    update(c) {
      const b = c.b, at = [1, 2, 3, 5]
      at.forEach((k, i) => {
        const on = c.seg(b[k].start, b[k].start + 0.3) * (1 - c.seg(b[k].end, b[k].end + 0.3))
        c.$('.x-e' + i).style.transform = `scale(${1 + 0.18 * on})`
      })
    },
  })

  // ---------- what c does: aluminum vs iron ----------
  const metal = (name, cval, cls, at) => `<div class="card" style="left:${name === 'Iron' ? 990 : 120}px;top:440px;width:810px;height:390px" data-at="${at}">
      <h3>${name} <span class="teal" style="font-size:36px;margin-left:16px" data-at="3@${name === 'Iron' ? 0.55 : 0.1}" data-fx="fade">c = ${cval} J/(g·°C)</span></h3>
      <svg style="position:absolute;left:0;top:90px" width="810" height="300" viewBox="0 0 810 300">
        <rect x="90" y="30" width="280" height="140" rx="18" fill="url(#g-gray)"/>
        <text x="230" y="112" text-anchor="middle" font-size="30" font-weight="900" class="f-dark">equal mass</text>
        <g class="${cls}a">${[150, 230, 310].map((x) => `<line x1="${x}" y1="270" x2="${x}" y2="196" stroke="${WARM}" stroke-width="8" stroke-dasharray="14 10" marker-end="url(#mk-warm)"/>`).join('')}</g>
        <text x="350" y="256" font-size="28" font-weight="900" class="f-warm">same heat q</text>
        ${thermo(680, 10, 200, cls + 't')}
        <text x="${640}" y="${name === 'Iron' ? 70 : 120}" text-anchor="end" font-size="32" font-weight="900" class="${name === 'Iron' ? 'f-warm' : 'f-teal'}" data-at="5@0.5" data-fx="fade">${name === 'Iron' ? 'larger ΔT' : 'smaller ΔT'}</text>
      </svg></div>`
  EZ.scene('bigc', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">What c does</div><h2 class="h1" data-at="0">Larger c, smaller change</h2>
      <div class="banner" style="top:296px" data-at="1" data-fx="pop">Same heat in: larger <span class="teal">c</span> ${ARR} smaller <span class="warm">ΔT</span></div>
      ${metal('Aluminum', '0.90', 'x-al', '2')}${metal('Iron', '0.45', 'x-fe', '2@0.3')}
      <div class="x-chip" style="left:120px;top:868px;border-color:rgba(141,141,240,.7)" data-at="4" data-fx="pop">ΔT = q / (m<span class="teal">c</span>)</div>
      <div class="x-chip" style="left:990px;top:868px" data-at="6" data-fx="pop">Molar heat capacity: J/(mol·°C)</div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[5].start + 0.2, b[5].start + 1.8))
      level(c, '.x-alt', 10, 200, lerp(0.15, 0.42, p)); level(c, '.x-fet', 10, 200, lerp(0.15, 0.69, p))
      const flow = -24 * clamp(c.t - b[2].start, 0, b[5].end - b[2].start)
      for (const k of ['.x-ala', '.x-fea']) c.$(k).querySelectorAll('line').forEach((l) => l.setAttribute('stroke-dashoffset', flow))
    },
  })

  // ---------- calorimetry ----------
  // an insulated cup with water, a lid, a thermometer and a reaction inside (coordinates in px)
  const cup = (tcls) => `
    <path d="M250 470 L750 470 L700 910 L300 910 Z" fill="rgba(238,240,247,.10)" stroke="#c9cee0" stroke-width="5" stroke-linejoin="round"/>
    <path d="M285 500 L715 500 L672 880 L328 880 Z" fill="rgba(14,16,24,.6)" stroke="#7d859c" stroke-width="3"/>
    <path d="M296 590 L704 590 L672 880 L328 880 Z" fill="${TEAL}" opacity=".35"/>
    <rect x="230" y="446" width="540" height="30" rx="12" fill="#646c82"/>
    ${thermo(620, 300, 420, tcls)}
    <g>${ball(430, 760, 22, 'pur')}${ball(470, 730, 18, 'warm')}${ball(462, 784, 16, 'teal')}${ball(400, 722, 14, 'gold')}</g>`
  const spokes = (cls, out, col, mk) => `<g class="${cls}">${Array.from({ length: 8 }, (_, i) => `<line data-a="${i * 45 + 22}" stroke="${col}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-${mk})" data-o="${out}"/>`).join('')}</g>`
  function spin(c, cls, on, out) {
    const g = c.$(cls), ph = (c.t * 0.8) % 1
    g.style.opacity = on
    g.querySelectorAll('line').forEach((l) => {
      const a = (+l.dataset.a * Math.PI) / 180, r1 = out ? 58 + 30 * ph : 128 - 30 * ph, r2 = out ? r1 + 40 : r1 - 40
      l.setAttribute('x1', 440 + r1 * Math.cos(a)); l.setAttribute('y1', 755 + r1 * 0.7 * Math.sin(a))
      l.setAttribute('x2', 440 + r2 * Math.cos(a)); l.setAttribute('y2', 755 + r2 * 0.7 * Math.sin(a))
    })
  }
  EZ.scene('calorimetry', {
    html: `<div class="kicker" data-at="in" data-fx="left">Calorimetry</div><h2 class="h1" data-at="0">Energy is conserved</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.5" data-fx="fade">${cup('x-ct')}</g>
        ${spokes('x-out', 1, WARM, 'warm')}${spokes('x-in', 0, TEAL, 'teal')}
        <g data-at="3@0.5" data-fx="fade"><text x="440" y="872" text-anchor="middle" font-size="28" font-weight="900" class="f-pri">process (system)</text>
          <text x="450" y="632" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">water (surroundings)</text></g>
        <text x="660" y="350" font-size="32" font-weight="900" class="f-warm" data-at="4@0.3" data-out="5" data-fx="fade">water warms</text>
        <text x="660" y="350" font-size="32" font-weight="900" class="f-teal" data-at="5@0.3" data-fx="fade">water cools</text>
      </svg>
      <div class="x-big" style="left:900px;top:300px;width:900px" data-at="1" data-fx="right"><b>First law of thermodynamics</b><span>energy is conserved</span></div>
      <div class="x-big" style="left:900px;top:450px;width:900px" data-at="2" data-fx="right"><b>heat lost by one = heat gained by the other</b><span>in an insulated calorimeter</span></div>
      <div class="x-big" style="left:900px;top:600px;width:900px;border-color:rgba(141,141,240,.7)" data-at="3" data-fx="right"><b class="pri" style="font-size:44px">q<sub>system</sub> = −q<sub>surroundings</sub></b></div>
      <div class="x-big" style="left:900px;top:740px;width:440px;border-color:rgba(243,167,100,.7)" data-at="4" data-fx="right"><b class="warm">Water warms</b><span>${ARR}exothermic</span></div>
      <div class="x-big" style="left:1360px;top:740px;width:440px;border-color:rgba(60,199,188,.7)" data-at="5" data-fx="right"><b class="teal">Water cools</b><span>${ARR}endothermic</span></div>`,
    update(c) {
      const b = c.b
      const up = eio(c.seg(b[4].start + 0.3, b[4].start + 2)), down = eio(c.seg(b[5].start + 0.3, b[5].start + 2))
      level(c, '.x-ct', 300, 420, 0.4 + 0.35 * up - 0.6 * down)
      spin(c, '.x-out', c.seg(b[4].start, b[4].start + 0.3) * (1 - c.seg(b[5].start, b[5].start + 0.3)), true)
      spin(c, '.x-in', c.seg(b[5].start, b[5].start + 0.3), false)
    },
  })

  // ---------- worked example: a metal's specific heat ----------
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Find a metal’s specific heat</h2>
      <div class="card" style="left:120px;top:300px;width:660px;height:650px" data-at="0@0.4"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="160" y="360" font-size="32" font-weight="900" class="f-warm" data-at="1" data-fx="fade">Metal: 25.0 g, starts at 95.0 °C</text>
        <text x="160" y="410" font-size="32" font-weight="900" class="f-teal" data-at="1@0.55" data-fx="fade">Water: 50.0 g, starts at 22.0 °C</text>
        <g data-at="1@0.5" data-fx="fade"><path d="M210 620 L210 900 Q210 920 230 920 L590 920 Q610 920 610 900 L610 620" fill="none" stroke="#c9cee0" stroke-width="5"/>
          <path d="M214 690 L606 690 L606 900 Q606 916 590 916 L230 916 Q214 916 214 900 Z" fill="${TEAL}" opacity=".35"/>
          ${thermo(540, 470, 330, 'x-xt')}</g>
        <g class="x-blk"><rect class="x-bk" x="-60" y="-45" width="120" height="90" rx="14" fill="${WARM}"/></g>
        <g data-at="2" data-fx="fade"><text x="160" y="462" font-size="32" font-weight="900">final: both at <tspan class="f-gold">25.0 °C</tspan></text></g>
      </svg>
      <div class="x-step" style="top:300px" data-at="3" data-fx="right"><div class="H"><i>1</i>Heat gained by the water</div>
        <div class="B" data-at="4" data-fx="fade">q = (50.0)(4.18)(25.0 − 22.0) = <span class="teal">627 J</span></div></div>
      <div class="x-step" style="top:490px" data-at="5" data-fx="right"><div class="H"><i>2</i>Heat lost by the metal</div>
        <div class="B" data-at="5@0.6" data-fx="fade">q = <span class="warm">−627 J</span></div>
        <div class="B" data-at="6" data-fx="fade">ΔT = 25.0 − 95.0 = <span class="warm">−70.0 °C</span></div></div>
      <div class="x-step" style="top:735px;border-color:rgba(76,199,129,.8)" data-at="7" data-fx="right"><div class="H"><i>3</i>Solve for c</div>
        <div class="B" data-at="7@0.4" data-fx="fade">c = q/(mΔT) = (−627) / [(25.0)(−70.0)]</div>
        <div class="B" data-at="8" data-fx="fade">c = <span class="good">0.358 J/(g·°C)</span></div></div>`,
    update(c) {
      const b = c.b, drop = eio(c.seg(b[1].end - 0.4, b[1].end + 0.6))
      c.$('.x-blk').setAttribute('transform', `translate(330 ${lerp(500, 820, drop)})`)
      c.$('.x-blk').style.opacity = c.seg(b[1].start, b[1].start + 0.4)
      const cool = eio(c.seg(b[2].start, b[2].end))
      c.$('.x-bk').setAttribute('fill', cool > 0.5 ? '#aab1c4' : WARM)
      level(c, '.x-xt', 470, 330, lerp(0.25, 0.4, cool))
    },
  })

  // ---------- the sign trick ----------
  const signRow = (top, at, col, a, b) => `<div class="x-big" style="left:40px;width:730px;top:${top}px;border-color:${col}" data-at="${at}" data-fx="pop"><b>${a}</b><span>${b}</span></div>`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Signs without stress</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:500px" data-at="1"><h3><small>1</small>Sizes first</h3>
        <div style="position:absolute;left:40px;top:140px;font-size:52px;font-weight:900">positive numbers only</div>
        <div style="position:absolute;left:40px;top:240px;font-size:34px;font-weight:800;color:var(--muted)">plug them into</div>
        <div style="position:absolute;left:40px;top:300px;font-size:84px;font-weight:900" class="gold">q = mcΔT</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:500px" data-at="2"><h3><small>2</small>Then the sign, by logic</h3>
        ${signRow(120, '3', 'rgba(243,167,100,.7)', 'System lost heat? <em class="warm">q is −</em>', 'exothermic')}
        ${signRow(300, '4', 'rgba(60,199,188,.7)', 'System gained heat? <em class="teal">q is +</em>', 'endothermic')}</div>
      <div class="banner" style="top:840px" data-at="5" data-fx="pop">Thermometer ${ARR} <span class="warm">direction</span> &nbsp;·&nbsp; equation ${ARR} <span class="teal">size</span></div>`,
  })

  // ---------- try it: 50.0 g of water, 20.0 -> 30.0 °C ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">How much heat is needed?</h2>
      <div class="x-gv" style="left:120px" data-at="1@0.3" data-fx="pop"><div class="N">water</div><div class="V">50.0 g</div></div>
      <div class="x-gv" style="left:695px" data-at="1@0.55" data-fx="pop"><div class="N">from ${ARR} to</div><div class="V">20.0 ${ARR} 30.0 °C</div></div>
      <div class="x-gv" style="left:1270px" data-at="1@0.8" data-fx="pop"><div class="N">specific heat</div><div class="V teal">4.18 J/(g·°C)</div></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="700" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="x-num" x="960" y="726" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><div class="ok">${CHECK}</div><div class="A good">2090 J</div>
        <div class="W" data-at="4" data-fx="fade">q = (50.0)(4.18)(<span class="warm">10.0</span>) = 2090 J</div>
        <div class="K" data-at="5" data-fx="fade">= 2.09 kJ</div></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.45 * win})`
    },
  })

  // ---------- free-response tip: heat lost to the surroundings ----------
  const wisps = Array.from({ length: 5 }, (_, i) => `<path class="x-w${i}" d="M0 0 C 14 -20 -14 -40 0 -60" fill="none" stroke="${WARM}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-warm)"/>`).join('')
  const WX = [280, 360, 440, 520, 710]
  EZ.scene('frq', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="0">Heat lost to the surroundings</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.5" data-fx="fade">${cup('x-ft')}</g>
        <g class="x-wisps">${wisps}</g>
        <text x="190" y="980" font-size="30" font-weight="900" class="f-warm" data-at="1@0.6" data-fx="fade">heat escapes to the cup and the air</text>
      </svg>
      <div class="x-big" style="left:900px;top:300px;width:900px;border-color:rgba(243,167,100,.7)" data-at="2" data-fx="right"><b class="warm">Some heat escapes</b><span>exothermic reaction</span></div>
      <div class="x-big" style="left:900px;top:450px;width:900px;height:200px" data-at="3" data-fx="right"><b>Measured ΔT is smaller</b>
        <svg width="840" height="110" viewBox="0 0 840 110" style="display:block;margin-top:10px">
          <text x="0" y="36" font-size="26" font-weight="800" class="f-muted">should be</text><rect x="170" y="14" width="560" height="28" rx="14" fill="none" stroke="#a3abbd" stroke-width="3" stroke-dasharray="12 8"/>
          <text x="0" y="92" font-size="26" font-weight="800" class="f-warm">measured</text><g data-at="3@0.4" data-fx="grow"><rect x="170" y="70" width="360" height="28" rx="14" fill="${WARM}"/></g></svg></div>
      <div class="x-big" style="left:900px;top:680px;width:900px;border-color:rgba(240,112,122,.8)" data-at="4" data-fx="right"><b>Calculated |q| and |ΔH|: <em class="bad">too small</em></b></div>
      <div class="banner" style="top:830px;left:900px;width:900px;font-size:44px" data-at="5" data-fx="pop">State the <span class="warm">direction</span> and the <span class="teal">reason</span></div>`,
    update(c) {
      const b = c.b, on = c.seg(b[1].start, b[1].start + 0.4)
      c.$('.x-wisps').style.opacity = on
      const run = clamp(c.t - b[1].start, 0, b[4].start - b[1].start) // drift while it is discussed, then settle
      WX.forEach((x, i) => {
        const ph = ((run * 0.5 + i * 0.21) % 1), y = 430 - 70 * ph
        const el = c.$('.x-w' + i)
        el.setAttribute('transform', `translate(${x} ${y})`)
        el.style.opacity = c.t > b[4].start ? 0.85 : Math.sin(Math.PI * ph)
      })
      level(c, '.x-ft', 300, 420, 0.55)
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="190" viewBox="0 0 440 190"><text x="220" y="110" text-anchor="middle" font-size="96" font-weight="900"><tspan class="f-gold">q</tspan> = <tspan class="f-pri">m</tspan><tspan class="f-teal">c</tspan><tspan class="f-warm">ΔT</tspan></text></svg>`
  const r2 = `<svg width="440" height="190" viewBox="0 0 440 190"><line x1="110" y1="95" x2="330" y2="95" stroke="${WARM}" stroke-width="10" marker-end="url(#mk-warm)"/>${ball(80, 95, 46, 'warm')}${ball(370, 95, 46, 'teal')}
    <text x="220" y="60" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">heat</text></svg>`
  const r3 = `<svg width="440" height="190" viewBox="0 0 440 190">${thermo(140, 14, 120, 'x-r1')}${thermo(300, 14, 120, 'x-r2', TEAL)}
    <line x1="190" y1="110" x2="190" y2="40" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/><line x1="350" y1="40" x2="350" y2="110" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>heat = mass × c × ΔT<br>Water:<br><span class="teal">c = 4.18 J/(g·°C)</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Calorimetry:<br><span class="warm">heat lost</span> by one<br>= <span class="teal">heat gained</span><br>by the other</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Water warms:<br><span class="warm">exothermic</span><br>Water cools:<br><span class="teal">endothermic</span></p></div>`,
    update(c) {
      level(c, '.x-r1', 14, 120, 0.85); level(c, '.x-r2', 14, 120, 0.2)
    },
  })
})()
