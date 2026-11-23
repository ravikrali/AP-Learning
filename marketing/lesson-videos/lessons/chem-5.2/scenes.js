// Pictures for chem-5.2 "Rate Laws & the Method of Initial Rates". One EZ.scene per scene id in
// script.mjs. Every number shown is the lesson's own (app/src/content/chem/u5.ts). Bar lengths are
// the lesson's own factors (×1, ×2, ×4); the particle boxes in the hook show "double", nothing more.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .r-eq{position:absolute;left:120px;width:1680px;text-align:center;font-weight:900;white-space:nowrap}
    .r-note{position:absolute;padding:22px 30px 24px 34px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);border-left-width:10px}
    .r-note b{display:block;font-size:40px;font-weight:900;line-height:1.15} .r-note span{display:block;margin-top:8px;font-size:28px;font-weight:700;color:var(--muted);line-height:1.3}
    .r-out{position:absolute;left:1000px;width:800px;height:110px;border-radius:26px;background:rgba(36,40,56,.85);border:2px solid var(--line);font-size:46px;font-weight:900;line-height:106px;padding-left:40px;white-space:nowrap}
    .r-out i{position:absolute;right:34px;top:0;font-style:normal;font-size:60px;color:var(--gold)}
    .r-th{position:absolute;top:296px;font-size:26px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
    .r-row{position:absolute;left:120px;width:1680px;height:130px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .r-row .lb{position:absolute;left:40px;top:36px;font-size:50px;font-weight:900;white-space:nowrap}
    .r-bar{position:absolute;top:47px;height:36px;border-radius:18px}
    .r-tag{position:absolute;right:30px;top:22px;height:84px;padding:0 30px;border-radius:20px;font-size:50px;font-weight:900;line-height:80px;white-space:nowrap;border:2px solid currentColor;background:rgba(255,255,255,.05)}
    .r-tab{position:absolute;left:120px;top:300px;width:1060px;height:400px}
    .r-tab .c{position:absolute;width:240px;text-align:center;white-space:nowrap}
    .r-tab .hd{top:34px;font-size:26px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
    .r-tab .v{font-size:46px;font-weight:900}
    .r-hl{position:absolute;border-radius:18px;border:4px solid}
    .r-cmp{position:absolute;left:1240px;width:560px;height:190px;padding:20px 34px}
    .r-cmp small{display:block;font-size:26px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .r-cmp .s{display:block;margin-top:6px;font-size:34px;font-weight:800;white-space:nowrap} .r-cmp .m{display:block;margin-top:10px;font-size:52px;font-weight:900;white-space:nowrap}
    .r-big{position:absolute;top:440px;height:300px;font-size:72px;font-weight:900;white-space:nowrap;text-align:center}
    .r-frac{display:inline-block;vertical-align:middle;text-align:center}
    .r-frac > span{display:block;padding:0 14px} .r-frac > span:first-child{border-bottom:6px solid currentColor;padding-bottom:6px;margin-bottom:6px}
    .r-ans{position:absolute;left:120px;top:800px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .r-ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .r-chip{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:800;line-height:68px;white-space:nowrap}
    .r-urow{position:absolute;left:120px;width:880px;height:110px;border-radius:24px;background:rgba(36,40,56,.8);border:2px solid var(--line);font-size:46px;font-weight:900;line-height:106px;white-space:nowrap}
    .r-urow .o{position:absolute;left:40px} .r-urow .u{position:absolute;left:480px}
    .r-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .r-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .r-tile .f{margin-top:60px;font-size:96px;font-weight:900;line-height:1} .r-tile .ch{margin-top:16px;font-size:40px;font-weight:800;color:var(--muted)}
    .r-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px} .r-tile .ok svg,.r-ok svg{display:block;width:100%;height:100%}
    .r-rc{top:320px;width:540px;height:560px;text-align:center} .r-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .r-rc svg{display:block;margin:14px auto 0} .r-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const CROSS = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></svg>'
  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', GOOD = '#4cc781'
  // a thermometer; the class on the mercury lets update() raise it
  const thermo = (x, y, k, cls = '') => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-16" y="0" width="32" height="160" rx="16" fill="rgba(255,255,255,.06)" stroke="#c9cee0" stroke-width="4"/>
    <rect class="${cls}" x="-8" y="70" width="16" height="110" rx="8" fill="#f0707a"/><circle cx="0" cy="182" r="28" fill="#f0707a" stroke="#c9cee0" stroke-width="4"/></g>`

  // ---------- intro artwork: faint rate bars (×1, ×2, ×4) at the left and right edges ----------
  const bars = (x, flip) => [1, 2, 4].map((f, i) => `<rect class="ib" data-f="${f}" x="${flip ? x - i * 74 - 50 : x + i * 74}" y="900" width="50" height="0" rx="12" fill="${[PUR, TEAL, WARM][i]}"/>`).join('')
  EZ.intro = {
    chips: [['1@0.3', 'The rate law'], ['1@0.55', 'Initial rates'], ['1@0.82', 'k and its units']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${bars(90, false)}${bars(1830, true)}</svg>`,
    update(c) {
      const s = c.sc.start
      c.root.querySelectorAll('.ib').forEach((r, i) => {
        const h = 60 * +r.dataset.f * eio(c.seg(s + 0.4 + (i % 3) * 0.4, s + 1.6 + (i % 3) * 0.4))
        r.setAttribute('y', 900 - h); r.setAttribute('height', h)
      })
    },
  }

  // ---------- hook: double it, how much faster? ----------
  const dots = (n, x0, cls) => Array.from({ length: n }, (_, i) => `<g class="${cls}" data-i="${i}"><g transform="translate(${x0 + 60 + (i % 4) * 60} ${90 + Math.floor(i / 4) * 80})">${ball(0, 0, 22, 'pur')}</g></g>`).join('')
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="1">Double it. How much faster?</h2>
      <div class="card" style="left:120px;top:300px;width:800px;height:390px" data-at="1@0.2">
        <svg style="position:absolute;left:0;top:20px" width="800" height="360" viewBox="0 0 800 360">
          <rect x="40" y="40" width="300" height="230" rx="24" fill="rgba(255,255,255,.04)" stroke="#c9cee0" stroke-width="3"/>
          ${dots(4, 40, 'h1d')}
          <text x="190" y="320" text-anchor="middle" font-size="38" font-weight="900" class="f-pri">[A]</text>
          <g data-at="1@0.45" data-fx="fade"><line x1="358" y1="155" x2="438" y2="155" stroke="#f2c443" stroke-width="7" marker-end="url(#mk-gold)"/><text x="398" y="130" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">×2</text></g>
          <g data-at="1@0.5" data-fx="fade"><rect x="460" y="40" width="300" height="230" rx="24" fill="rgba(255,255,255,.04)" stroke="#c9cee0" stroke-width="3"/>
          ${dots(8, 460, 'h2d')}
          <text x="610" y="320" text-anchor="middle" font-size="38" font-weight="900" class="f-pri">2 × [A]</text></g>
        </svg></div>
      <div class="r-out" style="top:300px" data-at="2@0.2" data-fx="right"><span class="teal">2×</span> faster<i data-at="2@0.8" data-fx="pop">?</i></div>
      <div class="r-out" style="top:440px" data-at="2@0.4" data-fx="right"><span class="warm">4×</span> faster<i data-at="2@0.85" data-fx="pop">?</i></div>
      <div class="r-out" style="top:580px" data-at="2@0.65" data-fx="right"><span class="muted">no change</span><i data-at="2@0.9" data-fx="pop">?</i></div>
      <div class="banner" style="top:740px" data-at="3" data-fx="pop">The <span class="gold">rate law</span> tells you which</div>
      <div style="position:absolute;left:0;top:880px;width:1920px;text-align:center;font-size:42px;font-weight:800;color:var(--muted)" data-at="4" data-fx="up">found only by <span class="teal">experiment</span></div>`,
    update(c) {
      for (const g of c.root.querySelectorAll('.h1d, .h2d')) {
        const i = +g.dataset.i + (g.classList.contains('h2d') ? 4 : 0)
        g.setAttribute('transform', `translate(${5 * Math.sin(c.t * 1.7 + i * 1.3)} ${5 * Math.cos(c.t * 1.3 + i * 2.1)})`)
      }
    },
  })

  // ---------- the rate law ----------
  EZ.scene('ratelaw', {
    html: `<div class="kicker" data-at="in" data-fx="left">The rate law</div><h2 class="h1" data-at="0">One equation, three parts</h2>
      <div class="card r-eq" style="top:300px;height:200px;line-height:196px;font-size:110px" data-at="1">rate = <span class="warm">k</span>[A]<sup class="pri">m</sup>[B]<sup class="teal">n</sup></div>
      <div class="r-note" style="left:120px;top:550px;width:520px;height:300px;border-left-color:var(--primary)" data-at="2" data-fx="up"><b><em class="pri" style="font-style:normal">m</em>, <em class="teal" style="font-style:normal">n</em> = orders</b><span>with respect to A and B</span><span data-at="2@0.6" data-fx="fade">usually <b style="display:inline;font-size:34px;color:var(--text)">0, 1 or 2</b></span></div>
      <div class="r-note" style="left:700px;top:550px;width:520px;height:300px;border-left-color:var(--gold)" data-at="3" data-fx="up"><b class="gold">Overall order</b><span>add them up:</span><b style="margin-top:20px;font-size:64px"><em class="pri" style="font-style:normal">m</em> + <em class="teal" style="font-style:normal">n</em></b></div>
      <div class="r-note" style="left:1280px;top:550px;width:520px;height:300px;border-left-color:var(--warm);padding-right:120px" data-at="4" data-fx="up"><b class="warm">k = rate constant</b>
        <span data-at="5" data-fx="fade">depends on <em style="font-style:normal;color:var(--text)">temperature</em>,<br>not on concentration</span>
        <span data-at="5@0.6" data-fx="fade">units depend on<br>the overall order</span>
        <svg style="position:absolute;right:24px;top:40px" width="80" height="230" viewBox="-40 -10 80 230" data-at="5" data-fx="fade">${thermo(0, 0, 1, 'r-merc')}</svg></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[5].start + 0.3, b[5].start + 1.5)), y = lerp(70, 20, p)
      c.$('.r-merc').setAttribute('y', y); c.$('.r-merc').setAttribute('height', 180 - y)
    },
  })

  // ---------- what the order means: double [A] ----------
  const F = [1, 2, 4], COL = [['#7d859c', '#a3abbd'], ['#1b7f77', TEAL], ['#b96a26', WARM]]
  EZ.scene('order', {
    html: `<div class="kicker" data-at="in" data-fx="left">What the order means</div><h2 class="h1" data-at="1">Double [A]: what happens to the rate?</h2>
      <div class="r-th" style="left:160px" data-at="1@0.5" data-fx="fade">Order in A</div><div class="r-th" style="left:450px" data-at="1@0.6" data-fx="fade">[A]</div><div class="r-th" style="left:820px" data-at="1@0.7" data-fx="fade">Rate</div>
      ${F.map((f, i) => `<div class="r-row" style="top:${340 + i * 150}px" data-at="${2 + i}">
        <div class="lb">Order ${i}</div>
        <div class="r-bar o${i}a" style="left:330px;background:linear-gradient(90deg,#5b5bd6,#8d8df0)"></div>
        <div class="r-bar o${i}b" style="left:700px;background:linear-gradient(90deg,${COL[i][0]},${COL[i][1]})"></div>
        <div class="r-tag" style="color:${COL[i][1]}" data-at="${2 + i}@0.6" data-fx="pop">${i === 0 ? 'no change ×1' : i === 1 ? 'doubles ×2' : 'quadruples ×4'}</div></div>`).join('')}
      <div class="banner" style="top:810px" data-at="5" data-fx="pop">[A] × <span class="gold">x</span> ${ARR} rate × <span class="gold">x</span><sup class="warm">order</sup></div>`,
    update(c) {
      const b = c.b
      F.forEach((f, i) => {
        const s = b[2 + i].start
        c.$(`.o${i}a`).style.width = `${110 * lerp(1, 2, eio(c.seg(s + 0.2, s + 0.8)))}px`
        c.$(`.o${i}b`).style.width = `${120 * lerp(1, f, eio(c.seg(s + 0.8, s + 1.6)))}px`
      })
    },
  })

  // ---------- method of initial rates ----------
  const COLS = [90, 330, 570, 850] // centres of the table columns inside the card
  const ROWS = [['1', '0.10', '0.10', '2.0 × 10<sup>−3</sup>'], ['2', '0.20', '0.10', '8.0 × 10<sup>−3</sup>'], ['3', '0.10', '0.20', '2.0 × 10<sup>−3</sup>']]
  const RY = (i) => 110 + i * 92
  const hl = (col, row, color, w = 220) => `<div class="r-hl" style="left:${COLS[col] - w / 2}px;top:${RY(row) - 6}px;width:${w}px;height:80px;border-color:${color}"></div>`
  EZ.scene('table', {
    html: `<div class="kicker" data-at="in" data-fx="left">Method of initial rates</div><h2 class="h1" data-at="0">Find the orders from data</h2>
      <div class="card r-tab" data-at="1">
        ${['Exp', '[A] (M)', '[B] (M)', 'Initial rate (M/s)'].map((h, j) => `<div class="c hd" style="left:${COLS[j] - (j === 3 ? 170 : 120)}px;width:${j === 3 ? 340 : 240}px">${h}</div>`).join('')}
        ${ROWS.map((r, i) => r.map((v, j) => `<div class="c v${j === 0 ? ' muted' : ''}" style="left:${COLS[j] - (j === 3 ? 170 : 120)}px;width:${j === 3 ? 340 : 240}px;top:${RY(i) + 10}px" data-at="1@${0.3 + i * 0.15}" data-fx="fade">${v}</div>`).join('')).join('')}
        <div data-at="3" data-out="5" data-fx="fade">${hl(1, 0, TEAL)}${hl(1, 1, TEAL)}${hl(3, 0, WARM, 320)}${hl(3, 1, WARM, 320)}</div>
        <div data-at="5" data-fx="fade">${hl(2, 0, TEAL)}${hl(2, 2, TEAL)}${hl(3, 0, WARM, 320)}${hl(3, 2, WARM, 320)}</div>
      </div>
      <div class="card r-cmp" style="top:300px" data-at="3" data-fx="right"><small>Exp 1 → 2</small><span class="s"><span class="teal">[A] ×2</span>, [B] same, <span class="warm">rate ×4</span></span>
        <span class="m" data-at="4" data-fx="fade">2<sup>m</sup> = 4 ${ARR} <span class="pri">m = 2</span></span></div>
      <div class="card r-cmp" style="top:510px" data-at="5" data-fx="right"><small>Exp 1 → 3</small><span class="s"><span class="teal">[B] ×2</span>, [A] same, <span class="warm">rate ×1</span></span>
        <span class="m" data-at="6" data-fx="fade">2<sup>n</sup> = 1 ${ARR} <span class="teal">n = 0</span></span></div>
      <div class="r-chip" style="left:120px;top:730px;border-color:rgba(242,196,67,.6)" data-at="2" data-fx="pop">compare experiments where <span class="gold">only one</span> concentration changes</div>
      <div class="banner" style="top:830px;padding:18px 40px" data-at="7" data-fx="pop">rate = k[A]<sup>2</sup> &nbsp;<span class="muted" style="font-size:40px">·</span>&nbsp; <span class="warm">second order overall</span></div>`,
  })

  // ---------- find k ----------
  EZ.scene('findk', {
    html: `<div class="kicker" data-at="in" data-fx="left">The rate constant</div><h2 class="h1" data-at="0">Find k from experiment 1</h2>
      <div class="r-chip" style="left:120px;top:300px" data-at="0@0.5" data-fx="pop">Exp 1: &nbsp;[A] = <span class="pri">0.10 M</span> &nbsp;·&nbsp; [B] = 0.10 M &nbsp;·&nbsp; rate = <span class="warm">2.0 × 10<sup>−3</sup> M/s</span></div>
      <div class="card r-big" style="left:120px;width:620px;padding-top:40px" data-at="1"><span class="warm">k</span> = <span class="r-frac"><span class="warm">rate</span><span class="pri">[A]<sup>2</sup></span></span></div>
      <div class="card r-big" style="left:800px;width:1000px;padding-top:40px" data-at="2"><span class="warm">k</span> = <span class="r-frac"><span class="warm">2.0 × 10<sup>−3</sup></span><span class="pri">(0.10)<sup>2</sup></span></span>
        <span data-at="3@0.75" data-fx="pop"> = <span class="good">0.20</span></span></div>
      <div class="r-ans" data-at="4" data-fx="pop"><span class="good">k = 0.20 M<sup>−1</sup>s<sup>−1</sup></span>${CHECK}</div>`,
    update(c) {
      const w = eo(c.seg(c.b[4].start + 0.3, c.b[4].start + 0.8))
      c.$('.r-ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- quick trick: units of k ----------
  const UNITS = [['0', 'M s<sup>−1</sup>'], ['1', 's<sup>−1</sup>'], ['2', 'M<sup>−1</sup> s<sup>−1</sup>'], ['3', 'M<sup>−2</sup> s<sup>−1</sup>']]
  EZ.scene('units', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Units of k from the overall order</h2>
      <div class="r-chip" style="left:120px;top:290px;border-color:rgba(60,199,188,.6)" data-at="1" data-fx="pop">rate is always in <span class="teal">M/s</span></div>
      <div class="r-th" style="left:160px;top:396px" data-at="2" data-fx="fade">Overall order</div><div class="r-th" style="left:600px;top:396px" data-at="2" data-fx="fade">Units of k</div>
      ${UNITS.map(([o, u], i) => `<div class="r-urow u${i}" style="top:${440 + i * 124}px" data-at="${2 + i}"><span class="o pri">${o}</span><span class="u warm">${u}</span></div>`).join('')}
      <div class="card" style="left:1080px;top:440px;width:720px;height:230px;text-align:center" data-at="6" data-fx="right"><h3 style="padding-top:26px">The pattern</h3>
        <div style="margin-top:22px;font-size:72px;font-weight:900;white-space:nowrap">M<sup class="pri" style="font-size:44px">(1 − order)</sup> s<sup>−1</sup></div></div>
      <div class="card" style="left:1080px;top:700px;width:720px;height:230px;text-align:center" data-at="7" data-fx="right"><h3 style="padding-top:26px">k in <span class="warm">s<sup>−1</sup></span>?</h3>
        <div style="margin-top:22px;font-size:60px;font-weight:900" class="good">first order</div></div>`,
    update(c) {
      const w = eo(c.seg(c.b[7].start + 0.2, c.b[7].start + 0.7))
      c.$('.u1').style.borderColor = w ? `rgba(76,199,129,${w})` : ''
      c.$('.u1').style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- the trap ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="1">Orders are not coefficients</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:250px" data-at="1@0.3"><h3 class="muted" style="font-size:34px">Balanced equation</h3>
        <div style="position:absolute;left:40px;top:96px;font-size:64px;font-weight:900;white-space:nowrap"><span class="bad">a</span>A + <span class="bad">b</span>B → products</div>
        <div style="position:absolute;left:40px;top:186px;font-size:32px;font-weight:800" class="bad" data-at="1@0.7" data-fx="fade">coefficients ≠ orders</div>
        <div class="r-ok" style="position:absolute;right:30px;top:24px;width:80px;height:80px" data-at="1@0.6" data-fx="pop">${CROSS}</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:250px" data-at="2"><h3 class="muted" style="font-size:34px">Experimental data</h3>
        <svg style="position:absolute;left:40px;top:96px" width="400" height="130" viewBox="0 0 400 130">
          ${[0, 1, 2].map((i) => `<rect x="0" y="${i * 42}" width="380" height="34" rx="10" fill="rgba(255,255,255,.07)"/><rect x="250" y="${i * 42 + 8}" width="${[60, 110, 60][i]}" height="18" rx="9" fill="${WARM}"/><rect x="20" y="${i * 42 + 8}" width="${[60, 110, 60][i] * 1.4}" height="18" rx="9" fill="${PUR}" opacity=".8"/>`).join('')}</svg>
        <div style="position:absolute;left:470px;top:110px;font-size:40px;font-weight:900;line-height:1.2" class="good">orders come<br>from here</div>
        <div class="r-ok" style="position:absolute;right:30px;top:24px;width:80px;height:80px" data-at="2@0.4" data-fx="pop">${CHECK}</div></div>
      <div class="r-chip" style="left:120px;top:580px;border-color:rgba(242,196,67,.6)" data-at="3" data-fx="pop">only exception: a reaction that is a <span class="gold">single elementary step</span></div>
      <div class="card" style="left:120px;top:690px;width:810px;height:230px" data-at="4"><h3 style="font-size:36px">Change a concentration</h3>
        <div style="position:absolute;left:40px;top:96px;font-size:44px;font-weight:900;line-height:1.35">rate <span class="warm">changes</span><br><span class="warm">k</span> <span class="muted">stays the same</span></div></div>
      <div class="card" style="left:990px;top:690px;width:810px;height:230px" data-at="5"><h3 style="font-size:36px">Change the temperature</h3>
        <div style="position:absolute;left:40px;top:96px;font-size:44px;font-weight:900;line-height:1.35">or add a catalyst<br><span class="warm">k changes</span></div>
        <svg style="position:absolute;right:50px;top:20px" width="70" height="200" viewBox="-35 -6 70 220">${thermo(0, 0, 0.92, 'r-merc2')}</svg></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[5].start + 0.3, b[5].start + 1.4)), y = lerp(80, 20, p)
      c.$('.r-merc2').setAttribute('y', y); c.$('.r-merc2').setAttribute('height', 180 - y)
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', '3×'], ['B', '6×'], ['C', '9×'], ['D', '27×']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:58px" data-at="1">rate = k[X][Y]<sup>2</sup>. Triple [Y], keep [X]. The rate becomes…</h2>
      ${OPTS.map(([l, f], i) => `<div class="r-tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.6 + i * 0.1}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok">${CHECK}</div>` : ''}
        <div class="f">${f}</div>${i === 2 ? '<div class="ch" data-at="4@0.5" data-fx="fade">3<sup>2</sup> = 9</div>' : ''}</div>`).join('')}
      <svg class="full r-count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="r-arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="r-num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:740px" data-at="4" data-fx="pop">Second order in Y: <span class="teal">3<sup>2</sup> = 9</span></div>
      <div style="position:absolute;left:0;top:880px;width:1920px;text-align:center;font-size:44px;font-weight:900" data-at="5" data-fx="up">the rate goes <span class="good">9× faster</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.r-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.r-arc').setAttribute('stroke-dashoffset', p)
      c.$('.r-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="40" y="120" font-size="50" font-weight="900">rate = <tspan class="f-warm">k</tspan>[A]<tspan dy="-22" font-size="32" class="f-pri">m</tspan><tspan dy="22">[B]</tspan><tspan dy="-22" font-size="32" class="f-teal">n</tspan></text></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210">${[1, 2, 4].map((f, i) => `<rect x="${110 + i * 90}" y="${190 - f * 40}" width="60" height="${f * 40}" rx="12" fill="${[PUR, TEAL, WARM][i]}"/><text x="${140 + i * 90}" y="${180 - f * 40}" text-anchor="middle" font-size="30" font-weight="900">×${f}</text>`).join('')}</svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210">${thermo(110, 6, 0.85)}<text x="170" y="125" font-size="48" font-weight="900" class="f-warm">M<tspan dy="-22" font-size="28">(1 − order)</tspan><tspan dy="22" dx="10">s</tspan><tspan dy="-22" font-size="30">−1</tspan></text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card r-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>The orders come<br>from <span class="teal">experiment</span>,<br>not coefficients</p></div>
      <div class="card r-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Change only one:<br><span class="gold">(factor)<sup>order</sup></span><br>= rate factor</p></div>
      <div class="card r-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="warm">k</span> depends on<br><span class="warm">temperature</span>; units<br>from overall order</p></div>`,
  })
  void clamp; void sup; void GOOD
})()
