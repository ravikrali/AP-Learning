// Pictures for chem-5.11 "Catalysis". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u5.ts, book.ts). The energy profiles
// follow the lesson's diagram (energy-profile-catalyst) and carry no numbers: heights are drawn in
// the right order only.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .k-ax{stroke:#c9cee0;stroke-width:4;stroke-linecap:round}
    .k-axl{font-size:30px;font-weight:800;fill:var(--muted)!important;text-anchor:middle}
    .k-curve{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .k-note{position:absolute;left:1360px;width:470px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .k-note i{position:absolute;left:22px;top:28px;width:46px;height:46px;border-radius:50%}
    .k-note b{display:block;font-size:31px;font-weight:900;line-height:1.15} .k-note span{display:block;font-size:26px;font-weight:700;color:var(--muted)}
    .k-big{position:absolute;font-size:120px;font-weight:900;line-height:1}
    .k-barlab{position:absolute;font-size:28px;font-weight:800;color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
    .k-track{position:absolute;height:44px;border-radius:22px;background:#2c3145;overflow:hidden}
    .k-track i{position:absolute;left:0;top:0;bottom:0;border-radius:22px}
    .k-chip{position:absolute;padding:14px 30px;border-radius:20px;font-size:38px;font-weight:900;border:3px solid;white-space:nowrap}
    .k-ask{position:absolute;left:0;width:1920px;text-align:center;font-size:52px;font-weight:900}
    .k-eq{position:absolute;left:980px;width:820px;height:100px;padding:0 26px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);display:flex;align-items:center;gap:16px;font-size:33px;font-weight:900;white-space:nowrap}
    .k-eq small{flex:none;width:118px;font-size:22px;line-height:1.15;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .k-c{position:relative} .k-x{position:absolute;left:-6px;right:-6px;top:52%;height:6px;border-radius:3px;background:var(--bad)}
    .k-ways{position:absolute;right:120px;top:130px;display:flex;gap:14px}
    .k-ways div{padding:8px 22px;border-radius:16px;background:var(--surface2);border:2px solid var(--line);font-size:26px;font-weight:800;color:var(--muted)}
    .k-ways .on{color:var(--text);border-color:var(--primary);background:rgba(141,141,240,.22)}
    .k-box{position:absolute;top:470px;height:120px;padding:0 30px;border-radius:26px;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:900;border:3px solid;background:rgba(36,40,56,.92);white-space:nowrap}
    .k-no{position:absolute;left:120px;width:820px;height:100px;padding-left:100px;border-radius:24px;background:rgba(36,40,56,.92);border:3px solid;display:flex;align-items:center;font-size:36px;font-weight:900;white-space:nowrap}
    .k-no svg{position:absolute;left:24px;top:22px;width:56px;height:56px}
    .k-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:34px;font-weight:800;line-height:1.2}
    .k-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .k-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .k-pillbox{position:absolute;top:850px;width:810px;height:110px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;white-space:nowrap}
    .k-rc{top:320px;width:540px;height:560px;text-align:center} .k-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .k-rc svg{display:block;margin:14px auto 0} .k-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // smooth energy profile through points, flat at each point (same curve as the app's diagram)
  const pp = (pts) => { let d = `M${pts[0][0]} ${pts[0][1]}`
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2; d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}` }
    return d }
  const EA = (cls = '') => `<tspan class="${cls}">E</tspan><tspan class="${cls}" dy="9" font-size=".68em">a</tspan>`
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const CROSS = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></svg>'
  const TICK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- the main energy profile (pathway scene) ----------
  const R = 640, P = 780
  const UN = [[230, R], [420, R], [660, 340], [1130, P], [1220, P]]
  const CA = [[230, R], [420, R], [620, 520], [725, 610], [820, 565], [970, P], [1220, P]]
  const note = (i, at, color, a, b) => `<div class="k-note" style="top:${300 + i * 124}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`

  // ---------- intro artwork: faint profiles at the left and right edges ----------
  const miniProf = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="${pp([[0, 130], [70, 130], [180, 10], [320, 175], [360, 175]])}" class="k-curve" stroke="#8d8df0" stroke-width="7" stroke-dasharray="14 12"/>
      <path d="${pp([[0, 130], [70, 130], [150, 75], [190, 102], [225, 92], [275, 175], [360, 175]])}" class="k-curve" stroke="#3cc7bc" stroke-width="8"/></g>`
  EZ.intro = {
    chips: [['1@0.4', 'Lower E<sub>a</sub>'], ['1@0.6', 'Same ΔH'], ['1@0.85', 'Three types']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${miniProf(-30, 360, 1.05)}${miniProf(1560, 600, 1.05)}</svg>`,
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The secret</div><h2 class="h1" data-at="0">Fast reactions, at body temperature</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:370px" data-at="0@0.2"><h3>In your body</h3>
        <div class="k-big warm" style="left:40px;top:110px;font-size:96px">37 °C</div>
        <div class="k-barlab" style="left:40px;top:236px">reaction progress</div>
        <div class="k-track" style="left:40px;top:280px;width:560px"><i class="fb" style="background:linear-gradient(90deg,#1b7f77,#3cc7bc)"></i></div>
        <div style="position:absolute;left:624px;top:276px;font-size:40px;font-weight:900" class="teal" data-at="0@0.85" data-fx="pop">done!</div>
        <div class="k-chip" style="left:400px;top:118px;font-size:34px;padding:10px 24px;border-color:var(--accent);background:rgba(60,199,188,.14)" data-at="2@0.3" data-fx="pop"><span class="teal">enzymes</span>: catalysts</div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:370px" data-at="1"><h3>In a test tube</h3>
        <div class="k-big muted" style="left:40px;top:110px;font-size:96px">same reactions</div>
        <div class="k-barlab" style="left:40px;top:236px">reaction progress</div>
        <div class="k-track" style="left:40px;top:280px;width:560px"><i class="sb" style="background:#7d859c"></i></div>
        <div style="position:absolute;left:624px;top:276px;font-size:40px;font-weight:900" class="muted" data-at="1@0.6" data-fx="pop">years…</div></div>
      <div class="card" style="left:120px;top:715px;width:1680px;height:150px" data-at="3">
        <svg style="position:absolute;left:0;top:0" width="1680" height="150" viewBox="0 0 1680 150">
          <text x="40" y="86" font-size="34" font-weight="900" class="f-muted">car exhaust</text>
          <line x1="250" y1="75" x2="1290" y2="75" stroke="#646c82" stroke-width="26" stroke-linecap="round"/>
          <g class="dirty">${[0, 1, 2].map((i) => `<circle cx="${300 + i * 120}" cy="75" r="${26 - i * 3}" fill="#5a5f70"/>`).join('')}</g>
          <rect x="620" y="22" width="440" height="106" rx="26" fill="rgba(242,196,67,.16)" stroke="#f2c443" stroke-width="4"/>
          <text x="840" y="88" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">catalytic converter</text>
          <g class="clean">${[0, 1, 2].map((i) => `<circle cx="${1130 + i * 120}" cy="75" r="${22 - i * 3}" fill="#3cc7bc" opacity=".55"/>`).join('')}</g>
          <text x="1640" y="86" text-anchor="end" font-size="34" font-weight="900" class="f-teal">cleaner</text>
        </svg></div>
      <div class="k-ask" style="top:905px" data-at="4" data-fx="pop">So what is <span class="pri">the trick</span>?</div>`,
    update(c) {
      const b = c.b
      c.$('.fb').style.width = 100 * eio(c.seg(b[0].start + 0.6, b[0].start + 2.0)) + '%'
      c.$('.sb').style.width = 4 * eo(c.seg(b[1].start + 0.3, b[1].end)) + '%'
      // puffs drift along the pipe and fade before they reach the converter box or the label
      c.root.querySelectorAll('.dirty circle, .clean circle').forEach((el, i) => {
        const clean = el.parentNode.classList.contains('clean'), k = (c.t * 0.25 + (i % 3) / 3) % 1
        el.setAttribute('cx', (clean ? 1110 : 290) + k * 300)
        el.style.opacity = Math.sin(Math.PI * k) * (clean ? 0.6 : 1)
      })
    },
  })

  // ---------- a new, lower pathway ----------
  EZ.scene('pathway', {
    html: `<div class="kicker" data-at="in" data-fx="left">How catalysts work</div><h2 class="h1" data-at="0">A new, lower path</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.2" data-fx="fade">
          <line x1="200" y1="300" x2="200" y2="930" class="k-ax"/><line x1="200" y1="930" x2="1240" y2="930" class="k-ax"/>
          <text transform="translate(150 615) rotate(-90)" class="k-axl">Potential energy</text>
          <text x="720" y="985" class="k-axl">Reaction coordinate</text>
          <text x="325" y="690" text-anchor="middle" font-size="32" font-weight="900">reactants</text>
          <text x="1110" y="830" text-anchor="middle" font-size="32" font-weight="900">products</text>
        </g>
        <g class="ung">
          <path d="${pp(UN)}" class="k-curve" stroke="#8d8df0" stroke-width="9" data-at="0@0.4" data-fx="draw" data-dur="1.6"/>
          <text x="660" y="310" text-anchor="middle" font-size="32" font-weight="900" class="f-pri" data-at="0@0.85" data-fx="fade">without a catalyst</text>
          <g data-at="1@0.45" data-fx="fade"><line x1="420" y1="${R}" x2="690" y2="${R}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="10 10"/>
            <line x1="660" y1="${R - 6}" x2="660" y2="352" stroke="#f3a764" stroke-width="7" marker-end="url(#mk-warm)"/>
            <text x="674" y="486" font-size="44" font-weight="900" class="f-warm">${EA('f-warm')}</text></g>
        </g>
        <path d="${pp(CA)}" class="k-curve" stroke="#3cc7bc" stroke-width="10" data-at="2@0.3" data-fx="draw" data-dur="1.8"/>
        <path d="${pp(CA)}" class="catpath" fill="none" stroke="none"/>
        <text x="730" y="692" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="2@0.6" data-fx="fade">with a catalyst</text>
        <g data-at="2@0.75" data-fx="fade"><line x1="620" y1="${R - 6}" x2="620" y2="532" stroke="#3cc7bc" stroke-width="7" marker-end="url(#mk-teal)"/>
          <text x="606" y="604" text-anchor="end" font-size="40" font-weight="900" class="f-teal">${EA('f-teal')}</text></g>
        <g class="dot"><circle r="24" fill="#3cc7bc" opacity=".3"/><circle r="12" fill="#fff"/></g>
        <g data-at="5" data-fx="fade" class="ends"><line x1="230" y1="${R}" x2="420" y2="${R}" stroke="#f2c443" stroke-width="14" stroke-linecap="round" opacity=".8"/>
          <line x1="970" y1="${P}" x2="1220" y2="${P}" stroke="#f2c443" stroke-width="14" stroke-linecap="round" opacity=".8"/></g>
        <g data-at="6" data-fx="fade"><line x1="1080" y1="${R}" x2="1200" y2="${R}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="10 10"/>
          <line x1="1160" y1="${R + 4}" x2="1160" y2="${P - 12}" stroke="#f2c443" stroke-width="7" marker-end="url(#mk-gold)"/>
          <text x="1176" y="724" font-size="38" font-weight="900" class="f-gold">ΔH</text></g>
      </svg>
      ${note(0, '2@0.5', '#3cc7bc', 'New pathway', 'with a lower E<sub>a</sub>')}
      ${note(1, '3', '#3cc7bc', 'More humps', 'more steps')}
      ${note(2, '5', '#f2c443', 'Same ends', 'reactants and products')}
      ${note(3, '6', '#f2c443', 'ΔH', 'does not change')}
      ${note(4, '7', '#8d8df0', 'More effective', 'collisions')}`,
    update(c) {
      const b = c.b
      c.$('.ung').style.opacity = 1 - 0.6 * c.seg(b[2].start, b[2].start + 0.6)
      const path = c.$('.catpath'), L = path.getTotalLength()
      const t0 = b[3].start + 0.2, t1 = b[3].end + 0.2, p = eio(c.seg(t0, t1))
      const pt = path.getPointAtLength(p * L)
      c.$('.dot').setAttribute('transform', `translate(${pt.x} ${pt.y})`)
      c.$('.dot').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.4))
    },
  })

  // ---------- used, then regenerated ----------
  EZ.scene('cycle', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Not consumed</div><h2 class="h1" data-at="0">Used, then regenerated</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:620px" data-at="0@0.3"><h3>One catalyst, start to finish</h3></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.5" data-fx="fade">
        <text class="s1 f-warm" x="510" y="440" text-anchor="middle" font-size="32" font-weight="900">early (slow) step: used</text>
        <text class="s2 f-teal" x="510" y="440" text-anchor="middle" font-size="32" font-weight="900">later step: regenerated</text>
        <g class="cat">${ball(0, 0, 50, 'gold')}</g>
        <g class="rx"><g class="rt">${ball(0, 0, 50, 'teal')}</g><g class="rp">${ball(0, 0, 50, 'warm')}</g></g>
        <text class="lr f-teal" text-anchor="middle" font-size="30" font-weight="900">reactant</text>
        <text class="lp f-warm" text-anchor="middle" font-size="30" font-weight="900">product</text>
        <text class="lc f-gold" text-anchor="middle" font-size="30" font-weight="900">catalyst</text>
        <text class="li f-gold" x="596" y="660" text-anchor="middle" font-size="30" font-weight="900">intermediate</text>
      </g></svg>
      <div class="k-eq" style="top:310px" data-at="2@0.05" data-fx="right"><small>Early<br>step</small>reactant + <span class="k-c gold">catalyst<i class="k-x" data-at="3@0.3" data-fx="grow" data-dur="0.35"></i></span> ${ARR} intermediate</div>
      <div class="k-eq" style="top:430px" data-at="2@0.55" data-fx="right"><small>Later<br>step</small>intermediate ${ARR} product + <span class="k-c gold">catalyst<i class="k-x" data-at="3@0.4" data-fx="grow" data-dur="0.35"></i></span></div>
      <div class="k-eq" style="top:560px;border-color:var(--accent)" data-at="3@0.6" data-fx="right"><small>Overall</small>reactant ${ARR} product <span class="muted" style="font-size:26px;margin-left:auto">no catalyst</span></div>
      <div class="k-eq" style="top:690px;border-color:var(--good);background:rgba(76,199,129,.12)" data-at="4@0.5" data-fx="pop">Net amount of catalyst: <span class="good">constant</span></div>
      <div class="k-eq" style="top:820px;border-color:var(--primary);background:rgba(141,141,240,.14)" data-at="5@0.3" data-fx="pop">In the slow step? It can be in the <span class="pri">rate law</span></div>`,
    update(c) {
      const b = c.b, b1 = b[1], d1 = b1.end - b1.start
      const aEnd = b1.start + 0.45 * d1, bStart = b1.start + 0.55 * d1
      const pA = eio(c.seg(b1.start + 0.2, aEnd)), pB = eio(c.seg(bStart, b1.end + 0.3))
      const CX = 640, CY = 560
      let x = lerp(300, CX - 100, pA), y = CY
      if (pB > 0) { x = lerp(CX - 100, 340, pB); y = lerp(CY, 780, pB) }
      c.$('.cat').setAttribute('transform', `translate(${CX} ${CY})`)
      c.$('.rx').setAttribute('transform', `translate(${x} ${y})`)
      const toProd = c.seg(bStart, bStart + 0.4)
      c.$('.rt').style.opacity = 1 - toProd; c.$('.rp').style.opacity = toProd
      const bound = clamp((pA - 0.75) / 0.25) * (1 - c.seg(bStart, bStart + 0.25))
      const lr = c.$('.lr'); lr.setAttribute('x', x); lr.setAttribute('y', y + 90); lr.style.opacity = 1 - clamp((pA - 0.3) / 0.3)
      const lp = c.$('.lp'); lp.setAttribute('x', x); lp.setAttribute('y', y + 90); lp.style.opacity = c.seg(bStart + 0.3, bStart + 0.6)
      const lc = c.$('.lc'); lc.setAttribute('x', CX); lc.setAttribute('y', CY + 90); lc.style.opacity = pB > 0 ? c.seg(bStart + 0.2, bStart + 0.5) : 1 - clamp((pA - 0.3) / 0.3)
      c.$('.li').style.opacity = bound
      c.$('.s1').style.opacity = c.seg(b1.start, b1.start + 0.3) * (1 - c.seg(bStart - 0.2, bStart))
      c.$('.s2').style.opacity = c.seg(bStart, bStart + 0.3)
    },
  })

  // ---------- the three ways ----------
  const ways = (on) => `<div class="k-ways" data-at="in" data-fx="fade">${['1 Binding', '2 Acid–base', '3 Surface'].map((w, i) => `<div class="${i === on ? 'on' : ''}">${w}</div>`).join('')}</div>`
  const patchBall = (r, g) => `${ball(0, 0, r, g)}<circle cx="${r * 0.6}" cy="0" r="${r * 0.26}" fill="#fff" opacity=".9"/>`
  EZ.scene('binding', {
    html: `<div class="kicker" data-at="in" data-fx="left">Way 1</div>${ways(0)}<h2 class="h1" data-at="1">Binding and orienting</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">
          <rect x="600" y="650" width="720" height="250" rx="60" fill="url(#g-pur)"/>
          <circle cx="860" cy="650" r="62" fill="#0e1018"/><circle cx="1060" cy="650" r="62" fill="#0e1018"/>
          <text x="960" y="830" text-anchor="middle" font-size="46" font-weight="900" class="f-dark">enzyme</text>
        </g>
        <g class="pair"><line class="bond" x1="860" y1="650" x2="1060" y2="650" stroke="#eef0f7" stroke-width="12"/>
          <g class="ra"><g class="rar">${patchBall(56, 'teal')}</g></g><g class="rb"><g class="rbr">${patchBall(56, 'warm')}</g></g></g>
        <text x="960" y="545" text-anchor="middle" font-size="36" font-weight="900" class="f-teal" data-at="2@0.75" data-out="4" data-fx="fade">favorable orientation</text>
        <g data-at="3@0.35" data-fx="fade"><line x1="1400" y1="700" x2="1132" y2="668" stroke="#f3a764" stroke-width="5" marker-end="url(#mk-warm)"/>
          <text x="1412" y="714" font-size="34" font-weight="900" class="f-warm">active site</text><text x="1412" y="756" font-size="28" font-weight="800" class="f-muted">binds specific reactants</text></g>
        <text x="960" y="545" text-anchor="middle" font-size="36" font-weight="900" class="f-gold" data-at="4@0.1" data-out="5" data-fx="fade">catalyst–reactant intermediate</text>
        <text x="1480" y="320" text-anchor="middle" font-size="36" font-weight="900" class="f-pri" data-at="5@0.55" data-fx="fade">product</text>
        <text x="960" y="560" text-anchor="middle" font-size="36" font-weight="900" class="f-teal" data-at="5@0.75" data-fx="fade">free to work again</text>
      </svg>`,
    update(c) {
      const b = c.b, t = c.t, tb = b[2].start + 0.2, te = b[2].start + 0.7 * (b[2].end - b[2].start)
      const p = eio(c.seg(tb, te)), drift = Math.min(t, tb) - c.sc.start
      const ax = lerp(330, 860, p), ay = lerp(430, 650, p), bx = lerp(1590, 1060, p), by = lerp(430, 650, p)
      const aa = lerp(150 + 22 * drift, 360, p), ab = lerp(30 - 22 * drift, 180, p)
      const tl = b[5].start + 0.3, q = eio(c.seg(tl, tl + 1.4))
      c.$('.ra').setAttribute('transform', `translate(${ax} ${ay})`); c.$('.rb').setAttribute('transform', `translate(${bx} ${by})`)
      c.$('.rar').setAttribute('transform', `rotate(${aa})`); c.$('.rbr').setAttribute('transform', `rotate(${ab})`)
      c.$('.bond').style.opacity = c.seg(b[5].start, b[5].start + 0.3)
      c.$('.pair').setAttribute('transform', `translate(${520 * q} ${-250 * q})`)
      c.$('.pair').style.opacity = c.seg(c.sc.start + 0.3, c.sc.start + 0.8)
    },
  })

  EZ.scene('acidbase', {
    html: `<div class="kicker" data-at="in" data-fx="left">Way 2</div>${ways(1)}<h2 class="h1" data-at="0">Acid–base catalysis</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="420" y="350" text-anchor="middle" font-size="36" font-weight="900" class="f-gold" data-at="1@0.4" data-fx="fade">gains or loses a proton</text>
        <g data-at="0@0.3" data-fx="pop"><g transform="translate(420 600)">${ball(0, 0, 84, 'teal')}</g></g>
        <g class="hp"><g>${ball(0, 0, 36, 'gold', sup('H', '+'), 30)}</g></g>
        <text x="420" y="740" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="0@0.5" data-out="2" data-fx="fade">reactant</text>
        <text x="420" y="740" text-anchor="middle" font-size="32" font-weight="900" class="f-gold" data-at="2@0.1" data-fx="fade">new intermediate</text>
        <circle class="ring" cx="440" cy="580" r="130" fill="none" stroke="#f2c443" stroke-width="5"/>
      </svg>
      <div class="k-box" style="left:780px;border-color:var(--accent)" data-at="2@0.4" data-fx="pop">reactant</div>
      <div class="k-box" style="left:1120px;border-color:var(--gold)" data-at="2@0.6" data-fx="pop">intermediate</div>
      <div class="k-box" style="left:1550px;border-color:var(--warm)" data-at="3@0.55" data-fx="pop">products</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.5" data-fx="fade"><line x1="1010" y1="530" x2="1102" y2="530" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/></g>
        <g data-at="3@0.4" data-fx="fade"><line x1="1442" y1="530" x2="1532" y2="530" stroke="#3cc7bc" stroke-width="6" marker-end="url(#mk-teal)"/></g>
        <text x="1330" y="680" text-anchor="middle" font-size="36" font-weight="900" class="f-teal" data-at="3@0.4" data-fx="fade">new elementary steps</text>
      </svg>
      <div class="banner" style="top:800px" data-at="3@0.75" data-fx="pop">A new intermediate opens <span class="teal">a different route</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[1].start + 0.4, b[1].start + 1.6))
      c.$('.hp').setAttribute('transform', `translate(${lerp(200, 500, p)} ${lerp(420, 512, p)})`)
      c.$('.hp').style.opacity = c.seg(c.sc.start + 0.4, c.sc.start + 0.9)
      c.$('.ring').style.opacity = c.seg(b[2].start, b[2].start + 0.4) * 0.8
    },
  })

  const PT = [...Array.from({ length: 17 }, (_, i) => [300 + i * 82, 770]), ...Array.from({ length: 16 }, (_, i) => [341 + i * 82, 840])]
  EZ.scene('surface', {
    html: `<div class="kicker" data-at="in" data-fx="left">Way 3</div>${ways(2)}<h2 class="h1" data-at="0">Surface catalysis</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.4" data-fx="fade">${PT.map(([x, y]) => ball(x, y, 40, 'gray')).join('')}
          <text x="960" y="940" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">metal surface (like Pt)</text></g>
        <g class="mol"><line class="bond" x1="920" y1="0" x2="1000" y2="0" stroke="#eef0f7" stroke-width="12"/>
          <g class="ma">${ball(0, 0, 40, 'teal')}</g><g class="mb">${ball(0, 0, 40, 'warm')}</g></g>
        <text x="960" y="610" text-anchor="middle" font-size="36" font-weight="900" class="f-gold" data-at="2@0.2" data-out="3" data-fx="fade">bound intermediates</text>
        <text x="960" y="610" text-anchor="middle" font-size="36" font-weight="900" class="f-teal" data-at="3@0.2" data-out="4" data-fx="fade">new steps, lower ${EA('f-teal')}</text>
        <text x="1500" y="455" text-anchor="middle" font-size="36" font-weight="900" class="f-pri" data-at="4@0.6" data-fx="fade">product</text>
        <text x="960" y="680" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="4@0.7" data-fx="fade">ready for more</text>
      </svg>
      <div class="k-no" style="top:290px;width:780px;border-color:var(--good)" data-at="5@0.15" data-fx="pop">${TICK}does not heat the reactants</div>
      <div class="k-no" style="left:1020px;top:290px;width:780px;border-color:var(--good)" data-at="5@0.6" data-fx="pop">${TICK}is not consumed</div>`,
    update(c) {
      const b = c.b, f = eio(c.seg(b[1].start + 0.3, b[1].start + 1.5))
      const s = eio(c.seg(b[3].start + 0.2, b[3].start + 1.0)), u = eio(c.seg(b[4].start + 0.3, b[4].start + 1.6))
      let ax = lerp(700, 880, f), bx = lerp(1220, 1040, f), y = lerp(400, 690, f)
      ax = lerp(ax, 920, s); bx = lerp(bx, 1000, s)
      c.$('.ma').setAttribute('transform', `translate(${ax} 0)`); c.$('.mb').setAttribute('transform', `translate(${bx} 0)`)
      c.$('.bond').style.opacity = c.seg(b[3].start + 0.9, b[3].start + 1.2)
      c.$('.mol').setAttribute('transform', `translate(${540 * u} ${y - 170 * u})`)
      c.$('.mol').style.opacity = c.seg(b[1].start, b[1].start + 0.4)
    },
  })

  // ---------- the trap ----------
  const bars = (y, label, wNo, wCat) => `<text x="20" y="${y + 52}" font-size="32" font-weight="900">${label}</text>
    <rect x="190" y="${y}" width="${wNo}" height="38" rx="19" fill="#646c82"/><text x="210" y="${y + 28}" font-size="24" font-weight="900" class="f-dark">no catalyst</text>
    <rect x="190" y="${y + 50}" width="${wCat}" height="38" rx="19" fill="#3cc7bc"/><text x="210" y="${y + 78}" font-size="24" font-weight="900" class="f-dark">catalyst</text>
    <rect x="${190 + wCat + 6}" y="${y + 50}" width="${wNo - wCat - 6}" height="38" rx="19" fill="rgba(242,196,67,.15)" stroke="#f2c443" stroke-width="3" stroke-dasharray="8 6"/>
    <text x="${190 + wCat + (wNo - wCat) / 2}" y="${y + 126}" text-anchor="middle" font-size="26" font-weight="900" class="f-gold">same drop</text>`
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The trap</div><h2 class="h1" data-at="0">What a catalyst does not change</h2>
      <div class="k-no" style="top:320px;border-color:var(--bad)" data-at="1" data-fx="pop">${CROSS}more product-favored</div>
      <div class="k-no" style="top:440px;border-color:var(--bad)" data-at="2" data-fx="pop">${CROSS}changes ΔH</div>
      <div class="card" style="left:990px;top:320px;width:810px;height:440px" data-at="3"><h3>Activation energy</h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="340" viewBox="0 0 810 340">
          <g data-at="3@0.2" data-fx="fade">${bars(20, 'Forward', 400, 280)}</g>
          <g data-at="3@0.55" data-fx="fade">${bars(180, 'Reverse', 560, 440)}</g>
        </svg></div>
      <div class="k-no" style="top:580px;border-color:var(--good)" data-at="4@0.1" data-fx="pop">${TICK}forward and reverse: sped up alike</div>
      <div class="k-no" style="top:700px;border-color:var(--good)" data-at="4@0.6" data-fx="pop">${TICK}equilibrium position: unchanged</div>
      <div class="banner" style="top:840px" data-at="5" data-fx="pop">It just provides <span class="teal">a faster route</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = ['lowers ΔH', 'raises the energy of the products', 'provides a pathway with a lower activation energy', 'is used up as the reaction proceeds']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Adding a <span class="teal">catalyst</span> to a reaction…</h2>
      ${OPTS.map((o, i) => `<div class="k-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${330 + Math.floor(i / 2) * 160}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 2 ? CHECK : ''}<span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px" data-at="8" data-fx="pop">An alternative pathway with a <span class="teal">lower E<sub>a</sub></span></div>
      <div class="k-pillbox" style="left:120px;border-color:var(--gold);background:rgba(242,196,67,.12)" data-at="9" data-fx="pop">ΔH&nbsp;<span class="gold">unchanged</span></div>
      <div class="k-pillbox" style="left:990px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="9@0.6" data-fx="pop">Catalyst&nbsp;<span class="teal">regenerated</span></div>`,
    update(c) {
      const b = c.b, t0 = b[6].start + 0.3, t1 = b[7].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[7].start + 0.5, b[7].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="400" height="210" viewBox="0 0 400 210">
    <path d="${pp([[20, 150], [90, 150], [190, 30], [330, 185], [380, 185]])}" class="k-curve" stroke="#8d8df0" stroke-width="7" stroke-dasharray="14 12"/>
    <path d="${pp([[20, 150], [90, 150], [165, 100], [205, 125], [240, 115], [290, 185], [380, 185]])}" class="k-curve" stroke="#3cc7bc" stroke-width="9"/>
    <line x1="362" y1="152" x2="362" y2="176" stroke="#f2c443" stroke-width="5" marker-end="url(#mk-gold)"/><line x1="320" y1="150" x2="372" y2="150" stroke="#a3abbd" stroke-width="2" stroke-dasharray="6 6"/></svg>`
  const r2 = `<svg width="400" height="210" viewBox="0 0 400 210"><path d="M200 22 A 82 82 0 1 1 118 104" fill="none" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/>${ball(200, 104, 46, 'gold')}</svg>`
  const r3 = `<svg width="440" height="210" viewBox="0 0 440 210">
    <rect x="12" y="110" width="128" height="70" rx="20" fill="url(#g-pur)"/><circle cx="76" cy="110" r="26" fill="#1a1d2a"/>${ball(76, 104, 22, 'teal')}
    ${ball(220, 140, 38, 'teal')}${ball(250, 96, 20, 'gold', sup('H', '+'), 18)}
    ${[0, 1, 2, 3].map((i) => ball(318 + i * 34, 168, 17, 'gray')).join('')}${ball(352, 134, 17, 'teal')}${ball(386, 134, 17, 'warm')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card k-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>A new mechanism<br>with a <span class="teal">lower E<sub>a</sub></span>.<br><span class="gold">ΔH</span> is unchanged.</p></div>
      <div class="card k-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Consumed, then<br><span class="teal">regenerated</span>:<br>net amount<br>is constant.</p></div>
      <div class="card k-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="pri">Enzyme binding</span><br><span class="gold">Acid–base</span><br><span class="muted">Surface</span> catalysis</p></div>`,
  })
})()
