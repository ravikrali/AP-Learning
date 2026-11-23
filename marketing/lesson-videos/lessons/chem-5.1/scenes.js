// Pictures for chem-5.1 "Reaction Rates". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u5.ts). The concentration-time
// curves are drawn by shape only, without numbers.
(() => {
  const { clamp, lerp, eio, eo, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-note{position:absolute;padding:20px 28px 22px 32px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);border-left-width:10px}
    .x-note b{display:block;font-size:40px;font-weight:900;line-height:1.15} .x-note span{display:block;margin-top:8px;font-size:30px;font-weight:700;color:var(--muted);line-height:1.3}
    .x-foot{position:absolute;left:0;right:0;text-align:center;font-size:40px;font-weight:900}
    .x-tag{position:absolute;right:30px;top:26px;padding:4px 22px;border-radius:16px;font-size:30px;font-weight:900;letter-spacing:.1em;border:3px solid currentColor;background:rgba(14,16,24,.6)}
    .x-mid{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900}
    .x-row{position:absolute;left:120px;width:1680px;height:100px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-row .lb{position:absolute;left:40px;top:24px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-bar{position:absolute;left:640px;top:32px;height:36px;border-radius:18px}
    .x-slot{position:absolute;left:1560px;top:18px;height:64px;padding:0 24px;border-radius:18px;font-size:40px;font-weight:900;line-height:60px;white-space:nowrap;border:2px solid currentColor;background:rgba(255,255,255,.05)}
    .x-one{position:absolute;left:1000px;top:26px;font-size:38px;font-weight:900;white-space:nowrap}
    .x-eqc{left:120px;top:290px;width:1680px;height:130px;text-align:center;font-size:64px;font-weight:900;line-height:126px;white-space:nowrap}
    .x-prob{left:120px;top:300px;width:1680px;height:150px;padding:22px 48px 0;font-size:44px;font-weight:800;white-space:nowrap}
    .x-prob .s{display:block;font-size:34px;color:var(--muted);margin-bottom:10px}
    .x-step{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-step .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;font-size:38px;font-weight:900;line-height:68px;text-align:center;color:#10131c}
    .x-step .lb{position:absolute;left:124px;top:36px;font-size:36px;font-weight:900;white-space:nowrap}
    .x-step .eq{position:absolute;left:420px;top:34px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-res{position:absolute;right:22px;top:18px;height:80px;padding:0 30px;border-radius:20px;font-size:44px;font-weight:900;line-height:76px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .x-fc{top:300px;width:390px;height:540px;text-align:center}
    .x-fc .n{margin:24px auto 0;width:60px;height:60px;border-radius:50%;background:var(--brand);font-size:34px;font-weight:900;line-height:60px}
    .x-fc h4{margin:12px 0 0;font-size:38px;font-weight:900;white-space:nowrap}
    .x-fc svg{display:block;margin:12px auto 0}
    .x-fc p{margin:14px 16px 0;font-size:30px;font-weight:800;line-height:1.3;color:var(--muted);white-space:nowrap}
    .x-mc{top:390px;width:390px;height:440px;text-align:center}
    .x-mc h4{margin:26px 0 0;font-size:38px;font-weight:900;white-space:nowrap}
    .x-mc svg{display:block;margin:10px auto 0}
    .x-mc p{margin:10px 16px 0;font-size:30px;font-weight:800;line-height:1.3;color:var(--muted);white-space:nowrap}
    .x-chx{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:800;line-height:68px;white-space:nowrap}
    .x-strike{position:absolute;left:14px;right:14px;top:50%;height:6px;border-radius:3px;background:var(--bad)}
    .x-chips{position:absolute;left:120px;top:310px;width:1680px;display:flex;justify-content:center;gap:30px}
    .x-chips .x-chx{position:relative}
    .x-ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .x-ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', GOLD = '#f2c443', RED = '#f0707a', AX = '#c9cee0'
  // SVG formula with lowered digits: svgF('N2O5', 40)
  const svgF = (s, fs) => { const d = fs * 0.22; let out = '', low = false
    for (const run of s.match(/\d+|\D+/g)) {
      const dig = /^\d/.test(run)
      if (dig && !low) { out += `<tspan dy="${d}" font-size="${fs * 0.62}">${run}</tspan>`; low = true }
      else if (!dig && low) { out += `<tspan dy="${-d}">${run}</tspan>`; low = false }
      else out += run
    }
    return out }
  const note = (left, top, width, at, color, title, body, fx = 'right') => `<div class="x-note" style="left:${left}px;top:${top}px;width:${width}px;border-left-color:${color}" data-at="${at}" data-fx="${fx}"><b style="color:${color}">${title}</b><span>${body}</span></div>`
  const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

  // ---------- intro artwork: a falling reactant curve at the left edge, a rising product curve at the right ----------
  const curvePath = (f, x0, x1, y0, h, n = 80) => 'M' + Array.from({ length: n + 1 }, (_, i) => { const p = i / n; return `${(x0 + p * (x1 - x0)).toFixed(1)} ${(y0 + h * (1 - f(p))).toFixed(1)}` }).join('L')
  EZ.intro = {
    chips: [['1@0.3', 'What a rate is'], ['1@0.55', 'Rates &amp; coefficients'], ['1@0.85', 'What speeds it up']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      <line x1="70" y1="240" x2="70" y2="640" stroke="${AX}" stroke-width="5"/><line x1="70" y1="640" x2="420" y2="640" stroke="${AX}" stroke-width="5"/>
      <path class="x-i1" d="${curvePath((p) => Math.exp(-3.2 * p), 70, 420, 260, 380)}" fill="none" stroke="${PUR}" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1"/>
      <line x1="1500" y1="240" x2="1500" y2="640" stroke="${AX}" stroke-width="5"/><line x1="1500" y1="640" x2="1850" y2="640" stroke="${AX}" stroke-width="5"/>
      <path class="x-i2" d="${curvePath((p) => 1 - Math.exp(-3.2 * p), 1500, 1850, 260, 380)}" fill="none" stroke="${TEAL}" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1"/></svg>`,
    update(c) {
      const p = eio(c.seg(c.sc.start + 0.3, c.sc.start + 3.3))
      c.$('.x-i1').setAttribute('stroke-dashoffset', 1 - p)
      c.$('.x-i2').setAttribute('stroke-dashoffset', 1 - p)
    },
  }

  // ---------- hook: an explosion and rusting ----------
  const FRAG = Array.from({ length: 12 }, (_, i) => `<g class="x-fr${i}"><circle r="${10 + 6 * rnd(i)}" fill="url(#g-warm)"/></g>`).join('')
  const RAYS = Array.from({ length: 14 }, (_, i) => `<line class="x-ray" data-a="${i * (360 / 14)}" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>`).join('')
  const SPOTS = Array.from({ length: 14 }, (_, i) => `<circle class="x-sp" data-k="${i}" cx="${270 + rnd(i + 3) * 270}" cy="${100 + rnd(i + 40) * 120}" r="${10 + rnd(i + 80) * 18}" fill="#b0602a" opacity="0"/>`).join('')
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="0">Same idea, different speeds</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:470px" data-at="0"><h3>An explosion</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="300" viewBox="0 0 810 300"><g class="x-burst">${RAYS}</g>${FRAG}<g class="x-core"><circle r="60" fill="url(#g-gold)"/></g></svg>
        <div class="x-foot warm" style="bottom:30px" data-at="0@0.5" data-fx="fade">over in a millisecond</div>
        <div class="x-tag gold" data-at="3" data-fx="pop">FAST</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:470px" data-at="1"><h3>Rusting</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="300" viewBox="0 0 810 300">
          <rect x="250" y="80" width="310" height="160" rx="18" fill="#7d859c"/><rect x="250" y="80" width="310" height="34" rx="16" fill="#aab1c4" opacity=".55"/>${SPOTS}</svg>
        <div class="x-foot warm" style="bottom:30px" data-at="1@0.4" data-fx="fade">takes years</div>
        <div class="x-tag muted" data-at="3@0.3" data-fx="pop">SLOW</div></div>
      <div class="x-mid" style="top:800px" data-at="2" data-fx="up">Same idea: <span class="teal">atoms rearranging</span></div>
      <div class="banner" style="top:880px" data-at="4" data-fx="pop"><span class="pri">Kinetics</span> = the study of <span class="gold">how fast</span></div>`,
    update(c) {
      const b = c.b, cx = 405, cy = 150
      const p = eo(c.seg(b[0].start + 0.2, b[0].start + 1.1))
      c.$('.x-core').setAttribute('transform', `translate(${cx} ${cy}) scale(${lerp(0.4, 1.3, p) * (1 - 0.7 * p)})`)
      c.$(".x-core").style.opacity = 1 - p
      c.$('.x-burst').style.opacity = c.seg(b[0].start + 0.1, b[0].start + 0.3) * (1 - 0.75 * c.seg(b[0].start + 0.9, b[0].start + 1.6))
      for (const l of c.root.querySelectorAll('.x-ray')) {
        const a = (+l.dataset.a * Math.PI) / 180, r1 = 50 + 120 * p, r2 = r1 + 30 + 40 * p
        l.setAttribute('x1', cx + r1 * Math.cos(a)); l.setAttribute('y1', cy + r1 * 0.7 * Math.sin(a)); l.setAttribute('x2', cx + r2 * Math.cos(a)); l.setAttribute('y2', cy + r2 * 0.7 * Math.sin(a))
      }
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + rnd(i) * 0.4, r = 20 + p * (150 + 60 * rnd(i + 9))
        c.$('.x-fr' + i).setAttribute('transform', `translate(${cx + r * Math.cos(a)} ${cy + r * 0.62 * Math.sin(a)})`)
        c.$('.x-fr' + i).style.opacity = c.seg(b[0].start + 0.15, b[0].start + 0.3)
      }
      const rust = c.seg(b[1].start + 0.2, b[1].start + 6)
      for (const s of c.root.querySelectorAll('.x-sp')) s.setAttribute('opacity', 0.9 * clamp(rust * 14 - +s.dataset.k))
    },
  })

  // ---------- what is a rate ----------
  const GX = (t) => 220 + t * 70, GY = (v) => 760 - v * 400
  const reac = curvePath((p) => Math.exp(-3.5 * p), GX(0), GX(10), GY(1), 400)
  const prod = curvePath((p) => 1 - Math.exp(-3.5 * p), GX(0), GX(10), GY(1), 400)
  EZ.scene('rate', {
    html: `<div class="kicker" data-at="in" data-fx="left">The definition</div><h2 class="h1" data-at="0">What is a rate?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><clipPath id="x-clip1"><rect class="x-cr1" x="0" y="300" width="0" height="600"/></clipPath></defs>
        <g data-at="1" data-fx="fade"><line x1="220" y1="330" x2="220" y2="760" stroke="${AX}" stroke-width="4" stroke-linecap="round"/><line x1="220" y1="760" x2="930" y2="760" stroke="${AX}" stroke-width="4" stroke-linecap="round"/>
          <text x="590" y="812" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">time</text>
          <text transform="translate(176 545) rotate(-90)" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">concentration</text></g>
        <g clip-path="url(#x-clip1)"><path d="${reac}" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round"/><path d="${prod}" fill="none" stroke="${TEAL}" stroke-width="8" stroke-linecap="round"/></g>
        <text x="${GX(10) + 16}" y="${GY(0.03) - 4}" font-size="32" font-weight="900" class="f-pri" data-at="3@0.85" data-fx="fade">reactant ↓</text>
        <text x="${GX(10) + 16}" y="${GY(0.97) + 10}" font-size="32" font-weight="900" class="f-teal" data-at="3@0.85" data-fx="fade">product ↑</text>
      </svg>
      ${note(1150, 300, 650, '1', PUR, 'Reaction rate', 'how fast reactants are converted<br>to products, per unit of time')}
      ${note(1150, 506, 650, '2', TEAL, 'Units: M/s', 'change in concentration per second')}
      ${note(1150, 672, 650, '5', WARM, 'Why the minus sign?', 'reactants go down; it keeps<br>the rate positive')}
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">Rate = <span class="warm">−</span>Δ[<span class="pri">reactant</span>]/Δt = <span class="good">+</span>Δ[<span class="teal">product</span>]/Δt</div>`,
    update(c) {
      const b = c.b
      c.$('.x-cr1').setAttribute('width', GX(10.2) * eio(c.seg(b[3].start + 0.1, b[3].end)))
    },
  })

  // ---------- rates as slopes ----------
  const SX = (t) => 220 + t * 90, C = (t) => Math.exp(-0.3 * t), SY = (v) => 860 - v * 480
  const slopeCurve = curvePath((p) => Math.exp(-3 * p), SX(0), SX(10), SY(1), 480)
  const tan = (t, back, fwd) => { const m = 1.6 * C(t), n = Math.hypot(1, m), x = SX(t), y = SY(C(t))
    return [x - (back * 1) / n, y - (back * m) / n, x + (fwd * 1) / n, y + (fwd * m) / n] }
  const sec = [SX(1.5), SY(C(1.5)), SX(5.5), SY(C(5.5))]
  const ini = tan(0, 0, 260)
  EZ.scene('slope', {
    html: `<div class="kicker" data-at="in" data-fx="left">Reading the graph</div><h2 class="h1" data-at="0">A rate is a slope</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><clipPath id="x-clip2"><rect class="x-cr2" x="0" y="300" width="0" height="640"/></clipPath></defs>
        <g data-at="in" data-fx="fade"><line x1="220" y1="340" x2="220" y2="860" stroke="${AX}" stroke-width="4" stroke-linecap="round"/><line x1="220" y1="860" x2="1140" y2="860" stroke="${AX}" stroke-width="4" stroke-linecap="round"/>
          <text x="680" y="912" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">time</text>
          <text transform="translate(176 600) rotate(-90)" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">[reactant]</text></g>
        <path d="${slopeCurve}" clip-path="url(#x-clip2)" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round"/>
        <g data-at="1@0.4" data-fx="fade"><line x1="${sec[0]}" y1="${sec[1]}" x2="${sec[2]}" y2="${sec[3]}" stroke="${WARM}" stroke-width="6" stroke-linecap="round"/>
          <circle cx="${sec[0]}" cy="${sec[1]}" r="12" fill="${WARM}"/><circle cx="${sec[2]}" cy="${sec[3]}" r="12" fill="${WARM}"/></g>
        <g class="x-tan"><line class="x-tl" stroke="${TEAL}" stroke-width="6" stroke-linecap="round"/><circle class="x-td" r="12" fill="${TEAL}"/></g>
        <g data-at="3@0.4" data-fx="fade"><line x1="${ini[0]}" y1="${ini[1]}" x2="${ini[2]}" y2="${ini[3]}" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/><circle cx="${SX(0)}" cy="${SY(1)}" r="12" fill="${GOLD}"/></g>
        <text x="390" y="420" font-size="32" font-weight="900" class="f-gold" data-at="4@0.2" data-fx="fade">steep</text>
        <text x="${SX(8.5) - 40}" y="${SY(C(8.5)) - 56}" font-size="32" font-weight="900" class="f-teal" data-at="4@0.9" data-fx="fade">flatter</text>
      </svg>
      ${note(1200, 300, 600, '1', WARM, 'Average rate', '<i style="font-style:normal;font-size:27px">slope of the line joining two points</i>')}
      ${note(1200, 450, 600, '2', TEAL, 'Instantaneous rate', '<i style="font-style:normal;font-size:27px">slope of the tangent at one moment</i>')}
      ${note(1200, 600, 600, '3', GOLD, 'Initial rate', '<i style="font-style:normal;font-size:27px">slope at t = 0</i>')}
      ${note(1200, 750, 600, '5', PUR, 'Rate decreases', 'reactants used up: fewer<br>collisions per second')}`,
    update(c) {
      const b = c.b
      c.$('.x-cr2').setAttribute('width', SX(10.2) * eio(c.seg(b[0].start, b[0].end + 0.2)))
      let t = lerp(1, 4, eio(c.seg(b[2].start + 0.3, b[2].start + 1.8)))
      if (c.t > b[4].start) t = lerp(4, 8.5, eio(c.seg(b[4].start + 0.2, b[4].end)))
      const [x1, y1, x2, y2] = tan(t, 150, 150)
      const l = c.$('.x-tl'); l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2)
      c.$('.x-td').setAttribute('cx', SX(t)); c.$('.x-td').setAttribute('cy', SY(C(t)))
      c.$('.x-tan').style.opacity = c.seg(b[2].start, b[2].start + 0.3)
    },
  })

  // ---------- stoichiometry links the rates ----------
  const U = 200
  const srow = (i, top, at, col, label, from, slotA, slotB) => `<div class="x-row" style="top:${top}px" data-at="${at}">
      <div class="lb" style="color:${col}">${label}</div>
      <div class="x-bar x-b${i}" style="width:${from * U}px;background:${col}" data-at="${at}+0.3" data-fx="grow"></div>
      ${slotA ? `<div class="x-slot" style="color:${col}" data-at="${slotA[1]}" data-out="4@0.25" data-fx="pop">${slotA[0]}</div>` : ''}
      <div class="x-slot" style="color:${col}" data-at="${slotB[1]}" data-fx="pop">${slotB[0]}</div></div>`
  EZ.scene('stoich', {
    html: `<div class="kicker" data-at="in" data-fx="left">Stoichiometry</div><h2 class="h1" data-at="0">The coefficients link the rates</h2>
      <div class="card x-eqc" data-at="1"><span class="gold">2</span>N<sub>2</sub>O<sub>5</sub> <span class="muted">→</span> <span class="gold">4</span>NO<sub>2</sub> + O<sub>2</sub></div>
      ${srow(0, 460, '2', PUR, 'N<sub>2</sub>O<sub>5</sub> used up', 2, null, ['÷ 2', '4@0.3'])}
      ${srow(1, 580, '2@0.35', TEAL, 'NO<sub>2</sub> formed', 4, ['× 2', '2@0.7'], ['÷ 4', '4@0.4'])}
      ${srow(2, 700, '3', WARM, 'O<sub>2</sub> formed', 1, ['× ½', '3@0.6'], ['÷ 1', '4@0.5'])}
      <div class="x-one gold" style="top:${580 + 26}px" data-at="4@0.85" data-fx="fade">= one single rate of reaction</div>
      <div class="banner" style="top:850px;font-size:46px" data-at="5" data-fx="pop">rate = −½ Δ[N<sub>2</sub>O<sub>5</sub>]/Δt = ¼ Δ[NO<sub>2</sub>]/Δt = Δ[O<sub>2</sub>]/Δt</div>`,
    update(c) {
      const p = eio(c.seg(c.at('4@0.45'), c.at('4@0.8')))
      c.$('.x-b0').style.width = lerp(2, 1, p) * U + 'px'
      c.$('.x-b1').style.width = lerp(4, 1, p) * U + 'px'
    },
  })

  // ---------- worked example (quick check) ----------
  const step = (i, top, at, col, label, eq, res) => `<div class="x-step" style="top:${top}px" data-at="${at}"><div class="n" style="background:${col}">${i}</div><div class="lb" style="color:${col}">${label}</div>
      <div class="eq" data-at="${at}@0.3" data-fx="fade">${eq}</div>${res ? `<div class="x-res" data-at="${res[1]}" data-fx="pop">${res[0]}</div>` : ''}</div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Use the coefficients</h2>
      <div class="card x-prob" data-at="1"><span class="s">2N<sub>2</sub>O<sub>5</sub> → 4NO<sub>2</sub> + O<sub>2</sub></span><span class="pri">N<sub>2</sub>O<sub>5</sub></span> consumed at <span class="pri">0.010 M/s</span>. <span class="warm">O<sub>2</sub></span> formed at <span class="warm">?</span></div>
      ${step(1, 490, '2', TEAL, 'ratio', 'O<sub>2</sub> : N<sub>2</sub>O<sub>5</sub> = 1 : 2', null)}
      ${step(2, 630, '3', WARM, 'rate of O<sub>2</sub>', '0.010 M/s × ½ =', ['0.0050 M/s', '3@0.8'])}
      <div class="banner" style="top:800px" data-at="4" data-fx="pop">Relative rates follow the <span class="gold">coefficients</span></div>`,
  })

  // ---------- four factors ----------
  const dots = (x, y, w, h, n, seed) => Array.from({ length: n }, (_, i) => `<circle cx="${x + 14 + rnd(seed + i) * (w - 28)}" cy="${y + 14 + rnd(seed + i + 50) * (h - 28)}" r="9" fill="url(#g-pur)"/>`).join('')
  const F1 = `<svg width="330" height="220" viewBox="0 0 330 220"><rect x="15" y="20" width="130" height="150" rx="12" fill="rgba(255,255,255,.04)" stroke="${AX}" stroke-width="3"/>${dots(15, 20, 130, 150, 4, 1)}
    <rect x="185" y="20" width="130" height="150" rx="12" fill="rgba(255,255,255,.04)" stroke="${AX}" stroke-width="3"/>${dots(185, 20, 130, 150, 15, 20)}
    <text x="80" y="208" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">low</text><text x="250" y="208" text-anchor="middle" font-size="28" font-weight="800" class="f-pri">high</text></svg>`
  const F2 = `<svg width="330" height="220" viewBox="0 0 330 220"><rect x="55" y="16" width="34" height="160" rx="17" fill="rgba(255,255,255,.06)" stroke="${AX}" stroke-width="3"/>
    <rect x="63" y="60" width="18" height="120" rx="9" fill="${RED}"/><circle cx="72" cy="182" r="28" fill="${RED}"/>
    ${[[190, 50], [270, 100], [200, 160]].map(([x, y], i) => `<line x1="${x - 70}" y1="${y + (i - 1) * 6}" x2="${x - 26}" y2="${y}" stroke="${WARM}" stroke-width="5" stroke-linecap="round" opacity=".7"/><line x1="${x - 60}" y1="${y + 14}" x2="${x - 30}" y2="${y + 10}" stroke="${WARM}" stroke-width="4" stroke-linecap="round" opacity=".45"/><circle cx="${x}" cy="${y}" r="20" fill="url(#g-warm)"/>`).join('')}</svg>`
  const F3 = `<svg width="330" height="220" viewBox="0 0 330 220"><rect x="20" y="50" width="110" height="110" rx="10" fill="#8f97ad" stroke="${AX}" stroke-width="3"/>
    ${Array.from({ length: 16 }, (_, i) => `<rect x="${180 + (i % 4) * 34 + rnd(i) * 8}" y="${54 + Math.floor(i / 4) * 28 + rnd(i + 30) * 6}" width="18" height="18" rx="4" fill="#8f97ad" stroke="${TEAL}" stroke-width="2.5"/>`).join('')}
    <text x="75" y="204" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">chunk</text><text x="250" y="204" text-anchor="middle" font-size="28" font-weight="800" class="f-teal">powder</text></svg>`
  const F4 = `<svg width="330" height="220" viewBox="0 0 330 220"><line x1="10" y1="200" x2="320" y2="200" stroke="${AX}" stroke-width="3"/>
    <path d="M10 160 C80 160 110 24 165 24 S250 180 320 180" fill="none" stroke="#7d859c" stroke-width="6" stroke-dasharray="12 10"/>
    <path d="M10 160 C80 160 110 96 165 96 S250 180 320 180" fill="none" stroke="${TEAL}" stroke-width="7"/></svg>`
  const fcard = (i, at, title, pic, text) => `<div class="card x-fc" style="left:${120 + i * 430}px" data-at="${at}"><div class="n">${i + 1}</div><h4>${title}</h4>${pic}<p>${text}</p></div>`
  EZ.scene('factors', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Four factors</div><h2 class="h1" data-at="0">What speeds a reaction up?</h2>
      ${fcard(0, '1', 'Concentration <span class="pri">↑</span>', F1, '<span class="pri">more collisions</span><br>(or pressure, for gases)')}
      ${fcard(1, '2', 'Temperature <span class="warm">↑</span>', F2, '<span class="warm">more collisions</span>, and<br>more of them energetic<br>enough to react')}
      ${fcard(2, '3', 'Surface area <span class="teal">↑</span>', F3, 'powder vs. chunk:<br><span class="teal">more particles exposed</span>')}
      ${fcard(3, '4', 'A catalyst', F4, 'a <span class="teal">lower-energy</span><br>pathway')}
      <div class="banner" style="top:880px;font-size:44px" data-at="5" data-fx="pop">The particle-level “why” for each: <span class="gold">coming lessons</span></div>`,
  })

  // ---------- powdered zinc vs. a lump (quick check) ----------
  const beaker = (cls, solid, bubbles) => `<svg style="position:absolute;left:0;top:80px" width="560" height="400" viewBox="0 0 560 400">
      <rect x="134" y="110" width="292" height="266" fill="${TEAL}" opacity=".22"/>
      ${solid}
      <g class="${cls}">${bubbles.map(([x, y, ph], i) => `<circle class="${cls}${i}" data-x="${x}" data-y="${y}" data-ph="${ph}" r="9" fill="none" stroke="#dff" stroke-width="3"/>`).join('')}</g>
      <path d="M130 30 V360 Q130 380 150 380 H410 Q430 380 430 360 V30" fill="none" stroke="${AX}" stroke-width="5" stroke-linejoin="round"/></svg>`
  const LUMP = `<rect x="225" y="282" width="110" height="88" rx="10" fill="#8f97ad"/><rect class="x-glow1" x="225" y="282" width="110" height="88" rx="10" fill="none" stroke="${TEAL}" stroke-width="5" opacity="0"/>
    <text x="280" y="338" text-anchor="middle" font-size="34" font-weight="900" class="f-dark">Zn</text>`
  const PB = Array.from({ length: 30 }, (_, i) => [150 + (i % 15) * 18 + rnd(i) * 6, 346 + Math.floor(i / 15) * 16 + rnd(i + 7) * 4])
  const POWDER = PB.map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="#8f97ad"/>`).join('') + `<g class="x-glow2" opacity="0">${PB.map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="none" stroke="${TEAL}" stroke-width="2.5"/>`).join('')}</g>`
  const B1 = [[250, 282, 0], [300, 282, 0.5], [280, 282, 0.25]]
  const B2 = Array.from({ length: 14 }, (_, i) => [160 + rnd(i + 3) * 240, 346, i / 14])
  const cross = '<svg width="40" height="40" viewBox="0 0 40 40" style="vertical-align:-8px;margin-right:12px"><path d="M8 8L32 32M32 8L8 32" stroke="#f0707a" stroke-width="7" stroke-linecap="round"/></svg>'
  EZ.scene('surface', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Classic question</div><h2 class="h1" data-at="1">Why does powdered zinc react faster?</h2>
      <div class="card" style="left:120px;top:300px;width:560px;height:530px" data-at="1@0.3"><h3>One lump</h3>${beaker('x-u', LUMP, B1)}
        <div class="x-tag muted" style="top:462px;right:205px" data-at="1@0.85" data-fx="pop">slower</div></div>
      <div class="card" style="left:720px;top:300px;width:560px;height:530px" data-at="1@0.5"><h3>Powder <span class="muted" style="font-size:30px">(same mass)</span></h3>${beaker('x-v', POWDER, B2)}
        <div class="x-tag good" style="top:462px;right:205px" data-at="1@0.95" data-fx="pop">faster</div></div>
      <div class="x-chx" style="left:1330px;top:310px" data-at="2@0.1" data-fx="pop">${cross}it is hotter</div>
      <div class="x-chx" style="left:1330px;top:400px" data-at="2@0.55" data-fx="pop">${cross}it is a catalyst</div>
      ${note(1330, 510, 470, '3', TEAL, 'More surface area', 'more Zn atoms<br>exposed to the acid')}
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">More <span class="teal">collisions per second</span> ${ARR} <span class="good">faster</span></div>`,
    update(c) {
      const b = c.b, on = c.seg(b[1].start + 0.6, b[1].start + 1.2)
      const run = (cls, list, speed) => list.forEach(([x, y, ph], i) => {
        const el = c.$(`.${cls}${i}`), q = (c.t * speed + ph) % 1
        el.setAttribute('cx', x + 6 * Math.sin(q * 9 + i)); el.setAttribute('cy', lerp(y - 12, 122, q))
        el.setAttribute('opacity', on * Math.min(1, q * 6, (1 - q) * 5))
      })
      run('x-u', B1, 0.35); run('x-v', B2, 0.45)
      const g = c.seg(b[3].start + 0.2, b[3].start + 0.7)
      c.$('.x-glow1').setAttribute('opacity', g); c.$('.x-glow2').setAttribute('opacity', g)
    },
  })

  // ---------- measuring a rate in the lab ----------
  const M1 = `<svg width="340" height="200" viewBox="0 0 340 200"><line x1="60" y1="100" x2="140" y2="100" stroke="${GOLD}" stroke-width="12" stroke-linecap="round"/><line x1="200" y1="100" x2="282" y2="100" stroke="${GOLD}" stroke-width="12" stroke-linecap="round" opacity=".4"/>
    <circle cx="40" cy="100" r="26" fill="url(#g-gold)"/><rect x="140" y="40" width="60" height="120" rx="6" fill="#b968d0" opacity=".85" stroke="${AX}" stroke-width="3"/><rect x="282" y="66" width="44" height="68" rx="8" fill="#646c82" stroke="${AX}" stroke-width="3"/></svg>`
  const M2 = `<svg width="340" height="200" viewBox="0 0 340 200"><path d="M150 70 V100 L95 180 Q92 192 106 192 H234 Q248 192 245 180 L190 100 V70" fill="rgba(255,255,255,.05)" stroke="${AX}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="144" y="56" width="52" height="22" rx="5" fill="#aab1c4"/><line x1="170" y1="56" x2="170" y2="40" stroke="${AX}" stroke-width="4"/>
    <circle cx="170" cy="30" r="0" fill="none"/><circle cx="250" cy="44" r="38" fill="#1a1d2a" stroke="${AX}" stroke-width="4"/><line x1="170" y1="40" x2="212" y2="44" stroke="${AX}" stroke-width="4"/>
    <g class="x-needle"><line x1="0" y1="0" x2="0" y2="-28" stroke="${RED}" stroke-width="5" stroke-linecap="round"/></g><circle cx="250" cy="44" r="5" fill="${AX}"/></svg>`
  const M3 = `<svg width="340" height="200" viewBox="0 0 340 200"><rect x="20" y="120" width="300" height="70" rx="8" fill="${TEAL}" opacity=".22" stroke="${AX}" stroke-width="3"/>
    <rect x="150" y="18" width="70" height="150" rx="6" fill="${TEAL}" opacity=".22"/><rect class="x-gas" x="150" y="18" width="70" height="0" fill="#eef0f7" opacity=".25"/>
    <path d="M150 168 V18 H220 V168" fill="none" stroke="${AX}" stroke-width="4"/>${[0, 1, 2, 3, 4].map((i) => `<line x1="150" x2="166" y1="${40 + i * 24}" y2="${40 + i * 24}" stroke="${AX}" stroke-width="2.5"/>`).join('')}
    <path d="M40 60 V170 H185 V150" fill="none" stroke="#aab1c4" stroke-width="5" stroke-linejoin="round"/></svg>`
  const M4 = `<svg width="340" height="200" viewBox="0 0 340 200"><path d="M150 40 V66 L108 140 Q105 150 116 150 H224 Q235 150 232 140 L190 66 V40" fill="rgba(255,255,255,.05)" stroke="${AX}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M114 140 L125 120 H215 L226 140 Q228 146 222 146 H118 Q112 146 114 140 Z" fill="${TEAL}" opacity=".4"/>
    <rect x="70" y="152" width="200" height="12" rx="4" fill="#aab1c4"/><rect x="100" y="164" width="140" height="30" rx="8" fill="#646c82"/>
    ${[0, 1, 2].map((i) => `<circle class="x-mb${i}" cx="${160 + i * 10}" r="7" fill="none" stroke="#dff" stroke-width="3"/>`).join('')}
    <text x="290" y="110" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">mass ↓</text></svg>`
  const mcard = (i, at, title, pic, text) => `<div class="card x-mc" style="left:${120 + i * 430}px" data-at="${at}"><h4>${title}</h4>${pic}<p>${text}</p></div>`
  EZ.scene('measure', {
    html: `<div class="kicker" data-at="in" data-fx="left">In the lab</div><h2 class="h1" data-at="0">Measuring a rate</h2>
      <div class="x-chx" style="left:120px;top:290px" data-at="1" data-fx="pop"><span class="bad">Rarely:</span> <span class="muted">take samples and titrate</span></div>
      <div class="x-chx" style="left:760px;top:290px;border-color:rgba(76,199,129,.6)" data-at="2" data-fx="pop">Instead: follow a property <span class="good">continuously</span></div>
      ${mcard(0, '3', 'Absorbance', M1, 'of a colored reactant<br>or product')}
      ${mcard(1, '4', 'Gas pressure', M2, 'gas produced in<br>a closed vessel')}
      ${mcard(2, '4@0.55', 'Gas volume', M3, 'volume of gas<br>collected')}
      ${mcard(3, '5', 'Mass lost', M4, 'mass lost as<br>gas escapes')}
      <div class="banner" style="top:870px" data-at="6" data-fx="pop">Each one ${ARR} converted into <span class="teal">concentration</span></div>`,
    update(c) {
      const b = c.b
      const pn = eio(c.seg(b[4].start + 0.4, b[4].start + 1.8))
      c.$('.x-needle').setAttribute('transform', `translate(250 44) rotate(${lerp(-70, 50, pn)})`)
      c.$('.x-gas').setAttribute('height', 90 * eio(c.seg(c.at('4@0.6'), c.at('4@0.6') + 1.8)))
      const on = c.seg(b[5].start + 0.3, b[5].start + 0.6)
      for (let i = 0; i < 3; i++) {
        const q = (c.t * 0.6 + i / 3) % 1, el = c.$('.x-mb' + i)
        el.setAttribute('cy', lerp(118, 20, q)); el.setAttribute('opacity', on * Math.min(1, (1 - q) * 4))
      }
    },
  })

  // ---------- try it ----------
  const prow = (i, top, at, label, eq) => `<div class="x-step" style="top:${top}px" data-at="${at}"><div class="n" style="background:${i === 1 ? TEAL : PUR}">${i}</div><div class="lb">${label}</div><div class="eq" style="left:330px" data-at="${at}@0.3" data-fx="fade">${eq}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">At what rate is <span class="teal">NH<sub>3</sub></span> formed?</h2>
      <div class="x-chips"><div class="x-chx" data-at="1@0.15" data-fx="pop">N<sub>2</sub> + 3H<sub>2</sub> → 2NH<sub>3</sub></div>
        <div class="x-chx" data-at="1@0.55" data-fx="pop">H<sub>2</sub> consumed: <span class="pri">0.060 M/s</span></div>
        <div class="x-chx" data-at="1@0.85" data-fx="pop">NH<sub>3</sub> formed: <span class="warm">?</span></div></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="x-num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><span class="good">NH<sub>3</sub> formed at 0.040 M/s</span>${CHECK}</div>
      ${prow(1, 620, '4', 'ratio', 'NH<sub>3</sub> : H<sub>2</sub> = <span class="pri">2 : 3</span>')}
      ${prow(2, 760, '5', 'rate', '0.060 M/s × 2/3 = <span class="good">0.040 M/s</span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><line x1="70" y1="10" x2="70" y2="190" stroke="${AX}" stroke-width="4"/><line x1="70" y1="190" x2="420" y2="190" stroke="${AX}" stroke-width="4"/>
    <path d="${curvePath((p) => Math.exp(-3 * p), 70, 420, 20, 170)}" fill="none" stroke="${PUR}" stroke-width="7" stroke-linecap="round"/>
    <path d="M120 ${20 + 170 * (1 - Math.exp(-3 * 50 / 350))} V${20 + 170 * (1 - Math.exp(-3 * 150 / 350))} H220" fill="none" stroke="${WARM}" stroke-width="4" stroke-dasharray="8 6"/>
    <text x="110" y="${20 + 170 * (1 - Math.exp(-3 * 100 / 350)) + 10}" text-anchor="end" font-size="26" font-weight="900" class="f-warm">Δ[ ]</text>
    <text x="170" y="${20 + 170 * (1 - Math.exp(-3 * 150 / 350)) + 34}" text-anchor="middle" font-size="26" font-weight="900" class="f-warm">Δt</text></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210">${[['N2O5', 2, PUR], ['NO2', 4, TEAL], ['O2', 1, WARM]].map(([f, n, col], i) => `
    <text x="20" y="${48 + i * 64}" font-size="34" font-weight="900" style="fill:${col}">${svgF(f, 34)}</text><rect x="140" y="${22 + i * 64}" width="${n * 64}" height="32" rx="16" fill="${col}"/>
    <text x="${152 + n * 64}" y="${48 + i * 64}" font-size="30" font-weight="900" class="f-gold">${n}</text>`).join('')}</svg>`
  const r3 = `<svg width="460" height="226" viewBox="0 0 460 226"><g transform="translate(10 10) scale(.5)">${F1.replace(/<\/?svg[^>]*>/g, '')}</g><g transform="translate(240 10) scale(.5)">${F2.replace(/<\/?svg[^>]*>/g, '')}</g>
    <g transform="translate(10 112) scale(.5)">${F3.replace(/<\/?svg[^>]*>/g, '')}</g><g transform="translate(240 112) scale(.5)">${F4.replace(/<\/?svg[^>]*>/g, '')}</g></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Rate =<br><span class="warm">change in concentration</span><br>÷ time</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Relative rates<br>follow the<br><span class="gold">coefficients</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="pri">Concentration</span>,<br><span class="warm">temperature</span>, <span class="teal">surface area</span><br>and catalysts all<br>affect the rate</p></div>`,
  })
})()
