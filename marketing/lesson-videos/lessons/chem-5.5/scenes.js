// Pictures for chem-5.5 "The Collision Model". One EZ.scene per scene id in script.mjs.
// Facts shown are the lesson's own (app/src/content/chem/u5.ts; the NO + O3 example and the
// "10 °C roughly doubles" line are from book.ts). The energy curves have the shape of the lesson's
// own diagram (mb-activation) and carry no numbers. Atoms are not drawn to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-ax{stroke:#c9cee0;stroke-width:4;stroke-linecap:round}
    .x-axl{font-size:30px;font-weight:800;fill:var(--muted)!important;text-anchor:middle}
    .x-note{position:absolute;left:1360px;width:490px;min-height:100px;padding:12px 20px 12px 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-note i{position:absolute;left:22px;top:28px;width:46px;height:46px;border-radius:50%}
    .x-note b{display:block;font-size:31px;font-weight:900;line-height:1.15} .x-note span{display:block;margin-top:4px;font-size:25px;font-weight:700;line-height:1.2;color:var(--muted)}
    .x-side{position:absolute;left:1060px;width:740px;padding:24px 34px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:40px;font-weight:800;line-height:1.25}
    .x-side b{font-weight:900}
    .x-p{position:absolute;left:0;right:0;top:350px;text-align:center;font-size:34px;font-weight:800;line-height:1.3;color:var(--muted)}
    .x-p b{color:var(--text);font-weight:900}
    .x-eq{position:absolute;left:120px;width:1680px;top:286px;text-align:center;font-size:58px;font-weight:900;white-space:nowrap}
    .x-tag{position:absolute;padding:8px 26px;border-radius:999px;font-size:32px;font-weight:900;white-space:nowrap;border:3px solid}
    .x-row{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.8);border:2px solid var(--line)}
    .x-row .n{position:absolute;left:26px;top:26px;width:68px;height:68px;border-radius:50%;font-size:36px;font-weight:900;line-height:68px;text-align:center;color:#10131c}
    .x-row .lb{position:absolute;left:120px;top:34px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-row .to{position:absolute;left:520px;top:34px;font-size:42px;font-weight:900;color:var(--muted)}
    .x-row .rs{position:absolute;left:600px;top:36px;font-size:40px;font-weight:800;white-space:nowrap}
    .x-big{position:absolute;right:24px;top:22px;height:74px;padding:0 24px;border-radius:18px;font-size:30px;font-weight:900;line-height:70px;white-space:nowrap;background:rgba(243,167,100,.16);border:2px solid var(--warm);color:var(--warm)}
    .x-hh{position:absolute;top:300px;width:810px;height:120px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;gap:20px;font-size:46px;font-weight:900;white-space:nowrap}
    .x-hh span{font-size:36px;font-weight:800;color:var(--muted)}
    .x-sub{position:absolute;left:120px;top:448px;font-size:34px;font-weight:800;color:var(--muted)}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:34px;font-weight:800;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .x-pb{position:absolute;top:850px;left:555px;width:810px;height:110px;border-radius:28px;border:3px solid var(--warm);background:rgba(243,167,100,.12);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', RED = '#f0707a', GOOD = '#4cc781', GRAY = '#6b7390'
  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const tickG = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="22" fill="#4cc781"/><path d="M-10 1l7 7 13-15" fill="none" stroke="#10131c" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></g>`
  const crossG = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="22" fill="#f0707a"/><path d="M-9 -9l18 18M9 -9l-18 18" fill="none" stroke="#10131c" stroke-width="5.5" stroke-linecap="round"/></g>`
  /** SVG "Ea" with a lowered a (put it last in its <text>) */
  const EA = 'E<tspan dy=".28em" font-size=".64em">a</tspan>'
  const EAh = 'E<sub>a</sub>'
  const pos = (c, q, x, y, extra = '') => c.$(q).setAttribute('transform', `translate(${x} ${y})${extra}`)
  const note = (top, at, color, a, b) => `<div class="x-note" style="top:${top}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`

  // ---------- the energy distribution (same function as the lesson's mb-activation diagram) ----------
  const f = (E, T) => (2 / Math.sqrt(Math.PI)) * Math.sqrt(E) * T ** -1.5 * Math.exp(-E / T)
  const PEAK = f(0.5, 1), EAV = 4.5
  const mk = (x0, y0, w, h) => {
    const X = (E) => x0 + (E / 10) * w, Y = (p) => y0 - (p / PEAK) * h
    const curve = (T) => 'M' + Array.from({ length: 101 }, (_, i) => `${X(i / 10).toFixed(1)} ${Y(f(i / 10, T)).toFixed(1)}`).join('L')
    const tail = (T) => { const pts = [`${X(EAV)} ${y0}`]; for (let E = EAV; E <= 10.001; E += 0.1) pts.push(`${X(E).toFixed(1)} ${Y(f(E, T)).toFixed(1)}`); pts.push(`${X(10)} ${y0}`); return 'M' + pts.join('L') + 'Z' }
    return { X, Y, curve, tail }
  }

  // ---------- intro artwork: faint colliding pairs at the left and right edges ----------
  const IP = [[150, 250, 'pur', 'teal', 0], [190, 640, 'teal', 'warm', 0.7], [1770, 330, 'warm', 'pur', 0.35], [1730, 720, 'pur', 'teal', 1.05]]
  EZ.intro = {
    chips: [['1@0.3', 'Three requirements'], ['1@0.55', 'Why most fail'], ['1@0.8', 'Why heat helps']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">${IP.map(([x, y, a, b], i) => `<g class="ia${i}">${ball(0, 0, 34, a)}</g><g class="ib${i}">${ball(0, 0, 34, b)}</g>`).join('')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start
      IP.forEach(([x, y, , , ph], i) => {
        const s = ((t * 0.5 + ph) % 1), d = 34 + 70 * Math.abs(Math.cos(Math.PI * s))
        pos(c, '.ia' + i, x - d, y); pos(c, '.ib' + i, x + d, y)
      })
    },
  }

  // ---------- hook: collisions everywhere ----------
  const HP = [[275, 420, 'pur', 'teal', 0], [560, 390, 'warm', 'pur', 0.4], [800, 450, 'teal', 'warm', 0.75], [330, 600, 'teal', 'pur', 0.55], [650, 580, 'pur', 'warm', 0.15], [850, 660, 'warm', 'teal', 0.9], [450, 730, 'pur', 'pur', 0.3], [730, 760, 'teal', 'teal', 0.65]]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Big question</div><h2 class="h1" data-at="0">Why doesn’t everything react instantly?</h2>
      <div class="card" style="left:120px;top:320px;width:880px;height:520px" data-at="in" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in" data-fx="fade">${HP.map(([x, y, a, b], i) => `<g class="ha${i}">${ball(0, 0, 30, a)}</g><g class="hb${i}">${ball(0, 0, 30, b)}</g><g class="hs${i}"><circle r="20" fill="none" stroke="#f2c443" stroke-width="5"/></g>`).join('')}</g>
        <text x="560" y="810" text-anchor="middle" font-size="30" font-weight="800" class="f-muted" data-at="0@0.3" data-fx="fade">a gas, up close</text>
      </svg>
      <div class="x-side" style="top:320px" data-at="0@0.2" data-fx="right">Each molecule collides<br><b class="gold">billions of times per second</b></div>
      <div class="x-side" style="top:480px" data-at="1" data-fx="right">If every collision reacted:<br><b class="bad">everything reacts instantly!</b></div>
      <div class="x-side" style="top:640px;text-align:center;font-size:56px;font-weight:900" data-at="2" data-fx="pop"><span class="warm">So why don’t they?</span></div>
      <div class="banner" style="top:880px;font-size:44px" data-at="3" data-fx="pop">The collision model: <span data-at="4@0.1" data-fx="fade">collide</span><span data-at="4@0.3" data-fx="fade"> + <span class="warm">enough energy</span></span><span data-at="4@0.55" data-fx="fade"> + <span class="teal">correct orientation</span></span></div>`,
    update(c) {
      const t = c.t, settle = eio(c.seg(c.b[3].start, c.b[3].start + 1.2))
      HP.forEach(([x, y, , , ph], i) => {
        const s = ((t * 0.55 + ph) % 1), cyc = Math.abs(Math.cos(Math.PI * s))
        const d = 30 + lerp(80 * cyc, 70, settle)
        pos(c, '.ha' + i, x - d, y); pos(c, '.hb' + i, x + d, y)
        const hit = (1 - settle) * clamp(1 - cyc / 0.25)
        c.$('.hs' + i).style.opacity = hit
        pos(c, '.hs' + i, x, y, ` scale(${1 + 1.4 * (1 - hit)})`)
      })
    },
  })

  // ---------- three requirements ----------
  const HILL = 'M40 210 C170 210 200 70 270 70 S370 210 500 210'
  EZ.scene('three', {
    html: `<div class="kicker" data-at="in" data-fx="left">The collision model</div><h2 class="h1" data-at="0">Three requirements</h2>
      <div class="card" style="left:120px;top:300px;width:540px;height:460px" data-at="1"><h3><small>1</small>Collide</h3>
        <svg style="position:absolute;left:0;top:100px" width="540" height="250"><g class="c1a">${ball(0, 0, 44, 'pur')}</g><g class="c1b">${ball(0, 0, 44, 'teal')}</g>
          <g class="c1s"><circle r="26" fill="none" stroke="#f2c443" stroke-width="6"/></g></svg>
        <div class="x-p"><b>More frequent</b> collisions<br>${ARR} faster reaction</div></div>
      <div class="card" style="left:690px;top:300px;width:540px;height:460px" data-at="2"><h3><small>2</small><span class="warm">Enough energy</span></h3>
        <svg style="position:absolute;left:0;top:100px" width="540" height="250"><path class="c2h" d="${HILL}" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linecap="round"/>
          <line x1="270" y1="210" x2="270" y2="84" stroke="#f3a764" stroke-width="5" stroke-dasharray="9 8"/><text x="286" y="160" font-size="38" font-weight="900" class="f-warm">${EA}</text>
          <g class="c2b">${ball(0, 0, 24, 'warm')}</g></svg>
        <div class="x-p">at least ${EAh}, to start<br><b>breaking bonds</b></div></div>
      <div class="card" style="left:1260px;top:300px;width:540px;height:460px" data-at="3"><h3 style="font-size:37px"><small>3</small><span class="teal">Correct orientation</span></h3>
        <svg style="position:absolute;left:0;top:100px" width="540" height="250"><g class="c3a"><g transform="translate(-34 0)">${ball(0, 0, 30, 'gray')}</g><g transform="translate(26 0)">${ball(0, 0, 30, 'pur')}</g></g>
          <g class="c3b"><g transform="translate(-26 0)">${ball(0, 0, 30, 'teal')}</g><g transform="translate(34 0)">${ball(0, 0, 30, 'gray')}</g></g>
          <g class="c3k" style="opacity:0">${tickG(270, 50)}</g></svg>
        <div class="x-p">so the <b>right atoms</b><br>meet</div></div>
      <div class="card" style="left:120px;top:800px;width:1680px;height:130px" data-at="4">
        <svg style="position:absolute;left:0;top:0" width="900" height="130">${Array.from({ length: 20 }, (_, i) => `<circle cx="${60 + i * 40}" cy="65" r="14" fill="${i === 6 || i === 15 ? GOOD : GRAY}" data-at="4@${0.05 + i * 0.02}" data-fx="pop"/>`).join('')}</svg>
        <div style="position:absolute;left:900px;top:20px;font-size:38px;font-weight:900;line-height:1.2;white-space:nowrap" data-at="4@0.4" data-fx="fade">Only a <span class="good">small fraction</span> meets both</div>
        <div style="position:absolute;left:900px;top:70px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap" data-at="5" data-fx="fade">most collisions just bounce off</div></div>`,
    update(c) {
      const b = c.b, t = c.t
      // 1: two particles meet
      const m = eio(c.seg(b[1].start + 0.4, b[1].start + 1.6))
      pos(c, '.c1a', lerp(80, 226, m), 120); pos(c, '.c1b', lerp(460, 314, m), 120)
      const fl = c.seg(b[1].start + 1.55, b[1].start + 2.3)
      c.$('.c1s').style.opacity = fl > 0 && fl < 1 ? 1 - fl : 0
      pos(c, '.c1s', 270, 120, ` scale(${1 + 2 * fl})`)
      // 2: a particle climbs over the energy hill
      const h = c.$('.c2h'), L = h.getTotalLength(), q = eio(c.seg(b[2].start + 0.6, b[2].end + 0.4))
      const pt = h.getPointAtLength(L * lerp(0.02, 0.98, q))
      pos(c, '.c2b', pt.x, pt.y - 26)
      // 3: one molecule turns so the right ends meet
      const r = eio(c.seg(b[3].start + 0.3, b[3].start + 1.8))
      pos(c, '.c3a', lerp(110, 210, r), 120, ` rotate(${lerp(90, 0, r)})`)
      pos(c, '.c3b', lerp(430, 330, r), 120)
      c.$('.c3k').style.opacity = c.seg(b[3].start + 1.8, b[3].start + 2.2)
      void t
    },
  })

  // ---------- orientation in NO + O3 ----------
  // panel coordinates (each panel svg is 810 x 420); O3 sits at the right, NO arrives from the left
  const O3 = [[470, 250], [530, 205], [590, 250]]
  const panel = (k) => `<g class="${k}N">${ball(0, 0, 32, 'pur', 'N', 30)}</g><g class="${k}O">${ball(0, 0, 30, 'red', 'O', 28)}</g>
    ${O3.map((_, i) => `<g class="${k}o${i}">${ball(0, 0, 30, 'red', 'O', 28)}</g>`).join('')}`
  const lab = (cls, txt) => `<text class="${cls}" text-anchor="middle" font-size="36" font-weight="900">${txt}</text>`
  const lsub = (b, s) => `${b}<tspan dy=".28em" font-size=".64em">${s}</tspan>`
  EZ.scene('orient', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Orientation</div><h2 class="h1" data-at="in+0.2">The right atoms must meet</h2>
      <div class="x-eq" data-at="0@0.2">NO + O<sub>3</sub> ${ARR} NO<sub>2</sub> + O<sub>2</sub></div>
      <div class="card" style="left:120px;top:380px;width:810px;height:440px;border-color:rgba(76,199,129,.6)" data-at="1"><h3 class="good">N end hits an end O</h3>
        <svg style="position:absolute;left:0;top:0" width="810" height="440">${panel('r')}
          ${lab('rl1', 'NO')}${lab('rl2', lsub('O', '3'))}${lab('rl3', lsub('NO', '2'))}${lab('rl4', lsub('O', '2'))}
          <text x="405" y="410" text-anchor="middle" font-size="30" font-weight="900" class="f-good" data-at="2@0.2" data-fx="fade">new N–O bond, O–O bond breaks</text>
          <g class="rk" style="opacity:0">${tickG(750, 56, 1.2)}</g></svg></div>
      <div class="card" style="left:990px;top:380px;width:810px;height:440px;border-color:rgba(240,112,122,.6)" data-at="3"><h3 class="bad">O end hits</h3>
        <svg style="position:absolute;left:0;top:0" width="810" height="440">${panel('w')}
          ${lab('wl1', 'NO')}${lab('wl2', lsub('O', '3'))}
          <text x="405" y="410" text-anchor="middle" font-size="30" font-weight="900" class="f-bad" data-at="3@0.7" data-fx="fade">no O atom transferred</text>
          <g class="wk" style="opacity:0">${crossG(750, 56, 1.2)}</g></svg></div>
      <div class="banner" style="top:860px;font-size:44px" data-at="4" data-fx="pop">More than enough energy, no reaction? <span data-at="5" data-fx="fade">${ARR} <span class="teal">incorrect orientation</span></span></div>`,
    update(c) {
      const b = c.b
      // right way: N leads, hits the left end O of O3, which leaves with it
      const a = eio(c.seg(b[1].start + 0.2, b[1].start + 1.8)), nx = lerp(160, 408, a)
      const p = eio(c.seg(b[2].start + 0.2, b[2].start + 1.6))
      const dx = -70 * p, dy = 20 * p, ox = 100 * p, oy = -25 * p
      pos(c, '.rN', nx + dx, 250 + dy); pos(c, '.rO', nx - 62 + dx, 250 + dy)
      pos(c, '.ro0', 470 + dx, 250 + dy); pos(c, '.ro1', 530 + ox, 205 + oy); pos(c, '.ro2', 590 + ox, 250 + oy)
      const sw = c.seg(b[2].start + 0.6, b[2].start + 1.1)
      pos(c, '.rl1', nx - 31, 345); c.$('.rl1').style.opacity = 1 - sw
      pos(c, '.rl2', 530, 345); c.$('.rl2').style.opacity = 1 - sw
      pos(c, '.rl3', 408 - 31 + dx, 345 + dy); c.$('.rl3').style.opacity = sw
      pos(c, '.rl4', 560 + ox, 345 + oy); c.$('.rl4').style.opacity = sw
      c.$('.rk').style.opacity = c.seg(b[2].start + 1.4, b[2].start + 1.8)
      // wrong way: O leads, touches the end O, and NO bounces back
      const w = eio(c.seg(b[3].start + 0.3, b[3].start + 1.6)), back = eio(c.seg(b[3].start + 1.7, b[3].start + 2.8))
      const fx = lerp(160, 410, w) - 230 * back
      pos(c, '.wO', fx, 250); pos(c, '.wN', fx - 64, 250)
      O3.forEach(([x, y], i) => pos(c, '.wo' + i, x, y))
      pos(c, '.wl1', fx - 32, 345); pos(c, '.wl2', 530, 345)
      c.$('.wk').style.opacity = c.seg(b[3].start + 1.7, b[3].start + 2.1)
    },
  })

  // ---------- temperature: the energy distribution ----------
  const G = mk(220, 900, 1000, 500)
  EZ.scene('temp', {
    html: `<svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade"><line x1="220" y1="330" x2="220" y2="900" class="x-ax"/><line x1="220" y1="900" x2="1236" y2="900" class="x-ax"/>
          <text x="728" y="960" class="x-axl">Kinetic energy →</text>
          <text transform="translate(170 620) rotate(-90)" class="x-axl">Fraction of particles</text></g>
        <path class="tl1" d="${G.tail(1)}" style="fill:#8d8df0;opacity:0"/>
        <path class="tl2" d="${G.tail(2)}" style="fill:#f3a764;opacity:0"/>
        <path class="cv1" d="${G.curve(1)}" fill="none" stroke="#8d8df0" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1"/>
        <path class="cv2" d="${G.curve(2)}" fill="none" stroke="#f3a764" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1"/>
        <g data-at="2" data-fx="fade"><line x1="${G.X(EAV)}" y1="900" x2="${G.X(EAV)}" y2="350" stroke="#eef0f7" stroke-width="4" stroke-dasharray="12 10"/>
          <text x="${G.X(EAV) + 16}" y="380" font-size="44" font-weight="900">${EA}</text></g>
        <text x="${G.X(0.75)}" y="${G.Y(PEAK) - 22}" text-anchor="middle" font-size="34" font-weight="900" class="f-pri" data-at="1@0.6" data-fx="fade">lower T</text>
        <text x="${G.X(2.6) + 20}" y="${G.Y(f(2.6, 2)) - 26}" font-size="34" font-weight="900" class="f-warm" data-at="3@0.4" data-fx="fade">higher T</text>
        <g data-at="2@0.5" data-fx="fade"><line x1="${G.X(6.6)}" y1="760" x2="${G.X(5.4)}" y2="${G.Y(f(5.4, 1)) - 10}" stroke="#eef0f7" stroke-width="4" marker-end="url(#mk-text)"/>
          <text x="${G.X(6.6)}" y="740" text-anchor="middle" font-size="30" font-weight="800">enough energy to react</text></g>
      </svg>
      <div class="kicker warm" style="left:1360px;top:150px" data-at="in" data-fx="right">Temperature</div>
      <div style="position:absolute;left:1360px;top:212px;width:480px;font-size:50px;font-weight:900;line-height:1.08" data-at="0" data-fx="right">Why heat helps<br>so much</div>
      ${note(370, '1', PUR, 'Spread of energies', 'Maxwell–Boltzmann distribution')}
      ${note(482, '2', '#eef0f7', 'Tail past ' + EAh, 'enough energy to react')}
      ${note(594, '3', WARM, 'Higher T', 'a much larger fraction has E ≥ ' + EAh)}
      ${note(706, '4', GOOD, 'Modest T increase', 'the rate speeds up dramatically')}
      ${note(818, '5', GOOD, '+10 °C', 'often roughly doubles the rate')}`,
    update(c) {
      const b = c.b
      c.$('.cv1').setAttribute('stroke-dashoffset', 1 - eio(c.seg(b[1].start + 0.2, b[1].start + 2.2)))
      c.$('.cv2').setAttribute('stroke-dashoffset', 1 - eio(c.seg(b[3].start + 0.3, b[3].start + 2.3)))
      c.$('.tl1').style.opacity = 0.55 * c.seg(b[2].start + 0.3, b[2].start + 1)
      c.$('.tl2').style.opacity = 0.35 * c.seg(b[3].start + 1.6, b[3].start + 2.4)
    },
  })

  // ---------- hit it hard, hit it right ----------
  const rows = [
    ['1', TEAL, 'Concentration ↑', 'frequency of collisions ↑', ''],
    ['2', WARM, 'Temperature ↑', `frequency ↑ <b class="warm">and</b> fraction with E ≥ ${EAh} ↑`, 'bigger effect'],
    ['3', PUR, 'Catalyst', `lower ${EAh}, so a bigger fraction qualifies`, ''],
  ]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">“Hit it hard, hit it right”</h2>
      <div class="x-hh" style="left:120px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="1@0.1" data-fx="pop"><b class="warm">Hit it hard</b><span>= energy ≥ ${EAh}</span></div>
      <div class="x-hh" style="left:990px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="1@0.55" data-fx="pop"><b class="teal">Hit it right</b><span>= orientation</span></div>
      <div class="x-sub" data-at="2" data-fx="fade">On FRQs: name which requirement changes</div>
      ${rows.map(([n, col, l, r, big], i) => `<div class="x-row" style="top:${520 + i * 140}px" data-at="${i + 3}">
        <div class="n" style="background:${col}">${n}</div><div class="lb">${l}</div><div class="to">${ARR}</div>
        <div class="rs" data-at="${i + 3}@0.45" data-fx="fade">${r}</div>${big ? `<div class="x-big" data-at="4@0.8" data-fx="pop">${big}</div>` : ''}</div>`).join('')}`,
  })

  // ---------- try it ----------
  const OPTS = ['the activation energy decreases', `a greater fraction of collisions have energy ≥ ${EAh}`, 'the particles become larger', 'the orientation of every collision improves']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px" data-at="1">Raising the temperature increases the rate <span class="teal">mainly because…</span></h2>
      ${OPTS.map((o, i) => `<div class="x-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? `<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px;font-size:44px" data-at="8" data-fx="pop">Higher T ${ARR} a <span class="teal">greater fraction</span> of collisions reaches the transition state</div>
      <div class="x-pb" data-at="9" data-fx="pop">${EAh}&nbsp;itself doesn’t change</div>`,
    update(c) {
      const b = c.b, t0 = b[6].start + 0.3, t1 = b[7].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[7].start + 0.4, b[7].start + 0.85))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${ball(150, 110, 32, 'gray')}${ball(212, 110, 32, 'pur')}${ball(270, 110, 32, 'teal')}${ball(332, 110, 32, 'gray')}
    <circle cx="241" cy="110" r="14" fill="none" stroke="#f2c443" stroke-width="5"/>${tickG(400, 40)}</svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${Array.from({ length: 24 }, (_, i) => `<circle cx="${60 + (i % 8) * 49}" cy="${45 + Math.floor(i / 8) * 60}" r="16" fill="${i === 10 ? GOOD : GRAY}"/>`).join('')}</svg>`
  const S = mk(30, 190, 400, 160)
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="${S.tail(2)}" style="fill:#f3a764;opacity:.4"/><path d="${S.tail(1)}" style="fill:#8d8df0;opacity:.6"/>
    <path d="${S.curve(1)}" fill="none" stroke="#8d8df0" stroke-width="5"/><path d="${S.curve(2)}" fill="none" stroke="#f3a764" stroke-width="5"/>
    <line x1="${S.X(EAV)}" y1="190" x2="${S.X(EAV)}" y2="40" stroke="#eef0f7" stroke-width="3" stroke-dasharray="7 6"/><text x="${S.X(EAV) + 8}" y="56" font-size="28" font-weight="900">${EA}</text>
    <line x1="30" y1="190" x2="440" y2="190" stroke="#c9cee0" stroke-width="3"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Success needs<br><span class="warm">energy ≥ ${EAh}</span><br>AND the correct<br><span class="teal">orientation</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Only a<br><span class="good">small fraction</span><br>of collisions<br>succeed</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p><span class="warm">Higher T</span>:<br>a much larger<br>fraction has<br>E ≥ ${EAh}</p></div>`,
  })
})()
