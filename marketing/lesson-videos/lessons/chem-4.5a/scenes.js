// Pictures for chem-4.5a "Stoichiometry: The Mole Ratio". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u4.ts; the methane masses and the
// units-cancel habit are from book.ts). Atom sizes are drawn in the right order, not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .s-foot{position:absolute;left:0;right:0;bottom:28px;text-align:center;font-size:36px;font-weight:900;white-space:nowrap}
    .s-eq{left:120px;top:290px;width:1680px;height:190px}
    .s-term{position:absolute;top:22px;width:360px;margin-left:-180px;text-align:center;font-size:84px;font-weight:900;line-height:1;white-space:nowrap}
    .s-term small{display:block;margin-top:14px;font-size:38px;font-weight:900}
    .s-box{position:absolute;width:320px;height:120px;margin-left:-160px;border-radius:26px;background:rgba(36,40,56,.95);border:3px solid var(--line);text-align:center;font-size:46px;font-weight:900;line-height:112px;white-space:nowrap}
    .s-lvl{position:absolute;font-size:26px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
    .s-prob{left:120px;top:290px;width:1680px;height:130px;padding:38px 48px 0;font-size:46px;font-weight:800;white-space:nowrap}
    .s-row{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .s-row .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;font-size:38px;font-weight:900;line-height:68px;text-align:center;color:#10131c}
    .s-row .lb{position:absolute;left:124px;top:36px;font-size:36px;font-weight:900;white-space:nowrap}
    .s-row .eq{position:absolute;left:400px;top:34px;font-size:42px;font-weight:900;white-space:nowrap}
    .s-res{position:absolute;right:22px;top:18px;height:80px;padding:0 30px;border-radius:20px;font-size:44px;font-weight:900;line-height:76px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .s-line{position:absolute;left:50px;right:50px;font-size:48px;font-weight:900;white-space:nowrap;text-align:center}
    .s-fr{display:inline-block;vertical-align:middle;margin:0 10px;text-align:center;font-size:40px;line-height:1.15}
    .s-fr .t{display:block;padding:0 8px 6px;border-bottom:4px solid currentColor} .s-fr .b{display:block;padding:6px 8px 0}
    .s-x{position:relative;display:inline-block} .s-x i{position:absolute;left:-6px;right:-6px;top:50%;height:7px;margin-top:-3px;border-radius:4px;background:var(--bad)}
    .s-quote{left:120px;top:420px;width:1680px;height:150px;text-align:center;font-size:60px;font-weight:900;line-height:146px}
    .s-quote .q{position:relative;display:inline-block} .s-quote .q i{position:absolute;left:-14px;right:-14px;top:50%;height:9px;margin-top:-4px;border-radius:5px;background:var(--bad)}
    .s-stamp{position:absolute;right:90px;top:396px} .s-stamp div{transform:rotate(-10deg);padding:2px 26px;border:8px solid var(--bad);border-radius:16px;color:var(--bad);font-size:64px;font-weight:900;letter-spacing:.08em;background:rgba(14,16,24,.88)}
    .s-chx{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:800;line-height:68px;white-space:nowrap}
    .s-ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .s-ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .s-rc{top:320px;width:540px;height:560px;text-align:center} .s-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .s-rc svg{display:block;margin:14px auto 0} .s-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', RED = '#f0707a', GREEN = '#4cc781'
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  // atoms: N and O drawn larger than H (right order, not to scale)
  const N = (x, y, r = 40) => ball(x, y, r, 'pur', 'N')
  const H = (x, y, r = 26) => ball(x, y, r, 'gray', 'H')
  const O = (x, y, r = 36) => ball(x, y, r, 'teal', 'O')
  const HOFF = [[-58, 34], [58, 34], [0, -66]]
  const nh3 = (x, y, k = 1) => HOFF.map(([dx, dy]) => H(x + dx * k, y + dy * k, 26 * k)).join('') + N(x, y, 40 * k)
  const n2 = (x, y, k = 1) => N(x - 40 * k, y, 40 * k) + N(x + 40 * k, y, 40 * k)
  const h2 = (x, y, k = 1) => H(x - 24 * k, y, 26 * k) + H(x + 24 * k, y, 26 * k)
  const o2 = (x, y, k = 1) => O(x - 34 * k, y, 36 * k) + O(x + 34 * k, y, 36 * k)

  // ---------- intro artwork: faint molecules at the edges, a bridge drawn under the chips ----------
  const ARCH = 'M600 932 Q960 770 1320 932'
  EZ.intro = {
    chips: [['1@0.32', 'A recipe in moles'], ['1@0.55', 'The mole bridge'], ['1@0.8', 'Grams to grams']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${n2(170, 300)}${h2(150, 760)}${h2(270, 880)}${nh3(1750, 320)}${nh3(1720, 820)}
      <path class="ia" d="${ARCH}" fill="none" stroke="${PUR}" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      <line class="id" x1="560" y1="932" x2="1360" y2="932" stroke="${TEAL}" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`,
    update(c) {
      const s = c.sc.start
      c.$('.id').style.strokeDashoffset = 1 - eio(c.seg(s + 0.3, s + 1.8))
      c.$('.ia').style.strokeDashoffset = 1 - eio(c.seg(s + 1.2, s + 3.2))
    },
  }

  // ---------- hook: a kitchen recipe, then a chemical one ----------
  const egg = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="24" ry="31" fill="#f4ead6"/><ellipse cx="${x - 8}" cy="${y - 12}" rx="8" ry="6" fill="#fff" opacity=".6"/>`
  const cup = (x, y) => `<path d="M${x - 30} ${y - 30} L${x + 30} ${y - 30} L${x + 24} ${y + 32} L${x - 24} ${y + 32} Z" fill="#363c54" stroke="#c9cee0" stroke-width="4" stroke-linejoin="round"/>
    <path d="M${x - 28} ${y - 18} Q${x} ${y - 46} ${x + 28} ${y - 18} Z" fill="#f4ead6"/><path d="M${x + 30} ${y - 18} q22 4 18 22 q-4 14 -21 12" fill="none" stroke="#c9cee0" stroke-width="4"/>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think like a cook</div><h2 class="h1" data-at="0">Stoichiometry is a recipe</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:560px" data-at="1"><h3>Kitchen recipe</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="450" viewBox="0 0 810 450">
          <g data-at="1@0.2" data-fx="pop">${egg(290, 90)}${egg(350, 90)}</g>
          <text x="430" y="104" text-anchor="middle" font-size="48" font-weight="900" class="f-muted" data-at="1@0.4" data-fx="fade">:</text>
          <g data-at="1@0.55" data-fx="pop">${cup(520, 90)}</g>
          <text x="320" y="170" text-anchor="middle" font-size="32" font-weight="900" class="f-gold" data-at="1@0.3" data-fx="fade">2 eggs</text>
          <text x="520" y="170" text-anchor="middle" font-size="32" font-weight="900" class="f-muted" data-at="1@0.6" data-fx="fade">1 cup flour</text>
          <g data-at="2@0.3" data-fx="fade"><line x1="420" y1="196" x2="420" y2="262" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/>
            <text x="448" y="240" font-size="38" font-weight="900" class="f-warm">× 3</text></g>
          ${[0, 1, 2, 3, 4, 5].map((i) => `<g data-at="2@${0.62 + i * 0.04}" data-fx="pop">${egg(130 + i * 56, 330)}</g>`).join('')}
          <text x="490" y="344" text-anchor="middle" font-size="48" font-weight="900" class="f-muted" data-at="2@0.6" data-fx="fade">:</text>
          ${[0, 1, 2].map((i) => `<g data-at="2@${0.5 + i * 0.05}" data-fx="pop">${cup(570 + i * 80, 330)}</g>`).join('')}
          <text x="270" y="410" text-anchor="middle" font-size="32" font-weight="900" class="f-gold" data-at="2@0.85" data-fx="fade">6 eggs</text>
          <text x="650" y="410" text-anchor="middle" font-size="32" font-weight="900" class="f-muted" data-at="2@0.7" data-fx="fade">3 cups flour</text>
        </svg></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:560px" data-at="3"><h3>Chemical recipe</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="450" viewBox="0 0 810 450">
          <g data-at="4" data-fx="fade">
            <text x="150" y="150" text-anchor="middle" font-size="64" font-weight="900">N₂</text><text x="250" y="150" text-anchor="middle" font-size="64" font-weight="900" class="f-muted">+</text>
            <text x="365" y="150" text-anchor="middle" font-size="64" font-weight="900"><tspan class="f-warm">3</tspan>H₂</text>
            <text x="505" y="150" text-anchor="middle" font-size="64" font-weight="900" class="f-muted">→</text>
            <text x="650" y="150" text-anchor="middle" font-size="64" font-weight="900"><tspan class="f-warm">2</tspan>NH₃</text></g>
          <g data-at="4@0.4" data-fx="fade"><path d="M90 196 v16 h360 v-16" fill="none" stroke="${TEAL}" stroke-width="5"/><text x="270" y="262" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">ingredients</text></g>
          <g data-at="4@0.6" data-fx="fade"><path d="M560 196 v16 h180 v-16" fill="none" stroke="${PUR}" stroke-width="5"/><text x="650" y="262" text-anchor="middle" font-size="34" font-weight="900" class="f-pri">the dish</text></g>
          <text x="405" y="370" text-anchor="middle" font-size="34" font-weight="800" class="f-muted" data-at="5@0.45" data-fx="fade">how much of one, from how much of another</text>
        </svg></div>
      <div class="banner" style="top:890px;padding:16px 40px" data-at="5" data-fx="pop">The balanced equation = a recipe in <span class="gold">moles</span></div>`,
  })

  // ---------- coefficients are mole ratios ----------
  const XS = { n2: 330, p1: 450, h2: 720, ar: 1050, nh3: 1470 }
  const HX = [560, 720, 880]
  const FROM = [[290, 640], [370, 640], ...HX.flatMap((x) => [[x - 24, 640], [x + 24, 640]])]
  const TO = [[1320, 640], [1620, 640], ...[1320, 1620].flatMap((x) => HOFF.map(([dx, dy]) => [x + dx, 640 + dy]))]
  // pair each reactant H with a product H
  const TO_H = [TO[2], TO[3], TO[4], TO[5], TO[6], TO[7]]
  EZ.scene('ratio', {
    html: `<div class="kicker" data-at="in" data-fx="left">Coefficients</div><h2 class="h1" data-at="0">Coefficients are mole ratios</h2>
      <div class="card s-eq" data-at="1">
        <div class="s-term" style="left:${XS.n2 - 120}px">N<sub>2</sub><small class="warm" data-at="2@0.15" data-fx="pop">1 mol</small></div>
        <div class="s-term muted" style="left:${XS.p1 - 120}px">+</div>
        <div class="s-term" style="left:${XS.h2 - 120}px"><span class="warm">3</span>H<sub>2</sub><small class="warm" data-at="2@0.4" data-fx="pop">3 mol</small></div>
        <div class="s-term muted" style="left:${XS.ar - 120}px">→</div>
        <div class="s-term" style="left:${XS.nh3 - 120}px"><span class="warm">2</span>NH<sub>3</sub><small class="warm" data-at="2@0.7" data-fx="pop">2 mol</small></div>
      </div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3@0.15" data-fx="pop">${n2(330, 640)}</g>
        <text x="${XS.p1}" y="656" text-anchor="middle" font-size="54" font-weight="900" class="f-muted" data-at="3@0.3" data-fx="fade">+</text>
        ${HX.map((x, i) => `<g data-at="3@${0.35 + i * 0.08}" data-fx="pop">${h2(x, 640)}</g>`).join('')}
        <line x1="990" y1="640" x2="1100" y2="640" stroke="#eef0f7" stroke-width="7" marker-end="url(#mk-text)" data-at="3@0.6" data-fx="fade"/>
        <g data-at="3@0.7" data-fx="pop"><g class="prod">${nh3(1320, 640)}<text x="1470" y="656" text-anchor="middle" font-size="54" font-weight="900" class="f-muted">+</text>${nh3(1620, 640)}</g></g>
        <g data-at="4@0.3" data-fx="fade"><text x="600" y="790" text-anchor="middle" font-size="44" font-weight="900"><tspan class="f-pri">2 N</tspan> · <tspan class="f-muted">6 H</tspan></text></g>
        <text x="1045" y="790" text-anchor="middle" font-size="54" font-weight="900" class="f-good" data-at="4@0.55" data-fx="pop">=</text>
        <g data-at="4@0.45" data-fx="fade"><text x="1470" y="790" text-anchor="middle" font-size="44" font-weight="900"><tspan class="f-pri">2 N</tspan> · <tspan class="f-muted">6 H</tspan></text></g>
        <g class="mv">${FROM.map((_, i) => `<g class="m${i}">${i < 2 ? N(0, 0) : H(0, 0)}</g>`).join('')}</g>
      </svg>
      <div class="banner" style="top:860px;padding:18px 40px" data-at="6" data-fx="pop">Coefficients compare <span class="gold">moles</span> (or molecules), <span class="bad">not grams</span></div>`,
    update(c) {
      const b = c.b, t0 = b[5].start + 0.3, t1 = t0 + 2.2
      const p = eio(c.seg(t0, t1)), on = c.seg(t0 - 0.2, t0) * (1 - c.seg(t1, t1 + 0.4))
      c.$('.mv').style.opacity = on
      FROM.forEach(([x, y], i) => {
        const [tx, ty] = i < 2 ? TO[i] : TO_H[i - 2]
        const arc = Math.sin(Math.PI * p) * (i % 2 ? -60 : 60)
        place(c.$('.m' + i), lerp(x, tx, p), lerp(y, ty, p) + arc)
      })
      c.$('.prod').style.opacity = 1 - 0.75 * c.seg(t0 - 0.2, t0) + 0.75 * c.seg(t1 - 0.1, t1 + 0.3)
    },
  })

  // ---------- the stoichiometry bridge ----------
  const LX = 420, RX = 1500, TY = 460, BY = 840
  EZ.scene('bridge', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">The stoichiometry bridge</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.1" data-fx="fade">${[808, 846, 884].map((y) => `<path d="M640 ${y} q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" fill="none" stroke="${TEAL}" stroke-width="5" opacity=".35"/>`).join('')}</g>
        <path d="M580 470 Q960 210 1340 470" fill="none" stroke="${PUR}" stroke-width="10" stroke-linecap="round" data-at="1@0.2" data-fx="draw"/>
        <line x1="580" y1="${TY}" x2="1340" y2="${TY}" stroke="#c9cee0" stroke-width="10" stroke-linecap="round" data-at="1@0.1" data-fx="draw"/>
        <g data-at="1@0.7" data-fx="fade">${[680, 780, 880, 960, 1040, 1140, 1240].map((x) => { const tq = (x - 580) / 760, y = (1 - tq) ** 2 * 470 + 2 * (1 - tq) * tq * 210 + tq * tq * 470
          return `<line x1="${x}" y1="${y.toFixed(0)}" x2="${x}" y2="${TY}" stroke="${PUR}" stroke-width="4" opacity=".6"/>` }).join('')}</g>
        <g data-at="3@0.1" data-fx="fade"><line x1="${LX}" y1="772" x2="${LX}" y2="540" stroke="${PUR}" stroke-width="8" marker-end="url(#mk-pri)"/>
          <circle cx="${LX + 52}" cy="636" r="22" fill="${PUR}"/><text x="${LX + 52}" y="647" text-anchor="middle" font-size="28" font-weight="900" class="f-dark">1</text>
          <text x="${LX + 88}" y="634" font-size="36" font-weight="900" class="f-pri">÷ molar mass</text><text x="${LX + 88}" y="676" font-size="36" font-weight="900" class="f-pri">of A</text></g>
        <g data-at="4@0.1" data-fx="fade"><circle cx="815" cy="532" r="22" fill="${WARM}"/><text x="815" y="543" text-anchor="middle" font-size="28" font-weight="900" class="f-dark">2</text>
          <text x="960" y="545" text-anchor="middle" font-size="40" font-weight="900" class="f-warm">× mole ratio</text>
          <text x="960" y="596" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">coefficient B / coefficient A</text></g>
        <g data-at="5@0.1" data-fx="fade"><line x1="${RX}" y1="540" x2="${RX}" y2="772" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
          <circle cx="${RX - 52}" cy="636" r="22" fill="${TEAL}"/><text x="${RX - 52}" y="647" text-anchor="middle" font-size="28" font-weight="900" class="f-dark">3</text>
          <text x="${RX - 88}" y="634" text-anchor="end" font-size="36" font-weight="900" class="f-teal">× molar mass</text><text x="${RX - 88}" y="676" text-anchor="end" font-size="36" font-weight="900" class="f-teal">of B</text></g>
        <g data-at="6@0.3" data-fx="pop"><path d="M920 806 l80 64 M1000 806 l-80 64" stroke="${RED}" stroke-width="12" stroke-linecap="round"/></g>
      </svg>
      <div class="s-box" style="left:${LX}px;top:${BY - 60}px;border-color:rgba(141,141,240,.7)" data-at="2@0.05" data-fx="pop"><span class="pri">grams A</span></div>
      <div class="s-box" style="left:${LX}px;top:${TY - 60}px;border-color:rgba(141,141,240,.7)" data-at="2@0.28" data-fx="pop"><span class="pri">moles A</span></div>
      <div class="s-box" style="left:${RX}px;top:${TY - 60}px;border-color:rgba(60,199,188,.7)" data-at="2@0.52" data-fx="pop"><span class="teal">moles B</span></div>
      <div class="s-box" style="left:${RX}px;top:${BY - 60}px;border-color:rgba(60,199,188,.7)" data-at="2@0.76" data-fx="pop"><span class="teal">grams B</span></div>
      <div class="s-lvl" style="left:120px;top:${TY - 112}px" data-at="6" data-fx="fade">mole level</div>
      <div class="s-lvl" style="left:120px;top:${BY + 74}px" data-at="6" data-fx="fade">gram level</div>
      <div style="position:absolute;left:640px;width:640px;top:930px;text-align:center;font-size:36px;font-weight:900" class="bad" data-at="6@0.4" data-fx="fade">no crossing in grams</div>
      <svg class="full" viewBox="0 0 1920 1080"><g class="trav"><circle r="30" fill="${WARM}" opacity=".3"/><circle r="16" fill="#fff"/></g></svg>`,
    update(c) {
      const b = c.b, t = c.t
      // u runs 0..3 over the three legs: g A -> mol A, mol A -> mol B, mol B -> g B
      let u = -1
      const s2a = b[2].start + 0.15 * (b[2].end - b[2].start), s2b = b[2].start + 0.95 * (b[2].end - b[2].start)
      if (t >= s2a && t < b[3].start) u = 3 * eio(c.seg(s2a, s2b))
      for (let k = 0; k < 3; k++) {
        const bb = b[3 + k], a0 = bb.start + 0.3, a1 = a0 + Math.min(1.8, 0.8 * (bb.end - bb.start))
        if (t >= bb.start && t < bb.end + 0.3) u = k + eio(c.seg(a0, a1))
      }
      const el = c.$('.trav')
      if (u < 0 || u >= 3) { el.style.opacity = 0; return }
      const k = Math.min(2, Math.floor(u)), f = u - k
      const P = [[[LX, 772], [LX, 532]], [[580, TY], [1340, TY]], [[RX, 532], [RX, 772]]][k]
      const lift = k === 1 ? -Math.sin(Math.PI * f) * 30 : 0
      place(el, lerp(P[0][0], P[1][0], f), lerp(P[0][1], P[1][1], f) + lift)
      el.style.opacity = Math.min(1, f * 6, (1 - f) * 6)
    },
  })

  // ---------- worked example: making ammonia ----------
  const srow = (i, top, at, col, label, eq, res) => `<div class="s-row" style="top:${top}px" data-at="${at}"><div class="n" style="background:${col}">${i}</div><div class="lb" style="color:${col}">${label}</div>
      <div class="eq" data-at="${at}@0.3" data-fx="fade">${eq}</div><div class="s-res" data-at="${res[1]}" data-fx="pop">${res[0]}</div></div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Making ammonia</h2>
      <div class="card s-prob" data-at="1">Grams of <span class="teal">NH<sub>3</sub></span> from <span class="pri">10.0 g of H<sub>2</sub></span>? <span class="muted" style="font-size:38px">(plenty of N<sub>2</sub>)</span>
        <span class="muted" style="position:absolute;right:48px;top:42px;font-size:38px;font-weight:900">N<sub>2</sub> + 3H<sub>2</sub> → 2NH<sub>3</sub></span></div>
      ${srow(1, 450, '2', PUR, 'g → mol', '10.0 g H<sub>2</sub> ÷ 2.016 g/mol =', ['4.96 mol H<sub>2</sub>', '2@0.8'])}
      ${srow(2, 590, '3', WARM, 'mole ratio', '4.96 mol H<sub>2</sub> × (2 mol NH<sub>3</sub> / 3 mol H<sub>2</sub>) =', ['3.31 mol NH<sub>3</sub>', '3@0.85'])}
      ${srow(3, 730, '4', TEAL, 'mol → g', '3.31 mol × 17.03 g/mol =', ['56.3 g NH<sub>3</sub>', '4@0.8'])}
      <div class="banner" style="top:880px;padding:16px 40px" data-at="4@0.9" data-fx="pop">Answer: <span class="good">56.3 g NH<sub>3</sub></span></div>`,
  })

  // ---------- two self-checks: units cancel, mass is conserved ----------
  const blk = (x, y, w, label, col) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="54" rx="12" fill="${col}"/><text x="${x}" y="${y + 38}" text-anchor="middle" font-size="28" font-weight="900" class="f-dark">${label}</text>`
  EZ.scene('check', {
    html: `<div class="kicker" data-at="in" data-fx="left">Self-checks</div><h2 class="h1" data-at="0">Two habits that catch mistakes</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:560px" data-at="1"><h3><small>1</small>Units cancel</h3>
        <div class="s-line" style="top:150px" data-at="1@0.2" data-fx="fade">10.0 <span class="s-x">g H<sub>2</sub><i data-at="1@0.62" data-fx="grow"></i></span> ×
          <span class="s-fr pri"><span class="t">1 mol H<sub>2</sub></span><span class="b">2.016 <span class="s-x">g H<sub>2</sub><i data-at="1@0.7" data-fx="grow"></i></span></span></span></div>
        <div class="s-line" style="top:310px" data-at="1@0.8" data-fx="fade">= <span class="good">4.96 mol H<sub>2</sub></span></div>
        <div class="s-foot muted" style="font-size:32px" data-at="1@0.85" data-fx="fade">only the unit you want is left</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:560px" data-at="2"><h3><small>2</small>Mass is conserved</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="460" viewBox="0 0 810 460">
          <path d="M405 120 L370 380 L440 380 Z" fill="#363c54" stroke="#c9cee0" stroke-width="4" stroke-linejoin="round"/>
          <g class="beam"><line x1="-245" y1="0" x2="245" y2="0" stroke="#c9cee0" stroke-width="12" stroke-linecap="round"/><circle r="14" fill="#c9cee0"/></g>
          <g class="panL"><line x1="-90" y1="0" x2="0" y2="-230" stroke="#7d859c" stroke-width="3"/><line x1="90" y1="0" x2="0" y2="-230" stroke="#7d859c" stroke-width="3"/>
            <path d="M-110 0 h220 l-20 22 h-180 Z" fill="#c9cee0"/>
            <g data-at="3@0.15" data-fx="fade">${blk(0, -56, 170, 'CH₄ 10.0 g', PUR)}</g><g data-at="3@0.4" data-fx="fade">${blk(0, -114, 170, 'O₂ 39.9 g', TEAL)}</g></g>
          <g class="panR"><line x1="-90" y1="0" x2="0" y2="-230" stroke="#7d859c" stroke-width="3"/><line x1="90" y1="0" x2="0" y2="-230" stroke="#7d859c" stroke-width="3"/>
            <path d="M-110 0 h220 l-20 22 h-180 Z" fill="#c9cee0"/>
            <g data-at="4@0.15" data-fx="fade">${blk(0, -56, 170, 'CO₂ 27.4 g', WARM)}</g><g data-at="4@0.4" data-fx="fade">${blk(0, -114, 170, 'H₂O 22.5 g', '#aab1c4')}</g></g>
          <text x="160" y="440" text-anchor="middle" font-size="34" font-weight="900" class="f-pri" data-at="3@0.75" data-fx="fade">reactants: 49.9 g</text>
          <text x="650" y="440" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="4@0.8" data-fx="fade">products: 49.9 g</text>
        </svg></div>
      <div class="banner" style="top:890px;padding:16px 40px" data-at="5" data-fx="pop">Masses add up ${ARR} a quick way to <span class="good">catch an error</span></div>`,
    update(c) {
      const b = c.b
      // the beam tips toward the loaded reactant pan, then levels when the products go on
      const ang = -5 * eio(c.seg(b[3].start + 0.3, b[3].start + 1.4)) + 5 * eio(c.seg(b[4].start + 0.4, b[4].start + 1.6))
      const a = (ang * Math.PI) / 180, cx = 405, cy = 120, L = 245
      c.$('.beam').setAttribute('transform', `translate(${cx} ${cy}) rotate(${ang})`)
      place(c.$('.panL'), cx - L * Math.cos(a), cy - L * Math.sin(a) + 230)
      place(c.$('.panR'), cx + L * Math.cos(a), cy + L * Math.sin(a) + 230)
    },
  })

  // ---------- the trap ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="1">Never use the coefficients with grams</h2>
      <div style="position:absolute;left:0;width:1920px;top:296px;text-align:center;font-size:74px;font-weight:900" data-at="2"><span class="warm">2</span>H<sub>2</sub> <span class="muted">+</span> O<sub>2</sub> <span class="muted">→</span> <span class="warm">2</span>H<sub>2</sub>O</div>
      <div class="card s-quote" data-at="3"><span class="q">“2 g of H<sub>2</sub> reacts with 1 g of O<sub>2</sub>”<i data-at="3@0.75" data-fx="grow"></i></span></div>
      <div class="s-stamp" data-at="3@0.85" data-fx="pop"><div>WRONG</div></div>
      <div class="card" style="left:120px;top:610px;width:1680px;height:220px" data-at="4">
        <svg style="position:absolute;left:30px;top:20px" width="640" height="180" viewBox="0 0 640 180">
          <g data-at="4@0.2" data-fx="pop">${h2(80, 90)}</g><g data-at="4@0.3" data-fx="pop">${h2(220, 90)}</g>
          <text x="330" y="106" text-anchor="middle" font-size="54" font-weight="900" class="f-muted" data-at="4@0.4" data-fx="fade">:</text>
          <g data-at="4@0.5" data-fx="pop">${o2(470, 90)}</g></svg>
        <div style="position:absolute;left:700px;top:44px;font-size:60px;font-weight:900;white-space:nowrap" data-at="4@0.6" data-fx="fade"><span class="good">2 mol</span> H<sub>2</sub> : <span class="good">1 mol</span> O<sub>2</sub></div>
        <div style="position:absolute;left:700px;top:130px;font-size:32px;font-weight:800;white-space:nowrap" class="muted" data-at="4@0.75" data-fx="fade">the 2 : 1 ratio counts moles, not grams</div>
        <svg style="position:absolute;right:40px;top:76px;width:72px;height:72px" data-at="4@0.8" data-fx="pop" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="banner" style="top:870px;padding:18px 40px" data-at="5" data-fx="pop">Convert to <span class="gold">moles</span> first. Always.</div>`,
  })

  // ---------- try it ----------
  const prow = (i, top, at, label, eq) => `<div class="s-row" style="top:${top}px" data-at="${at}"><div class="n" style="background:${i === 1 ? WARM : TEAL}">${i}</div><div class="lb">${label}</div><div class="eq" style="left:420px" data-at="${at}@0.3" data-fx="fade">${eq}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">How many <span class="teal">moles of O<sub>2</sub></span> react with 6.0 mol H<sub>2</sub>?</h2>
      <div class="s-chx" style="left:120px;top:330px" data-at="1@0.5" data-fx="pop"><span class="warm">2</span>H<sub>2</sub> + O<sub>2</sub> → <span class="warm">2</span>H<sub>2</sub>O</div>
      <div class="s-chx" style="left:560px;top:330px" data-at="1@0.7" data-fx="pop">H<sub>2</sub>: <span class="pri">6.0 mol</span></div>
      <div class="s-chx" style="left:860px;top:330px" data-at="1@0.85" data-fx="pop">O<sub>2</sub>: <span class="warm">?</span></div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="s-ans" data-at="3" data-fx="pop"><span class="good">3.0 mol O<sub>2</sub></span>${CHECK}</div>
      ${prow(1, 620, '4', 'Mole ratio', 'O<sub>2</sub> : H<sub>2</sub> = <span class="warm">1 : 2</span>')}
      ${prow(2, 760, '5', 'Multiply', '6.0 mol H<sub>2</sub> × (1 mol O<sub>2</sub> / 2 mol H<sub>2</sub>) = <span class="good">3.0 mol O<sub>2</sub></span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      c.$('.s-ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="80" text-anchor="middle" font-size="48" font-weight="900">N₂ + <tspan class="f-warm">3</tspan>H₂ → <tspan class="f-warm">2</tspan>NH₃</text>
    <text x="230" y="160" text-anchor="middle" font-size="44" font-weight="900" class="f-gold">1 : 3 : 2 mol</text></svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="M120 92 Q230 20 340 92" fill="none" stroke="${PUR}" stroke-width="7"/><line x1="120" y1="92" x2="340" y2="92" stroke="#c9cee0" stroke-width="7"/>
    <rect x="30" y="66" width="90" height="52" rx="12" fill="${PUR}"/><text x="75" y="102" text-anchor="middle" font-size="26" font-weight="900" class="f-dark">mol A</text>
    <rect x="340" y="66" width="90" height="52" rx="12" fill="${TEAL}"/><text x="385" y="102" text-anchor="middle" font-size="26" font-weight="900" class="f-dark">mol B</text>
    <rect x="30" y="150" width="90" height="52" rx="12" fill="none" stroke="${PUR}" stroke-width="4"/><text x="75" y="186" text-anchor="middle" font-size="26" font-weight="900" class="f-pri">g A</text>
    <rect x="340" y="150" width="90" height="52" rx="12" fill="none" stroke="${TEAL}" stroke-width="4"/><text x="385" y="186" text-anchor="middle" font-size="26" font-weight="900" class="f-teal">g B</text>
    <line x1="75" y1="148" x2="75" y2="124" stroke="${PUR}" stroke-width="5" marker-end="url(#mk-pri)"/><line x1="385" y1="122" x2="385" y2="146" stroke="${TEAL}" stroke-width="5" marker-end="url(#mk-teal)"/></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="110" text-anchor="middle" font-size="58" font-weight="900" class="f-muted">2 g : 1 g</text>
    <line x1="90" y1="140" x2="370" y2="60" stroke="${RED}" stroke-width="10" stroke-linecap="round"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card s-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Balanced<br>coefficients =<br><span class="gold">mole ratios</span></p></div>
      <div class="card s-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>g A ${ARR} mol A<br><span class="warm">× mole ratio</span><br>mol B ${ARR} g B</p></div>
      <div class="card s-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Never apply<br>the coefficients<br>to <span class="bad">grams</span></p></div>`,
  })
})()
