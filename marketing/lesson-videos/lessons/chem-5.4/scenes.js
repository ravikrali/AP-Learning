// Pictures for chem-5.4 "Elementary Reactions". One EZ.scene per scene id in script.mjs.
// Every equation and rate law shown is the lesson's own (app/src/content/chem/u5.ts, book.ts).
// Particles are drawn as simple shaded balls, not to scale. Particle counts in the "why" boxes are
// a picture of "double the concentration", not data.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-th{position:absolute;top:300px;font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .x-row{position:absolute;left:120px;width:1680px;height:140px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-row .s{position:absolute;left:44px;top:36px;font-size:56px;font-weight:900;white-space:nowrap}
    .x-row .m{position:absolute;left:660px;top:46px;font-size:44px;font-weight:800;color:var(--muted)}
    .x-row .r{position:absolute;left:1120px;top:22px;height:96px;padding:0 34px;border-radius:24px;background:rgba(141,141,240,.16);border:2px solid rgba(141,141,240,.6);font-size:54px;font-weight:900;line-height:94px;white-space:nowrap}
    .x-tag{position:absolute;padding:8px 22px;border-radius:999px;font-size:28px;font-weight:900;white-space:nowrap}
    .x-def{left:120px;top:286px;width:1680px;padding:26px 44px;font-size:42px;font-weight:800;line-height:1.45}
    .x-def div{white-space:nowrap}
    .x-eq{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-big{position:absolute;left:120px;width:1680px;display:flex;align-items:center;justify-content:center;gap:34px;font-size:84px;font-weight:900}
    .x-big > span{position:relative;padding:4px 18px;border-radius:22px;border:4px solid transparent}
    .x-big .lab{position:absolute;left:50%;top:112%;transform:translateX(-50%);font-size:30px;font-weight:900;white-space:nowrap}
    .x-law{position:absolute;padding:20px 40px;border-radius:28px;background:rgba(141,141,240,.16);border:3px solid rgba(141,141,240,.7);font-size:72px;font-weight:900;white-space:nowrap}
    .x-strike{position:absolute;left:24px;right:24px;top:58%;height:6px;border-radius:5px;background:var(--bad)}
    .x-stamp{position:absolute} .x-stamp div{transform:rotate(-11deg);padding:4px 30px;border:9px solid var(--bad);border-radius:18px;color:var(--bad);font-size:72px;font-weight:900;letter-spacing:.08em;background:rgba(14,16,24,.85)}
    .x-chk{position:absolute;left:44px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-chk i{display:inline-block;width:22px;height:22px;margin-right:22px;border-radius:50%;vertical-align:middle}
    .x-chip{position:absolute;top:96px;width:200px;height:80px;border-radius:22px;border:3px solid var(--line);background:var(--surface2);text-align:center;font-size:34px;font-weight:900;line-height:74px}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .x-pbox{position:absolute;top:870px;width:810px;height:100px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const flash = (cls, x, y) => `<g transform="translate(${x} ${y})"><circle class="${cls}" r="20" fill="none" stroke="#f2c443" stroke-width="6" opacity="0"/></g>`
  // a one-time expanding ring at the moment two particles meet
  const ring = (c, sel, t0) => { const p = c.seg(t0, t0 + 0.7); const el = c.$(sel); el.setAttribute('r', 20 + 70 * p); el.style.opacity = p > 0 && p < 1 ? 1 - p : 0 }

  // ---------- intro artwork: faint particles at the edges ----------
  EZ.intro = {
    chips: [['1@0.4', 'One step'], ['1@0.6', 'Molecularity'], ['1@0.82', 'Rate law shortcut']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      <g class="ia">${ball(0, 0, 54, 'pur', 'A', 40)}</g><g class="ib">${ball(0, 0, 54, 'teal', 'B', 40)}</g>
      <g class="ic">${ball(0, 0, 50, 'pur', 'A', 38)}</g><g class="id">${ball(0, 0, 50, 'pur', 'A', 38)}</g></svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.3, c.sc.start + 2.6))
      c.$('.ia').setAttribute('transform', `translate(${lerp(90, 150, p)} ${lerp(420, 560, p)})`)
      c.$('.ib').setAttribute('transform', `translate(${lerp(260, 220, p)} ${lerp(800, 650, p)})`)
      c.$('.ic').setAttribute('transform', `translate(${lerp(1700, 1720, p)} ${lerp(380, 540, p)})`)
      c.$('.id').setAttribute('transform', `translate(${lerp(1840, 1810, p)} ${lerp(820, 640, p)})`)
    },
  }

  // ---------- hook: a relay race of small steps ----------
  const LEGS = [200, 580, 960, 1340, 1720]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="0">Most reactions run like a relay race</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><text x="200" y="420" font-size="40" font-weight="900" class="f-pri">Reactants</text><text x="1720" y="420" text-anchor="end" font-size="40" font-weight="900" class="f-teal">Products</text></g>
        <g data-at="0@0.5" data-out="1" data-fx="fade"><line x1="230" y1="480" x2="1680" y2="480" stroke="#a3abbd" stroke-width="10" stroke-dasharray="26 22" marker-end="url(#mk-muted)"/>
          <text x="960" y="545" text-anchor="middle" font-size="34" font-weight="800" class="f-muted">one big event?</text></g>
        <g data-at="1" data-fx="fade"><line x1="200" y1="480" x2="1720" y2="480" stroke="#363c54" stroke-width="20" stroke-linecap="round"/>
          ${LEGS.slice(1, 4).map((x) => `<circle cx="${x}" cy="480" r="16" fill="#a3abbd"/>`).join('')}</g>
        <line class="x-run" x1="200" y1="480" x2="200" y2="480" stroke="#f2c443" stroke-width="20" stroke-linecap="round"/>
        <g class="x-bat"><circle r="26" fill="url(#g-gold)"/></g>
        ${LEGS.slice(0, 4).map((x, i) => `<text x="${(x + LEGS[i + 1]) / 2}" y="540" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="3@${0.2 + i * 0.12}" data-fx="fade">elementary step</text>`).join('')}
      </svg>
      <div class="card" style="left:120px;top:590px;width:810px;height:280px" data-at="2"><h3>One collision</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="200"><g class="x-c1">${ball(0, 0, 56, 'pur')}</g><g class="x-c2">${ball(0, 0, 56, 'teal')}</g>${flash('x-f1', 405, 96)}</svg></div>
      <div class="card" style="left:990px;top:590px;width:810px;height:280px" data-at="2@0.55"><h3>One breakup</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="200"><g class="x-b1">${ball(0, 0, 56, 'warm')}</g><g class="x-b2">${ball(0, 0, 56, 'warm')}</g></svg></div>
      <div class="banner" style="top:900px" data-at="4" data-fx="pop">Elementary step ${ARR} read the <span class="teal">rate law</span> from the equation</div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[1].start + 0.4, b[1].end + 0.6)), x = lerp(200, 1720, p)
      c.$('.x-run').setAttribute('x2', x)
      c.$('.x-bat').setAttribute('transform', `translate(${x} 480)`)
      c.$('.x-bat').style.opacity = c.seg(b[1].start, b[1].start + 0.4)
      const m = eio(c.seg(b[2].start + 0.2, b[2].start + 1.4))
      c.$('.x-c1').setAttribute('transform', `translate(${lerp(170, 349, m)} 96)`)
      c.$('.x-c2').setAttribute('transform', `translate(${lerp(640, 461, m)} 96)`)
      ring(c, '.x-f1', b[2].start + 1.4)
      const s = eio(c.seg(b[2].start + 1.6, b[2].start + 2.8))
      c.$('.x-b1').setAttribute('transform', `translate(${lerp(370, 220, s)} 96)`)
      c.$('.x-b2').setAttribute('transform', `translate(${lerp(440, 590, s)} 96)`)
    },
  })

  // ---------- what an elementary step is: molecularity ----------
  const MOL = [
    ['1', 'Unimolecular', 'A → products', 'x-u'],
    ['2', 'Bimolecular', 'A + B → products', 'x-bi'],
    ['3', 'Termolecular', 'A + B + C → products', 'x-t'],
  ]
  EZ.scene('what', {
    html: `<div class="kicker" data-at="in" data-fx="left">Elementary step</div><h2 class="h1" data-at="0">One event, counted in particles</h2>
      <div class="card x-def" data-at="0@0.2"><div>An <b class="pri">elementary reaction</b> = a single molecular event</div>
        <div class="muted" data-at="1" data-fx="fade">Its equation shows exactly which particles come together</div>
        <div data-at="2" data-fx="fade"><b class="teal">Molecularity</b> = the number of particles colliding</div></div>
      ${MOL.map(([n, name, eq, k], i) => `<div class="card" style="left:${120 + i * 570}px;top:540px;width:540px;height:400px" data-at="${3 + i}"><h3><small>${n}</small><span class="${['warm', 'pri', 'teal'][i]}">${name}</span></h3>
        <svg style="position:absolute;left:0;top:100px" width="540" height="210">
          ${i === 0 ? `<g class="x-u1">${ball(0, 0, 50, 'warm')}</g><g class="x-u2">${ball(0, 0, 50, 'warm')}</g>` : ''}
          ${i === 1 ? `<g class="x-bi1">${ball(0, 0, 50, 'pur', 'A', 38)}</g><g class="x-bi2">${ball(0, 0, 50, 'teal', 'B', 38)}</g>${flash('x-bif', 270, 105)}` : ''}
          ${i === 2 ? `<g class="x-t1">${ball(0, 0, 42, 'pur', 'A', 32)}</g><g class="x-t2">${ball(0, 0, 42, 'teal', 'B', 32)}</g><g class="x-t3">${ball(0, 0, 42, 'gold', 'C', 32)}</g>${flash('x-tf', 270, 105)}` : ''}
        </svg><div class="x-eq">${eq}</div></div>`).join('')}`,
    update(c) {
      const b = c.b
      const u = eio(c.seg(b[3].start + 0.6, b[3].end))
      c.$('.x-u1').setAttribute('transform', `translate(${lerp(240, 150, u)} 105)`)
      c.$('.x-u2').setAttribute('transform', `translate(${lerp(300, 390, u)} 105)`)
      const m = eio(c.seg(b[4].start + 0.2, b[4].start + 1.2))
      c.$('.x-bi1').setAttribute('transform', `translate(${lerp(70, 220, m)} 105)`)
      c.$('.x-bi2').setAttribute('transform', `translate(${lerp(470, 320, m)} 105)`)
      ring(c, '.x-bif', b[4].start + 1.2)
      const t = eio(c.seg(b[5].start + 0.2, b[5].start + 1.3))
      c.$('.x-t1').setAttribute('transform', `translate(${lerp(60, 226, t)} ${lerp(40, 120, t)})`)
      c.$('.x-t2').setAttribute('transform', `translate(${lerp(480, 314, t)} ${lerp(40, 120, t)})`)
      c.$('.x-t3').setAttribute('transform', `translate(270 ${lerp(220, 46, t)})`)
      ring(c, '.x-tf', b[5].start + 1.3)
    },
  })

  // ---------- the shortcut table ----------
  const ROWS = [
    ['A → products', 'unimolecular', 'rate = k[A]'],
    ['A + B → products', 'bimolecular', 'rate = k[A][B]'],
    ['<span class="x-hl">2</span>A → products', 'bimolecular', 'rate = k[A]<sup class="x-hl">2</sup>'],
  ]
  EZ.scene('table', {
    html: `<div class="kicker" data-at="in" data-fx="left">The shortcut</div><h2 class="h1" data-at="0">Rate law straight from the equation</h2>
      <div class="x-tag warm" style="left:1440px;top:204px;border:3px solid var(--warm);background:rgba(243,167,100,.12)" data-at="0@0.3" data-fx="pop">elementary steps only</div>
      <div class="x-th" style="left:164px" data-at="0@0.6" data-fx="fade">Step</div><div class="x-th" style="left:780px" data-at="0@0.6" data-fx="fade">Molecularity</div><div class="x-th" style="left:1240px" data-at="0@0.6" data-fx="fade">Rate law</div>
      ${ROWS.map(([s, m, r], i) => `<div class="x-row" style="top:${350 + i * 160}px" data-at="${i + 1}"><div class="s">${s}</div><div class="m">${m}</div>
        <div class="r" data-at="${i + 1}@0.6" data-fx="pop">${r}</div></div>`).join('')}
      <div class="banner" style="top:850px" data-at="4" data-fx="pop">Elementary step: <span class="gold">exponents = coefficients</span></div>`,
    update(c) {
      const on = c.seg(c.b[4].start + 0.5, c.b[4].start + 0.9)
      for (const el of c.root.querySelectorAll('.x-hl')) { el.style.color = on ? '#f2c443' : ''; el.style.textShadow = on ? `0 0 ${24 * on}px rgba(242,196,67,${on})` : '' }
    },
  })

  // ---------- why: count the collisions ----------
  const A0 = [[90, 70], [250, 170], [380, 60]], B0 = [[170, 180], [300, 80], [420, 190]]
  const A2 = [[60, 180], [200, 50], [330, 200]], B2 = [[60, 130], [230, 60], [350, 140]]
  const BOX = [['Start', A0, B0, 1], ['Double [A]', [...A0, ...A2], B0, 2], ['Double [B]', A0, [...B0, ...B2], 2]]
  EZ.scene('why', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Why it works</div><h2 class="h1" data-at="0">Count the A–B collisions</h2>
      ${BOX.map(([h, pa, pb, k], i) => {
        return `<div class="card" style="left:${120 + i * 570}px;top:300px;width:540px;height:470px" data-at="${i + 1}"><h3>${h.replace(/\[(A|B)\]/, (m, s) => `<span class="${s === 'A' ? 'pri' : 'teal'}">[${s}]</span>`)}</h3>
        <svg style="position:absolute;left:0;top:96px" width="540" height="370">
          <rect x="30" y="6" width="480" height="250" rx="22" fill="rgba(14,16,24,.55)" stroke="#363c54" stroke-width="3"/>
          <g transform="translate(30 6)">${pa.map(([x, y], j) => `<g class="x-p" data-ph="${j * 1.7 + i}">${ball(x, y, 22, 'pur', 'A', 20)}</g>`).join('')}${pb.map(([x, y], j) => `<g class="x-p" data-ph="${j * 2.3 + i + 0.5}">${ball(x, y, 22, 'teal', 'B', 20)}</g>`).join('')}</g>
          <text x="30" y="300" font-size="26" font-weight="800" class="f-muted">A–B collisions per second</text>
          <rect x="30" y="318" width="${k === 1 ? 150 : 300}" height="30" rx="15" fill="${k === 1 ? '#7d859c' : '#f2c443'}" data-at="${i + 1}@0.6" data-fx="grow"/>
          <text x="${k === 1 ? 200 : 350}" y="345" font-size="36" font-weight="900" class="${k === 1 ? 'f-muted' : 'f-gold'}" data-at="${i + 1}@0.75" data-fx="fade">×${k}</text>
        </svg></div>` }).join('')}
      <div class="banner" style="top:800px" data-at="4" data-fx="pop">Rate ∝ <span class="pri">[A]</span><span class="teal">[B]</span></div>
      <div style="position:absolute;left:0;top:938px;width:1920px;text-align:center;font-size:40px;font-weight:800;color:var(--muted)" data-at="5">The rate law counts the particles that must come together</div>`,
    update(c) {
      const amp = 9 * (1 - c.seg(c.b[4].start, c.b[4].start + 1.2))
      for (const g of c.root.querySelectorAll('.x-p')) { const ph = +g.dataset.ph; g.setAttribute('transform', `translate(${amp * Math.sin(c.t * 1.3 + ph)} ${amp * Math.cos(c.t * 1.1 + ph * 1.3)})`) }
    },
  })

  // ---------- termolecular steps are rare ----------
  EZ.scene('rare', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Three at once?</div><h2 class="h1" data-at="0">Termolecular steps</h2>
      <div class="x-row" style="top:300px" data-at="1"><div class="s">A + B + C → products</div><div class="m" style="left:830px">termolecular</div>
        <div class="r" data-at="1@0.6" data-fx="pop">rate = k[A][B][C]</div></div>
      <div class="x-stamp" style="left:1480px;top:150px" data-at="2" data-fx="pop"><div>RARE</div></div>
      <div class="card" style="left:120px;top:480px;width:900px;height:420px" data-at="3"><h3>Three balls, one spot, one instant</h3>
        <svg style="position:absolute;left:0;top:90px" width="900" height="330">
          <circle cx="450" cy="150" r="64" fill="none" stroke="#a3abbd" stroke-width="3" stroke-dasharray="10 10" opacity=".7"/>
          <g class="x-r1">${ball(0, 0, 44, 'gray')}</g><g class="x-r2">${ball(0, 0, 44, 'gold')}</g><g class="x-r3">${ball(0, 0, 44, 'warm')}</g>
          <text x="450" y="312" text-anchor="middle" font-size="32" font-weight="900" class="f-warm" data-at="3@0.85" data-fx="fade">almost never all together</text>
        </svg></div>
      <div class="card" style="left:1060px;top:480px;width:740px;height:420px" data-at="4"><h3>All three must happen</h3>
        <div class="x-chk" style="top:110px" data-at="4@0.15" data-fx="left"><i style="background:var(--primary)"></i>at the same instant</div>
        <div class="x-chk" style="top:170px" data-at="4@0.35" data-fx="left"><i style="background:var(--warm)"></i>with the right energy</div>
        <div class="x-chk" style="top:230px" data-at="4@0.55" data-fx="left"><i style="background:var(--accent)"></i>with the right orientation</div>
        <div style="position:absolute;left:44px;right:44px;top:310px;padding:16px;border-radius:22px;text-align:center;font-size:38px;font-weight:900;background:rgba(76,199,129,.14);border:2px solid var(--good)" data-at="5" data-fx="pop"><span class="good">Common:</span> uni- and bimolecular</div></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3
      // two balls reach the spot together; the third arrives late, after they have bounced apart
      const a = eio(c.seg(t0, t0 + 1.2)), back = eio(c.seg(t0 + 1.2, t0 + 2.2))
      const late = eio(c.seg(t0 + 1.0, t0 + 2.6))
      c.$('.x-r1').setAttribute('transform', `translate(${lerp(90, 404, a) - 150 * back} ${lerp(60, 150, a) - 60 * back})`)
      c.$('.x-r2').setAttribute('transform', `translate(${lerp(810, 496, a) + 150 * back} ${lerp(60, 150, a) - 60 * back})`)
      c.$('.x-r3').setAttribute('transform', `translate(450 ${lerp(400, 196, late)})`)
    },
  })

  // ---------- worked example: 2NO2 -> NO3 + NO ----------
  const no2 = `${ball(0, -6, 34, 'teal', 'N', 30)}${ball(-44, 30, 30, 'red', 'O', 26)}${ball(44, 30, 30, 'red', 'O', 26)}`
  EZ.scene('example', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Read the rate law from the step</h2>
      <div class="card" style="left:120px;top:296px;width:1680px;height:270px" data-at="1"></div>
      <div class="x-big" style="top:330px" data-at="1"><span class="x-lhs">2NO<sub>2</sub><b class="lab teal" data-at="2" data-fx="fade">what collides</b></span><span>→</span><span class="x-rhs">NO<sub>3</sub> + NO<b class="lab muted" data-at="4" data-fx="fade">not in the rate law</b></span></div>
      <div class="card" style="left:120px;top:600px;width:810px;height:330px" data-at="2"><h3>Two NO<sub>2</sub> molecules collide</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="250"><g class="x-n1">${no2}</g><g class="x-n2">${no2}</g>${flash('x-nf', 405, 120)}</svg></div>
      <div class="x-law" style="left:1070px;top:640px" data-at="3@0.4" data-fx="pop">rate = k[NO<sub>2</sub>]<sup class="gold">2</sup></div>
      <div style="position:absolute;left:1070px;top:810px;font-size:38px;font-weight:900;white-space:nowrap" data-at="3@0.7" data-fx="fade"><span class="pri">bimolecular</span>: 2 molecules ${ARR} exponent <span class="gold">2</span></div>`,
    update(c) {
      const b = c.b
      const hl = c.seg(b[2].start, b[2].start + 0.4), dim = c.seg(b[4].start, b[4].start + 0.5)
      const l = c.$('.x-lhs'); l.style.borderColor = `rgba(60,199,188,${hl})`; l.style.background = `rgba(60,199,188,${0.12 * hl})`
      c.$('.x-rhs').style.color = dim ? `rgba(238,240,247,${1 - 0.6 * dim})` : ''
      const m = eio(c.seg(b[2].start + 0.3, b[2].start + 1.5))
      c.$('.x-n1').setAttribute('transform', `translate(${lerp(150, 310, m)} 110)`)
      c.$('.x-n2').setAttribute('transform', `translate(${lerp(660, 500, m)} 110)`)
      ring(c, '.x-nf', b[2].start + 1.5)
    },
  })

  // ---------- the trap: overall reactions ----------
  const h2 = `${ball(-20, 0, 22, 'gray', 'H', 18)}${ball(20, 0, 22, 'gray', 'H', 18)}`
  const no = `${ball(-22, 0, 26, 'teal', 'N', 22)}${ball(24, 0, 24, 'red', 'O', 20)}`
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The trap</div><h2 class="h1" data-at="1">Only for elementary steps</h2>
      <div class="card" style="left:120px;top:296px;width:1680px;height:130px" data-at="2"><div style="position:absolute;left:44px;top:34px;font-size:30px;font-weight:900;letter-spacing:.1em;color:var(--muted)">OVERALL</div>
        <div style="position:absolute;left:0;right:0;top:22px;text-align:center;font-size:66px;font-weight:900">2H<sub>2</sub> + 2NO → N<sub>2</sub> + 2H<sub>2</sub>O</div></div>
      <div class="x-law" style="left:120px;top:452px;font-size:60px;padding:14px 40px;border-color:rgba(240,112,122,.7);background:rgba(240,112,122,.1)" data-at="3"><span style="position:relative">rate = k[H<sub>2</sub>]<sup>2</sup>[NO]<sup>2</sup><i class="x-strike" style="left:-10px;right:-10px" data-at="4" data-fx="grow" data-dur="0.35"></i></span></div>
      <div class="x-stamp" style="left:860px;top:452px" data-at="4+0.15" data-fx="pop"><div>NO!</div></div>
      <div class="card" style="left:120px;top:600px;width:810px;height:280px" data-at="5"><h3>In one step?</h3>
        <svg style="position:absolute;left:0;top:70px" width="810" height="210">
          <g class="x-m1">${h2}</g><g class="x-m2">${h2}</g><g class="x-m3">${no}</g><g class="x-m4">${no}</g>
          <text x="405" y="196" text-anchor="middle" font-size="30" font-weight="900" class="f-bad" data-at="5@0.6" data-fx="fade">4 molecules at once: effectively impossible</text></svg></div>
      <div class="card" style="left:990px;top:600px;width:810px;height:280px" data-at="6"><h3>Really: several steps</h3>
        <div class="x-chip" style="left:44px" data-at="6@0.3" data-fx="pop">step</div><div style="position:absolute;left:256px;top:108px;font-size:40px" class="muted">${ARR}</div>
        <div class="x-chip" style="left:304px" data-at="6@0.45" data-fx="pop">step</div><div style="position:absolute;left:516px;top:108px;font-size:40px" class="muted">${ARR}</div>
        <div class="x-chip" style="left:564px" data-at="6@0.6" data-fx="pop">…</div>
        <div style="position:absolute;left:44px;top:190px;font-size:30px;font-weight:800" class="muted" data-at="6@0.7" data-fx="fade">each step: only 1 or 2 molecules</div>
        <div style="position:absolute;left:44px;top:230px;font-size:30px;font-weight:900;white-space:nowrap" class="warm" data-at="7" data-fx="fade">the slowest step sets the experimental rate law</div></div>
      <div class="banner" style="top:904px;font-size:46px" data-at="8" data-fx="pop">Overall rate law: from <span class="warm">experiment</span> (or a mechanism)</div>`,
    update(c) {
      const b = c.b, m = eio(c.seg(b[5].start + 0.2, b[5].start + 1.4))
      const P = [[120, 40, 330, 70], [690, 40, 480, 70], [120, 150, 340, 120], [690, 150, 470, 120]]
      P.forEach(([x0, y0, x1, y1], i) => c.$('.x-m' + (i + 1)).setAttribute('transform', `translate(${lerp(x0, x1, m)} ${lerp(y0, y1, m)})`))
    },
  })

  // ---------- try it ----------
  const OPTS = ['rate = k[NO]', 'rate = k[NO][O<sub>3</sub>]', 'rate = k[NO<sub>2</sub>][O<sub>2</sub>]', 'rate = k[NO]<sup>2</sup>[O<sub>3</sub>]']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What is the <span class="teal">rate law</span>?</h2>
      <div style="position:absolute;left:120px;top:274px;font-size:42px;font-weight:800;color:var(--muted)" data-at="1@0.2">Elementary step: <b style="color:var(--text)">NO + O<sub>3</sub> → NO<sub>2</sub> + O<sub>2</sub></b></div>
      ${OPTS.map((o, i) => `<div class="x-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${370 + Math.floor(i / 2) * 150}px" data-at="1@${0.55 + i * 0.1}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="800" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="800" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 800)"/>
        <text class="num" x="960" y="826" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="930" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:700px" data-at="4" data-fx="pop">Elementary + <span class="pri">bimolecular</span>: one NO meets one O<sub>3</sub></div>
      <div class="x-pbox" style="left:555px;border-color:var(--gold);background:rgba(242,196,67,.12)" data-at="5" data-fx="pop">Each exponent =&nbsp;<span class="gold">1</span></div>`,
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
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="70" text-anchor="middle" font-size="46" font-weight="900"><tspan class="f-gold">2</tspan>A → products</text>
    <text x="230" y="170" text-anchor="middle" font-size="50" font-weight="900" class="f-pri">rate = k[A]<tspan dy="-.5em" font-size=".62em" class="f-gold">2</tspan></text></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210">${ball(70, 60, 30, 'pur')}${ball(130, 60, 30, 'teal')}<text x="200" y="72" font-size="32" font-weight="900" class="f-good">common</text>
    ${ball(60, 160, 26, 'pur')}${ball(112, 160, 26, 'teal')}${ball(164, 160, 26, 'gold')}<text x="216" y="172" font-size="32" font-weight="900" class="f-bad">rare</text></svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="30" y="24" width="400" height="100" rx="22" fill="rgba(240,112,122,.1)" stroke="#f0707a" stroke-width="3"/>
    <text x="230" y="88" text-anchor="middle" font-size="38" font-weight="900">overall coefficients</text>
    <text x="230" y="178" text-anchor="middle" font-size="40" font-weight="900" class="f-bad">≠ rate law exponents</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Elementary step:<br><span class="gold">exponents =</span><br><span class="gold">coefficients</span><br>(molecularity)</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Uni- and bimolecular:<br><span class="good">common</span><br>Termolecular:<br><span class="bad">rare</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Never for an<br><span class="bad">overall reaction!</span><br>Its rate law comes<br>from <span class="warm">experiment</span></p></div>`,
  })
})()
