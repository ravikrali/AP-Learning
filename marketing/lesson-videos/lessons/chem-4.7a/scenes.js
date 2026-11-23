// Pictures for chem-4.7a "Types of Reactions & Precipitation". One EZ.scene per scene id in script.mjs.
// Every formula, number and example is the lesson's own (app/src/content/chem/u4.ts; the methane
// oxidation numbers and "spectators" are from book.ts). Ions are drawn schematically: the sizes are
// not to scale, and one ball stands for each kind of ion, not for how many there are.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .y-foot{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:36px;font-weight:900;white-space:nowrap}
    .y-row{position:absolute;left:120px;width:1680px;height:190px;border-radius:28px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .y-row .nm{position:absolute;left:40px;top:34px;font-size:52px;font-weight:900;white-space:nowrap}
    .y-row .ex{position:absolute;left:40px;top:112px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .y-row .tg{position:absolute;left:1190px;top:40px;width:460px;font-size:38px;font-weight:900;line-height:1.15}
    .y-row .tg span{display:block;font-size:28px;font-weight:800;color:var(--muted)}
    .y-eqc{left:120px;top:290px;width:1680px;height:250px}
    .y-ln{position:absolute;left:250px;font-size:56px;font-weight:900;white-space:nowrap}
    .y-ln small{font-size:32px;font-weight:800;color:var(--muted);margin-left:24px}
    .y-sub{position:absolute;left:40px;top:96px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .y-note{position:absolute;top:660px;width:810px;height:150px;padding:28px 40px 0;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .y-note b{display:block;font-size:42px;font-weight:900} .y-note span{display:block;margin-top:6px;font-size:30px;font-weight:800;color:var(--muted)}
    .y-tile{position:absolute;width:390px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .y-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .y-tile .f{font-weight:900;line-height:1;white-space:nowrap} .y-tile .ch{margin-top:14px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .y-tile .ok{position:absolute;right:18px;top:14px;width:60px;height:60px}
    .y-big{font-size:150px;font-weight:900;line-height:1;margin-top:30px}
    .y-chip{position:absolute;top:44px;width:340px;height:96px;border-radius:24px;border:3px solid var(--line);background:rgba(255,255,255,.05);font-size:38px;font-weight:900;line-height:90px;text-align:center}
    .y-chip i{position:absolute;left:-10px;right:-10px;top:40px;height:8px;border-radius:4px;background:var(--bad)}
    .y-prob{left:120px;top:290px;width:1680px;height:100px;padding:0 44px;font-size:44px;font-weight:800;line-height:96px;white-space:nowrap}
    .y-eq{left:120px;top:884px;width:1680px;height:96px;text-align:center;font-size:44px;font-weight:900;line-height:92px;white-space:nowrap}
    .y-ans{position:absolute;top:580px;width:810px;height:160px;padding:26px 40px 0;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .y-ans b{display:block;font-size:52px;font-weight:900;white-space:nowrap} .y-ans > span{display:block;margin-top:4px;font-size:32px;font-weight:800;color:var(--muted)}
    .y-rc{top:320px;width:540px;height:560px;text-align:center} .y-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .y-rc svg{display:block;margin:14px auto 0} .y-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.32;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  const ion = (r, g, base, ch, fs) => ball(0, 0, r, g, ch ? sup(base, ch) : base, fs ?? r * 0.72)
  const proton = `<circle r="22" fill="url(#g-gold)"/><text y="-32" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">H⁺</text>`
  const electron = `<circle r="24" fill="#3cc7bc" opacity=".25"/><circle r="13" fill="url(#g-teal)"/><text y="-30" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">e⁻</text>`
  // a beaker outline with a faint liquid, (x, y) = top-left corner
  const beaker = (x, y, w, h) => `<rect x="${x + 4}" y="${y + 30}" width="${w - 8}" height="${h - 34}" rx="16" fill="#3cc7bc" opacity=".07"/>
    <path d="M${x} ${y} V${y + h - 20} q0 20 20 20 H${x + w - 20} q20 0 20 -20 V${y}" fill="none" stroke="#7d859c" stroke-width="6" stroke-linejoin="round"/>`

  // ---------- intro artwork: two faint beakers at the edges, a solid settling in each ----------
  const SETTLE = [[-60, 0], [-20, 0], [20, 0], [60, 0], [-40, -38], [0, -38], [40, -38], [-20, -76], [20, -76]]
  const introBeaker = (x, cls) => `${beaker(x, 640, 250, 280)}${SETTLE.map((_, i) => `<g class="${cls}${i}">${ball(0, 0, 19, 'gold')}</g>`).join('')}`
  EZ.intro = {
    chips: [['1@0.3', 'Three families'], ['1@0.55', 'One solubility rule'], ['1@0.8', 'Predict a precipitate']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">${introBeaker(60, 'ia')}${introBeaker(1610, 'ib')}</svg>`,
    update(c) {
      const s = c.sc.start
      SETTLE.forEach(([dx, dy], i) => {
        const p = eio(c.seg(s + 0.3 + i * 0.22, s + 1.4 + i * 0.22))
        place(c.$('.ia' + i), 185 + dx, lerp(680, 899 + dy, p))
        place(c.$('.ib' + i), 1735 - dx, lerp(680, 899 + dy, p))
      })
    },
  }

  // ---------- hook: millions of reactions, three families ----------
  const hookCard = (i, at, title, color, inner, name) => `
    <div class="card" style="left:${120 + i * 570}px;top:300px;width:540px;height:470px" data-at="${at}">
      <h3 style="color:${color}">${title}</h3>
      <svg style="position:absolute;left:0;top:110px" width="540" height="300" viewBox="0 0 540 300">${inner}</svg>
      <div class="y-foot muted" style="font-size:34px" data-at="5@0.3" data-fx="fade">${name}</div></div>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Sorting reactions</div>
      <h2 class="h1" data-at="0">Millions of reactions, <span class="teal" data-at="1" data-fx="fade">three families</span></h2>
      ${hookCard(0, '2', 'Swap protons', 'var(--accent)', `${ball(140, 150, 50, 'pur')}${ball(400, 150, 50, 'pur')}<g class="hp">${proton}</g>`, 'acid–base')}
      ${hookCard(1, '3', 'Swap electrons', 'var(--warm)', `${ball(140, 150, 50, 'gray')}${ball(400, 150, 50, 'gray')}<g class="he">${electron}</g>`, 'redox')}
      ${hookCard(2, '4', 'Form a solid', 'var(--primary)', `<line x1="120" x2="420" y1="272" y2="272" stroke="#7d859c" stroke-width="6" stroke-linecap="round"/>
        <g class="hc">${ion(34, 'warm', '+', '', 44)}</g><g class="ha">${ion(40, 'teal', '−', '', 48)}</g>`, 'precipitation')}
      <div class="banner" style="top:812px" data-at="5" data-fx="pop">Know the family ${ARR} know <span class="teal">what to look for</span></div>`,
    update(c) {
      const b = c.b
      const hop = (el, t0) => { const p = eio(c.seg(t0, t0 + 1.1)); place(el, lerp(196, 344, p), 150 - 80 * Math.sin(Math.PI * p)) }
      hop(c.$('.hp'), b[2].start + 0.3)
      hop(c.$('.he'), b[3].start + 0.3)
      const t0 = b[4].start + 0.2, p1 = eio(c.seg(t0, t0 + 0.9)), p2 = eio(c.seg(t0 + 0.8, t0 + 1.5))
      place(c.$('.hc'), lerp(100, 233, p1), lerp(84, 238, p2))
      place(c.$('.ha'), lerp(440, 307, p1), lerp(84, 232, p2))
    },
  })

  // ---------- the big three ----------
  const row = (i, at, name, color, ex, tag, sub, inner) => `<div class="y-row" style="top:${290 + i * 210}px" data-at="${at}">
      <div class="nm" style="color:${color}">${name}</div><div class="ex">${ex}</div>
      <svg style="position:absolute;left:0;top:0" width="1680" height="190" viewBox="0 0 1680 190">${inner}</svg>
      <div class="tg" style="color:${color}">${tag}<span>${sub}</span></div></div>`
  EZ.scene('families', {
    html: `<div class="kicker" data-at="in" data-fx="left">The big three</div><h2 class="h1" data-at="0">Three families of reactions</h2>
      ${row(0, '1', 'Acid–base', 'var(--accent)', 'HCl + NaOH', 'protons (H⁺) move', 'from acid to base', `
        ${ball(560, 95, 50, 'green', 'Cl', 38)}<text x="595" y="180" text-anchor="middle" font-size="28" font-weight="900" class="f-muted">HCl</text>
        ${ball(900, 95, 50, 'red', 'O', 40)}${ball(948, 66, 22, 'gray')}
        <text x="910" y="180" text-anchor="middle" font-size="28" font-weight="900" class="f-muted" data-at="1" data-out="3@0.75" data-fx="fade">OH⁻</text>
        <text x="910" y="180" text-anchor="middle" font-size="28" font-weight="900" class="f-teal" data-at="3@0.75" data-fx="fade">H₂O</text>
        <g class="fp">${proton}</g>`)}
      ${row(1, '4', 'Redox', 'var(--warm)', 'Zn + Cu²⁺', 'electrons (e⁻) move', 'oxidation numbers change', `
        ${ball(600, 95, 56, 'gray', 'Zn', 40)}${ball(900, 95, 50, 'warm', sup('Cu', '2+'), 36)}
        <g class="fe0">${electron}</g><g class="fe1">${electron}</g>`)}
      ${row(2, '6', 'Precipitation', 'var(--primary)', 'Ag⁺ + Cl⁻ → AgCl(s)', 'an insoluble solid forms', 'ions combine', `
        <line x1="560" x2="940" y1="182" y2="182" stroke="#7d859c" stroke-width="6" stroke-linecap="round"/>
        <g class="fa">${ion(34, 'gray', 'Ag', '+', 26)}</g><g class="fc">${ion(42, 'green', 'Cl', '−', 30)}</g>
        <text x="850" y="150" font-size="34" font-weight="900" class="f-pri" data-at="7@0.8" data-fx="fade">AgCl(s)</text>`)}
      <div style="position:absolute;left:120px;top:930px;width:1680px;text-align:center;font-size:40px;font-weight:900" data-at="8" data-fx="fade">Ask: <span class="teal">protons?</span> &nbsp; <span class="warm">electrons?</span> &nbsp; <span class="pri">a solid?</span></div>`,
    update(c) {
      const b = c.b
      const p = eio(c.seg(b[3].start + 0.3, b[3].start + 1.4))
      place(c.$('.fp'), lerp(626, 852, p), lerp(95, 74, p) - 30 * Math.sin(Math.PI * p))
      for (let i = 0; i < 2; i++) {
        const t0 = b[5].start + 0.2 + i * 0.35, q = eio(c.seg(t0, t0 + 1.1)), y0 = i ? 125 : 72
        place(c.$('.fe' + i), lerp(668, 832, q), y0 - 22 * Math.sin(Math.PI * q))
      }
      const t0 = b[7].start + 0.2, p1 = eio(c.seg(t0, t0 + 1)), p2 = eio(c.seg(t0 + 0.9, t0 + 1.6))
      place(c.$('.fa'), lerp(520, 704, p1), lerp(62, 146, p2))
      place(c.$('.fc'), lerp(980, 780, p1), lerp(62, 138, p2))
    },
  })

  // ---------- combustion is redox ----------
  const NX = (v) => 405 + v * 80
  const numLine = (cls, from, labelFrom, color, mk) => `<svg style="position:absolute;left:0;top:110px" width="810" height="210" viewBox="0 0 810 210">
      <line x1="80" x2="730" y1="110" y2="110" stroke="#c9cee0" stroke-width="5" stroke-linecap="round"/>
      ${[-4, -2, 0, 2, 4].map((v) => `<line x1="${NX(v)}" x2="${NX(v)}" y1="98" y2="122" stroke="#c9cee0" stroke-width="5"/><text x="${NX(v)}" y="162" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">${v > 0 ? '+' + v : v < 0 ? '−' + -v : 0}</text>`).join('')}
      <line class="${cls}t" x1="${NX(from)}" x2="${NX(from)}" y1="110" y2="110" stroke="${color}" stroke-width="10" stroke-linecap="round"/>
      <text x="${NX(from)}" y="64" text-anchor="middle" font-size="32" font-weight="900" style="fill:${color}">${labelFrom}</text>
      <g class="${cls}d"><circle r="20" fill="${color}"/></g>
      <text x="405" y="204" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">oxidation number</text></svg>`
  EZ.scene('combustion', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Combustion</div><h2 class="h1" data-at="0">A special kind of redox</h2>
      <div class="card y-eqc" data-at="0@0.5">
        <svg style="position:absolute;left:50px;top:40px" width="150" height="170" viewBox="0 0 150 170"><g class="fl">
          <path d="M75 8 C110 50 135 80 125 118 C116 152 92 166 75 166 C58 166 34 152 25 118 C17 88 40 70 52 40 C58 64 66 70 75 8Z" fill="#f3a764"/>
          <path d="M75 70 C95 96 102 116 96 136 C90 154 82 160 75 160 C68 160 58 154 54 136 C50 116 60 98 75 70Z" fill="#f2c443"/></g></svg>
        <div class="y-ln" style="top:36px"><span data-at="1" data-fx="fade">hydrocarbon + <span class="teal">O₂</span></span> <span data-at="2@0.4" data-fx="fade">${ARR} <span class="warm">CO₂ + H₂O</span></span><small data-at="2@0.2" data-fx="fade">complete combustion</small></div>
        <div class="y-ln" style="top:136px"><span data-at="3" data-fx="fade">C₃H₈</span><span data-at="4" data-fx="fade"> + 5<span class="teal">O₂</span> ${ARR} 3<span class="warm">CO₂</span> + 4<span class="warm">H₂O</span></span><small data-at="3@0.3" data-fx="fade">propane</small></div></div>
      <div class="card" style="left:120px;top:580px;width:810px;height:330px" data-at="5@0.2"><h3><span class="warm">Carbon</span> in methane</h3>
        <div class="y-sub" style="left:auto;right:40px;top:36px" data-at="5@0.3" data-fx="fade">loses e⁻</div>
        ${numLine('cn', -4, 'CH₄', '#f3a764', 'warm')}
        <svg style="position:absolute;left:0;top:110px" width="810" height="210" viewBox="0 0 810 210"><text x="${NX(4)}" y="64" text-anchor="middle" font-size="32" font-weight="900" class="f-warm" data-at="6@0.5" data-fx="fade">CO₂</text></svg></div>
      <div class="card" style="left:990px;top:580px;width:810px;height:330px" data-at="5@0.55"><h3><span class="teal">Oxygen</span></h3>
        <div class="y-sub" style="left:auto;right:40px;top:36px" data-at="5@0.65" data-fx="fade">gains e⁻</div>
        ${numLine('on', 0, 'O₂', '#3cc7bc', 'teal')}</div>
      <div style="position:absolute;left:120px;top:940px;width:1680px;text-align:center;font-size:34px;font-weight:900;white-space:nowrap" data-at="7" data-fx="fade">Free element on one side, compound on the other ${ARR} <span class="warm">oxidation number changes</span> ${ARR} redox</div>`,
    update(c) {
      const b = c.b, t = c.t
      const f = 1 + 0.04 * Math.sin(t * 9) * (1 - c.seg(b[2].end, b[2].end + 0.5))
      c.$('.fl').setAttribute('transform', `translate(75 166) scale(${f.toFixed(3)} ${(2 - f).toFixed(3)}) translate(-75 -166)`)
      const d = b[6].end - b[6].start
      const vc = lerp(-4, 4, eio(c.seg(b[6].start + 0.2, b[6].start + 0.5 * d)))
      const vo = lerp(0, -2, eio(c.seg(b[6].start + 0.58 * d, b[6].start + 0.9 * d)))
      place(c.$('.cnd'), NX(vc), 110); c.$('.cnt').setAttribute('x2', NX(vc))
      place(c.$('.ond'), NX(vo), 110); c.$('.ont').setAttribute('x2', NX(vo))
      c.$('.cnt').style.opacity = c.seg(b[6].start + 0.3, b[6].start + 0.5)
      c.$('.ont').style.opacity = c.seg(b[6].start + 0.62 * d, b[6].start + 0.68 * d)
    },
  })

  // ---------- the one solubility rule ----------
  const SNAP4 = [['Na', '+', 'warm', 'sodium', 50], ['K', '+', 'warm', 'potassium', 54], ['NH₄', '+', 'pur', 'ammonium', 40], ['NO₃', '−', 'teal', 'nitrate', 40]]
  const COMP = [['AgCl', false], ['BaSO₄', false], ['(NH₄)₂CO₃', true], ['CaCO₃', false]]
  EZ.scene('rule', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Solubility</div><h2 class="h1" data-at="0">The one rule you must know</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:340px" data-at="1@0.4"><h3>All of these salts are <span class="teal">soluble in water</span></h3>
        <div class="y-sub" style="left:auto;right:44px;top:36px;color:var(--accent)" data-at="5@0.4" data-fx="fade">stay dissolved</div>
        <svg style="position:absolute;left:0;top:0" width="1680" height="340" viewBox="0 0 1680 340">
          ${SNAP4.map(([s, ch, g, nm, fs], i) => `<g data-at="2@${0.08 + i * 0.2}" data-fx="pop"><g class="rb${i}">${ion(72, g, s, ch, fs)}</g>
            <text x="${270 + i * 380}" y="318" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">${nm}</text></g>`).join('')}
        </svg></div>
      <div data-at="in" data-out="6" data-fx="fade">
        <div class="y-note" style="left:120px" data-at="3"><b>The only rule to memorize</b><span>for the exam</span></div>
        <div class="y-note" style="left:990px" data-at="4"><b>Any other solubility info</b><span>is given to you in the question</span></div>
      </div>
      ${COMP.map(([f, ok], i) => `<div class="y-tile x${i}" style="left:${120 + i * 430}px;top:660px;height:230px" data-at="6@${0.05 + i * 0.08}" data-fx="pop">
        ${ok ? CHECK : ''}<div class="f" style="margin-top:66px;font-size:${ok ? 58 : 66}px">${f}</div>
        <div class="ch" style="${ok ? 'color:var(--good)' : 'font-size:44px'}" data-at="6@0.6" data-fx="fade">${ok ? 'contains NH₄⁺' : '?'}</div></div>`).join('')}`,
    update(c) {
      const b = c.b, t = c.t, s = b[5].start
      const amp = 9 * c.seg(s, s + 0.4) * (1 - c.seg(s + 3, s + 4))
      for (let i = 0; i < 4; i++) place(c.$('.rb' + i), 270 + i * 380, 190 + amp * Math.sin(t * 3 + i * 1.7))
      const w = eo(c.seg(b[6].start + 0.6 * (b[6].end - b[6].start), b[6].end))
      const el = c.$('.x2')
      el.style.borderColor = w ? `rgba(76,199,129,${w})` : ''
      el.style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.5 * w})`
      el.querySelector('.ok').style.opacity = w
      for (const i of [0, 1, 3]) c.$('.x' + i).style.filter = `brightness(${1 - 0.4 * w})`
    },
  })

  // ---------- SNAP ----------
  const LET = [['S', 'Sodium', 'Na⁺', 'var(--warm)'], ['N', 'Nitrate', 'NO₃⁻', 'var(--accent)'], ['A', 'Ammonium', 'NH₄⁺', 'var(--primary)'], ['P', 'Potassium', 'K⁺', 'var(--gold)']]
  EZ.scene('snap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Memory trick</div><h2 class="h1" data-at="0">SNAP the soluble ions</h2>
      ${LET.map(([l, nm, f, col], i) => `<div class="y-tile" style="left:${120 + i * 430}px;top:290px;height:330px" data-at="1@${0.02 + i * 0.25}" data-fx="pop">
        <div class="y-big" style="color:${col}">${l}</div><div class="f" style="margin-top:18px;font-size:40px">${nm}</div><div class="ch" style="font-size:40px;color:var(--text)">${f}</div></div>`).join('')}
      <div class="banner" style="top:680px" data-at="2" data-out="3" data-fx="pop">SNAP salts are <span class="teal">always soluble</span></div>
      <div class="card" style="left:120px;top:660px;width:1680px;height:280px" data-at="3">
        <div class="y-chip" style="left:60px;color:var(--muted)">SNAP ion<i data-at="3@0.6" data-fx="grow" data-dur="0.3"></i></div>
        <div class="y-chip" style="left:440px;color:var(--muted)">SNAP ion<i data-at="3@0.75" data-fx="grow" data-dur="0.3"></i></div>
        <div class="y-chip x-o" style="left:900px">other ion</div><div class="y-chip x-o" style="left:1280px">other ion</div>
        <div style="position:absolute;left:250px;top:170px;width:340px;text-align:center;font-size:34px;font-weight:900;color:var(--accent)" data-at="3@0.85" data-fx="fade">stay dissolved</div>
        <div style="position:absolute;left:880px;top:170px;width:740px;text-align:center;font-size:38px;font-weight:900;color:var(--gold)" data-at="4@0.3" data-fx="fade">might form the solid</div></div>`,
    update(c) {
      const w = eo(c.seg(c.b[4].start, c.b[4].start + 0.5))
      for (const el of c.root.querySelectorAll('.x-o')) { el.style.borderColor = w ? `rgba(242,196,67,${w})` : ''; el.style.color = w > 0.5 ? 'var(--gold)' : ''; el.style.boxShadow = `0 0 ${40 * w}px rgba(242,196,67,${0.35 * w})` }
    },
  })

  // ---------- worked example: Pb(NO3)2 + KI ----------
  const Y0 = 560
  const CLUSTER = [[-60, 0], [-20, 0], [20, 0], [60, 0], [-40, -36], [0, -36], [40, -36], [-20, -72], [20, -72]]
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Predict the precipitate</h2>
      <div class="card y-prob" data-at="1">Mix <span class="pri">Pb(NO₃)₂</span> and <span class="pri">KI</span>: a <span class="gold">yellow solid</span> forms. What is it?</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.4" data-fx="fade">${beaker(300, 420, 1320, 440)}</g>
        <text x="960" y="460" text-anchor="middle" font-size="30" font-weight="800" class="f-muted" data-at="2@0.1" data-out="3" data-fx="fade">the ions in the mix</text>
        <g data-at="2@0.3" data-fx="pop"><g class="ePb">${ion(54, 'gray', 'Pb', '2+', 36)}</g></g>
        <g data-at="2@0.45" data-fx="pop"><g class="eNO">${ion(50, 'teal', 'NO₃', '−', 30)}</g></g>
        <g data-at="2@0.65" data-fx="pop"><g class="eK">${ion(46, 'warm', 'K', '+', 38)}</g></g>
        <g data-at="2@0.85" data-fx="pop"><g class="eI">${ion(56, 'pur', 'I', '−', 40)}</g></g>
        <text x="590" y="662" text-anchor="middle" font-size="40" font-weight="900" data-at="3@0.75" data-fx="fade">KNO₃</text>
        <text x="1330" y="662" text-anchor="middle" font-size="40" font-weight="900" data-at="3@0.75" data-out="5@0.2" data-fx="fade">PbI₂</text>
        <text x="590" y="706" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="4@0.3" data-fx="fade">SNAP salt: soluble</text>
        <text x="590" y="754" text-anchor="middle" font-size="32" font-weight="900" class="f-warm" data-at="7@0.5" data-fx="fade">spectators</text>
        <g class="sol">${CLUSTER.map(([dx, dy]) => ball(1300 + dx, 836 + dy, 18, 'gold')).join('')}</g>
        <text x="1410" y="806" font-size="44" font-weight="900" class="f-gold" data-at="5@0.6" data-fx="fade">PbI₂(s)</text>
        <text x="1410" y="846" font-size="28" font-weight="800" class="f-muted" data-at="5@0.7" data-fx="fade">yellow solid</text>
      </svg>
      <div class="card y-eq" data-at="6">Pb(NO₃)₂(aq) + 2KI(aq) ${ARR} <span class="gold">PbI₂(s)</span> + 2KNO₃(aq)</div>`,
    update(c) {
      const b = c.b, s = b[3].start + 0.4, p = eio(c.seg(s, s + 1.4)), arc = Math.sin(Math.PI * p)
      const d0 = b[5].start + 0.2, q = eio(c.seg(d0, d0 + 1)), fade = 1 - c.seg(d0 + 0.8, d0 + 1.2)
      place(c.$('.ePb'), lerp(420, 1270, p), Y0 - 120 * arc + (790 - Y0) * q)
      place(c.$('.eI'), lerp(1500, 1392, p), Y0 + (790 - Y0) * q)
      place(c.$('.eNO'), lerp(760, 650, p), Y0)
      place(c.$('.eK'), lerp(1160, 536, p), Y0 + 150 * arc)
      c.$('.ePb').style.opacity = fade; c.$('.eI').style.opacity = fade
      c.$('.sol').style.opacity = c.seg(d0 + 0.8, d0 + 1.2)
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'Precipitation'], ['B', 'Acid–base'], ['C', 'Redox'], ['D', 'No reaction']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which reaction type is <span class="teal">2Mg(s) + O₂(g) ${ARR} 2MgO(s)</span>?</h2>
      ${OPTS.map(([l, f], i) => `<div class="y-tile t${i}" style="left:${120 + i * 430}px;top:330px;height:210px" data-at="1@${0.62 + i * 0.09}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? CHECK : ''}<div class="f" style="margin-top:96px;font-size:${i === 0 ? 48 : 54}px">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="70" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="700" r="70" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="num" x="960" y="725" text-anchor="middle" font-size="72" font-weight="900">3</text><text x="960" y="820" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="y-ans" style="left:120px;border-color:rgba(243,167,100,.7)" data-at="4" data-fx="up"><b>Mg: 0 ${ARR} <span class="warm">+2</span></b><span>loses electrons</span></div>
      <div class="y-ans" style="left:990px;border-color:rgba(60,199,188,.7)" data-at="5" data-fx="up"><b>O: 0 ${ARR} <span class="teal">−2</span></b><span>gains electrons</span></div>
      <div class="banner" style="top:790px" data-at="6" data-fx="pop">Electron transfer ${ARR} <span class="teal">redox</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="200" viewBox="0 0 460 200">
    <g transform="translate(70 70)">${proton}</g><g transform="translate(230 70)">${electron}</g>
    <line x1="330" x2="430" y1="96" y2="96" stroke="#7d859c" stroke-width="5" stroke-linecap="round"/>${ball(360, 76, 18, 'gold')}${ball(398, 76, 18, 'gold')}${ball(379, 44, 18, 'gold')}
    <text x="70" y="170" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">acid–base</text><text x="230" y="170" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">redox</text><text x="380" y="170" text-anchor="middle" font-size="28" font-weight="900" class="f-pri">solid</text></svg>`
  const r2 = `<svg width="460" height="200" viewBox="0 0 460 200"><g transform="translate(40 20) scale(.95)">
    <path d="M75 8 C110 50 135 80 125 118 C116 152 92 166 75 166 C58 166 34 152 25 118 C17 88 40 70 52 40 C58 64 66 70 75 8Z" fill="#f3a764"/>
    <path d="M75 70 C95 96 102 116 96 136 C90 154 82 160 75 160 C68 160 58 154 54 136 C50 116 60 98 75 70Z" fill="#f2c443"/></g>
    <text x="210" y="86" font-size="40" font-weight="900" class="f-warm">CO₂</text><text x="210" y="146" font-size="40" font-weight="900" class="f-teal">H₂O</text></svg>`
  const r3 = `<svg width="460" height="200" viewBox="0 0 460 200">${SNAP4.map(([s, ch, g, , fs], i) => ball(70 + i * 107, 100, 48, g, sup(s, ch), fs * 0.62)).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card y-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Acid–base: <span class="teal">H⁺ moves</span><br>Redox: <span class="warm">e⁻ move</span><br>Precipitation:<br><span class="pri">insoluble solid</span></p></div>
      <div class="card y-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Combustion (+ O₂)<br>is <span class="warm">redox</span>.<br>A hydrocarbon<br>burns to <span class="teal">CO₂ + H₂O</span></p></div>
      <div class="card y-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Na⁺, K⁺, NH₄⁺, NO₃⁻<br>salts are<br><span class="good">ALWAYS</span><br><span class="good">soluble</span></p></div>`,
  })
})()
