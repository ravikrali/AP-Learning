// Pictures for chem-3.11 "Spectroscopy & the EM Spectrum". One EZ.scene per scene id in script.mjs.
// Everything shown comes from the lesson (app/src/content/chem/u3.ts, the em-spectrum diagram, and
// book.ts for the level spacing and fingerprint ideas). Waves, energy levels and spectra are
// schematic: no wavelengths, frequencies or energies are drawn to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .sx-hk{top:300px;width:540px;height:470px}
    .sx-tag{position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:36px;font-weight:900}
    .sx-note{position:absolute;left:1180px;width:620px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .sx-note i{position:absolute;left:22px;top:26px;width:46px;height:46px;border-radius:50%}
    .sx-note b{display:block;font-size:31px;font-weight:900;line-height:1.15;white-space:nowrap} .sx-note span{display:block;font-size:26px;font-weight:700;color:var(--muted);white-space:nowrap}
    .sx-lad{position:absolute;left:1180px;top:672px;width:620px;height:228px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .sx-lad svg{position:absolute;left:26px;top:22px} .sx-lad div{position:absolute;left:230px;top:44px;white-space:nowrap}
    .sx-lad b{display:block;font-size:36px;font-weight:900;line-height:1.15} .sx-lad span{display:block;margin-top:8px;font-size:27px;font-weight:700;color:var(--muted);line-height:1.3}
    .sx-ft{position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:34px;font-weight:800;white-space:nowrap}
    .sx-lab{position:absolute;left:120px;font-size:34px;font-weight:900;white-space:nowrap}
    .sx-row{position:absolute;left:120px;width:1680px;height:126px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .sx-row .tx{position:absolute;left:40px;top:26px;display:flex;align-items:center;gap:22px;font-size:50px;font-weight:900;white-space:nowrap}
    .sx-row .lt{display:inline-flex;align-items:center;justify-content:center;width:74px;height:74px;border-radius:20px;font-size:48px;color:#10131c}
    .sx-row .sub{position:absolute;right:40px;top:40px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .sx-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .sx-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .sx-tile .f{margin-top:96px;font-size:54px;font-weight:900;line-height:1} .sx-tile .ch{margin-top:22px;font-size:34px;font-weight:800;color:var(--muted)}
    .sx-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .sx-rc{top:320px;width:540px;height:560px;text-align:center} .sx-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .sx-rc svg{display:block;margin:14px auto 0} .sx-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const UV = '#b18cf0', BLUE = '#6aa7ff'
  const RAINBOW = ['#f0707a', '#f3a764', '#f2c443', '#4cc781', '#6aa7ff', '#b18cf0']
  const rainbowDef = (id) => `<defs><linearGradient id="${id}" x1="0" x2="1">${RAINBOW.map((c, i) => `<stop offset="${i / 5}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`
  // a wave from x0 to x1 whose wavelength changes smoothly from l0 to l1 (schematic)
  const wave = (x0, x1, y, amp, l0, l1 = l0) => {
    let d = '', ph = 0
    for (let x = x0; x <= x1; x += 3) { ph += (2 * Math.PI * 3) / lerp(l0, l1, (x - x0) / (x1 - x0)); d += `${x === x0 ? 'M' : 'L'}${x} ${(y + amp * Math.sin(ph)).toFixed(1)}` }
    return d
  }
  // water molecule centred on (0, 0), scale s
  const h2o = (s = 1) => `<line x1="0" y1="0" x2="${-56 * s}" y2="${44 * s}" stroke="#eef0f7" stroke-width="${10 * s}"/><line x1="0" y1="0" x2="${56 * s}" y2="${44 * s}" stroke="#eef0f7" stroke-width="${10 * s}"/>
    ${ball(-56 * s, 44 * s, 28 * s, 'gray', 'H')}${ball(56 * s, 44 * s, 28 * s, 'gray', 'H')}${ball(0, 0, 46 * s, 'teal', 'O')}`
  // a three-atom molecule whose bonds stretch and bend (atoms not named); p = class prefix
  const tri = (p, s = 1) => `<line class="${p}l1" x1="0" y1="0" stroke="#eef0f7" stroke-width="${10 * s}"/><line class="${p}l2" x1="0" y1="0" stroke="#eef0f7" stroke-width="${10 * s}"/>
    <g class="${p}a">${ball(0, 0, 30 * s, 'gray')}</g><g class="${p}b">${ball(0, 0, 30 * s, 'gray')}</g>${ball(0, 0, 40 * s, 'warm')}`
  const setTri = (c, p, L, th) => {
    const x = L * Math.cos(th), y = L * Math.sin(th)
    c.$(`.${p}a`).setAttribute('transform', `translate(${-x} ${y})`); c.$(`.${p}b`).setAttribute('transform', `translate(${x} ${y})`)
    c.$(`.${p}l1`).setAttribute('x2', -x); c.$(`.${p}l1`).setAttribute('y2', y); c.$(`.${p}l2`).setAttribute('x2', x); c.$(`.${p}l2`).setAttribute('y2', y)
  }
  const spin = (c, sel, t0, speed = 150) => c.$(sel).setAttribute('transform', `rotate(${(speed * Math.max(0, c.t - t0)).toFixed(1)})`)
  const arcs = (cx, cy, r, col, mk) => { const a = (d) => [cx + r * Math.cos((d * Math.PI) / 180), cy + r * Math.sin((d * Math.PI) / 180)]
    const [p, q, u, v] = [a(205), a(335), a(25), a(155)]
    return `<path d="M${p[0]} ${p[1]} A${r} ${r} 0 0 1 ${q[0]} ${q[1]}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-${mk})"/>
      <path d="M${u[0]} ${u[1]} A${r} ${r} 0 0 1 ${v[0]} ${v[1]}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-${mk})"/>` }
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const note = (i, at, color, a, b) => `<div class="sx-note" style="top:${300 + i * 124}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`
  const levels = (ys, w, col) => ys.map((y) => `<line x1="0" x2="${w}" y1="${y}" y2="${y}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`).join('')

  // ---------- intro artwork: a faint wave below the chips, getting shorter to the right (above y = 950) ----------
  const IW = wave(80, 1840, 880, 34, 260, 34)
  EZ.intro = {
    chips: [['1@0.4', 'Spin'], ['1@0.55', 'Vibrate'], ['1@0.8', 'Electrons jump']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">${rainbowDef('sx-irb')}<path class="iw" d="${IW}" fill="none" stroke="url(#sx-irb)" stroke-width="7" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></svg>`,
    update(c) { c.$('.iw').setAttribute('stroke-dashoffset', 1 - eio(c.seg(c.sc.start + 0.3, c.sc.start + 3.6))) },
  }

  // ---------- hook: three kinds of light, three effects ----------
  const hookCard = (left, title, cls, at, pic, tag) => `<div class="card sx-hk" style="left:${left}px" data-at="${at}"><h3 class="${cls}">${title}</h3>
      <svg style="position:absolute;left:0;top:90px" width="540" height="300">${pic}</svg>
      <div class="sx-tag ${cls}" data-at="${at}@0.55" data-fx="pop">${tag}</div></div>`
  const hk1 = `<path d="${wave(30, 200, 150, 24, 110)}" fill="none" stroke="#8d8df0" stroke-width="6"/><g transform="translate(350 150)">${arcs(0, 0, 110, '#8d8df0', 'pri')}<g class="hr">${h2o(1)}</g></g>`
  const hk2 = `<path d="${wave(30, 190, 150, 22, 52)}" fill="none" stroke="#f3a764" stroke-width="6"/><g transform="translate(360 150)">${tri('hv')}</g>`
  const hk3 = `<g transform="translate(90 150)"><circle r="40" fill="url(#g-gold)"/>${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<line x1="${54 * Math.cos(a)}" y1="${54 * Math.sin(a)}" x2="${72 * Math.cos(a)}" y2="${72 * Math.sin(a)}" stroke="#f2c443" stroke-width="7" stroke-linecap="round"/>` }).join('')}</g>
    <path d="${wave(170, 270, 150, 16, 30)}" fill="none" stroke="#f2c443" stroke-width="5"/>
    <g transform="translate(300 40)">${levels([30, 230], 190, '#c9cee0')}</g><circle class="he" cx="395" cy="270" r="17" fill="#3cc7bc"/>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Everyday light</div><h2 class="h1" data-at="0">Same molecules, different light</h2>
      ${hookCard(120, 'Microwave oven', 'pri', '1', hk1, 'molecules spin')}
      ${hookCard(690, 'Infrared lamp', 'warm', '2', hk2, 'molecules vibrate')}
      ${hookCard(1260, 'Sunlight', 'gold', '3', hk3, 'electrons excited')}
      <div class="banner" style="top:810px" data-at="4" data-fx="pop">Different light ${ARR} different effects</div>`,
    update(c) {
      const b = c.b
      spin(c, '.hr', b[1].start + 0.4)
      const k = c.seg(b[2].start + 0.4, b[2].start + 0.8)
      setTri(c, 'hv', 92 + k * 16 * Math.sin((c.t - b[2].start) * 9), 0)
      c.$('.he').setAttribute('cy', lerp(270, 70, eio(c.seg(b[3].start + 0.9, b[3].start + 1.5))))
    },
  })

  // ---------- the electromagnetic spectrum ----------
  const REG = [['Radio', '#7d859c'], ['Microwave', '#8d8df0'], ['Infrared', '#f3a764'], ['Visible', 'url(#sx-rb)'], ['UV', UV], ['X-ray', '#9aa4b5']]
  const RX = (i) => 120 + i * 282
  EZ.scene('spectrum', {
    html: `<div class="kicker" data-at="in" data-fx="left">The EM spectrum</div><h2 class="h1" data-at="0">One spectrum, many regions</h2>
      <svg class="full" viewBox="0 0 1920 1080">${rainbowDef('sx-rb')}
        ${REG.map(([n, col], i) => `<g data-at="1@${0.08 + i * 0.13}" data-fx="pop"><rect x="${RX(i)}" y="310" width="270" height="100" rx="18" style="fill:${col}"/>
          <text x="${RX(i) + 135}" y="374" text-anchor="middle" font-size="38" font-weight="900" class="f-dark">${n}</text></g>`).join('')}
        ${[1, 2, 3, 4].map((i) => `<g data-at="4@${0.12 + (i - 1) * 0.2}" data-fx="pop"><circle cx="${RX(i) + 135}" cy="466" r="32" fill="#5b5bd6"/><text x="${RX(i) + 135}" y="479" text-anchor="middle" font-size="36" font-weight="900">${i}</text></g>
          ${i < 4 ? `<text x="${RX(i) + 276}" y="482" text-anchor="middle" font-size="50" font-weight="900" class="f-warm" data-at="4@${0.2 + (i - 1) * 0.2}" data-fx="fade">&lt;</text>` : ''}`).join('')}
        <path d="${wave(120, 1800, 572, 44, 300, 26)}" fill="none" stroke="#c9cee0" stroke-width="5" data-at="0+0.2" data-fx="draw" data-dur="1.6"/>
        <g data-at="2@0.1" data-fx="fade"><line x1="140" y1="666" x2="1776" y2="666" stroke="#3cc7bc" stroke-width="7" marker-end="url(#mk-teal)"/>
          <text x="960" y="722" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">higher frequency · shorter wavelength</text></g>
        <g data-at="3" data-fx="grow"><polygon points="120,812 1300,784 1300,840" fill="#f3a764" opacity=".85"/></g>
        <text x="1330" y="826" font-size="38" font-weight="900" class="f-warm" data-at="3@0.4" data-fx="fade">more energy per photon</text>
      </svg>
      <div class="banner" style="top:886px" data-at="5" data-fx="pop">More energetic light ${ARR} a <span class="warm">bigger change</span> in a molecule</div>`,
  })

  // ---------- microwave: rotation ----------
  EZ.scene('rotation', {
    html: `<div class="kicker" data-at="in" data-fx="left">Microwave</div><h2 class="h1" data-at="0">Microwaves make molecules spin</h2>
      <div class="card" style="left:120px;top:300px;width:1000px;height:600px" data-at="in+0.2" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="180" y="520" font-size="36" font-weight="900" class="f-pri" data-at="0@0.3" data-fx="fade">microwave</text>
        <path d="${wave(180, 560, 600, 42, 170)}" fill="none" stroke="#8d8df0" stroke-width="7" data-at="0@0.3" data-fx="draw"/>
        <g data-at="2" data-fx="fade">${arcs(840, 600, 150, '#8d8df0', 'pri')}</g>
        <g transform="translate(840 600)"><g class="rw">${h2o(1.45)}</g></g>
        <text x="840" y="840" text-anchor="middle" font-size="34" font-weight="800" class="f-muted" data-at="3@0.3" data-fx="fade">water molecule</text>
      </svg>
      ${note(0, '1', '#8d8df0', 'Microwave', '→ rotational energy levels')}
      ${note(1, '2', '#8d8df0', 'Molecules spin', 'that is rotation')}
      ${note(2, '3', '#3cc7bc', 'Microwave oven', 'water molecules spin')}
      <div class="sx-lad" data-at="4" data-fx="right"><svg width="180" height="184">${levels(Array.from({ length: 9 }, (_, k) => 20 + k * 18), 170, '#8d8df0')}</svg>
        <div><b class="pri">Very close together</b><span>a low-energy photon<br>is enough</span></div></div>`,
    update(c) { spin(c, '.rw', c.b[2].start + 0.2, 120) },
  })

  // ---------- infrared: vibration ----------
  EZ.scene('vibration', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Infrared</div><h2 class="h1" data-at="0">Infrared makes bonds vibrate</h2>
      <div class="card" style="left:120px;top:300px;width:1000px;height:600px" data-at="in+0.2" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="180" y="520" font-size="36" font-weight="900" class="f-warm" data-at="0@0.3" data-fx="fade">infrared (IR)</text>
        <path d="${wave(180, 540, 600, 36, 84)}" fill="none" stroke="#f3a764" stroke-width="7" data-at="0@0.3" data-fx="draw"/>
        <g transform="translate(840 590)">${tri('vv', 1.4)}</g>
        <text x="840" y="840" text-anchor="middle" font-size="40" font-weight="900" class="f-warm" data-at="2" data-out="2@0.5" data-fx="fade">stretch</text>
        <text x="840" y="840" text-anchor="middle" font-size="40" font-weight="900" class="f-warm" data-at="2@0.55" data-fx="fade">bend</text>
      </svg>
      ${note(0, '1', '#f3a764', 'Infrared (IR)', '→ vibrational energy levels')}
      ${note(1, '2', '#f3a764', 'Bonds stretch', 'longer, shorter, longer')}
      ${note(2, '2@0.55', '#f3a764', 'Bonds bend', 'the angle opens and closes')}
      <div class="sx-lad" data-at="3" data-fx="right"><svg width="180" height="184">${levels([20, 72, 124, 176], 170, '#f3a764')}</svg>
        <div><b class="warm">Farther apart</b><span>than rotational levels:<br>needs an IR photon</span></div></div>`,
    update(c) {
      const b = c.b, t = c.t, bendAt = b[2].start + 0.55 * (b[2].end - b[2].start)
      const st = c.seg(b[2].start, b[2].start + 0.4) * (1 - c.seg(bendAt - 0.2, bendAt + 0.2))
      const bd = c.seg(bendAt, bendAt + 0.4) * (1 - 0.6 * c.seg(b[3].end - 1.2, b[3].end))
      setTri(c, 'vv', 120 + 22 * st * Math.sin((t - b[2].start) * 8), 0.32 * bd * Math.sin((t - bendAt) * 6))
    },
  })

  // ---------- UV-vis: electronic transitions ----------
  EZ.scene('electronic', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">UV-vis</div><h2 class="h1" data-at="0">UV and visible light move electrons</h2>
      <div class="card" style="left:120px;top:300px;width:820px;height:600px" data-at="1"><h3 class="teal">Electronic transition</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade"><g transform="translate(330 0)">${levels([450, 790], 420, '#c9cee0')}</g>
          <text x="330" y="434" font-size="30" font-weight="800" class="f-muted">higher energy level</text><text x="330" y="842" font-size="30" font-weight="800" class="f-muted">lower energy level</text></g>
        <path d="${wave(160, 470, 690, 20, 30)}" fill="none" stroke="${'#b18cf0'}" stroke-width="6" data-at="2" data-fx="draw" data-dur="0.8"/>
        <line x1="620" y1="770" x2="620" y2="478" stroke="#3cc7bc" stroke-width="6" stroke-dasharray="14 10" marker-end="url(#mk-teal)" data-at="2@0.45" data-fx="fade"/>
        <g data-at="3" data-fx="fade"><line x1="820" y1="462" x2="820" y2="778" stroke="#f2c443" stroke-width="7" marker-start="url(#mk-gold)" marker-end="url(#mk-gold)"/>
          <text x="800" y="630" text-anchor="end" font-size="34" font-weight="900" class="f-gold">big gap</text></g>
        <circle class="el" cx="690" cy="790" r="18" fill="#3cc7bc" data-at="1@0.5" data-fx="fade"/>
      </svg>
      <div class="card" style="left:990px;top:300px;width:810px;height:290px" data-at="4"><h3 style="color:${BLUE}">Color</h3>
        <svg style="position:absolute;left:0;top:76px" width="810" height="214">
          ${RAINBOW.map((col, i) => `<line x1="40" x2="300" y1="${52 + i * 10}" y2="${52 + i * 10}" stroke="${col}" stroke-width="6"/>`).join('')}
          <path d="M330 20 V140 Q330 160 350 160 H450 Q470 160 470 140 V20" fill="none" stroke="#c9cee0" stroke-width="5"/><rect x="336" y="56" width="128" height="98" rx="10" fill="${BLUE}" opacity=".55"/>
          ${[4, 5].map((i) => `<line x1="500" x2="760" y1="${52 + i * 10}" y2="${52 + i * 10}" stroke="${RAINBOW[i]}" stroke-width="6"/>`).join('')}
          <text x="40" y="200" font-size="28" font-weight="800" class="f-muted" data-at="5@0.3" data-fx="fade">absorbs some visible light</text>
          <text x="770" y="200" text-anchor="end" font-size="32" font-weight="900" style="fill:${BLUE}" data-at="5@0.15" data-fx="fade">looks blue</text>
        </svg></div>
      <div class="card" style="left:990px;top:620px;width:810px;height:280px" data-at="6"><h3 class="bad">UV can break bonds</h3>
        <svg style="position:absolute;left:0;top:76px" width="810" height="204">
          <path d="${wave(40, 290, 90, 18, 30)}" fill="none" stroke="${UV}" stroke-width="6" data-at="6@0.15" data-fx="draw" data-dur="0.7"/>
          <line class="bb" x1="440" x2="540" y1="90" y2="90" stroke="#eef0f7" stroke-width="9"/>
          <g class="ba">${ball(0, 0, 34, 'pur')}</g><g class="bc">${ball(0, 0, 34, 'teal')}</g>
          <text x="770" y="186" text-anchor="end" font-size="32" font-weight="900" class="f-bad" data-at="6@0.75" data-fx="fade">can damage skin</text>
        </svg></div>`,
    update(c) {
      const b = c.b
      c.$('.el').setAttribute('cy', lerp(790, 450, eio(c.seg(b[2].start + 0.45 * (b[2].end - b[2].start), b[2].start + 0.75 * (b[2].end - b[2].start)))))
      const s = eio(c.seg(b[6].start + 0.45 * (b[6].end - b[6].start), b[6].start + 0.6 * (b[6].end - b[6].start)))
      c.$('.ba').setAttribute('transform', `translate(${lerp(440, 390, s)} 90)`); c.$('.bc').setAttribute('transform', `translate(${lerp(540, 640, s)} 90)`)
      c.$('.bb').style.opacity = 1 - s
    },
  })

  // ---------- the energy ladder ----------
  const COLS = [[420, 'Rotational', 'microwave', '#8d8df0', 'f-pri', Array.from({ length: 9 }, (_, k) => 860 - k * 18)],
    [960, 'Vibrational', 'infrared', '#f3a764', 'f-warm', Array.from({ length: 6 }, (_, k) => 860 - k * 76)],
    [1500, 'Electronic', 'UV / visible', '#3cc7bc', 'f-teal', [860, 450]]]
  EZ.scene('ladder', {
    html: `<div class="kicker" data-at="in" data-fx="left">Putting it together</div><h2 class="h1" data-at="0">One energy ladder</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        ${COLS.map(([cx, n, light, col, cls, ys], i) => `<g data-at="${i + 1}" data-fx="fade">
          <rect x="${cx - 170}" y="${ys[1]}" width="340" height="${ys[0] - ys[1]}" fill="${col}" fill-opacity=".28" data-at="4@${0.15 + i * 0.25}" data-fx="fade"/>
          <g transform="translate(${cx - 170} 0)">${levels(ys, 340, col)}</g>
          <text x="${cx}" y="926" text-anchor="middle" font-size="40" font-weight="900">${n}</text>
          <text x="${cx}" y="970" text-anchor="middle" font-size="32" font-weight="800" class="${cls}">${light}</text></g>
          <circle class="dt${i}" cx="${cx}" cy="${ys[0]}" r="15" fill="#fff" data-at="4@${0.1 + i * 0.25}" data-fx="fade"/>`).join('')}
        <g data-at="5" data-fx="fade"><text x="420" y="618" text-anchor="middle" font-size="36" font-weight="900" class="f-pri">small gap</text>
          <text x="420" y="660" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">low-energy light</text></g>
        <g data-at="5@0.5" data-fx="fade"><text x="1500" y="640" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">big gap</text>
          <text x="1500" y="682" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">high-energy light</text></g>
      </svg>
      <div class="banner" style="top:290px" data-at="6" data-fx="pop">Change: <span class="pri">rotation</span> &lt; <span class="warm">vibration</span> &lt; <span class="teal">electronic</span></div>`,
    update(c) {
      const b = c.b, d = b[4].end - b[4].start
      COLS.forEach(([, , , , , ys], i) => {
        const p = eio(c.seg(b[4].start + (0.15 + i * 0.25) * d, b[4].start + (0.15 + i * 0.25) * d + 0.6))
        c.$('.dt' + i).setAttribute('cy', lerp(ys[0], ys[1], p))
      })
    },
  })

  // ---------- spectra as fingerprints ----------
  const dips = (x0, x1, base, list) => { let d = ''
    for (let x = x0; x <= x1; x += 4) { const u = (x - x0) / (x1 - x0); let y = base
      for (const [m, w, h] of list) y += h * Math.exp(-((u - m) ** 2) / (2 * w * w))
      d += `${x === x0 ? 'M' : 'L'}${x} ${y.toFixed(1)}` }
    return d }
  const strip = (y, at, lines, label) => `<text x="120" y="${y + 40}" font-size="34" font-weight="900" data-at="${at}" data-fx="fade">${label}</text>
    <g data-at="${at}" data-fx="fade"><rect x="420" y="${y}" width="1380" height="56" rx="12" fill="url(#sx-frb)"/>${lines.map((u) => `<rect x="${420 + u * 1380 - 6}" y="${y}" width="12" height="56" fill="#10131c"/>`).join('')}</g>`
  EZ.scene('fingerprint', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Spectroscopy</div><h2 class="h1" data-at="0">Every substance has its own spectrum</h2>
      <svg class="full" viewBox="0 0 1920 1080">${rainbowDef('sx-frb')}
        ${strip(296, '1@0.3', [0.12, 0.31, 0.55, 0.62, 0.83], 'Substance 1')}
        ${strip(372, '1@0.55', [0.2, 0.27, 0.47, 0.71, 0.9], 'Substance 2')}
      </svg>
      <div class="card" style="left:120px;top:460px;width:810px;height:410px" data-at="2"><h3 class="warm">Infrared spectrum</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="230">
          <path d="${dips(50, 760, 40, [[0.14, 0.02, 120], [0.3, 0.035, 80], [0.52, 0.015, 150], [0.7, 0.03, 100], [0.86, 0.02, 60]])}" fill="none" stroke="#f3a764" stroke-width="6" data-at="2@0.2" data-fx="draw" data-dur="1.4"/>
          <text x="760" y="226" text-anchor="end" font-size="26" font-weight="800" class="f-muted">wavelength →</text></svg>
        <div class="sx-ft warm" data-at="2@0.55" data-fx="fade">which bonds are present</div></div>
      <div class="card" style="left:990px;top:460px;width:810px;height:410px" data-at="3"><h3 class="teal">UV-visible spectrum</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="230">${rainbowDef('sx-urb')}
          <rect x="50" y="196" width="710" height="18" rx="9" fill="url(#sx-urb)" opacity=".8"/>
          <path d="${dips(50, 760, 180, [[0.42, 0.12, -150]])}" fill="none" stroke="#3cc7bc" stroke-width="6" data-at="3@0.2" data-fx="draw" data-dur="1.2"/></svg>
        <div class="sx-ft teal" data-at="3@0.55" data-fx="fade">electronic transitions · color</div></div>
      <div class="banner" style="top:896px" data-at="4" data-fx="pop">A spectrum is a <span class="teal">fingerprint</span>: no reaction needed</div>`,
  })

  // ---------- the trick ----------
  const icoSpin = `<svg width="150" height="100" viewBox="-75 -50 150 100" style="position:absolute;right:40px;top:12px">${arcs(0, 0, 44, '#8d8df0', 'pri')}<g class="ks">${h2o(0.55)}</g></svg>`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Memory trick</div>
      <h2 class="h1" data-at="1">“<span class="pri">M</span>y <span class="warm">I</span>nsides <span class="warm">V</span>ibrate, <span class="teal">E</span>lectrons <span class="teal">U</span>ltra-jump”</h2>
      <div class="sx-row" style="top:330px" data-at="2"><div class="tx"><span class="lt" style="background:var(--primary)">M</span>Microwave ${ARR} <span class="pri">rotation</span></div><div class="sub" style="right:210px">food rotating in the microwave</div>${icoSpin}</div>
      <div class="sx-row" style="top:480px" data-at="3"><div class="tx"><span class="lt" style="background:var(--warm)">I</span>Infrared ${ARR} <span class="lt" style="background:var(--warm)">V</span><span class="warm">Vibration</span></div></div>
      <div class="sx-row" style="top:630px" data-at="4"><div class="tx"><span class="lt" style="background:var(--accent)">U</span>UV / visible ${ARR} <span class="lt" style="background:var(--accent)">E</span><span class="teal">Electrons</span></div></div>
      <div class="banner" style="top:810px" data-at="5" data-fx="pop">Energy: <span class="pri">microwave</span> &lt; <span class="warm">IR</span> &lt; visible &lt; <span class="teal">UV</span></div>`,
    update(c) { spin(c, '.ks', c.b[2].start + 0.3, 110) },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'Microwave', 'rotation', '5@0.2'], ['B', 'Infrared', 'vibration', '4@0.1'], ['C', 'Ultraviolet', 'electronic', '5@0.55'], ['D', 'Radio', '', '']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which radiation causes transitions between<br><span class="warm">vibrational</span> energy levels?</h2>
      ${OPTS.map(([l, f, ch, at], i) => `<div class="sx-tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.12}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? CHECK : ''}<div class="f">${f}</div>${ch ? `<div class="ch" data-at="${at}" data-fx="fade">${ch}</div>` : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:760px" data-at="4" data-fx="pop"><span class="warm">Infrared</span> ${ARR} bonds stretch and bend</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><g transform="translate(110 100)">${arcs(0, 0, 70, '#8d8df0', 'pri')}${h2o(0.7)}</g>
    <g transform="translate(340 100)"><line x1="-80" y1="0" x2="80" y2="0" stroke="#eef0f7" stroke-width="7"/>${ball(-80, 0, 22, 'gray')}${ball(80, 0, 22, 'gray')}${ball(0, 0, 30, 'warm')}
      <line x1="-112" y1="50" x2="-62" y2="50" stroke="#f3a764" stroke-width="5" marker-start="url(#mk-warm)" marker-end="url(#mk-warm)"/><line x1="62" y1="50" x2="112" y2="50" stroke="#f3a764" stroke-width="5" marker-start="url(#mk-warm)" marker-end="url(#mk-warm)"/></g></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="${wave(30, 150, 110, 14, 26)}" fill="none" stroke="${UV}" stroke-width="5"/>
    <g transform="translate(180 0)">${levels([30, 180], 220, '#c9cee0')}</g><line x1="350" y1="168" x2="350" y2="50" stroke="#3cc7bc" stroke-width="6" stroke-dasharray="12 9" marker-end="url(#mk-teal)"/><circle cx="290" cy="30" r="16" fill="#3cc7bc"/></svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210">${rainbowDef('sx-crb')}${[['#8d8df0', 'MW'], ['#f3a764', 'IR'], ['url(#sx-crb)', 'Vis'], [UV, 'UV']].map(([col, n], i) => `<rect x="${8 + i * 116}" y="${130 - i * 34}" width="88" height="${50 + i * 34}" rx="12" style="fill:${col}"/>
    <text x="${52 + i * 116}" y="206" text-anchor="middle" font-size="28" font-weight="900" class="f-muted">${n}</text>`).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card sx-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Microwave ${ARR} <span class="pri">rotation</span><br>Infrared ${ARR} <span class="warm">vibration</span></p></div>
      <div class="card sx-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>UV / visible ${ARR}<br><span class="teal">electronic transitions</span></p></div>
      <div class="card sx-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Energy order:<br><span class="pri">microwave</span> &lt; <span class="warm">IR</span><br>&lt; visible &lt; <span class="teal">UV</span></p></div>`,
  })
})()
