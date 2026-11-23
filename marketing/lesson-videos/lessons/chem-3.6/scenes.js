// Pictures for chem-3.6 "Real Gases vs. Ideal Gases". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u3.ts, plus book.ts for the "opposite
// directions" and CH4 / CCl4 lines). Particles are schematic: counts, sizes and speeds are not to scale,
// and the bars compare directions only (no values).
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-ln{position:absolute;left:40px;font-size:34px;font-weight:800;white-space:nowrap}
    .x-sm{position:absolute;font-size:30px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-big{position:absolute;left:0;right:0;text-align:center;font-size:84px;font-weight:900;letter-spacing:-1px}
    .x-chip{position:absolute;left:990px;width:810px;height:76px;padding:0 28px;border-radius:22px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:34px;font-weight:800;line-height:72px;white-space:nowrap}
    .x-tag{position:absolute;left:44px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-bar{position:absolute;left:330px;height:30px;border-radius:15px}
    .x-bl{position:absolute;left:40px;font-size:30px;font-weight:800;white-space:nowrap}
    .x-row{position:absolute;left:40px;right:40px}
    .x-row>b{display:block;font-size:40px;font-weight:900;line-height:1.15;white-space:nowrap} .x-row>span{display:block;margin-top:4px;font-size:30px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .x-tile .f{margin-top:54px;font-size:92px;font-weight:900;line-height:1} .x-tile .ch{margin-top:16px;font-size:34px;font-weight:800;color:var(--muted)}
    .x-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .x-step{position:absolute;top:330px;height:110px;padding:0 40px 0 26px;border-radius:28px;display:flex;align-items:center;gap:20px;font-size:48px;font-weight:900;border:3px solid}
    .x-step small{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;font-size:38px;color:#10131c}
    .x-ans{left:120px;width:1680px;height:190px;padding:24px 48px;font-size:34px;font-weight:700;line-height:1.42}
    .x-ans .lab{display:block;font-size:24px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:6px} .x-ans b{font-weight:900}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:33px;font-weight:800;line-height:1.36;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const rnd = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }
  const tri = (p, L) => { const m = ((p % (2 * L)) + 2 * L) % (2 * L); return m < L ? m : 2 * L - m }
  // where bouncing particle i sits inside box [x, y, w, h] (radius r) after "travel time" tau
  const bounce = (i, box, r, tau) => { const [x, y, w, h] = box
    const vx = (90 + rnd(i * 3.7 + 1) * 110) * (i % 2 ? 1 : -1), vy = (70 + rnd(i * 5.3 + 2) * 110) * (i % 3 ? 1 : -1)
    return [x + r + tri(rnd(i * 7.1 + 3) * 1000 + vx * tau, Math.max(1, w - 2 * r)), y + r + tri(rnd(i * 9.7 + 4) * 1000 + vy * tau, Math.max(1, h - 2 * r))] }
  // travel time when the speed eases from `fast` to `slow` over d seconds starting at tc
  const tau = (t, t0, tc, fast, slow, d = 1.2) => { const s = t - tc, I = s < 0 ? 0 : s < d ? (s * s) / (2 * d) : s - d / 2
    return fast * (t - t0) - (fast - slow) * I }
  const at = (g, x, y) => g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  const sb = (s) => `<tspan dy=".3em" font-size=".62em">${s}</tspan>` // SVG subscript (only at the end of a text)
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const parts = (cls, n, r, g) => Array.from({ length: n }, (_, i) => `<g class="${cls}" transform="translate(0 0)">${ball(0, 0, r, g)}</g>`).join('')

  // ---------- intro artwork: two faint gas boxes on the left and right edges, below the title ----------
  EZ.intro = {
    chips: [['1@0.32', 'Two assumptions'], ['1@0.58', 'When they break'], ['1@0.85', 'Most ideal gases']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      <rect x="50" y="660" width="250" height="270" rx="20" fill="none" stroke="#c9cee0" stroke-width="5"/>
      <rect x="1620" y="660" width="250" height="270" rx="20" fill="none" stroke="#c9cee0" stroke-width="5"/>
      ${parts('ia', 5, 16, 'pur')}${parts('ib', 5, 16, 'teal')}</svg>`,
    update(c) {
      const tt = (c.t - c.sc.start) * 0.6
      all(c, '.ia').forEach((g, i) => { const [x, y] = bounce(i, [54, 664, 242, 262], 16, tt); at(g, x, y) })
      all(c, '.ib').forEach((g, i) => { const [x, y] = bounce(i + 7, [1624, 664, 242, 262], 16, tt); at(g, x, y) })
    },
  }

  // ---------- hook: PV = nRT and its two assumptions ----------
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">The ideal gas law</div><h2 class="h1" data-at="0">Two big assumptions</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:560px" data-at="0@0.2">
        <div class="x-big" style="top:26px"><span class="pri">PV</span> = <span class="teal">nRT</span></div>
        <div class="x-sm" style="left:0;right:0;bottom:22px;text-align:center" data-at="0@0.6" data-fx="fade">the ideal picture</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.4" data-fx="fade">
        <rect class="hbox" x="200" y="440" width="650" height="350" rx="16" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="5"/>
        ${parts('hp', 12, 8, 'warm')}</g>
        <g class="hsq" style="opacity:0"><line x1="380" x2="380" y1="0" y2="0" stroke="#f3a764" stroke-width="8" marker-end="url(#mk-warm)"/><line x1="670" x2="670" y1="0" y2="0" stroke="#f3a764" stroke-width="8" marker-end="url(#mk-warm)"/></g></svg>
      <div class="card" style="left:990px;top:300px;width:810px;height:140px" data-at="1"><div class="x-row" style="top:22px"><b><span class="pri">1</span> · No volume</b><span>gas particles take up no space</span></div></div>
      <div class="card" style="left:990px;top:460px;width:810px;height:140px" data-at="2"><div class="x-row" style="top:22px"><b><span class="teal">2</span> · No attractions</b><span>particles don’t attract each other</span></div></div>
      <div class="x-sm" style="left:990px;top:628px;color:var(--text);font-weight:800;font-size:34px" data-at="3" data-fx="fade"><span class="good">A great approximation…</span> until you:</div>
      <div class="x-chip" style="top:690px" data-at="4" data-fx="right"><span class="warm">squeeze</span> it really hard</div>
      <div class="x-chip" style="top:784px" data-at="5" data-fx="right"><span class="teal">cool</span> it until it’s nearly a liquid</div>
      <div class="banner" style="top:890px;padding:16px 40px" data-at="6" data-fx="pop">Then <span class="warm">real gases</span> stop following the law</div>`,
    update(c) {
      const b = c.b, t = c.t, p = eio(c.seg(b[4].start + 0.2, b[4].start + 1.4)), top = lerp(440, 600, p)
      c.$('.hbox').setAttribute('y', top); c.$('.hbox').setAttribute('height', 790 - top)
      c.$('.hsq').style.opacity = c.seg(b[4].start, b[4].start + 0.3) * (1 - c.seg(b[4].start + 1.6, b[4].start + 2))
      c.$('.hsq').setAttribute('transform', `translate(0 ${top})`)
      for (const l of all(c, '.hsq line')) { l.setAttribute('y1', -80); l.setAttribute('y2', -18) }
      const tt = tau(t, c.sc.start, b[5].start + 0.3, 1.5, 0.35)
      all(c, '.hp').forEach((g, i) => { const [x, y] = bounce(i, [204, top + 4, 642, 782 - top], 8, tt); at(g, x, y) })
    },
  })

  // ---------- assumption 1: particle volume ----------
  const CX = [160, 760], CB = 920 // cylinder walls and floor
  EZ.scene('volume', {
    html: `<div class="kicker" data-at="in" data-fx="left">Assumption 1</div><h2 class="h1" data-at="0">“Particles have no volume”</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><path d="M${CX[0]} 300 V${CB} H${CX[1]} V300" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/></g>
        <g data-at="6@0.2" data-fx="fade"><line x1="${CX[0]}" x2="890" y1="800" y2="800" stroke="#a3abbd" stroke-width="4" stroke-dasharray="14 12"/>
          <line x1="${CX[1]}" x2="890" y1="740" y2="740" stroke="#3cc7bc" stroke-width="4"/></g>
        ${parts('vp', 10, 30, 'pur')}
        <g class="pist" data-at="0@0.3" data-fx="fade"><g class="pg"><rect x="${CX[0] + 4}" y="0" width="${CX[1] - CX[0] - 8}" height="30" rx="6" fill="#646c82" stroke="#c9cee0" stroke-width="3"/>
          <line x1="460" x2="460" y1="-46" y2="0" stroke="#c9cee0" stroke-width="12"/><rect x="390" y="-62" width="140" height="18" rx="9" fill="#c9cee0"/>
          <g class="vsq"><line x1="270" x2="270" y1="-70" y2="-12" stroke="#f3a764" stroke-width="8" marker-end="url(#mk-warm)"/><line x1="650" x2="650" y1="-70" y2="-12" stroke="#f3a764" stroke-width="8" marker-end="url(#mk-warm)"/></g></g></g>
        <g data-at="6@0.3" data-fx="fade"><text x="905" y="752" font-size="34" font-weight="900" class="f-teal">actual volume</text>
          <text x="905" y="812" font-size="34" font-weight="900" class="f-muted">PV = nRT prediction</text></g>
      </svg>
      <div class="card" style="left:900px;top:300px;width:900px;height:180px" data-at="1"><div class="x-row" style="top:24px"><b>Low pressure</b></div>
        <div class="x-sm" style="left:40px;top:84px" data-at="1@0.4" data-fx="fade">particles spread out through the container</div>
        <div class="x-sm" style="left:40px;top:124px;color:var(--text)" data-at="2" data-fx="fade">own volume: <span class="good">negligible</span></div></div>
      <div class="card" style="left:900px;top:500px;width:900px;height:200px" data-at="3"><div class="x-row" style="top:24px"><b class="warm">Very high pressure</b></div>
        <div class="x-sm" style="left:40px;top:84px" data-at="4" data-fx="fade">particles crammed together</div>
        <div class="x-sm" style="left:40px;top:128px;color:var(--text)" data-at="5" data-fx="fade">own volume: <span class="warm">a real fraction of the container</span></div></div>
      <div style="position:absolute;left:905px;top:850px;font-size:52px;font-weight:900;white-space:nowrap" data-at="6@0.5" data-fx="pop">actual <span class="teal">V</span> <span class="warm">&gt;</span> ideal <span class="muted">V</span></div>`,
    update(c) {
      const b = c.b, t = c.t, p = eio(c.seg(b[3].start + 0.2, b[3].start + 2.2)), py = lerp(380, 710, p)
      c.$('.pg').setAttribute('transform', `translate(0 ${py})`)
      c.$('.vsq').style.opacity = c.seg(b[3].start, b[3].start + 0.3) * (1 - c.seg(b[3].start + 2.4, b[3].start + 2.8))
      const q = eio(c.seg(b[4].start, b[4].start + 1.2)), tt = (t - c.sc.start) * (1 - 0.6 * p)
      all(c, '.vp').forEach((g, i) => {
        const [bx, by] = bounce(i, [CX[0] + 2, py + 32, CX[1] - CX[0] - 4, CB - py - 34], 30, tt)
        const kx = 220 + (i % 5) * 120 + 3 * Math.sin(t * 6 + i * 1.7), ky = (i < 5 ? 785 : 875) + 3 * Math.cos(t * 5 + i * 2.3)
        at(g, lerp(bx, kx, q), lerp(by, ky, q))
      })
    },
  })

  // ---------- assumption 2: attractions ----------
  const AB = [176, 420, 738, 444] // gas box inside the left card
  const NB = [[1150, 470], [1120, 580], [1210, 530]] // neighbours near the wall
  EZ.scene('attract', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Assumption 2</div><h2 class="h1" data-at="0">“Particles don’t attract each other”</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:610px" data-at="0@0.3">
        <div class="x-tag warm" style="top:30px" data-at="1" data-out="2" data-fx="fade">High temperature: fast</div>
        <div class="x-tag teal" style="top:30px" data-at="2" data-fx="fade">Low temperature: slow</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><rect x="${AB[0]}" y="${AB[1]}" width="${AB[2]}" height="${AB[3]}" rx="16" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="5"/></g>
        <g class="alines">${Array.from({ length: 36 }, () => '<line stroke="#3cc7bc" stroke-width="4" stroke-dasharray="8 8"/>').join('')}</g>
        ${Array.from({ length: 9 }, () => `<g class="ap"><g class="hot">${ball(0, 0, 26, 'warm')}</g><g class="cold">${ball(0, 0, 26, 'teal')}</g></g>`).join('')}
      </svg>
      <div class="card" style="left:990px;top:290px;width:810px;height:610px" data-at="4"><h3>At the wall</h3>
        <div class="x-sm" style="left:40px;top:330px;color:var(--text);font-weight:800;font-size:33px" data-at="5" data-fx="fade">hits the walls <span class="teal">less hard</span>, and <span class="teal">less often</span></div>
        <div class="x-bl" style="top:408px" data-at="6" data-fx="fade">PV = nRT</div><div class="x-bar" style="top:412px;width:420px;background:#7d859c" data-at="6@0.1" data-fx="grow"></div>
        <div class="x-bl teal" style="top:462px" data-at="6@0.3" data-fx="fade">actual P</div><div class="x-bar" style="top:466px;width:250px;background:linear-gradient(90deg,#1b7f77,#3cc7bc)" data-at="6@0.4" data-fx="grow"></div>
        <div class="x-sm" style="left:40px;top:536px;font-size:29px" data-at="7" data-fx="fade">CO<sub>2</sub> near condensation: <span class="teal">P lower than predicted</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="4" data-fx="fade">
        <line x1="1740" x2="1740" y1="400" y2="610" stroke="#c9cee0" stroke-width="8" stroke-linecap="round"/>
        ${[0, 1, 2, 3, 4, 5].map((k) => `<line x1="1744" x2="1766" y1="${410 + k * 36}" y2="${396 + k * 36}" stroke="#7d859c" stroke-width="4"/>`).join('')}
        <g class="wlines">${NB.map(() => '<line stroke="#3cc7bc" stroke-width="4" stroke-dasharray="8 8"/>').join('')}</g>
        ${NB.map(() => `<g class="nb">${ball(0, 0, 26, 'teal')}</g>`).join('')}
        <g class="wp">${ball(0, 0, 26, 'teal')}</g>
        <g class="pull"><line x1="0" x2="0" y1="0" y2="0" stroke="#eef0f7" stroke-width="7" marker-end="url(#mk-text)"/></g>
        <g class="hit"><circle r="30" fill="none" stroke="#f2c443" stroke-width="5"/></g>
        <text class="pt f-teal" x="1250" y="400" font-size="28" font-weight="900">pulled back by neighbors</text></g></svg>`,
    update(c) {
      const b = c.b, t = c.t, cold = c.seg(b[2].start, b[2].start + 1.2)
      const tt = tau(t, c.sc.start, b[2].start, 2.0, 0.45)
      const P = all(c, '.ap').map((g, i) => { const [x, y] = bounce(i + 3, [AB[0] + 4, AB[1] + 4, AB[2] - 8, AB[3] - 8], 26, tt); at(g, x, y)
        g.querySelector('.hot').style.opacity = 1 - cold; g.querySelector('.cold').style.opacity = cold; return [x, y] })
      const show = c.seg(b[3].start, b[3].start + 0.6), L = all(c, '.alines line')
      let k = 0
      for (let i = 0; i < 9; i++) for (let j = i + 1; j < 9; j++) {
        const l = L[k++], d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1])
        l.setAttribute('x1', P[i][0].toFixed(1)); l.setAttribute('y1', P[i][1].toFixed(1)); l.setAttribute('x2', P[j][0].toFixed(1)); l.setAttribute('y2', P[j][1].toFixed(1))
        l.style.opacity = show * clamp(1 - d / 190) }
      // the particle heading for the wall: slows as its neighbours pull it back, then taps the wall
      const s = eo(c.seg(b[4].start + 0.3, b[4].start + 2.6)), x = lerp(1330, 1712, s)
      at(c.$('.wp'), x, 505)
      all(c, '.nb').forEach((g, i) => at(g, NB[i][0] + 2 * Math.sin(t * 1.3 + i * 2), NB[i][1] + 2 * Math.cos(t * 1.1 + i)))
      all(c, '.wlines line').forEach((l, i) => { l.setAttribute('x1', NB[i][0]); l.setAttribute('y1', NB[i][1]); l.setAttribute('x2', x.toFixed(1)); l.setAttribute('y2', 505) })
      const pl = c.$('.pull line'); pl.setAttribute('x1', x - 16); pl.setAttribute('x2', x - 96); pl.setAttribute('y1', 462); pl.setAttribute('y2', 462)
      c.$('.pull').style.opacity = c.seg(b[4].start + 0.8, b[4].start + 1.2)
      c.$('.pt').style.opacity = c.seg(b[4].start + 1, b[4].start + 1.4)
      const h = c.seg(b[4].start + 2.5, b[4].start + 3.3)
      c.$('.hit').setAttribute('transform', `translate(1740 505) scale(${0.6 + 0.8 * h})`)
      c.$('.hit').style.opacity = h > 0 && h < 1 ? 1 - h : 0
    },
  })

  // ---------- two deviations, opposite directions ----------
  EZ.scene('opposite', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two deviations</div><h2 class="h1" data-at="0">Opposite directions</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><line x1="160" x2="1040" y1="620" y2="620" stroke="#a3abbd" stroke-width="5" stroke-dasharray="16 12"/>
          <text x="1040" y="600" text-anchor="end" font-size="32" font-weight="900" class="f-muted">PV = nRT prediction</text></g>
        <g data-at="1" data-fx="fade"><line class="up" x1="330" x2="330" y1="612" y2="612" stroke="#f3a764" stroke-width="12" marker-end="url(#mk-warm)"/>
          <text x="380" y="440" font-size="40" font-weight="900" class="f-warm">particle volume</text><text x="380" y="488" font-size="31" font-weight="800" class="f-muted">real value larger</text></g>
        <g data-at="2" data-fx="fade"><line class="dn" x1="660" x2="660" y1="628" y2="628" stroke="#3cc7bc" stroke-width="12" marker-end="url(#mk-teal)"/>
          <text x="710" y="780" font-size="40" font-weight="900" class="f-teal">attractions</text><text x="710" y="828" font-size="31" font-weight="800" class="f-muted">real pressure smaller</text></g>
      </svg>
      <div class="card" style="left:1120px;top:300px;width:680px;height:580px" data-at="3"><h3>Which one wins?</h3>
        <div class="x-row" style="top:130px" data-at="4" data-fx="right"><b class="warm">Very high pressure</b><span>particle volume tends to win</span></div>
        <div class="x-row" style="top:290px" data-at="4@0.5" data-fx="right"><b class="teal">Low temperature</b><span>attractions tend to win</span></div>
        <div class="x-sm" style="left:40px;top:470px" data-at="3@0.5" data-fx="fade">it depends on the conditions</div></div>`,
    update(c) {
      const b = c.b
      c.$('.up').setAttribute('y2', lerp(612, 400, eo(c.seg(b[1].start + 0.1, b[1].start + 0.9))))
      c.$('.dn').setAttribute('y2', lerp(628, 840, eo(c.seg(b[2].start + 0.1, b[2].start + 0.9))))
    },
  })

  // ---------- memory trick: hot and lonely ----------
  const water = `${ball(0, 0, 40, 'red', 'O', 30)}${ball(-44, 32, 22, 'gray', 'H', 22)}${ball(44, 32, 22, 'gray', 'H', 22)}`
  const ammonia = `${ball(-52, 22, 22, 'gray', 'H', 22)}${ball(52, 22, 22, 'gray', 'H', 22)}${ball(0, 56, 22, 'gray', 'H', 22)}${ball(0, 0, 40, 'pur', 'N', 30)}`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Memory trick</div><h2 class="h1" data-at="0">Most ideal when <span class="warm">“hot and lonely”</span></h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:480px;border-color:rgba(76,199,129,.6)" data-at="0@0.5"><h3 class="good">Most ideal</h3>
        <div class="x-row" style="top:106px" data-at="1" data-fx="left"><b><span class="warm">Hot</span> · high T</b><span>attractions hardly matter</span></div>
        <div class="x-row" style="top:214px" data-at="2" data-fx="left"><b><span class="pri">Lonely</span> · low P</b><span>particle volume is negligible</span></div>
        <div class="x-row" style="top:322px" data-at="3" data-fx="left"><b>Small, nonpolar</b><span>tiny atoms, very weak dispersion forces</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3@0.35" data-fx="pop"><g class="he">${ball(0, 0, 44, 'gold', 'He', 34)}</g></g>
        <text x="790" y="510" text-anchor="middle" font-size="30" font-weight="900" class="f-gold" data-at="3@0.45" data-fx="fade">the champion</text></svg>
      <div class="card" style="left:990px;top:300px;width:810px;height:480px;border-color:rgba(240,112,122,.6)" data-at="4"><h3 class="bad">Least ideal</h3>
        <div class="x-row" style="top:106px" data-at="4@0.1" data-fx="left"><b>Low T, high P</b></div>
        <div class="x-row" style="top:170px" data-at="4@0.45" data-fx="left"><b>Large or polar particles</b><span>strong intermolecular forces</span></div>
        <div class="x-sm" style="left:0;right:0;top:432px;text-align:center" data-at="5@0.5" data-fx="fade">hydrogen bonds</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="5@0.1" data-fx="pop"><g transform="translate(1240 600)">${water}</g></g>
        <text x="1240" y="702" text-anchor="middle" font-size="32" font-weight="900" data-at="5@0.2" data-fx="fade">H${sb('2')}<tspan dy="-.3em">O vapor</tspan></text>
        <g data-at="5@0.35" data-fx="pop"><g transform="translate(1560 586)">${ammonia}</g></g>
        <text x="1560" y="702" text-anchor="middle" font-size="32" font-weight="900" data-at="5@0.45" data-fx="fade">NH${sb('3')}</text>
      </svg>
      <div class="card" style="left:120px;top:806px;width:1680px;height:124px" data-at="6">
        <svg width="1680" height="124" viewBox="0 0 1680 124">
          <text x="44" y="76" font-size="40" font-weight="900" class="f-gold">Size matters:</text>
          <g data-at="6@0.3" data-fx="pop">${ball(380, 62, 24, 'gray')}</g><text x="414" y="76" font-size="38" font-weight="900" data-at="6@0.3" data-fx="fade">CH${sb('4')}</text>
          <text x="530" y="74" font-size="30" font-weight="800" class="f-muted" data-at="6@0.35" data-fx="fade">deviates less than</text>
          <g data-at="6@0.4" data-fx="pop">${ball(960, 62, 40, 'pur')}</g><text x="1012" y="76" font-size="38" font-weight="900" data-at="6@0.4" data-fx="fade">CCl${sb('4')}</text>
          <text x="1135" y="74" font-size="29" font-weight="800" class="f-muted" data-at="6@0.7" data-fx="fade">stronger dispersion forces</text></svg></div>`,
    update(c) {
      const t = c.t, s = 1 + 0.04 * Math.sin(t * 3)
      c.$('.he').setAttribute('transform', `translate(790 438) scale(${s})`)
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'He'], ['B', 'Ne'], ['C', 'CH<sub>4</sub>'], ['D', 'NH<sub>3</sub>']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">Which gas would deviate <span class="teal">most</span> from ideal behavior<br>under the same conditions?</h2>
      ${OPTS.map(([l, f], i) => `<div class="x-tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.62 + i * 0.09}" data-fx="pop"><div class="l">${l}</div>
        ${i === 3 ? CHECK : ''}<div class="f">${f}</div>${i === 3 ? '<div class="ch" data-at="4@0.2" data-fx="fade">polar, H-bonds</div>' : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:760px" data-at="5" data-fx="pop">Strong attractions ${ARR} the <span class="teal">biggest deviation</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 3) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- free-response tip ----------
  EZ.scene('frq', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="0">Explain a deviation</h2>
      <div class="x-step" style="left:120px;border-color:var(--primary);background:rgba(141,141,240,.14)" data-at="1@0.55" data-fx="pop"><small style="background:var(--primary)">1</small>condition</div>
      <div style="position:absolute;left:556px;top:362px;font-size:56px" class="muted" data-at="1@0.62" data-fx="fade">${ARR}</div>
      <div class="x-step" style="left:640px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="1@0.7" data-fx="pop"><small style="background:var(--accent)">2</small>assumption</div>
      <div class="muted" style="position:absolute;left:1120px;top:362px;font-size:56px" data-at="1@0.78" data-fx="fade">${ARR}</div>
      <div class="x-step" style="left:1200px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="1@0.86" data-fx="pop"><small style="background:var(--warm)">3</small>direction</div>
      <div class="card x-ans" style="top:480px" data-at="2-0.2"><span class="lab">Model answer · high pressure</span>
        <span data-at="2@0.04" data-fx="fade"><b class="pri">At high pressure</b>, </span><span data-at="2@0.12" data-fx="fade"><b class="teal">the volume of the gas particles is no longer negligible</b> compared with the container volume, </span><span data-at="2@0.62" data-fx="fade">so <b class="warm">the measured volume is greater</b> than the ideal gas law predicts.</span></div>
      <div class="card x-ans" style="top:694px" data-at="3-0.2"><span class="lab">Model answer · low temperature</span>
        <span data-at="3@0.04" data-fx="fade"><b class="pri">At low temperature</b>, </span><span data-at="3@0.18" data-fx="fade"><b class="teal">attractions between particles reduce the force of collisions</b> with the walls, </span><span data-at="3@0.65" data-fx="fade">so <b class="warm">the measured pressure is lower</b> than predicted.</span></div>`,
  })

  // ---------- recap ----------
  let r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="M110 20 V190 H350 V20" fill="none" stroke="#c9cee0" stroke-width="5"/><rect x="114" y="96" width="232" height="16" rx="4" fill="#646c82"/>
    <line x1="230" x2="230" y1="40" y2="94" stroke="#f3a764" stroke-width="7" marker-end="url(#mk-warm)"/>`
  for (let i = 0; i < 8; i++) r1 += ball(140 + (i % 4) * 60, i < 4 ? 135 : 171, 16, 'pur')
  r1 += '</svg>'
  const RP = [[150, 80], [220, 140], [290, 70], [200, 40]]
  let r2 = '<svg width="460" height="210" viewBox="0 0 460 210">'
  for (let i = 0; i < RP.length; i++) for (let j = i + 1; j < RP.length; j++) r2 += `<line x1="${RP[i][0]}" y1="${RP[i][1]}" x2="${RP[j][0]}" y2="${RP[j][1]}" stroke="#3cc7bc" stroke-width="4" stroke-dasharray="7 7"/>`
  r2 += RP.map(([x, y]) => ball(x, y, 20, 'teal')).join('') + '<line x1="380" x2="380" y1="20" y2="190" stroke="#c9cee0" stroke-width="7" stroke-linecap="round"/><text x="230" y="200" text-anchor="middle" font-size="27" font-weight="900" class="f-teal">attractions</text></svg>'
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="60" y="20" width="250" height="170" rx="14" fill="none" stroke="#c9cee0" stroke-width="5"/>
    ${ball(110, 70, 14, 'gold')}${ball(250, 120, 14, 'gold')}${ball(160, 150, 14, 'gold')}
    <rect x="356" y="30" width="24" height="130" rx="12" fill="none" stroke="#c9cee0" stroke-width="4"/><rect x="362" y="44" width="12" height="120" rx="6" fill="#f0707a"/><circle cx="368" cy="172" r="22" fill="#f0707a"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>High pressure:<br><span class="warm">particle volume</span> matters<br>actual V &gt; ideal</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Low T or strong IMFs:<br><span class="teal">attractions</span> matter<br>actual P &lt; ideal</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Most ideal:<br><span class="good">high T, low P</span><br>small, nonpolar</p></div>`,
  })
  void sup
})()
