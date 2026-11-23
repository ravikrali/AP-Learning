// Pictures for chem-4.1 "Physical vs. Chemical Changes". One EZ.scene per scene id in script.mjs.
// Words shown are the lesson's own (app/src/content/chem/u4.ts and chem/book.ts). Molecules and ions
// are pictures, not to scale (Na+ is drawn smaller than Cl-, the right order).
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    svg .f-pri{fill:var(--primary)} svg .f-teal{fill:var(--accent)} svg .f-warm{fill:var(--warm)} svg .f-bad{fill:var(--bad)}
    svg .f-muted{fill:var(--muted)} svg .f-gold{fill:var(--gold)} svg .f-good{fill:var(--good)}
    .x-sub{position:absolute;left:40px;right:40px;top:96px;font-size:32px;font-weight:800;color:var(--muted)}
    .x-chiprow{position:absolute;left:40px;right:40px;bottom:34px;display:flex;gap:14px;flex-wrap:nowrap}
    .x-chip{padding:8px 20px;border-radius:999px;font-size:26px;font-weight:800;white-space:nowrap;background:rgba(36,40,56,.95);border:2px solid var(--line)}
    .x-pb{position:absolute;top:812px;width:810px;height:100px;border-radius:26px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;white-space:nowrap}
    .x-tile{position:absolute;top:300px;width:390px;height:370px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-tile .n{position:absolute;left:20px;top:18px;width:58px;height:58px;border-radius:50%;background:var(--brand);font-size:32px;font-weight:900;line-height:58px}
    .x-tile svg{display:block;margin:20px auto 0} .x-tile b{display:block;font-size:42px;font-weight:900;line-height:1.1} .x-tile span{display:block;margin-top:6px;font-size:28px;font-weight:700;color:var(--muted)}
    .x-say{position:absolute;font-size:46px;font-weight:900;white-space:nowrap}
    .x-quote{position:absolute;left:40px;right:40px;top:110px;text-align:center;font-size:48px;font-weight:900}
    .x-quote .q{position:relative} .x-quote .strike{position:absolute;left:-10px;right:-10px;top:54%;height:8px;border-radius:4px;background:var(--bad)}
    .x-stamp{position:absolute} .x-stamp div{transform:rotate(-9deg);padding:2px 24px;border:7px solid var(--bad);border-radius:16px;color:var(--bad);font-size:50px;font-weight:900;letter-spacing:.08em;background:rgba(14,16,24,.85)}
    .x-line{position:absolute;left:44px;right:30px;font-size:34px;font-weight:800;line-height:1.25} .x-line i{display:inline-block;width:18px;height:18px;margin-right:16px;border-radius:50%;vertical-align:middle}
    .x-def{position:absolute;top:300px;width:810px;height:210px;padding:26px 36px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid}
    .x-def b{display:block;font-size:44px;font-weight:900;line-height:1.15} .x-def span{display:block;margin-top:10px;font-size:32px;font-weight:700;color:var(--muted);line-height:1.25}
    .x-lab{position:absolute;top:548px;font-size:34px;font-weight:900;white-space:nowrap}
    .x-ok{position:absolute;left:0;right:0;top:930px;text-align:center} .x-ok span{display:inline-block;padding:10px 36px;border-radius:999px;font-size:40px;font-weight:900;background:rgba(76,199,129,.14);border:3px solid var(--good);color:var(--good)}
    .x-arg{position:absolute;left:990px;width:810px;height:200px;padding:28px 36px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid}
    .x-arg b{display:block;font-size:46px;font-weight:900} .x-arg span{display:block;margin-top:10px;font-size:32px;font-weight:700;color:var(--muted);line-height:1.25}
    .x-ans{left:120px;top:782px;width:1680px;height:196px;padding:22px 48px;font-size:38px;font-weight:700;line-height:1.35}
    .x-ans .lab{display:block;font-size:25px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
    .opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:38px;font-weight:800;line-height:1.2}
    .opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .pillbox{position:absolute;top:850px;width:810px;height:110px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;white-space:nowrap}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- helpers ----------
  /** a water molecule: O with two H, H's pointing along +y before rotation */
  const water = (x, y, a, s = 1) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${ball(-15, 13, 10, 'gray')}${ball(15, 13, 10, 'gray')}${ball(0, 0, 16, 'red')}</g>`
  /** a beaker (130 wide, 155 tall) with its top-left at (x, y); inner is drawn in the same local frame */
  const beaker = (x, y, liq, inner = '', cls = '') => `<g transform="translate(${x} ${y})">
    <rect class="${cls}" x="7" y="52" width="116" height="96" rx="8" style="fill:${liq}"/>${inner}
    <path d="M-8 0 H0 V140 Q0 155 15 155 H115 Q130 155 130 140 V0 H138" fill="none" stroke="#c9cee0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`
  const bubbles = (cls, n = 5) => Array.from({ length: n }, (_, i) => `<circle class="${cls}" data-i="${i}" cx="${24 + i * 20}" cy="140" r="${6 + (i % 3) * 2}" fill="none" stroke="#eef0f7" stroke-width="3"/>`).join('')
  const rise = (c, sel, x0 = 0) => { let i = 0
    for (const el of c.root.querySelectorAll(sel)) { const ph = ((c.t * 0.55 + i * 0.21) % 1); el.setAttribute('cy', 140 - ph * 86); el.setAttribute('cx', x0 + 24 + i * 20 + 4 * Math.sin(c.t * 3 + i)); el.style.opacity = ph < 0.85 ? 1 : (1 - ph) / 0.15; i++ } }
  const flame = (cls = '') => `<g class="${cls}"><path d="M0 0 C-34 -10 -40 -52 -14 -86 C-12 -60 4 -56 4 -76 C24 -56 40 -20 0 0Z" fill="#f3a764"/><path d="M0 -4 C-16 -10 -18 -32 -4 -50 C0 -34 10 -34 10 -44 C18 -30 18 -10 0 -4Z" fill="#f2c443"/></g>`
  const OK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- intro: a faint ice cube and a faint flame, low at the edges ----------
  EZ.intro = {
    chips: [['1@0.4', 'Tell them apart'], ['1@0.6', 'Clues of a reaction'], ['1@0.82', 'The particle view']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      <g transform="translate(170 790)"><rect width="150" height="150" rx="20" fill="#b4e6ff" stroke="#eaf8ff" stroke-width="5"/><rect x="22" y="20" width="40" height="18" rx="9" fill="#fff" opacity=".7"/></g>
      <g transform="translate(1660 935)"><rect x="-110" y="-30" width="220" height="56" rx="28" fill="#8a5a33"/><g class="ifl">${flame()}</g></g></svg>`,
    update(c) { c.$('.ifl').setAttribute('transform', `translate(0 -24) scale(1.3 ${1.3 + 0.08 * Math.sin(c.t * 9)})`) },
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="0">Two changes, one big difference</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:470px" data-at="0@0.1"><h3>Melting ice</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="300" viewBox="0 0 810 300">
          <ellipse class="pud" cx="405" cy="262" rx="0" ry="0" fill="#7fc8f0" opacity=".6"/>
          <g class="ice"><rect x="-80" y="-160" width="160" height="160" rx="20" fill="#b4e6ff" fill-opacity=".85" stroke="#eaf8ff" stroke-width="5"/><rect x="-58" y="-140" width="44" height="18" rx="9" fill="#fff" opacity=".7"/></g>
        </svg>
        <div class="x-say good" style="left:0;right:0;top:390px;text-align:center" data-at="1" data-fx="pop">You can refreeze it</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:470px" data-at="0@0.4"><h3>Burning wood</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="300" viewBox="0 0 810 300">
          <g class="log"><rect x="255" y="190" width="300" height="74" rx="37" fill="#8a5a33"/><ellipse cx="518" cy="227" rx="26" ry="35" fill="#b07a4a"/><ellipse cx="518" cy="227" rx="12" ry="17" fill="none" stroke="#8a5a33" stroke-width="4"/></g>
          <path class="ash" d="M250 264 C300 214 360 206 405 204 C450 206 510 214 560 264Z" fill="#6b7390"/>
          <g class="fl">${flame()}</g>
        </svg>
        <div class="x-say bad" style="left:0;right:0;top:390px;text-align:center" data-at="2" data-fx="pop">You can’t “unburn” the ash</div></div>
      <div class="banner" style="top:830px" data-at="3" data-out="4" data-fx="pop">So what’s the <span class="warm">real difference</span>?</div>
      <div class="banner" style="top:830px" data-at="4" data-fx="pop">Not only what you see: <span class="teal">what happens to the particles</span></div>`,
    update(c) {
      const b = c.b
      const m = eio(c.seg(b[0].start + 1.2, b[0].end)) * (1 - eio(c.seg(b[1].start + 0.3, b[1].end)))
      c.$('.ice').setAttribute('transform', `translate(405 264) scale(${1 + 0.15 * m} ${1 - 0.85 * m})`)
      c.$('.pud').setAttribute('rx', 190 * m); c.$('.pud').setAttribute('ry', 24 * m)
      const p = eio(c.seg(b[0].start + 1.6, b[0].end + 0.4))
      c.$('.log').style.opacity = 1 - p; c.$('.ash').style.opacity = clamp(p * 2 - 1)
      c.$('.fl').style.opacity = clamp(p * 6) * (1 - c.seg(b[0].end + 0.2, b[0].end + 0.9))
      c.$('.fl').setAttribute('transform', `translate(405 200) scale(1.5 ${1.5 + 0.12 * Math.sin(c.t * 9)})`)
    },
  })

  // ---------- definitions ----------
  const ICE = [[-70, -32], [0, -32], [70, -32], [-70, 32], [0, 32], [70, 32]]
  const LIQ = [[-210, -40, 40], [-60, 30, -70], [40, -50, 150], [150, 40, 80], [250, -30, -120], [-170, 50, 200]]
  EZ.scene('defs', {
    html: `<div class="kicker" data-at="in" data-fx="left">The definitions</div><h2 class="h1" data-at="0">Physical vs. chemical</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:480px;border-color:rgba(60,199,188,.6)" data-at="1"><h3 class="teal">Physical change</h3>
        <div class="x-sub">no change in composition: <b style="color:var(--text)">same substances</b>, different form</div>
        <svg style="position:absolute;left:0;top:192px" width="810" height="190" viewBox="0 0 810 190">${ICE.map((_, i) => `<g class="w${i}">${water(0, 0, 0)}</g>`).join('')}</svg>
        <div class="x-chiprow">${['melting, boiling', 'dissolving', 'mixing or separating'].map((t, i) => `<div class="x-chip" data-at="3@${0.1 + i * 0.25}" data-fx="pop">${t}</div>`).join('')}</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:480px;border-color:rgba(243,167,100,.6)" data-at="4"><h3 class="warm">Chemical change</h3>
        <div class="x-sub"><b style="color:var(--text)">new substances</b> form, typically with a different composition</div>
        <svg style="position:absolute;left:0;top:192px" width="810" height="190" viewBox="0 0 810 190">
          <g class="bonds"><line class="o1" stroke="#eef0f7" stroke-width="9"/><line class="o2" stroke="#eef0f7" stroke-width="9"/><line class="n1" stroke="#eef0f7" stroke-width="9"/><line class="n2" stroke="#eef0f7" stroke-width="9"/></g>
          <g class="a0">${ball(0, 0, 34, 'pur')}</g><g class="a1">${ball(0, 0, 34, 'pur')}</g><g class="a2">${ball(0, 0, 30, 'teal')}</g><g class="a3">${ball(0, 0, 30, 'teal')}</g></svg>
        <div class="x-chiprow">${['burning', 'rusting', 'cooking', 'neutralization'].map((t, i) => `<div class="x-chip" data-at="5@${0.1 + i * 0.18}" data-fx="pop">${t}</div>`).join('')}</div></div>
      <div class="x-pb" style="left:120px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="6" data-fx="pop">Melting ice: still H₂O ${ARR}&nbsp;<span class="teal">physical</span></div>
      <div class="x-pb" style="left:990px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="7" data-fx="pop">Electrolysis: H₂ and O₂ form ${ARR}&nbsp;<span class="warm">chemical</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[2].start + 0.2, b[2].end + 0.3))
      ICE.forEach(([x, y], i) => { const [lx, ly, la] = LIQ[i], j = p * 5 * Math.sin(c.t * 1.5 + i)
        c.$('.w' + i).setAttribute('transform', `translate(${405 + lerp(x, lx, p)} ${95 + lerp(y, ly, p) + j}) rotate(${lerp(0, la, p)})`) })
      const q = eio(c.seg(b[4].start + 1.2, b[4].end + 0.3))
      const A = [[lerp(370, 260, q), lerp(50, 95, q)], [lerp(440, 480, q), lerp(50, 95, q)], [lerp(370, 330, q), lerp(140, 95, q)], [lerp(440, 550, q), lerp(140, 95, q)]]
      A.forEach(([x, y], i) => c.$('.a' + i).setAttribute('transform', `translate(${x} ${y})`))
      const L = (cls, i, j, o) => { const e = c.$(cls); e.setAttribute('x1', A[i][0]); e.setAttribute('y1', A[i][1]); e.setAttribute('x2', A[j][0]); e.setAttribute('y2', A[j][1]); e.style.opacity = o }
      L('.o1', 0, 1, 1 - clamp(q * 3)); L('.o2', 2, 3, 1 - clamp(q * 3)); L('.n1', 0, 2, clamp(q * 3 - 2)); L('.n2', 1, 3, clamp(q * 3 - 2))
    },
  })

  // ---------- four kinds of evidence ----------
  const PPT = Array.from({ length: 12 }, (_, i) => [22 + (i % 6) * 17 + (i > 5 ? 8 : 0), i > 5 ? 128 : 140])
  const EV = [
    ['Heat or light', '', `<g transform="translate(195 150)"><g class="rays">${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="-112" x2="0" y2="-138" stroke="#f2c443" stroke-width="7" stroke-linecap="round" transform="rotate(${-70 + i * 20})"/>`).join('')}</g><g class="evf">${flame()}</g></g>`],
    ['Gas (bubbles)', 'when not just boiling', beaker(130, 20, 'rgba(60,199,188,.35)', bubbles('gb'))],
    ['A precipitate', 'a solid from solutions', beaker(130, 20, 'rgba(60,199,188,.3)', PPT.map(([x], i) => `<circle class="pp" data-i="${i}" cx="${x}" cy="80" r="7" fill="#f2c443"/>`).join(''))],
    ['A color change', '', beaker(130, 20, '#3cc7bc', '', 'x-liq')],
  ]
  EZ.scene('evidence', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Evidence</div><h2 class="h1" data-at="0">Clues that a reaction may have happened</h2>
      ${EV.map(([b, s, art], i) => `<div class="x-tile" style="left:${120 + i * 430}px" data-at="${i + 1}" data-fx="pop"><div class="n">${i + 1}</div>
        <svg width="390" height="190" viewBox="0 0 390 190">${art}</svg><b>${b}</b>${s ? `<span>${s}</span>` : ''}</div>`).join('')}
      <div class="card" style="left:120px;top:700px;width:1680px;height:250px" data-at="5">
        <svg style="position:absolute;left:0;top:0" width="1680" height="250" viewBox="0 0 1680 250">
          ${beaker(120, 50, 'rgba(200,210,230,.22)')}<text x="330" y="150" text-anchor="middle" font-size="64" font-weight="900" class="f-muted">+</text>${beaker(400, 50, 'rgba(200,210,230,.22)')}
          <line x1="580" y1="128" x2="690" y2="128" stroke="#a3abbd" stroke-width="7" marker-end="url(#mk-muted)"/>
          <g data-at="5@0.45" data-fx="fade">${beaker(730, 50, 'rgba(200,210,230,.22)', PPT.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#f2c443"/>`).join(''))}</g>
          <text x="940" y="112" font-size="40" font-weight="900" class="f-gold" data-at="5@0.6" data-fx="fade">a yellow solid = a precipitate</text>
          <text x="940" y="176" font-size="40" font-weight="900" class="f-good" data-at="6" data-fx="fade">evidence of a chemical change</text>
        </svg>
        <div style="position:absolute;left:120px;top:16px;font-size:26px;font-weight:800;color:var(--muted)">two clear solutions</div></div>`,
    update(c) {
      const b = c.b
      c.$('.evf').setAttribute('transform', `translate(0 10) scale(1.2 ${1.2 + 0.1 * Math.sin(c.t * 9)})`)
      c.$('.rays').style.opacity = 0.55 + 0.35 * Math.sin(c.t * 4)
      rise(c, '.gb')
      const s = eio(c.seg(b[3].start + 0.2, b[3].end + 0.6))
      for (const el of c.root.querySelectorAll('.pp')) { const i = +el.dataset.i; el.setAttribute('cy', lerp(70 + (i % 4) * 10, PPT[i][1], s)) }
      const k = eio(c.seg(b[4].start + 0.2, b[4].end + 0.3))
      c.$('.x-liq').style.fill = `rgb(${lerp(60, 141, k)},${lerp(199, 141, k)},${lerp(188, 240, k)})`
    },
  })

  // ---------- two traps ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">Two traps</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:470px" data-at="1"><h3><small>1</small>Evidence, not proof</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="300" viewBox="0 0 810 300">
          ${beaker(150, 40, 'rgba(127,200,240,.4)', bubbles('bb'))}<g transform="translate(215 278)"><g class="bfl">${flame()}</g></g>
          <text x="340" y="130" font-size="38" font-weight="900" data-at="2" data-fx="fade">Boiling water</text>
          <text x="340" y="180" font-size="34" font-weight="800" class="f-muted" data-at="2@0.3" data-fx="fade">makes bubbles too…</text>
          <text x="340" y="236" font-size="38" font-weight="900" class="f-teal" data-at="2@0.6" data-fx="fade">still just water</text>
        </svg></div>
      <div class="x-stamp" style="left:560px;top:668px" data-at="2@0.75" data-fx="pop"><div>NOT PROOF</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:470px" data-at="3"><h3><small>2</small>The reversibility test</h3>
        <div class="x-quote"><span class="q">“Physical = can be reversed”<i class="strike" data-at="4" data-fx="grow" data-dur="0.35"></i></span></div>
        <div class="x-line" style="top:240px" data-at="5@0.05" data-fx="fade"><i style="background:var(--warm)"></i>Many chemical reactions are reversible</div>
        <div class="x-line" style="top:320px" data-at="5@0.5" data-fx="fade"><i style="background:var(--accent)"></i>Some physical changes are hard to undo</div></div>
      <div class="x-stamp" style="left:1460px;top:680px" data-at="4+0.2" data-fx="pop"><div>POOR TEST</div></div>
      <div class="banner" style="top:812px" data-at="6" data-fx="pop">The reliable test: <span class="warm">composition</span></div>
      <div style="position:absolute;left:0;right:0;top:952px;text-align:center;font-size:36px;font-weight:800;color:var(--muted)" data-at="7" data-fx="fade">different substances, different formulas ${ARR} <b style="color:var(--warm)">a chemical change</b></div>`,
    update(c) {
      rise(c, '.bb')
      c.$('.bfl').setAttribute('transform', `scale(.8 ${0.8 + 0.06 * Math.sin(c.t * 9)})`)
    },
  })

  // ---------- particle view: bromine evaporating ----------
  const BR_L = [[-150, -55, 20], [0, -65, -30], [150, -50, 60], [-140, 60, -10], [10, 55, 40], [160, 65, -50]]
  const BR_G = [[330, 660, 30], [640, 850, -20], [930, 650, 70], [1240, 840, -60], [1520, 660, 10], [1700, 830, 50]]
  const NB = [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5]]
  const br2 = () => `<line x1="-30" y1="0" x2="30" y2="0" stroke="#eef0f7" stroke-width="12"/>${ball(-30, 0, 34, 'red', 'Br', 24)}${ball(30, 0, 34, 'red', 'Br', 24)}`
  EZ.scene('particles', {
    html: `<div class="kicker" data-at="in" data-fx="left">Particle view</div><h2 class="h1" data-at="0">Bonds, or the forces between particles?</h2>
      <div class="x-def" style="left:120px;border-color:rgba(243,167,100,.7)" data-at="1"><b class="warm">Chemical: bonds break and form</b><span>covalent, ionic or metallic</span></div>
      <div class="x-def" style="left:990px;border-color:rgba(60,199,188,.7)" data-at="2"><b class="teal">Physical: only the IMFs change</b><span>intermolecular interactions:<br>the forces between particles</span></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3" data-fx="fade">
        <g class="ldf">${NB.map((_, k) => `<line class="d${k}" stroke="#f3a764" stroke-width="5" stroke-dasharray="4 12" stroke-linecap="round"/>`).join('')}</g>
        ${BR_L.map((_, i) => `<g class="m${i}">${br2()}</g>`).join('')}
        </g><text x="960" y="925" text-anchor="middle" font-size="32" font-weight="800" class="f-muted" data-at="3" data-out="5" data-fx="fade">liquid bromine</text></svg>
      <div class="x-lab teal" style="left:120px" data-at="4" data-fx="fade">Br–Br bond inside each molecule: intact</div>
      <div class="x-lab warm" style="right:120px" data-at="5" data-fx="fade">LDFs between Br₂ molecules: overcome</div>
      <div class="x-ok" data-at="6" data-fx="pop"><span>Evaporation is physical</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[5].start + 0.3, b[5].start + 2.6))
      const P = BR_L.map(([x, y, a], i) => { const g = BR_G[i]; const w = (1 - p) * 4 * Math.sin(c.t * 2 + i)
        return [lerp(960 + x, g[0], p) + w, lerp(770 + y, g[1], p), lerp(a, g[2], p)] })
      P.forEach(([x, y, a], i) => c.$('.m' + i).setAttribute('transform', `translate(${x} ${y}) rotate(${a})`))
      NB.forEach(([i, j], k) => { const e = c.$('.d' + k); e.setAttribute('x1', P[i][0]); e.setAttribute('y1', P[i][1]); e.setAttribute('x2', P[j][0]); e.setAttribute('y2', P[j][1]) })
      c.$('.ldf').style.opacity = 1 - clamp(p * 2.5)
    },
  })

  // ---------- the gray zone: dissolving NaCl ----------
  const LAT = []
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) LAT.push([250 + k * 80, 470 + r * 80, (r + k) % 2 === 0])
  const FREE = { 7: [760, 450], 11: [740, 650] } // lattice index -> where it ends up in the water
  const ion = (na) => (na ? ball(0, 0, 24, 'warm', sup('Na', '+'), 17) : ball(0, 0, 38, 'teal', sup('Cl', '−'), 22))
  const shell = (na) => Array.from({ length: 6 }, (_, i) => { const th = (i * 60 + 15) * Math.PI / 180, d = na ? 60 : 76
    return water(d * Math.cos(th), d * Math.sin(th), (th * 180 / Math.PI) + (na ? -90 : 90), 0.85) }).join('')
  EZ.scene('gray', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The gray zone</div><h2 class="h1" data-at="0">Is dissolving physical or chemical?</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:450px;overflow:hidden" data-at="0@0.3">
        <div style="position:absolute;left:36px;top:20px;font-size:30px;font-weight:900">NaCl in water</div>
        <svg style="position:absolute;left:-120px;top:-300px" width="930" height="750" viewBox="0 0 930 750">
          <rect x="122" y="380" width="806" height="368" fill="#7fc8f0" opacity=".1"/>
          ${water(560, 420, 30, 0.85)}${water(880, 560, -60, 0.85)}${water(600, 640, 120, 0.85)}${water(590, 728, 200, 0.85)}
          <g class="h7">${shell(true)}</g><g class="h11">${shell(false)}</g>
          ${LAT.map(([, , na], i) => `<g class="i${i}">${ion(na)}</g>`).join('')}
          <text x="370" y="420" text-anchor="middle" font-size="28" font-weight="900" class="f-warm" data-at="1@0.35" data-fx="fade">ionic bonds break</text>
        </svg>
        <div style="position:absolute;left:36px;bottom:18px;font-size:28px;font-weight:900" class="teal" data-at="1@0.75" data-fx="fade">ion–dipole attractions form</div></div>
      <div class="x-arg" style="top:300px;border-color:rgba(243,167,100,.7)" data-at="2"><b class="warm">Bonds break</b><span>sounds chemical</span></div>
      <div class="x-arg" style="top:550px;border-color:rgba(60,199,188,.7)" data-at="3"><b class="teal">No new substance</b><span>the ions keep their identity in solution:<br>sounds physical</span></div>
      <div class="banner" style="top:800px" data-at="4" data-out="5" data-fx="pop">You can argue it <span class="warm">either way</span></div>
      <div class="card x-ans" data-at="5"><span class="lab">Free-response: support it at the particle level</span>
        <span data-at="6" data-fx="fade">“Dissolving is <b class="teal">physical</b> because the Na<sup>+</sup> and Cl<sup>−</sup> ions are <b class="teal">unchanged</b>; only their <b class="warm">surroundings</b> change.”</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[1].start + 0.3, b[1].start + 2.4))
      LAT.forEach(([x, y], i) => { const f = FREE[i]
        c.$('.i' + i).setAttribute('transform', f ? `translate(${lerp(x, f[0], p)} ${lerp(y, f[1], p)})` : `translate(${x} ${y})`) })
      const h = c.seg(b[1].start + 2.0, b[1].start + 2.8)
      c.$('.h7').setAttribute('transform', `translate(${FREE[7][0]} ${FREE[7][1]})`); c.$('.h7').style.opacity = h
      c.$('.h11').setAttribute('transform', `translate(${FREE[11][0]} ${FREE[11][1]})`); c.$('.h11').style.opacity = h
    },
  })

  // ---------- try it ----------
  const OPTS = ['Dry ice subliming', 'Sugar dissolving in tea', 'An iron nail rusting', 'Salt water being boiled dry']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which is a <span class="warm">chemical</span> change?</h2>
      ${OPTS.map((o, i) => `<div class="opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${330 + Math.floor(i / 2) * 160}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 2 ? OK : ''}<span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px;font-size:46px" data-at="8" data-fx="pop">Rusting forms a <span class="warm">new substance</span>: iron oxide</div>
      <div class="pillbox" style="left:120px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="8@0.6" data-fx="pop">Bonds break and form</div>
      <div class="pillbox" style="left:990px;border-color:var(--line);background:rgba(36,40,56,.8);font-size:33px" data-at="9" data-fx="pop">Others: phase changes, dissolving, separating</div>`,
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
  const m1 = `<svg width="460" height="200" viewBox="0 0 460 200">${[[70, 70, 0], [130, 70, 0], [70, 130, 0], [130, 130, 0]].map(([x, y, a]) => water(x, y, a)).join('')}
    <line x1="190" y1="100" x2="250" y2="100" stroke="#3cc7bc" stroke-width="6" marker-end="url(#mk-teal)"/>${[[300, 60, 40], [400, 90, -70], [320, 150, 150], [420, 160, 80]].map(([x, y, a]) => water(x, y, a)).join('')}</svg>`
  const m2 = `<svg width="460" height="200" viewBox="0 0 460 200"><line x1="60" y1="70" x2="120" y2="70" stroke="#eef0f7" stroke-width="8"/><line x1="60" y1="140" x2="120" y2="140" stroke="#eef0f7" stroke-width="8"/>
    ${ball(60, 70, 28, 'pur')}${ball(120, 70, 28, 'pur')}${ball(60, 140, 24, 'teal')}${ball(120, 140, 24, 'teal')}
    <line x1="180" y1="105" x2="240" y2="105" stroke="#f3a764" stroke-width="6" marker-end="url(#mk-warm)"/>
    <line x1="290" y1="70" x2="350" y2="70" stroke="#eef0f7" stroke-width="8"/><line x1="290" y1="140" x2="350" y2="140" stroke="#eef0f7" stroke-width="8"/>
    ${ball(290, 70, 28, 'pur')}${ball(350, 70, 24, 'teal')}${ball(290, 140, 28, 'pur')}${ball(350, 140, 24, 'teal')}</svg>`
  const m3 = `<svg width="460" height="200" viewBox="0 0 460 200"><g transform="translate(70 150) scale(.8)">${flame()}</g>
    ${beaker(140, 30, 'rgba(60,199,188,.35)', '<circle cx="40" cy="110" r="8" fill="none" stroke="#eef0f7" stroke-width="3"/><circle cx="70" cy="85" r="10" fill="none" stroke="#eef0f7" stroke-width="3"/><circle cx="95" cy="120" r="6" fill="none" stroke="#eef0f7" stroke-width="3"/>')}
    ${beaker(300, 30, '#8d8df0', '<circle cx="40" cy="140" r="8" fill="#f2c443"/><circle cx="62" cy="142" r="8" fill="#f2c443"/><circle cx="84" cy="140" r="8" fill="#f2c443"/>')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p><span class="teal">Physical:</span><br>same substances,<br>typically only<br>IMFs change</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p><span class="warm">Chemical:</span><br>new substances,<br>bonds break<br>and form</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p><span class="gold">Evidence:</span><br>heat or light, gas,<br>a precipitate,<br>a color change</p></div>`,
  })
})()
