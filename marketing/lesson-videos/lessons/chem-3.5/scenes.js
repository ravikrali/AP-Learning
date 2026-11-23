// Pictures for chem-3.5 "Kinetic Molecular Theory". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u3.ts; the gas-law explanations and the
// curve's peak are from book.ts). Particles, speeds and curves are schematic: the right order, not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-note{position:absolute;left:1060px;width:740px;height:96px;padding:0 30px 0 88px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);display:flex;align-items:center;font-size:36px;font-weight:900;white-space:nowrap}
    .x-note i{position:absolute;left:26px;top:24px;width:44px;height:44px;border-radius:50%}
    .x-big{position:absolute;padding:24px 30px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-big b{display:block;font-size:36px;font-weight:900;line-height:1.15;white-space:nowrap} .x-big span{display:block;margin-top:8px;font-size:29px;font-weight:700;line-height:1.25;color:var(--muted);white-space:nowrap}
    .x-sub{position:absolute;left:40px;top:96px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-res{position:absolute;left:0;right:0;text-align:center;font-size:33px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;font-size:34px;font-weight:900;white-space:nowrap}
    .x-bar{position:absolute;height:34px;border-radius:17px}
    .x-row{position:absolute;left:0;width:1680px;height:64px}
    .x-row .f{position:absolute;left:56px;top:6px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-row .m{position:absolute;left:250px;top:14px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-row .s{position:absolute;left:540px;top:15px;height:34px;border-radius:17px;background:linear-gradient(90deg,#1b7f77,#3cc7bc)}
    .x-row .e{position:absolute;left:1250px;top:15px;width:300px;height:34px;border-radius:17px;background:linear-gradient(90deg,#4a4ab8,#8d8df0)}
    .x-row .w{position:absolute;top:10px;font-size:32px;font-weight:900;white-space:nowrap}
    .x-hd{position:absolute;top:50px;font-size:30px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
    .x-fm{position:absolute;left:0;right:0;text-align:center;font-weight:900;white-space:nowrap}
    .opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 84px 0 106px;font-size:29px;font-weight:800;line-height:1.2}
    .opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .pillbox{position:absolute;top:850px;height:110px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;white-space:nowrap}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:31px;font-weight:800;line-height:1.4;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const rnd = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }
  const tri = (p, L) => { const m = ((p % (2 * L)) + 2 * L) % (2 * L); return m < L ? m : 2 * L - m }
  const sb = (s) => `<tspan dy=".3em" font-size=".62em">${s}</tspan>` // SVG subscript (only at the end of a text)

  // a gas particle that bounces inside the box bx,by,bw,bh (sp scales its speed)
  const pj = (i, x, y, r, g, box, sp = 1) =>
    `<g class="pj" data-i="${i}" data-x="${x}" data-y="${y}" data-r="${r}" data-s="${sp}" data-b="${box.join(',')}" transform="translate(${x} ${y})">${ball(0, 0, r, g)}</g>`
  const move = (c) => {
    const t = c.t
    for (const g of all(c, '.pj')) {
      const d = g.dataset, i = +d.i, x = +d.x, y = +d.y, r = +d.r, s = +d.s
      const [bx, by, bw, bh] = d.b.split(',').map(Number)
      const X = bx + r + tri(x - bx - r + (90 + ((i * 47) % 80)) * s * t * (i % 3 ? 1 : -1), bw - 2 * r)
      const Y = by + r + tri(y - by - r + (70 + ((i * 29) % 90)) * s * t * (i % 2 ? 1 : -1), bh - 2 * r)
      g.setAttribute('transform', `translate(${X.toFixed(1)} ${Y.toFixed(1)})`)
    }
  }

  // Maxwell–Boltzmann shape (a = the most probable speed; the area under every curve is the same)
  const mbf = (v, a) => (4 / Math.sqrt(Math.PI)) * (v * v / (a * a * a)) * Math.exp(-(v * v) / (a * a))
  const PK = mbf(1, 1)
  const mbPath = (a, X0, Y0, W, H, vmax = 3.6, close = false) => {
    let d = ''
    for (let k = 0; k <= 90; k++) { const v = (k / 90) * vmax; d += `${k ? 'L' : 'M'}${(X0 + (v / vmax) * W).toFixed(1)} ${(Y0 - (mbf(v, a) / PK) * H).toFixed(1)}` }
    return close ? d + `L${X0 + W} ${Y0}L${X0} ${Y0}Z` : d
  }

  // ---------- intro artwork: faint speed curves at the left and right edges (above y = 950) ----------
  const introCurves = (x) => `<path d="${mbPath(1, x, 900, 270, 170)}" fill="none" stroke="#8d8df0" stroke-width="7" stroke-linecap="round" data-at="in+0.3" data-fx="draw" data-dur="2"/>
    <path d="${mbPath(1.5, x, 900, 270, 170)}" fill="none" stroke="#f3a764" stroke-width="7" stroke-linecap="round" data-at="in+1" data-fx="draw" data-dur="2"/>
    <line x1="${x}" y1="900" x2="${x + 280}" y2="900" stroke="#c9cee0" stroke-width="5" stroke-linecap="round"/>
    <line x1="${x}" y1="900" x2="${x}" y2="690" stroke="#c9cee0" stroke-width="5" stroke-linecap="round"/>`
  EZ.intro = {
    chips: [['1@0.3', 'Pressure'], ['1@0.5', 'Temperature & KE'], ['1@0.78', 'Maxwell–Boltzmann']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">${introCurves(40)}${introCurves(1600)}</svg>`,
  }

  // ---------- hook: about 500 m/s, billions of hits a second ----------
  let hb = '<rect x="40" y="20" width="740" height="360" rx="24" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="5"/>'
  for (let q = 0; q < 9; q++) hb += pj(q, 80 + ((q * 151) % 640), 50 + ((q * 83) % 300), 17, q % 3 ? 'pur' : 'teal', [40, 20, 740, 360], 1.6)
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Look closer</div><h2 class="h1" data-at="0">The air around you</h2>
      <div class="card" style="left:120px;top:290px;width:820px;height:520px" data-at="0@0.2"><h3 class="pri">Air molecules</h3>
        <svg style="position:absolute;left:0;top:100px" width="820" height="400">${hb}</svg></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:520px" data-at="0@0.5"><h3>How fast?</h3>
        <div class="x-lab" style="left:44px;top:120px">air molecule</div>
        <div class="x-bar" style="left:44px;top:180px;width:600px;background:linear-gradient(90deg,#4a4ab8,#8d8df0)" data-at="0@0.6" data-fx="grow"></div>
        <div class="x-lab pri" style="left:44px;top:226px" data-at="0@0.8" data-fx="fade">about 500 m/s</div>
        <div class="x-lab" style="left:44px;top:310px" data-at="1">passenger jet</div>
        <div class="x-bar" style="left:44px;top:370px;width:400px;background:linear-gradient(90deg,#646c82,#aab1c4)" data-at="1@0.2" data-fx="grow"></div>
        <div class="x-lab muted" style="left:44px;top:416px" data-at="1@0.5" data-fx="fade">slower</div></div>
      <div class="banner" style="top:850px" data-at="2" data-out="3" data-fx="pop">Each one hits something <span class="warm">billions of times</span> every second</div>
      <div class="banner" style="top:850px" data-at="3" data-fx="pop"><span class="pri">KMT</span>: chaos ${ARR} <span class="teal">simple predictions</span></div>`,
    update: move,
  })

  // ---------- motion: constant random motion, wall collisions make pressure ----------
  let mb = ''
  for (let q = 0; q < 12; q++) mb += pj(q, 70 + ((q * 157) % 700), 50 + ((q * 97) % 420), 20, q % 4 ? 'pur' : 'teal', [30, 20, 820, 500])
  const pushes = [[30, 140, -1, 0], [30, 380, -1, 0], [850, 170, 1, 0], [850, 400, 1, 0], [240, 20, 0, -1], [600, 20, 0, -1], [300, 520, 0, 1], [640, 520, 0, 1]]
    .map(([x, y, dx, dy]) => `<line x1="${x + dx * 8}" y1="${y + dy * 8}" x2="${x + dx * 40}" y2="${y + dy * 40}" stroke="#f3a764" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-warm)"/>`).join('')
  EZ.scene('motion', {
    html: `<div class="kicker" data-at="in" data-fx="left">Core idea</div><h2 class="h1" data-at="0">Particles in constant motion</h2>
      <div class="card" style="left:120px;top:290px;width:880px;height:600px" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:30px;overflow:visible" width="880" height="560">
          <rect x="30" y="20" width="820" height="500" rx="20" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="5"/>
          ${mb}
          <rect class="wall" x="30" y="20" width="820" height="500" rx="20" fill="none" stroke="#f3a764" stroke-width="7" opacity="0"/>
          <g data-at="3@0.3" data-fx="fade">${pushes}</g></svg></div>
      <div class="x-note" style="top:290px" data-at="1" data-fx="right"><i style="background:var(--primary)"></i>constant, <span class="pri">&nbsp;random&nbsp;</span> motion</div>
      <div class="x-note" style="top:410px" data-at="2" data-fx="right"><i style="background:var(--accent)"></i>collide with each other&nbsp;<span class="teal">&amp; walls</span></div>
      <div class="x-note" style="top:530px" data-at="3" data-fx="right"><i style="background:var(--warm)"></i>wall collisions&nbsp;→&nbsp;<span class="warm">pressure</span></div>
      <div class="x-big" style="left:1060px;top:660px;width:740px" data-at="4" data-fx="up"><b>Pressure = force from countless</b><b class="warm">collisions with the walls</b>
        <span data-at="5" data-fx="fade">more frequent or harder collisions</span><span style="color:var(--good);font-weight:900" data-at="5@0.5" data-fx="fade">→ higher pressure</span></div>`,
    update(c) {
      move(c)
      const w = c.p('3@0.2', 0.5) * (0.55 + 0.45 * Math.sin(c.t * 4))
      c.$('.wall').setAttribute('opacity', w.toFixed(2))
    },
  })

  // ---------- gas laws at the particle level ----------
  const box = (seed, n, x0, w, len, g) => {
    let s = `<rect x="${x0}" y="10" width="${w}" height="230" rx="16" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="5"/>`
    for (let k = 0; k < n; k++) {
      const x = x0 + 30 + rnd(seed + k) * (w - 60), y = 40 + rnd(seed + k + 50) * 170, a = rnd(seed + k + 99) * 6.283
      s += `<line x1="${x}" y1="${y}" x2="${(x + Math.cos(a) * len).toFixed(1)}" y2="${(y + Math.sin(a) * len).toFixed(1)}" stroke="#a3abbd" stroke-width="4" marker-end="url(#mk-muted)"/>${ball(x, y, 15, g)}`
    }
    return s
  }
  const lawCard = (left, at, title, sub, pic, r1, r1at, r2at) => `<div class="card" style="left:${left}px;top:290px;width:540px;height:520px" data-at="${at}"><h3>${title}</h3><div class="x-sub">${sub}</div>
      <svg style="position:absolute;left:0;top:150px" width="540" height="250">${pic}</svg>
      <div class="x-res" style="top:410px" data-at="${r1at}" data-fx="fade">${r1}</div>
      <div class="x-res good" style="top:458px" data-at="${r2at}" data-fx="pop">pressure ↑</div></div>`
  EZ.scene('laws', {
    html: `<div class="kicker" data-at="in" data-fx="left">The gas laws</div><h2 class="h1" data-at="0">Explained with particles</h2>
      ${lawCard(120, '1', 'Temperature <span class="warm">↑</span>', 'at constant volume', box(3, 6, 70, 400, 70, 'warm'), 'faster: <span class="warm">more often + more force</span>', '2', '2@0.75')}
      ${lawCard(690, '3', 'Volume <span class="teal">↓</span>', 'at constant temperature', box(20, 6, 170, 200, 36, 'pur'), 'more often, <span class="teal">same speed</span>', '4', '4@0.4')}
      ${lawCard(1260, '5', 'Moles <span class="pri">↑</span>', 'at constant V and T', box(40, 12, 70, 400, 36, 'pur'), '<span class="pri">more collisions</span> per second', '5@0.6', '5@0.85')}
      <div class="banner" style="top:850px;font-size:42px" data-at="6" data-fx="pop">T changes: <span class="warm">frequency + force</span> &nbsp;·&nbsp; V or n changes: <span class="teal">frequency only</span></div>`,
  })

  // ---------- energy: T ∝ average KE, KE = ½mv² ----------
  EZ.scene('energy', {
    html: `<div class="kicker" data-at="in" data-fx="left">Core idea</div><h2 class="h1" data-at="0">What temperature measures</h2>
      <div class="card" style="left:120px;top:290px;width:780px;height:600px" data-at="1"><h3>Temperature</h3>
        <div class="x-fm" style="top:140px;font-size:54px">Kelvin T <span class="pri">∝</span> <span class="warm">average KE</span></div>
        <div class="x-fm" style="top:260px;font-size:110px" data-at="2" data-fx="pop">KE = ½<span class="warm">m</span><span class="teal">v</span><sup>2</sup></div>
        <div class="x-fm teal" style="top:470px;font-size:40px" data-at="3@0.3" data-fx="fade">same T ${ARR} same average KE</div></div>
      <div class="card" style="left:960px;top:290px;width:840px;height:600px" data-at="3"><h3>Same T, same average KE</h3>
        <svg style="position:absolute;left:0;top:110px" width="840" height="470">
          <line x1="60" y1="150" x2="780" y2="150" stroke="#363c54" stroke-width="4" stroke-dasharray="12 12"/>
          <line x1="60" y1="350" x2="780" y2="350" stroke="#363c54" stroke-width="4" stroke-dasharray="12 12"/>
          <g class="hv">${ball(0, 0, 44, 'warm')}</g><g class="lt">${ball(0, 0, 22, 'teal')}</g>
          <text x="60" y="70" font-size="34" font-weight="900" class="f-warm" data-at="4@0.5" data-fx="fade">heavier: big m, small v</text>
          <text x="60" y="290" font-size="34" font-weight="900" class="f-teal" data-at="5" data-fx="fade">lighter: small m, big v</text>
          <text x="60" y="440" font-size="32" font-weight="800" class="f-muted" data-at="5@0.5" data-fx="fade">lighter particles must move faster</text></svg></div>`,
    update(c) {
      const on = c.p('3@0.2', 0.5), t = Math.max(0, c.t - c.at('3'))
      c.$('.hv').setAttribute('transform', `translate(${(104 + tri(110 * t, 632)).toFixed(1)} 150)`)
      c.$('.lt').setAttribute('transform', `translate(${(82 + tri(300 * t, 676)).toFixed(1)} 350)`)
      c.$('.hv').style.opacity = on; c.$('.lt').style.opacity = on
    },
  })

  // ---------- the Maxwell–Boltzmann distribution ----------
  const X0 = 220, Y0 = 820, W = 1000, H = 380, HOT = 1.45
  const px = (v) => X0 + (v / 3.6) * W, py = (v, a) => Y0 - (mbf(v, a) / PK) * H
  EZ.scene('mb', {
    html: `<div class="kicker" data-at="in" data-fx="left">Speed distribution</div><h2 class="h1" data-at="0">The Maxwell–Boltzmann curve</h2>
      <div class="card" style="left:120px;top:290px;width:1180px;height:620px" data-at="1"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">
          <path class="fl1" d="${mbPath(1, X0, Y0, W, H, 3.6, true)}" fill="#8d8df0" opacity="0"/>
          <path class="fl2" d="" fill="#f3a764" opacity="0"/>
          <line x1="${X0}" y1="${Y0}" x2="${X0 + W + 20}" y2="${Y0}" stroke="#c9cee0" stroke-width="5" stroke-linecap="round"/>
          <line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H - 50}" stroke="#c9cee0" stroke-width="5" stroke-linecap="round"/>
          <text x="${X0 + W / 2}" y="${Y0 + 52}" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">molecular speed →</text>
          <text x="0" y="0" text-anchor="middle" font-size="30" font-weight="800" class="f-muted" transform="translate(${X0 - 30} ${Y0 - H / 2}) rotate(-90)">fraction of molecules →</text></g>
        <path class="cv1" d="${mbPath(1, X0, Y0, W, H)}" fill="none" stroke="#8d8df0" stroke-width="8" stroke-linecap="round" data-at="1@0.4" data-fx="draw" data-dur="1.6"/>
        <text x="${px(0.62)}" y="${py(1, 1) + 20}" text-anchor="end" font-size="34" font-weight="900" class="f-pri" data-at="1@0.9" data-fx="fade">lower T</text>
        <g data-at="2" data-fx="fade"><line x1="${px(1)}" y1="${py(1, 1) + 10}" x2="${px(1)}" y2="${Y0}" stroke="#eef0f7" stroke-width="3" stroke-dasharray="10 10"/>
          <text x="${px(1) + 16}" y="${py(1, 1) - 18}" font-size="32" font-weight="900">peak = most probable speed</text></g>
        <path class="cv2" d="" fill="none" stroke="#f3a764" stroke-width="8" stroke-linecap="round"/>
        <text x="${px(2.25) + 20}" y="${py(2.25, HOT) - 18}" font-size="34" font-weight="900" class="f-warm" data-at="4@0.35" data-fx="fade">higher T</text>
        <g data-at="5@0.3" data-fx="fade"><text x="${X0 + W}" y="${Y0 - 300}" text-anchor="end" font-size="32" font-weight="900" class="f-good">same area</text><text x="${X0 + W}" y="${Y0 - 258}" text-anchor="end" font-size="30" font-weight="800" class="f-muted">= same number of particles</text></g>
        <g data-at="6" data-fx="fade"><line x1="${px(1) - 30}" y1="${py(1, 1) + 30}" x2="${px(HOT) - 12}" y2="${py(HOT, HOT) - 18}" stroke="#f3a764" stroke-width="6" marker-end="url(#mk-warm)"/></g>
      </svg>
      <div class="x-big" style="left:1340px;top:290px;width:460px" data-at="4" data-fx="right"><b class="warm">Higher T</b><span>shifts right<br>flatter and wider<br>more particles at high speeds</span></div>
      <div class="x-big" style="left:1340px;top:540px;width:460px" data-at="7" data-fx="right"><b class="teal">Lighter gas, same T</b><span>speed curve also<br>shifts right and flattens</span></div>
      <div class="x-big" style="left:1340px;top:740px;width:460px" data-at="8" data-fx="right"><b class="pri">Energy distribution</b><span>depends only on T</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[3].start + 0.2, b[3].start + 2.6)), a = lerp(1, HOT, p)
      const cv2 = c.$('.cv2')
      cv2.setAttribute('d', mbPath(a, X0, Y0, W, H)); cv2.style.opacity = c.seg(b[3].start, b[3].start + 0.3)
      c.$('.fl2').setAttribute('d', mbPath(a, X0, Y0, W, H, 3.6, true))
      const f = 0.22 * c.p('5', 0.8)
      c.$('.fl1').setAttribute('opacity', f.toFixed(3)); c.$('.fl2').setAttribute('opacity', f.toFixed(3))
    },
  })

  // ---------- trick: light = fast, heavy = slow ----------
  const GAS = [['H' + '<sub>2</sub>', '2 g/mol', 2], ['He', '4 g/mol', 4], ['N<sub>2</sub>', '28 g/mol', 28], ['O<sub>2</sub>', '32 g/mol', 32], ['CO<sub>2</sub>', '44 g/mol', 44], ['Cl<sub>2</sub>', '70.9 g/mol', 70.9]]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Light = fast, heavy = slow</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:620px" data-at="1">
        <div class="x-hd muted" style="left:56px">gas</div><div class="x-hd muted" style="left:250px">molar mass</div>
        <div class="x-hd teal" style="left:540px">average speed</div>
        <div class="x-hd pri" style="left:1250px" data-at="3" data-fx="fade">average KE</div>
        ${GAS.map(([f, m, M], i) => { const at = i < 5 ? `2@${(0.05 + i * 0.17).toFixed(2)}` : '5@0.2', w = Math.round(520 * Math.sqrt(2 / M))
          return `<div class="x-row r${i}" style="top:${112 + i * 72}px" data-at="${at}" data-fx="left"><div class="f ${i === 5 ? 'bad' : ''}">${f}</div><div class="m">${m}</div>
            <div class="s" style="width:${w}px"></div>${i === 0 ? `<div class="w teal" style="left:${540 + w + 20}px">fastest</div>` : ''}${i === 5 ? `<div class="w bad" style="left:${540 + w + 20}px">slowest</div>` : ''}
            <div class="e" data-at="${i < 5 ? `3@${(0.1 + i * 0.1).toFixed(2)}` : '5@0.4'}" data-fx="grow"></div></div>` }).join('')}
        <div class="x-fm" style="top:${112 + 6 * 72 + 10}px;font-size:36px;left:1100px;right:40px;text-align:center" data-at="3@0.7" data-fx="fade"><span class="pri">equal</span> (same T)</div></div>
      <div class="x-big" style="left:1150px;top:146px;width:650px;padding:14px 26px;border-color:var(--warm)" data-at="4" data-fx="pop"><b class="warm" style="font-size:34px">AP® loves testing that difference!</b></div>`,
    update(c) {
      const w = eo(c.seg(c.b[5].start + 2.5, c.b[5].start + 3)) * (0.75 + 0.25 * Math.sin(c.t * 4))
      c.$('.r5').style.filter = `drop-shadow(0 0 ${16 * w}px rgba(240,112,122,${0.8 * w}))`
    },
  })

  // ---------- try it ----------
  const OPTS = ['They have the same average kinetic energy, but He atoms move faster on average', 'Ar atoms have higher average kinetic energy', 'They have the same average speed', 'He atoms have higher average kinetic energy']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1@0.62">Which statement is <span class="teal">true</span>?</h2>
      <div style="position:absolute;left:120px;top:272px;font-size:36px;font-weight:800;color:var(--muted)" data-at="1">Samples of <b style="color:var(--text)">He</b> and <b style="color:var(--text)">Ar</b> are both at <b style="color:var(--text)">300 K</b>.</div>
      ${OPTS.map((o, i) => `<div class="opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 0 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px;font-size:46px" data-at="8" data-fx="pop">Same T ${ARR} <span class="pri">same average KE</span></div>
      <div class="pillbox" style="left:120px;width:1680px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="9" data-fx="pop">KE = ½mv<sup>2</sup>:&nbsp;<span class="teal">lighter He</span>&nbsp;${ARR}&nbsp;<span class="warm">higher average speed</span></div>`,
    update(c) {
      const b = c.b, t0 = b[6].start + 0.3, t1 = b[7].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[7].start + 0.3, b[7].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 0) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="60" y="20" width="36" height="140" rx="18" fill="none" stroke="#c9cee0" stroke-width="5"/>
    <rect x="70" y="70" width="16" height="100" rx="8" fill="#f3a764"/>${ball(78, 170, 26, 'warm')}
    <text x="190" y="128" text-anchor="middle" font-size="64" font-weight="900" class="f-pri">∝</text>${ball(300, 110, 30, 'pur')}<line x1="340" y1="110" x2="420" y2="110" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/></svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${ball(90, 60, 40, 'warm')}<line x1="140" y1="60" x2="200" y2="60" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/>
    ${ball(90, 160, 20, 'teal')}<line x1="120" y1="160" x2="360" y2="160" stroke="#3cc7bc" stroke-width="6" marker-end="url(#mk-teal)"/>
    <text x="320" y="70" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">heavy · slow</text><text x="240" y="130" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">light · fast</text></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><line x1="40" y1="190" x2="440" y2="190" stroke="#c9cee0" stroke-width="4"/><line x1="40" y1="190" x2="40" y2="20" stroke="#c9cee0" stroke-width="4"/>
    <path d="${mbPath(1, 40, 190, 390, 150)}" fill="none" stroke="#8d8df0" stroke-width="6"/><path d="${mbPath(HOT, 40, 190, 390, 150)}" fill="none" stroke="#f3a764" stroke-width="6"/>
    <line x1="170" y1="44" x2="232" y2="92" stroke="#f3a764" stroke-width="5" marker-end="url(#mk-warm)"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Kelvin T <span class="pri">∝</span> <span class="warm">average KE</span><br>KE = ½mv<sup>2</sup></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Same T: <span class="pri">same average KE</span><br>Lighter particles<br>are <span class="teal">faster</span></p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Hotter (or lighter):<br>M–B curve <span class="warm">shifts right</span><br>and flattens<br><span class="good">The area stays the same</span></p></div>`,
  })
})()
