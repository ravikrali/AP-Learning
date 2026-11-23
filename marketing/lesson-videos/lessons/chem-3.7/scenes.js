// Pictures for chem-3.7 "Solutions & Molarity". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u3.ts; the volumetric flask note is
// from book.ts). Particles are schematic: counts and sizes are not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .hk{top:300px;width:540px;height:470px}
    .tag{position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:36px;font-weight:900}
    .ft{position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:33px;font-weight:800;white-space:nowrap}
    .chx{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:31px;font-weight:800;line-height:68px;white-space:nowrap}
    .fm{position:absolute;left:56px;top:96px;display:flex;align-items:center;gap:30px;font-size:64px;font-weight:900;white-space:nowrap}
    .fr{display:flex;flex-direction:column;align-items:center} .fr span{padding:4px 16px;font-size:44px} .fr span+span{border-top:6px solid var(--text)}
    .ln{position:absolute;left:56px;font-size:34px;font-weight:800;white-space:nowrap;color:var(--muted)}
    .b2{position:absolute;left:60px;font-size:54px;font-weight:900;white-space:nowrap}
    .prob{left:120px;top:290px;width:1680px;height:130px;padding:36px 48px 0;font-size:44px;font-weight:800;white-space:nowrap}
    .srow{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .srow .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:68px;text-align:center}
    .srow .lb{position:absolute;left:124px;top:38px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .srow .eq{position:absolute;left:520px;top:30px;font-size:46px;font-weight:900;white-space:nowrap}
    .res{position:absolute;left:1330px;top:18px;height:80px;padding:0 30px;border-radius:20px;font-size:46px;font-weight:900;line-height:76px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .tok{position:absolute;left:0;top:0;font-size:46px;font-weight:900;white-space:nowrap;color:var(--primary)}
    .ir{position:absolute;left:36px;width:740px;height:80px}
    .ir .f{position:absolute;left:0;top:10px;font-size:40px;font-weight:900;white-space:nowrap}
    .ir .k{position:absolute;left:236px;top:18px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .ir .br{position:absolute;left:380px;top:24px;height:32px;border-radius:16px;background:linear-gradient(90deg,#b96a26,#f3a764)}
    .ir .v{position:absolute;top:12px;font-size:40px;font-weight:900;white-space:nowrap}
    .cn{position:absolute;left:56px;font-size:46px;font-weight:900;white-space:nowrap}
    .ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:31px;font-weight:800;line-height:1.4;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const rnd = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }
  const tri = (p, L) => { const m = ((p % (2 * L)) + 2 * L) % (2 * L); return m < L ? m : 2 * L - m }
  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const sb = (s) => `<tspan dy=".3em" font-size=".62em">${s}</tspan>` // SVG subscript (only at the end of a text)

  // a moving particle: k = 'v' vibrate, 'l' wander (liquid), 'g' bounce inside the box bx,by,bw,bh
  const pj = (k, i, x, y, r, g, box = [0, 0, 0, 0]) =>
    `<g class="pj" data-k="${k}" data-i="${i}" data-x="${x}" data-y="${y}" data-r="${r}" data-b="${box.join(',')}" transform="translate(${x} ${y})">${ball(0, 0, r, g)}</g>`
  const move = (c) => {
    const t = c.t
    for (const g of all(c, '.pj')) {
      const d = g.dataset, i = +d.i, x = +d.x, y = +d.y, r = +d.r
      let X = x, Y = y
      if (d.k === 'v') { X += 2 * Math.sin(t * 14 + i * 1.9); Y += 2 * Math.cos(t * 12 + i * 2.7) }
      else if (d.k === 'l') { X += 4 * Math.sin(t * 2.2 + i * 1.7); Y += 3.5 * Math.cos(t * 1.9 + i * 2.3) }
      else { const [bx, by, bw, bh] = d.b.split(',').map(Number)
        X = bx + r + tri(x - bx - r + (80 + ((i * 47) % 70)) * t, bw - 2 * r)
        Y = by + r + tri(y - by - r + (60 + ((i * 29) % 80)) * t * (i % 2 ? 1 : -1), bh - 2 * r) }
      g.setAttribute('transform', `translate(${X.toFixed(1)} ${Y.toFixed(1)})`)
    }
  }

  // glassware
  const beakerD = (x, y, w, h) => `M${x - 12} ${y} H${x} V${y + h - 26} Q${x} ${y + h} ${x + 26} ${y + h} H${x + w - 26} Q${x + w} ${y + h} ${x + w} ${y + h - 26} V${y} H${x + w + 12}`
  const liqD = (x, y, w, h, lv) => { const t = y + h - lv, i = 7
    return `M${x + i} ${t} H${x + w - i} V${y + h - 26} Q${x + w - i} ${y + h - i} ${x + w - 26} ${y + h - i} H${x + 26} Q${x + i} ${y + h - i} ${x + i} ${y + h - 26} Z` }
  const beaker = (x, y, w, h, lv, fill = 'rgba(60,199,188,.16)', cls = '') =>
    `<path class="${cls}" d="${liqD(x, y, w, h, lv)}" fill="${fill}"/><path d="${beakerD(x, y, w, h)}" fill="none" stroke="#c9cee0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`
  // volumetric flask: neck from y = top to nb, round bulb of radius r below
  const flaskD = (cx, top, nb, r, hw = 30) => `M${cx - hw} ${top} V${nb} A${r} ${r} 0 1 0 ${cx + hw} ${nb} V${top}`
  const bulbC = (nb, r, hw = 30) => nb + Math.sqrt(r * r - hw * hw)

  // ---------- intro artwork: faint flasks on the left and right edges (above y = 950) ----------
  const introFlask = (cx, id) => `<clipPath id="${id}"><path d="${flaskD(cx, 360, 470, 95)}Z"/></clipPath>
    <rect class="lv ${id}" x="${cx - 100}" y="660" width="200" height="300" clip-path="url(#${id})" fill="#3cc7bc" opacity=".55"/>
    <path d="${flaskD(cx, 360, 470, 95)}" fill="none" stroke="#c9cee0" stroke-width="6"/><line x1="${cx - 42}" x2="${cx + 42}" y1="400" y2="400" stroke="#c9cee0" stroke-width="4"/>`
  EZ.intro = {
    chips: [['1@0.3', 'What is a solution'], ['1@0.5', 'Molarity'], ['1@0.78', 'Ions & dilution']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${introFlask(150, 'ifa')}${introFlask(1770, 'ifb')}</svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.4, c.sc.start + 3.4)), y = lerp(660, 400, p)
      for (const el of all(c, '.lv')) el.setAttribute('y', y)
    },
  }

  // ---------- hook: a sports drink, air and brass are all solutions ----------
  const bottle = 'M210 20 H330 V60 Q330 80 360 90 Q420 110 420 160 V250 Q420 272 398 272 H142 Q120 272 120 250 V160 Q120 110 180 90 Q210 80 210 60 Z'
  let drink = `<path d="${bottle}" fill="rgba(243,167,100,.12)" stroke="#c9cee0" stroke-width="5"/>`, n = 0
  for (let r = 0; r < 4; r++) for (let q = 0; q < 8; q++) { n++; drink += pj('l', n, 152 + q * 34 + (r % 2 ? 10 : 0), 140 + r * 36, (n % 3 ? 12 : 9), n % 3 ? 'teal' : 'warm') }
  let air = '<rect x="110" y="24" width="320" height="246" rx="22" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="4" stroke-dasharray="14 10"/>'
  for (let q = 0; q < 12; q++) air += pj('g', q, 140 + ((q * 151) % 260), 50 + ((q * 83) % 190), 13, q % 3 ? 'pur' : 'gray', [110, 24, 320, 246])
  let brass = '<rect x="100" y="64" width="340" height="208" rx="18" fill="rgba(242,196,67,.08)" stroke="#c9cee0" stroke-width="4"/>'
  n = 0
  for (let r = 0; r < 5; r++) for (let q = 0; q < 8; q++) { n++; brass += pj('v', n, 132 + q * 40, 92 + r * 40, 19, rnd(n) < 0.35 ? 'warm' : 'gold') }
  const hookCard = (left, title, cls, at, pic, tag, tcls) => `<div class="card hk" style="left:${left}px" data-at="${at}"><h3 class="${cls}">${title}</h3>
      <svg style="position:absolute;left:0;top:86px" width="540" height="300">${pic}</svg>
      <div class="tag ${tcls}" data-at="2@${0.2 + (left - 120) / 2400}" data-fx="pop">${tag}</div></div>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">What do these share?</div><h2 class="h1" data-at="0">Three everyday mixtures</h2>
      ${hookCard(120, 'Sports drink', 'warm', '0@0.2', drink, 'liquid', 'teal')}
      ${hookCard(690, 'Air you breathe', 'pri', '0@0.45', air, 'gas', 'pri')}
      ${hookCard(1260, 'Brass trumpet', 'gold', '0@0.75', brass, 'solid', 'gold')}
      <div class="banner" style="top:810px" data-at="1" data-out="3" data-fx="pop">All three are <span class="teal">solutions</span></div>
      <div class="banner" style="top:810px" data-at="3" data-fx="pop">A solution is <span class="teal">uniform throughout</span></div>`,
    update: move,
  })

  // ---------- solution vs heterogeneous mixture ----------
  let solB = beaker(70, 30, 260, 280, 240), sand = beaker(70, 30, 260, 280, 240)
  n = 0
  for (let r = 0; r < 6; r++) for (let q = 0; q < 5; q++) { n++; solB += pj('l', n, 108 + q * 46 + (r % 2 ? 18 : 0) + (rnd(n) - 0.5) * 10, 104 + r * 36 + (rnd(n + 7) - 0.5) * 8, 9, 'warm') }
  for (let r = 0; r < 3; r++) for (let q = 0; q < 8 - r; q++) { n++; sand += pj('v', n, 98 + q * 29 + r * 15 + (rnd(n) - 0.5) * 4, 286 - r * 25, 13, 'warm') }
  const dress = `<clipPath id="mx-dr"><path d="${liqD(450, 30, 260, 280, 240)}"/></clipPath>
    <g clip-path="url(#mx-dr)"><rect x="440" y="60" width="290" height="270" fill="rgba(141,141,240,.32)"/><path class="oil" d="" fill="rgba(242,196,67,.42)"/></g>
    <path d="${beakerD(450, 30, 260, 280)}" fill="none" stroke="#c9cee0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`
  const probe = (cls) => `<g class="${cls}"><circle r="34" fill="rgba(255,255,255,.06)" stroke="#eef0f7" stroke-width="5"/><line x1="24" y1="24" x2="52" y2="52" stroke="#eef0f7" stroke-width="9" stroke-linecap="round"/></g>`
  EZ.scene('mixture', {
    html: `<div class="kicker" data-at="in" data-fx="left">Mixtures</div><h2 class="h1" data-at="0">Solution or not?</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:600px" data-at="1"><h3 class="teal">Solution <span class="muted" style="font-size:32px">(homogeneous mixture)</span></h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="380">${solB}${probe('pa')}</svg>
        <div class="chx" style="left:420px;top:150px" data-at="2" data-fx="right"><span class="gold">solid</span> · alloy</div>
        <div class="chx" style="left:420px;top:250px" data-at="2@0.4" data-fx="right"><span class="teal">liquid</span> · salt water</div>
        <div class="chx" style="left:420px;top:350px" data-at="2@0.75" data-fx="right"><span class="pri">gas</span> · air</div>
        <div class="ft teal" data-at="1@0.5" data-fx="fade">same throughout the sample</div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:600px" data-at="3"><h3 class="warm">Heterogeneous mixture</h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="380">${sand}${dress}${probe('pb')}
          <text x="200" y="362" text-anchor="middle" font-size="32" font-weight="900" class="f-muted" data-at="4" data-fx="fade">sand in water</text>
          <text x="580" y="362" text-anchor="middle" font-size="32" font-weight="900" class="f-muted" data-at="4@0.4" data-fx="fade">salad dressing</text></svg>
        <div class="ft warm" data-at="3@0.5" data-fx="fade">depends on where you look</div></div>`,
    update(c) {
      move(c)
      const t = c.t, w = (k) => 0.5 + 0.5 * Math.sin(t * 1.5 + k)
      c.$('.pa').setAttribute('transform', `translate(${200 + 30 * Math.sin(t * 0.9)} ${lerp(110, 270, w(0))})`)
      c.$('.pa').style.opacity = c.p('1@0.4', 0.5)
      c.$('.pb').setAttribute('transform', `translate(200 ${lerp(110, 270, w(1))})`)
      c.$('.pb').style.opacity = c.p('3@0.4', 0.5)
      let d = 'M440 60'
      for (let x = 440; x <= 730; x += 10) d += ` L${x} ${(170 + 6 * Math.sin(x / 30 + t * 1.6)).toFixed(1)}`
      c.$('.oil').setAttribute('d', d + ' L730 60 Z')
    },
  })

  // ---------- molarity ----------
  const FL = flaskD(250, 20, 150, 115), FC = bulbC(150, 115)
  let ions = ''
  for (let k = 0; k < 12; k++) { const a = k * 2.4, rad = 22 + 66 * Math.sqrt((k + 0.5) / 12)
    ions += pj('l', k, (250 + rad * Math.cos(a)).toFixed(1), (FC + rad * Math.sin(a)).toFixed(1), k % 2 ? 15 : 10, k % 2 ? 'teal' : 'warm') }
  EZ.scene('molarity', {
    html: `<div class="kicker" data-at="in" data-fx="left">Molarity</div><h2 class="h1" data-at="0">Moles per liter of solution</h2>
      <div class="card" style="left:120px;top:290px;width:820px;height:310px" data-at="1">
        <div class="fm"><span class="pri">M</span><span>=</span><div class="fr"><span>moles of <span class="warm">solute</span></span><span>liters of <span class="teal">solution</span></span></div></div>
        <div class="ln" style="top:240px" data-at="2" data-fx="fade">units: <span style="color:var(--text)">mol/L</span>, written “M”</div></div>
      <div class="card" style="left:120px;top:630px;width:820px;height:280px" data-at="6"><h3>Rearrange as needed</h3>
        <div class="b2" style="top:110px" data-at="6@0.45" data-fx="left">moles = <span class="pri">M</span> × L</div>
        <div class="b2" style="top:186px" data-at="6@0.75" data-fx="left">L = moles ÷ <span class="pri">M</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:620px" data-at="3"><h3><span class="pri">2.0 M</span> NaCl</h3>
        <svg style="position:absolute;left:0;top:84px" width="810" height="420">
          <clipPath id="ml-fl"><path d="${FL}Z"/></clipPath>
          <rect class="mlq" x="120" y="420" width="260" height="400" clip-path="url(#ml-fl)" fill="rgba(60,199,188,.18)"/>
          <g class="mions">${ions}</g>
          <path d="${FL}" fill="none" stroke="#c9cee0" stroke-width="5" stroke-linejoin="round"/>
          <line x1="206" x2="294" y1="70" y2="70" stroke="#eef0f7" stroke-width="5"/>
          <g data-at="3@0.6" data-fx="fade">${ball(440, 250, 10, 'warm')}<text x="466" y="261" font-size="32" font-weight="900">Na${sup('', '+')}</text>
            ${ball(440, 310, 15, 'teal')}<text x="466" y="321" font-size="32" font-weight="900">Cl${sup('', '−')}</text></g>
          <g data-at="5" data-fx="fade"><line x1="420" y1="70" x2="304" y2="70" stroke="#3cc7bc" stroke-width="5" marker-end="url(#mk-teal)"/>
            <text x="432" y="62" font-size="34" font-weight="900" class="f-teal">volumetric flask</text>
            <text x="432" y="102" font-size="27" font-weight="800" class="f-muted">measures the total volume</text>
            <text x="432" y="136" font-size="27" font-weight="800" class="f-muted">of solution precisely</text></g>
        </svg>
        <div class="ln" style="top:500px;left:44px;color:var(--text)" data-at="3@0.55" data-fx="fade">2.0 mol in every <span class="teal">1 L of solution</span></div>
        <div class="ln" style="top:552px;left:44px" data-at="4@0.3" data-fx="fade"><span class="bad">✗</span> not every liter of <span class="bad">water added</span></div></div>`,
    update(c) {
      move(c)
      const b = c.b, p = eio(c.seg(b[3].start + 0.2, b[3].start + 2.2)), y = lerp(420, 70, p)
      c.$('.mlq').setAttribute('y', y)
      c.$('.mions').style.opacity = c.seg(b[3].start + 0.5, b[3].start + 1.4)
    },
  })

  // ---------- worked example ----------
  const srow = (i, top, at, label, eq, res) => `<div class="srow" style="top:${top}px" data-at="${at}"><div class="n">${i}</div><div class="lb">${label}</div>
      <div class="eq" data-at="${at}@0.3" data-fx="fade">${eq}</div>${res ? `<div class="res" data-at="${res[1]}" data-fx="pop">${res[0]}</div>` : ''}</div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Make a solution</h2>
      <div class="card prob" data-at="1"><span class="warm">5.85 g</span> NaCl, dissolved to make <span class="teal">250.0 mL</span> of solution. <span class="muted">Molarity?</span></div>
      ${srow(1, 450, '2', 'Find the moles', '5.85 g ÷ 58.44 g/mol =', ['0.100 mol', '2@0.8'])}
      ${srow(2, 590, '3', 'Volume in liters', '250.0 mL =', ['0.2500 L', '3@0.8'])}
      ${srow(3, 730, '4', 'Divide', '<span style="margin-left:248px">÷</span><span style="margin-left:268px">=</span>', ['0.400 M', '4@0.85'])}
      <div class="tok t1">0.100 mol</div><div class="tok t2">0.2500 L</div>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="5" data-fx="pop">Answer: <span class="good">0.400 M NaCl</span></div>`,
    update(c) {
      const b = c.b, fly = (el, a, x0, y0, x1, y1) => { const p = eio(c.seg(a, a + 0.9))
        el.style.transform = `translate(${lerp(x0, x1, p)}px, ${lerp(y0, y1, p)}px)`; el.style.opacity = clamp((c.t - a - 0.4) / 0.25) }
      fly(c.$('.t1'), b[4].start + 0.1, 1480, 470, 640, 760)
      fly(c.$('.t2'), b[4].start + 0.35, 1480, 610, 944, 760)
    },
  })

  // ---------- count the ions ----------
  const IONS = [['NaCl', '2 ions', 0.2, '0.20 M'], ['MgCl<sub>2</sub>', '3 ions', 0.3, '0.30 M'], ['Al(NO<sub>3</sub>)<sub>3</sub>', '4 ions', 0.4, '0.40 M'], ['glucose', '0.20 M, but no ions', 0, '']]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Count the ions!</h2>
      <div class="card" style="left:120px;top:290px;width:820px;height:560px" data-at="1"><h3>Ionic solutes split into ions</h3>
        <svg style="position:absolute;left:0;top:90px" width="820" height="300">
          <text x="410" y="44" text-anchor="middle" font-size="40" font-weight="900" data-at="2" data-fx="fade">0.10 M CaCl${sb('2')}</text>
          <g data-at="2@0.2" data-fx="pop"><g class="cl1">${ball(0, 0, 44, 'teal', sup('Cl', '−'), 30)}</g><g class="cl2">${ball(0, 0, 44, 'teal', sup('Cl', '−'), 30)}</g><g class="ca">${ball(0, 0, 32, 'warm', sup('Ca', '2+'), 24)}</g></g>
          <text x="190" y="270" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="3@0.6" data-fx="fade">1 Ca${sup('', '2+')}</text>
          <text x="580" y="270" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="3@0.75" data-fx="fade">2 Cl${sup('', '−')}</text></svg>
        <div class="cn" style="top:400px" data-at="4@0.1" data-fx="left">[Ca<sup>2+</sup>] = <span class="warm">0.10 M</span></div>
        <div class="cn" style="top:466px" data-at="4@0.55" data-fx="left">[Cl<sup>−</sup>] = <span class="teal">0.20 M</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:560px" data-at="5"><h3>Highest ion concentration?</h3>
        <div class="ln" style="top:104px;left:40px" data-at="7" data-fx="fade">salts at 0.10 M each</div>
        ${IONS.map(([f, k, v, val], i) => `<div class="ir i${i}" style="top:${170 + i * 92}px" data-at="${i < 3 ? `7@${0.08 + i * 0.3}` : '8'}" data-fx="left">
          <div class="f">${f}</div><div class="k">${k}</div>${v ? `<div class="br" data-at="${`7@${0.16 + i * 0.3}`}" data-fx="grow" style="width:${v * 500}px"></div>` : ''}
          <div class="v ${i === 3 ? 'muted' : 'warm'}" style="left:${380 + v * 500 + (v ? 18 : 0)}px">${val}</div></div>`).join('')}</div>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="6" data-fx="pop">Ion concentration = <span class="pri">M</span> × <span class="warm">ions per formula unit</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[3].start + 0.2, b[3].start + 1.4)), j = 3 * Math.sin(c.t * 3)
      c.$('.ca').setAttribute('transform', `translate(${lerp(410, 190, p)} ${170 + j * p})`)
      c.$('.cl1').setAttribute('transform', `translate(${lerp(334, 510, p)} ${lerp(170, 160, p) - j * p})`)
      c.$('.cl2').setAttribute('transform', `translate(${lerp(486, 650, p)} ${lerp(170, 180, p) + j * p})`)
      const w = eo(c.seg(b[7].end - 0.4, b[7].end + 0.1)) * (0.75 + 0.25 * Math.sin(c.t * 5)), el = c.$('.i2')
      el.style.filter = `drop-shadow(0 0 ${18 * w}px rgba(76,199,129,${0.9 * w}))`
    },
  })

  // ---------- dilution ----------
  const BX = [170, 640], BY = 400, BW = 260, BH = 380, BOT = BY + BH
  const dil = Array.from({ length: 8 }, (_, i) => [((i % 4) + 0.5) / 4 + (rnd(i) - 0.5) * 0.08, (Math.floor(i / 4) + 0.5) / 2 + (rnd(i + 20) - 0.5) * 0.1])
  const dots = (cls) => dil.map((_, i) => `<g class="${cls}" data-i="${i}">${ball(0, 0, 13, 'warm')}</g>`).join('')
  EZ.scene('dilution', {
    html: `<div class="kicker" data-at="in" data-fx="left">Dilution</div><h2 class="h1" data-at="0">Add water, same moles</h2>
      <div style="position:absolute;left:170px;top:300px;font-size:36px;font-weight:900" class="warm" data-at="1@0.5" data-fx="fade">moles of solute: <span style="color:var(--text)">unchanged</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">${beaker(BX[0], BY, BW, BH, 80)}${dots('da')}</g>
        <g data-at="1" data-fx="fade">${beaker(BX[1], BY, BW, BH, 80, 'rgba(60,199,188,.16)', 'lb')}${dots('db')}</g>
        <g data-at="1@0.15" data-fx="fade"><line x1="458" y1="600" x2="612" y2="600" stroke="#3cc7bc" stroke-width="7" marker-end="url(#mk-teal)"/>
          <text x="535" y="576" text-anchor="middle" font-size="32" font-weight="900" class="f-teal">+ water</text></g>
        <text x="300" y="836" text-anchor="middle" font-size="34" font-weight="900" data-at="3@0.2" data-fx="fade">50.0 mL · <tspan class="f-warm">2.00 M</tspan></text>
        <text x="770" y="836" text-anchor="middle" font-size="34" font-weight="900" data-at="3@0.75" data-fx="fade">200.0 mL</text>
        <text x="770" y="884" text-anchor="middle" font-size="34" font-weight="900" class="f-good" data-at="5@0.3" data-fx="fade">0.500 M</text>
      </svg>
      <div class="card" style="left:1060px;top:290px;width:740px;height:600px" data-at="2"><h3>The dilution equation</h3>
        <div style="position:absolute;left:0;right:0;top:130px;text-align:center;font-size:84px;font-weight:900">M<sub>1</sub>V<sub>1</sub> = M<sub>2</sub>V<sub>2</sub></div>
        <div style="position:absolute;left:0;right:0;top:310px;text-align:center;font-size:46px;font-weight:900" data-at="4" data-fx="up">(2.00)(50.0) = M<sub>2</sub>(200.0)</div>
        <div style="position:absolute;left:110px;right:110px;top:420px;padding:16px;border-radius:22px;text-align:center;font-size:52px;font-weight:900;background:rgba(76,199,129,.16);border:2px solid var(--good)" data-at="5@0.2" data-fx="pop">M<sub>2</sub> = <span class="good">0.500 M</span></div></div>`,
    update(c) {
      const b = c.b, t = c.t, lv = lerp(80, 320, eio(c.seg(b[1].start + 0.4, b[1].start + 2.2)))
      c.$('.lb').setAttribute('d', liqD(BX[1], BY, BW, BH, lv))
      const place = (cls, x0, L) => all(c, '.' + cls).forEach((g, i) => { const [fx, fy] = dil[i]
        const x = x0 + 26 + fx * (BW - 52) + 3 * Math.sin(t * 2.2 + i * 1.7), y = BOT - 16 - fy * (L - 28) + 3 * Math.cos(t * 1.9 + i)
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`) })
      place('da', BX[0], 80); place('db', BX[1], lv)
    },
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px" data-at="1">How many <span class="teal">moles</span> of KNO<sub>3</sub> are in 75.0 mL<br>of a 0.200 M KNO<sub>3</sub> solution?</h2>
      <div class="chx" style="left:120px;top:350px" data-at="1@0.6" data-fx="pop">V = <span class="teal">75.0 mL</span></div>
      <div class="chx" style="left:440px;top:350px" data-at="1@0.75" data-fx="pop">M = <span class="pri">0.200 M</span></div>
      <div class="chx" style="left:760px;top:350px" data-at="1@0.9" data-fx="pop">moles = <span class="warm">?</span></div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="ans" data-at="3" data-fx="pop"><span class="good">0.0150 mol</span> KNO<sub>3</sub>${CHECK}</div>
      ${srow(1, 620, '4', 'Convert mL to L', '75.0 mL = <span class="teal">0.0750 L</span>')}
      ${srow(2, 760, '5', 'moles = M × L', '0.200 mol/L × 0.0750 L = <span class="good">0.0150 mol</span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      c.$('.ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- recap ----------
  let mUni = beaker(30, 20, 150, 150, 120), mHet = beaker(250, 20, 150, 150, 120)
  for (let q = 0; q < 12; q++) mUni += ball(52 + (q % 4) * 34 + (Math.floor(q / 4) % 2 ? 14 : 0), 80 + Math.floor(q / 4) * 30, 7, 'warm')
  for (let q = 0; q < 9; q++) mHet += ball(270 + (q % 5) * 25 + (q > 4 ? 12 : 0), 156 - (q > 4 ? 20 : 0), 11, 'warm')
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${mUni}${mHet}<text x="105" y="204" text-anchor="middle" font-size="27" font-weight="900" class="f-teal">uniform</text><text x="325" y="204" text-anchor="middle" font-size="27" font-weight="900" class="f-warm">varies</text></svg>`
  const FL2 = flaskD(110, 20, 80, 62, 18)
  let m2 = `<svg width="460" height="210" viewBox="0 0 460 210"><clipPath id="rc-fl"><path d="${FL2}Z"/></clipPath><rect x="40" y="40" width="140" height="180" clip-path="url(#rc-fl)" fill="rgba(60,199,188,.2)"/>`
  for (let k = 0; k < 8; k++) { const a = k * 2.4, rad = 12 + 34 * Math.sqrt((k + 0.5) / 8); m2 += ball(110 + rad * Math.cos(a), bulbC(80, 62, 18) + rad * Math.sin(a), k % 2 ? 9 : 6, k % 2 ? 'teal' : 'warm') }
  m2 += `<path d="${FL2}" fill="none" stroke="#c9cee0" stroke-width="4"/><line x1="86" x2="134" y1="40" y2="40" stroke="#eef0f7" stroke-width="4"/>
    <text x="320" y="96" text-anchor="middle" font-size="44" font-weight="900" class="f-warm">mol</text><line x1="250" x2="390" y1="114" y2="114" stroke="#eef0f7" stroke-width="5"/><text x="320" y="160" text-anchor="middle" font-size="44" font-weight="900" class="f-teal">L</text></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210">${ball(40, 70, 22, 'warm')}${ball(100, 50, 28, 'teal')}${ball(100, 112, 28, 'teal')}
    <text x="76" y="184" text-anchor="middle" font-size="27" font-weight="900" class="f-warm">× ions</text>
    ${beaker(190, 40, 90, 120, 34)}${beaker(340, 40, 90, 120, 100)}<line x1="292" y1="110" x2="326" y2="110" stroke="#3cc7bc" stroke-width="5" marker-end="url(#mk-teal)"/>
    <text x="310" y="200" text-anchor="middle" font-size="27" font-weight="900" class="f-teal">dilute</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Solution = <span class="teal">homogeneous</span><br>(uniform)<br>Heterogeneous mixture:<br><span class="warm">varies by location</span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p><span class="pri">M</span> = <span class="warm">mol solute</span><br>÷ <span class="teal">L solution</span></p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Ion concentration =<br><span class="warm">M × ions per formula unit</span><br>Dilution: <span class="pri">M<sub>1</sub>V<sub>1</sub> = M<sub>2</sub>V<sub>2</sub></span></p></div>`,
  })
})()
