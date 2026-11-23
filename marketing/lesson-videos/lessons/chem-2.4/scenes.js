// Pictures for chem-2.4 "Metals & Alloys". One EZ.scene per scene id in script.mjs.
// Everything shown is from the lesson (app/src/content/chem/u2.ts, book.ts). The lattices follow
// the app's own "alloys" diagram: a square array of metal ions with electrons in between,
// same-size atoms swapped in (substitutional), small atoms in the gaps (interstitial).
// Atom sizes are in the right order (similar / much smaller) but not to exact scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .note{position:absolute;left:1290px;width:550px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .note i{position:absolute;left:22px;top:26px;width:46px;height:46px;border-radius:50%}
    .note b{display:block;font-size:30px;font-weight:900;line-height:1.15} .note span{display:block;font-size:25px;font-weight:700;color:var(--muted)}
    .big{position:absolute;left:1290px;width:550px;padding:24px 28px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid rgba(141,141,240,.7)}
    .big b{display:block;font-size:26px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--primary)} .big span{display:block;margin-top:8px;font-size:32px;font-weight:800;line-height:1.3}
    .cap{position:absolute;left:0;width:100%;text-align:center;font-size:38px;font-weight:800;white-space:nowrap}
    .cap b{font-weight:900}
    .tag{position:absolute;right:34px;top:30px;padding:8px 22px;border-radius:999px;font-size:28px;font-weight:900;background:rgba(243,167,100,.14);border:2px solid rgba(243,167,100,.5);color:var(--warm)}
    .rule{position:absolute;left:120px;width:840px;height:150px;border-radius:26px;background:rgba(36,40,56,.85);border:2px solid var(--line)}
    .rule svg{position:absolute;left:14px;top:15px} .rule .a{position:absolute;left:190px;top:22px;font-size:30px;font-weight:800;color:var(--muted)}
    .rule .b{position:absolute;left:190px;top:60px;font-size:50px;font-weight:900;white-space:nowrap}
    .rule .q{position:absolute;right:26px;top:48px;padding:8px 22px;border-radius:999px;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:800;white-space:nowrap}
    .tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:96px;font-size:40px;font-weight:900;line-height:1} .tile .ch{margin-top:22px;font-size:32px;font-weight:800;color:var(--muted)}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- shared pieces ----------
  const rnd = (i, k) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s) }
  const grid = (cols, rows, x0, y0, sp, fn) => { let s = ''; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) s += fn(i, j, x0 + i * sp, y0 + j * sp); return s }
  const eDot = (r = 10) => `<circle class="el" r="${r}" fill="#7df0e6" stroke="#15665f" stroke-width="2.5"/>`
  // a gentle wander around a home position: a pure function of time
  const wob = (i, t, amp) => [
    amp * (0.62 * Math.sin(t * (0.9 + rnd(i, 1)) + 6.283 * rnd(i, 2)) + 0.38 * Math.sin(t * (2.1 + rnd(i, 3)) + 6.283 * rnd(i, 4))),
    amp * (0.62 * Math.sin(t * (0.8 + rnd(i, 5)) + 6.283 * rnd(i, 6)) + 0.38 * Math.sin(t * (1.9 + rnd(i, 7)) + 6.283 * rnd(i, 8))),
  ]
  const els = (c) => (c.els ??= [...c.root.querySelectorAll('.el')])
  const note = (i, at, color, a, b) => `<div class="note" style="top:${320 + i * 130}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`

  // the big block of metal used in "sea" and "conduct": 7 x 4 positive ions, 24 electrons
  const SX = 220, SY = 395, SP = 150, PL = 100, PR = 1240
  const HOME = []
  for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) HOME.push([SX + 75 + SP * i, SY + 75 + SP * j])
  for (let i = 0; i < 6; i++) HOME.push([SX + 75 + SP * i, i % 2 ? SY + 450 : SY])
  const block = (ionAt, seaAt) => `
    <rect x="${PL}" y="300" width="${PR - PL}" height="640" rx="36" fill="rgba(36,40,56,.6)" stroke="#363c54" stroke-width="2"/>
    <g data-at="${seaAt}" data-fx="fade"><rect x="${PL}" y="300" width="${PR - PL}" height="640" rx="36" fill="rgba(60,199,188,.13)"/></g>
    <g class="halo" style="opacity:0">${grid(7, 4, SX, SY, SP, (i, j, x, y) => `<circle cx="${x}" cy="${y}" r="58" fill="none" stroke="#3cc7bc" stroke-width="5"/>`)}</g>
    ${grid(7, 4, SX, SY, SP, (i, j, x, y) => `<g data-at="${ionAt(i, j)}" data-fx="pop">${ball(x, y, 46, 'warm', '+', 54)}</g>`)}
    <g data-at="${seaAt}" data-fx="fade">${HOME.map(() => eDot()).join('')}</g>`

  // small lattices for the cards: 6 x 3 atoms, 96 px apart, radius 42
  const LX = 165, LS = 96
  const GAPS = [[0, 0], [2, 0], [4, 0], [1, 1], [3, 1]] // where the small atoms sit
  const SWAPS = ['1,0', '4,0', '2,1', '5,1', '0,2', '3,2'] // which host atoms are replaced
  const host = (y0, g, label) => grid(6, 3, LX, y0, LS, (i, j, x, y) => ball(x, y, 42, g, label, 30))
  const smalls = (y0, g, label, at, r = 18) => GAPS.map(([i, j], k) => `<g ${at ? `data-at="${at(k)}" data-fx="pop"` : ''}>${ball(LX + 48 + LS * i, y0 + 48 + LS * j, r, g, label, 19)}</g>`).join('')
  const swapped = (y0, g, label, g2, label2, at) => { let k = 0
    return grid(6, 3, LX, y0, LS, (i, j, x, y) => { if (!SWAPS.includes(i + ',' + j)) return ball(x, y, 42, g, label, 30)
      const when = at(k++)
      return `<g data-at="in" data-fx="fade" data-out="${when}">${ball(x, y, 42, g, label, 30)}</g><g data-at="${when}" data-fx="pop">${ball(x, y, 42, g2, label2, 30)}</g>` }) }

  // ---------- intro artwork: a faint block of metal behind the title ----------
  const IH = []
  for (let j = 0; j < 2; j++) for (let i = 0; i < 7; i++) IH.push([300 + 220 * i, 420 + 260 * j])
  EZ.intro = {
    chips: [['1@0.2', 'The electron sea'], ['1@0.5', 'Why metals bend'], ['1@0.8', 'Two kinds of alloys']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.17">${[235, 885].map((y) => grid(8, 1, 190, y, 220, (i, j, x) => ball(x, y, 52, 'warm'))).join('')}${IH.map(() => eDot(13)).join('')}</svg>`,
    update(c) { els(c).forEach((e, i) => { const [dx, dy] = wob(i, c.t, 70); e.setAttribute('transform', `translate(${IH[i][0] + dx} ${IH[i][1] + dy})`) }) },
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Small mix, big change</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:540px" data-at="0"><h3>Iron + a little carbon</h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="290">${host(48, 'gray', 'Fe')}${smalls(48, 'gold', 'C', (k) => `1@${(0.08 + k * 0.07).toFixed(2)}`)}</svg>
        <div class="cap" style="top:420px" data-at="0@0.3" data-out="1" data-fx="fade">pure iron: <b class="muted">fairly soft</b></div>
        <div class="cap" style="top:420px" data-at="1@0.45" data-fx="fade"><b class="gold">steel</b>: strong enough for skyscrapers</div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:540px" data-at="2"><h3>Copper + zinc</h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="290">${swapped(48, 'warm', 'Cu', 'pur', 'Zn', (k) => `2@${(0.12 + k * 0.07).toFixed(2)}`)}</svg>
        <div class="cap" style="top:420px" data-at="2@0.55" data-fx="fade"><b class="pri">brass</b>: for trumpets</div></div>
      <div class="banner" style="top:880px" data-at="3" data-fx="pop">Mixing metals at the <span class="teal">atomic level</span> changes everything</div>`,
  })

  // ---------- the electron-sea model ----------
  EZ.scene('sea', {
    html: `<div class="kicker" data-at="in" data-fx="left">Inside a metal</div><h2 class="h1" data-at="0">The electron-sea model</h2>
      <svg class="full" viewBox="0 0 1920 1080">${block((i, j) => `1@${(0.05 + i * 0.07 + j * 0.04).toFixed(2)}`, '2')}</svg>
      ${note(0, '1', '#f3a764', 'Positive metal ions', 'in a regular array')}
      ${note(1, '2', '#3cc7bc', 'A sea of electrons', 'delocalized valence electrons')}
      ${note(2, '3', '#7df0e6', 'Free to move', 'not stuck in place')}
      ${note(3, '4', '#8d8df0', 'Metallic bond', 'ions attracted to the electron sea')}
      <div style="position:absolute;left:1290px;top:856px;width:550px;font-size:34px;font-weight:900;line-height:1.25" class="teal" data-at="5" data-fx="right">One picture explains<br>how metals behave</div>`,
    update(c) {
      const amp = lerp(16, 62, eio(c.p('3', 1.2)))
      els(c).forEach((e, i) => { const [dx, dy] = wob(i, c.t, amp); e.setAttribute('transform', `translate(${HOME[i][0] + dx} ${HOME[i][1] + dy})`) })
      c.$('.halo').style.opacity = c.p('4', 0.5) * (1 - c.p('5', 0.5)) * (0.55 + 0.45 * Math.sin(c.t * 4.5))
    },
  })

  // ---------- conducts electricity and heat ----------
  EZ.scene('conduct', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Property 1</div><h2 class="h1" data-at="0">Metals conduct</h2>
      <svg class="full" viewBox="0 0 1920 1080">${block(() => 'in', 'in')}
        <g data-at="1" data-out="2" data-fx="fade"><text x="610" y="925" text-anchor="end" font-size="28" font-weight="900" class="f-teal">voltage applied</text>
          <line x1="630" y1="916" x2="730" y2="916" stroke="#3cc7bc" stroke-width="6" marker-end="url(#mk-teal)"/><text x="752" y="925" font-size="28" font-weight="900" class="f-teal">electrons move</text></g>
        <g data-at="2" data-fx="fade"><rect class="hot" x="${PL}" y="330" width="16" height="580" rx="8" fill="#f3a764"/>
          <text x="134" y="925" font-size="28" font-weight="900" class="f-warm">heat</text></g></svg>
      ${note(0, '0', '#3cc7bc', 'Conducts electricity', 'delocalized electrons move freely')}
      ${note(1, '2', '#f3a764', 'Conducts heat', 'electrons carry kinetic energy')}
      <div class="big" style="top:610px" data-at="4" data-fx="right"><b>On the exam</b><span>Name the <em class="teal" style="font-style:normal">delocalized electrons</em>, then link them to the property.</span></div>`,
    update(c) {
      const b = c.b, W = PR - PL - 20, xl = PL + 10
      const drift = 1500 * eio(c.seg(b[1].start + 0.3, b[2].start))
      const front = lerp(PL - 140, PR + 140, c.seg(b[3].start, b[3].end))
      c.$('.hot').style.opacity = 0.65 + 0.35 * Math.sin(c.t * 6)
      els(c).forEach((e, i) => {
        const [dx, dy] = wob(i, c.t, 50)
        const x = xl + ((((HOME[i][0] + dx + drift - xl) % W) + W) % W)
        const h = c.t >= b[2].start ? clamp((front - x) / 140) : 0
        const j = h * 9 * Math.sin(c.t * 23 + i)
        e.setAttribute('transform', `translate(${x + j} ${HOME[i][1] + dy * (1 + 0.35 * h) + h * 9 * Math.cos(c.t * 19 + i * 2)})`)
        e.setAttribute('fill', h > 0.5 ? '#ffc58f' : '#7df0e6'); e.setAttribute('stroke', h > 0.5 ? '#b96a26' : '#15665f')
        e.style.opacity = Math.min(1, (x - xl) / 36, (xl + W - x) / 36)
      })
    },
  })

  // ---------- malleable: layers slide ----------
  const MX = 129, MY = 46, MS = 92
  const mrow = (j) => Array.from({ length: 6 }, (_, i) => ball(MX + MS * i, MY + MS * j, 36, 'warm', '+', 44)).join('')
  const irow = (j) => Array.from({ length: 6 }, (_, i) => ((i + j) % 2 ? ball(MX + MS * i, MY + MS * j, 40, 'pur', '−', 50) : ball(MX + MS * i, MY + MS * j, 28, 'warm', '+', 40))).join('')
  const MH = []
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) MH.push([MX + 46 + MS * i, MY + 46 + MS * j, j])
  EZ.scene('slide', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Property 2</div><h2 class="h1" data-at="0">Malleable and ductile</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:550px" data-at="0"><h3>Metal</h3><div class="tag" data-at="1" data-fx="pop">hammers into a sheet</div>
        <svg style="position:absolute;left:0;top:98px;overflow:visible" width="810" height="370">
          <rect class="haze" x="72" y="-6" width="666" height="380" rx="30" fill="#3cc7bc"/>
          <g class="mtop">${mrow(0)}${mrow(1)}</g>${mrow(2)}${mrow(3)}${MH.map(() => eDot(9)).join('')}</svg>
        <div class="cap teal" style="top:486px;font-size:35px" data-at="3" data-fx="fade">the electron sea still holds them together</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:550px" data-at="4"><h3>Ionic solid</h3>
        <svg style="position:absolute;left:0;top:98px;overflow:visible" width="810" height="370">
          <g class="itop">${irow(0)}${irow(1)}</g><g class="ibot">${irow(2)}${irow(3)}</g>
          <g class="clash" style="opacity:0">${[1, 2, 3, 4, 5].map((k) => `<path transform="translate(${MX + MS * k} ${MY + MS * 1.5})" d="M-10 -3L0 -17L10 -3ZM-10 3L0 17L10 3Z" fill="#f0707a"/>`).join('')}</g></svg>
        <div class="cap bad" style="top:486px" data-at="5@0.55" data-fx="fade">like charges clash</div></div>
      <div class="banner" style="top:880px" data-at="6" data-fx="pop">In a metal: layers slide, <span class="teal">no like-charge clash</span></div>`,
    update(c) {
      const b = c.b, t = c.t
      const dx = MS * eio(c.seg(b[2].start + 0.38 * (b[2].end - b[2].start), b[2].end + 0.1))
      c.$('.mtop').setAttribute('transform', `translate(${dx} 0)`)
      c.$('.haze').style.opacity = 0.1 + 0.1 * c.p('3', 0.4) * (0.6 + 0.4 * Math.sin(t * 4.5))
      els(c).forEach((e, i) => { const [wx, wy] = wob(i, t, 20), k = MH[i][2] === 0 ? 1 : MH[i][2] === 1 ? 0.5 : 0
        e.setAttribute('transform', `translate(${MH[i][0] + wx + dx * k} ${MH[i][1] + wy})`) })
      const s0 = b[5].start + 0.15, s1 = s0 + 1.1, hit = eo(c.seg(s1 - 0.05, s1 + 0.4))
      const ix = MS * eio(c.seg(s0, s1))
      c.$('.itop').setAttribute('transform', `translate(${ix} ${-12 * hit})`)
      c.$('.ibot').setAttribute('transform', `translate(0 ${12 * hit})`)
      c.$('.clash').style.opacity = hit * (0.7 + 0.3 * Math.sin(t * 9))
    },
  })

  // ---------- two kinds of alloys ----------
  EZ.scene('alloys', {
    html: `<div class="kicker" data-at="in" data-fx="left">Alloys</div><h2 class="h1" data-at="0">Two kinds of alloys</h2>
      <div style="position:absolute;left:120px;top:274px;font-size:38px;font-weight:800" class="muted" data-at="1" data-fx="fade">Alloy = a mixture of a metal with one or more other elements</div>
      <div class="card" style="left:120px;top:350px;width:810px;height:540px" data-at="3"><h3><small>1</small><span class="pri">Substitutional</span></h3>
        <svg style="position:absolute;left:0;top:104px" width="810" height="290">${swapped(48, 'warm', 'Cu', 'pur', 'Zn', (k) => `4@${(0.3 + k * 0.09).toFixed(2)}`)}</svg>
        <div class="cap" style="top:404px" data-at="3@0.4" data-fx="fade">similar size: <b class="pri">replace</b> host atoms</div>
        <div class="cap" style="top:460px" data-at="4" data-fx="fade"><b>Brass</b>: <b class="pri">Zn</b> for some <b class="warm">Cu</b></div></div>
      <div class="card" style="left:990px;top:350px;width:810px;height:540px" data-at="5"><h3><small>2</small><span class="gold">Interstitial</span></h3>
        <svg style="position:absolute;left:0;top:104px" width="810" height="290">${host(48, 'gray', 'Fe')}
          ${GAPS.map(([i, j], k) => `<g data-at="5@${(0.45 + k * 0.06).toFixed(2)}" data-out="6@${(0.3 + k * 0.09).toFixed(2)}" data-fx="fade"><circle cx="${LX + 48 + LS * i}" cy="${48 + 48 + LS * j}" r="21" fill="none" stroke="#f2c443" stroke-width="4" stroke-dasharray="7 6"/></g>`).join('')}
          ${smalls(48, 'gold', 'C', (k) => `6@${(0.3 + k * 0.09).toFixed(2)}`)}</svg>
        <div class="cap" style="top:406px;font-size:35px" data-at="5@0.4" data-fx="fade">much smaller: fit in the <b class="gold">gaps</b> (interstices)</div>
        <div class="cap" style="top:460px" data-at="6" data-fx="fade"><b>Steel</b>: <b class="gold">C</b> between <b class="muted">Fe</b></div></div>`,
  })

  // ---------- size decides the type ----------
  const JY = 92
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Shortcut</div><h2 class="h1" data-at="0">Size decides the type</h2>
      <div class="rule" style="top:300px" data-at="1"><svg width="160" height="120">${ball(46, 60, 40, 'warm')}${ball(120, 60, 40, 'pur')}</svg>
        <div class="a">Similar radii</div><div class="b pri">Substitutional</div><div class="q">“swap places”</div></div>
      <div class="rule" style="top:470px" data-at="2"><svg width="160" height="120">${ball(56, 60, 46, 'gray')}${ball(128, 76, 18, 'gold')}</svg>
        <div class="a">Very different radii</div><div class="b gold">Interstitial</div><div class="q">“in the gaps”</div></div>
      <div class="rule" style="top:640px" data-at="6"><svg width="160" height="120">${ball(80, 60, 46, 'gray', 'Fe', 34)}${ball(132, 96, 18, 'gold', 'C', 19)}</svg>
        <div class="a">Steel vs. pure iron</div><div class="b warm">harder, less malleable</div></div>
      <div class="card" style="left:1000px;top:300px;width:800px;height:550px" data-at="3"><h3>Interstitial alloy</h3>
        <svg style="position:absolute;left:0;top:96px;overflow:visible" width="800" height="330">
          <g data-at="5" data-fx="fade"><line class="push" x1="24" x2="96" y1="${JY}" y2="${JY}" stroke="#f3a764" stroke-width="9" marker-end="url(#mk-warm)"/><text x="22" y="${JY - 26}" font-size="28" font-weight="900" class="f-warm">push</text></g>
          <g class="jtop">${grid(6, 1, LX, JY, LS, (i, j, x, y) => ball(x, y, 42, 'gray', 'Fe', 30))}</g>
          ${grid(6, 2, LX, JY + LS, LS, (i, j, x, y) => ball(x, y, 42, 'gray', 'Fe', 30))}${smalls(JY, 'gold', 'C')}
          <g class="jam" style="opacity:0">${GAPS.filter((g) => g[1] === 0).map(([i]) => `<circle cx="${LX + 48 + LS * i}" cy="${JY + 48}" r="25" fill="none" stroke="#f0707a" stroke-width="5"/>`).join('')}</g></svg>
        <div class="cap" style="top:432px" data-at="4" data-fx="fade">usually <b class="warm">harder</b> and <b class="warm">less malleable</b></div>
        <div class="cap muted" style="top:486px;font-size:32px" data-at="5@0.3" data-fx="fade">small atoms jam the layers</div></div>
      <div class="banner" style="top:880px" data-at="7" data-fx="pop">Electron sea remains ${ARR} still <span class="gold">shiny</span>, still <span class="teal">conducts</span></div>`,
    update(c) {
      const since = c.t - c.b[5].start, on = clamp(since / 0.4) * (1 - c.seg(c.b[7].start, c.b[7].start + 0.5))
      const pulse = since > 0 ? Math.pow(Math.max(0, Math.sin(since * 3.4)), 2) * on : 0
      c.$('.jtop').setAttribute('transform', `translate(${15 * pulse} 0)`)
      c.$('.push').setAttribute('transform', `translate(${15 * pulse} 0)`)
      c.$('.jam').style.opacity = pulse
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'substitutional', 'similar sizes'], ['B', 'interstitial', 'very different sizes'], ['C', 'ionic', ''], ['D', 'a molecular solid', '']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px;line-height:1.2" data-at="1">Boron atoms are <span class="teal">much smaller</span> than iron atoms.<br>A boron–iron alloy is most likely…</h2>
      ${OPTS.map(([l, f, ch], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.6 + i * 0.1}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${f}</div>${ch ? `<div class="ch" data-at="4" data-fx="fade">${ch}</div>` : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:760px" data-at="5" data-fx="pop">Small B atoms fit in the <span class="teal">gaps</span> between larger Fe atoms</div>`,
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
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${grid(4, 2, 98, 62, 88, (i, j, x, y) => ball(x, y, 32, 'warm', '+', 38))}
    ${[[142, 62], [318, 62], [230, 106], [54, 106], [406, 106], [142, 150], [318, 150], [230, 18], [230, 194]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#7df0e6" stroke="#15665f" stroke-width="2.5"/>`).join('')}</svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${grid(3, 3, 42, 40, 64, (i, j, x, y) => ball(x, y, 28, (i + j * 3) % 4 === 1 ? 'pur' : 'warm'))}
    ${grid(3, 3, 290, 40, 64, (i, j, x, y) => ball(x, y, 28, 'gray'))}${[[322, 72], [386, 136], [322, 136]].map(([x, y]) => ball(x, y, 12, 'gold')).join('')}</svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210">${grid(4, 2, 110, 48, 80, (i, j, x, y) => ball(x, y, 35, 'gray', 'Fe', 26))}${[[150, 88], [230, 88], [310, 88]].map(([x, y]) => ball(x, y, 15, 'gold')).join('')}
    <line x1="20" y1="48" x2="58" y2="48" stroke="#f3a764" stroke-width="8" marker-end="url(#mk-warm)"/><text x="230" y="196" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">layers can’t slide as easily</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Metal = cations +<br>a <span class="teal">sea of electrons</span><br>Conductive<br>and malleable</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p><span class="pri">Substitutional</span>: similar<br>sizes swap (brass)<br><span class="gold">Interstitial</span>: small atoms<br>in the gaps (steel)</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Interstitial alloys:<br>typically <span class="warm">harder</span><br>and <span class="warm">less malleable</span></p></div>`,
  })
})()
