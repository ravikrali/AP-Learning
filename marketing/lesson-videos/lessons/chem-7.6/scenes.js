// Pictures for chem-7.6 "Manipulating K". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u7.ts and chem/book.ts): the ammonia
// equation and its reversed, doubled and halved forms, the NO2 -> N2O4 check (K = 6.0, sqrt = 2.4),
// K1 = 3.0 and K2 = 5.0 (15), and the try question (4.0 x 10^2 -> 2.5 x 10^-3).
(() => {
  const { clamp, lerp, eio, eo, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-f{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.12}
    .x-f>span{display:block;padding:0 .14em}
    .x-f>span+span{border-top:.07em solid currentColor}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:48px;font-weight:900;white-space:nowrap}
    .x-li{position:absolute;left:44px;font-size:46px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:120px;width:1680px;height:100px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-row .L{position:absolute;left:28px;top:0;line-height:96px;font-size:30px;font-weight:900;color:var(--muted);white-space:nowrap;letter-spacing:.06em}
    .x-row .E{position:absolute;left:330px;top:0;line-height:96px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-row .D{position:absolute;right:34px;top:0;line-height:96px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-row.tall{height:136px} .x-row.tall .L,.x-row.tall .E,.x-row.tall .D{line-height:132px}
    .x-row.tall .D{font-size:42px}
    .x-tag{position:absolute;height:60px;padding:0 22px;border-radius:30px;font-size:32px;font-weight:900;line-height:56px;white-space:nowrap}
    .x-tag.k{background:rgba(60,199,188,.16);border:2px solid rgba(60,199,188,.7);color:var(--accent)}
    .x-tag.r{background:rgba(243,167,100,.16);border:2px solid rgba(243,167,100,.7);color:var(--warm)}
    .x-sp{border-radius:12px;padding:0 6px}
    .x-gone{opacity:.4;text-decoration:line-through;text-decoration-color:var(--bad);text-decoration-thickness:7px}
    .x-op{display:inline-block;width:.8em;text-align:center}
    .x-big{position:absolute;left:360px;top:560px;width:1200px;height:250px}
    .x-big .lab{position:absolute;left:0;width:320px;top:0;line-height:250px;text-align:right;font-size:78px;font-weight:900;white-space:nowrap}
    .x-big .fr{position:absolute;left:350px;width:520px;height:250px}
    .x-big .nu,.x-big .de{position:absolute;left:0;width:520px;text-align:center;font-size:72px;font-weight:900;line-height:100px;white-space:nowrap}
    .x-big .nu{top:12px} .x-big .de{top:138px}
    .x-big .bar{position:absolute;left:10px;width:500px;top:121px;height:8px;border-radius:4px;background:#eef0f7}
    .x-big .res{position:absolute;left:900px;top:0;line-height:250px;font-size:78px;font-weight:900;white-space:nowrap}
    .x-step{position:absolute;top:536px;width:400px;height:150px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-step .H{margin-top:18px;font-size:28px;font-weight:900;letter-spacing:.08em;color:var(--muted);white-space:nowrap}
    .x-step .V{margin-top:6px;font-size:60px;font-weight:900;white-space:nowrap}
    .x-sarr{position:absolute;top:586px;font-size:50px;font-weight:900;color:var(--muted)}
    .x-tab{left:120px;top:290px;width:1680px;height:520px}
    .x-tab table{position:absolute;left:40px;top:30px;width:1600px;border-collapse:collapse;font-size:54px;font-weight:900}
    .x-tab th{padding:14px 20px;font-size:30px;letter-spacing:.1em;color:var(--muted);text-align:left;border-bottom:3px solid var(--line)}
    .x-tab td{padding:22px 20px;border-bottom:2px solid var(--line);white-space:nowrap}
    .x-tab tr:last-child td{border-bottom:none}
    .x-tab td:first-child{width:440px}
    .x-ans{position:absolute;left:120px;top:560px;width:1680px;height:360px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(76,199,129,.8)}
    .x-ans .ok{position:absolute;left:44px;top:44px;width:84px;height:84px}
    .x-ans .A{position:absolute;left:156px;top:30px;font-size:96px;font-weight:900;white-space:nowrap}
    .x-ans .W{position:absolute;left:60px;font-size:46px;font-weight:800;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:36px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443', PRI = '#8d8df0'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const EQ = '<i class="x-eq"></i>'
  const N2 = 'N<sub>2</sub>', H2 = 'H<sub>2</sub>', NH3 = 'NH<sub>3</sub>', NO2 = 'NO<sub>2</sub>', N2O4 = 'N<sub>2</sub>O<sub>4</sub>'
  const K1 = 'K<sub>1</sub>', K2 = 'K<sub>2</sub>', KN = 'K<sub>new</sub>'
  const fr = (top, bot, style = '') => `<span class="x-f" style="${style}"><span>${top}</span><span>${bot}</span></span>`
  const HALF = '½', THREEHALF = '<sup>3</sup>⁄<sub>2</sub>'
  const FWD = `${N2}(g) + 3${H2}(g) ${EQ} 2${NH3}(g)`
  const REV = `2${NH3}(g) ${EQ} ${N2}(g) + 3${H2}(g)`

  // ---------- intro artwork: faint equilibrium arrows on the left, the three new Ks on the right ----------
  const harp = (x, y, w, col) => `<path d="M${x} ${y} h${w} l-26 -20" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${x + w} ${y + 34} h${-w} l26 20" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`
  EZ.intro = {
    chips: [['1@0.62', 'Reverse'], ['1@0.74', 'Multiply'], ['1@0.86', 'Add']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      <g class="x-ia">${harp(70, 330, 220, TEAL)}${harp(70, 560, 220, WARM)}${harp(70, 790, 220, PRI)}</g>
      <g font-weight="900" text-anchor="middle">
        <text x="1760" y="360" font-size="80" style="fill:${WARM}">1/K</text>
        <text x="1760" y="600" font-size="90" style="fill:${TEAL}">K<tspan dy="-36" font-size="54">c</tspan></text>
        <text x="1760" y="840" font-size="66" style="fill:${PRI}">K<tspan dy="14" font-size="40">1</tspan><tspan dy="-14"> × K</tspan><tspan dy="14" font-size="40">2</tspan></text>
      </g></svg>`,
    update(c) {
      c.$('.x-ia').setAttribute('transform', `translate(${10 * Math.sin((c.t - c.sc.start) * 1.2)} 0)`)
    },
  }

  // ---------- hook: like Hess's law, but K multiplies ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The twist</div><h2 class="h1" data-at="0">Rules for combining K</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:440px" data-at="0@0.4"><h3>Hess's law: <span class="gold">ΔH</span></h3>
        <div class="x-li" style="top:150px" data-at="1" data-fx="fade"><span class="warm">Reverse</span> ${ARR} flip the sign</div>
        <div class="x-li" style="top:250px" data-at="2" data-fx="fade"><span class="pri">Add</span> ${ARR} ΔH<sub>1</sub> + ΔH<sub>2</sub></div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:440px" data-at="3"><h3>Equilibrium: <span class="teal">K</span></h3>
        <div class="x-li" style="top:130px" data-at="4@0.2" data-fx="fade"><span class="warm">Reversed</span> ${ARR} <span class="muted">?</span></div>
        <div class="x-li" style="top:220px" data-at="4@0.35" data-fx="fade"><span class="teal">Multiplied</span> ${ARR} <span class="muted">?</span></div>
        <div class="x-li" style="top:310px" data-at="4@0.5" data-fx="fade"><span class="pri">Combined</span> ${ARR} <span class="muted" data-at="in" data-fx="fade" data-out="6">?</span></div>
        <div class="x-li" style="left:352px;top:310px" data-at="6@0.5" data-fx="pop">${K1} × ${K2}</div></div>
      <div class="x-line" style="top:790px;font-size:90px" data-at="5" data-fx="pop">K<sub>1</sub> <span class="x-op">+</span> K<sub>2</sub></div>
      <div class="x-line" style="top:920px;font-size:44px" data-at="6" data-fx="fade">K values <span class="teal">multiply</span>, instead of add</div>`,
    update(c) {
      const p = eio(c.seg(c.b[6].start + 0.1, c.b[6].start + 0.9)), op = c.$('.x-op')
      op.style.transform = `rotate(${45 * p}deg) scale(${1 + 0.15 * Math.sin(Math.PI * p)})`
      op.style.color = p > 0.5 ? TEAL : WARM
    },
  })

  // ---------- rule 1: reverse -> 1/K, the K expression flips ----------
  EZ.scene('reverse', {
    html: `<div class="kicker" data-at="in" data-fx="left">Rule 1</div><h2 class="h1" data-at="0">Reverse the equation</h2>
      <div class="x-row" style="top:290px" data-at="1"><div class="L">ORIGINAL</div><div class="E">${FWD}</div><div class="D teal">K</div></div>
      <div class="x-row" style="top:410px;border:3px solid rgba(243,167,100,.75)" data-at="3"><div class="L warm">REVERSED</div><div class="E">${REV}</div>
        <div class="D"><span class="muted" data-at="in" data-fx="fade" data-out="5">${KN} = ?</span></div></div>
      <div class="x-row" style="top:410px;background:none;border:none" data-at="5@0.3" data-fx="pop"><div class="D warm">${KN} = 1/K</div></div>
      <div class="x-big" data-at="2">
        <div class="lab"><span class="x-l1">K =</span><span class="x-l2 warm">${KN} =</span></div>
        <div class="fr"><div class="bar"></div>
          <div class="nu teal">[${NH3}]<sup>2</sup></div>
          <div class="de warm">[${N2}][${H2}]<sup>3</sup></div></div>
        <div class="res" data-at="5" data-fx="pop">= ${fr('1', 'K', 'color:var(--warm)')}</div></div>
      <div class="x-line" style="top:880px;font-size:44px" data-at="6" data-fx="fade">Large K ${ARR} small 1/K &nbsp;·&nbsp; small K ${ARR} large 1/K</div>`,
    update(c) {
      const b = c.b, t0 = b[4].start + 0.6, p = eio(c.seg(t0, t0 + 1.4)), swing = 70 * Math.sin(Math.PI * p)
      c.$('.nu').style.transform = `translate(${swing}px, ${126 * p}px)`
      c.$('.de').style.transform = `translate(${-swing}px, ${-126 * p}px)`
      const flipped = c.t >= t0
      c.$('.x-l1').style.display = flipped ? 'none' : ''
      c.$('.x-l2').style.display = flipped ? '' : 'none'
    },
  })

  // ---------- rule 2: multiply by c -> K^c; NO2 example ----------
  EZ.scene('multiply', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Rule 2</div><h2 class="h1" data-at="0">Multiply by c</h2>
      <div class="x-line" style="top:300px" data-at="1">Coefficients × c &nbsp;${ARR}&nbsp; ${KN} = <span class="teal">K<sup>c</sup></span></div>
      <div data-at="2" data-out="3" data-fx="fade">
        <div class="x-line muted" style="top:410px;font-size:34px;font-weight:800">coefficients are the exponents</div>
        <div class="x-line" style="top:490px;font-size:64px">${fr(`[${NH3}]<sup class="gold">2</sup>`, `[${N2}][${H2}]<sup class="gold">3</sup>`)} &nbsp;<span class="teal">× c</span> ${ARR}&nbsp;
          ${fr(`[${NH3}]<sup class="teal">2c</sup>`, `[${N2}]<sup class="teal">c</sup>[${H2}]<sup class="teal">3c</sup>`)} = <span class="teal">K<sup>c</sup></span></div></div>
      <div class="x-row" style="top:410px" data-at="3"><div class="L">ORIGINAL</div><div class="E">2${NO2}(g) ${EQ} ${N2O4}(g)</div><div class="D">K = 6.0</div></div>
      <div class="x-row" style="top:530px;border:3px solid rgba(60,199,188,.7)" data-at="4"><div class="L teal">× ½</div><div class="E">${NO2}(g) ${EQ} ${HALF}${N2O4}(g)</div>
        <div class="D"><span class="muted" data-at="in" data-fx="fade" data-out="6">${KN} = ?</span></div></div>
      <div class="x-row" style="top:530px;background:none;border:none" data-at="6@0.4" data-fx="pop"><div class="D good">${KN} = 2.4</div></div>
      <div class="x-line" style="top:680px;font-size:64px" data-at="5" data-fx="fade">K<sup>1/2</sup> = √K <span data-at="6" data-fx="fade">&nbsp;·&nbsp; √6.0 = <span class="good">2.4</span></span></div>
      <div class="banner" style="top:840px" data-at="7" data-fx="pop">Multiply by ½ ${ARR} take the <span class="teal">square root</span></div>`,
  })

  // ---------- rule 3: add -> K1 x K2; B cancels ----------
  const HL = 'rgba(242,196,67,.28)'
  EZ.scene('add', {
    html: `<div class="kicker" data-at="in" data-fx="left">Rule 3</div><h2 class="h1" data-at="0">Add the equations</h2>
      <div class="x-line" style="top:296px" data-at="1">Add equations &nbsp;${ARR}&nbsp; ${KN} = <span class="pri">${K1} × ${K2}</span></div>
      <div class="x-row tall" style="top:386px" data-at="2"><div class="L">(1)</div><div class="E">A ${EQ} <span class="x-sp x-b1">B</span></div>
        <div class="D">${K1} = ${fr('[B]', '[A]')}</div></div>
      <div class="x-row tall" style="top:540px" data-at="2@0.5"><div class="L">(2)</div><div class="E"><span class="x-sp x-b2">B</span> ${EQ} C</div>
        <div class="D">${K2} = ${fr('[C]', '[B]')}</div></div>
      <div class="x-tag k" style="left:720px;top:424px" data-at="3@0.3" data-fx="pop">product</div>
      <div class="x-tag r" style="left:720px;top:578px" data-at="3@0.6" data-fx="pop">reactant</div>
      <div class="x-line" style="top:700px;font-size:56px" data-at="4">${K1} × ${K2} = ${fr('<span class="x-c1">[B]</span>', '[A]')} × ${fr('[C]', '<span class="x-c2">[B]</span>')}
        <span data-at="5" data-fx="fade">= ${fr('[C]', '[A]', 'color:var(--accent)')} <span class="teal" style="font-size:40px">(A ${EQ} C)</span></span></div>
      <div class="banner" style="top:880px;font-size:46px" data-at="6" data-fx="pop">${K1} = 3.0, ${K2} = 5.0 ${ARR} K = 3.0 × 5.0 = <span class="gold">15</span></div>`,
    update(c) {
      const b = c.b, on = c.t >= b[3].start && c.t < b[5].start
      c.$('.x-b1').style.background = on ? HL : 'transparent'; c.$('.x-b2').style.background = on ? HL : 'transparent'
      const gone = c.t >= b[4].start + 0.6 * (b[4].end - b[4].start)
      c.$('.x-c1').classList.toggle('x-gone', gone); c.$('.x-c2').classList.toggle('x-gone', gone)
    },
  })

  // ---------- combining the rules ----------
  EZ.scene('combo', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Put together</div><h2 class="h1" data-at="0">Use the rules together</h2>
      <div class="x-row" style="top:290px" data-at="1"><div class="L">ORIGINAL</div><div class="E">${FWD}</div><div class="D teal">K</div></div>
      <div class="x-row" style="top:404px;border:3px solid rgba(243,167,100,.75)" data-at="2"><div class="L warm">REV. × 2</div><div class="E">4${NH3} ${EQ} 2${N2} + 6${H2}</div>
        <div class="D"><span class="muted" data-at="in" data-fx="fade" data-out="4">${KN} = ?</span></div></div>
      <div class="x-row" style="top:404px;background:none;border:none" data-at="4@0.4" data-fx="pop"><div class="D warm">${KN} = 1/K<sup>2</sup></div></div>
      <div class="x-step" style="left:240px" data-at="3" data-fx="pop"><div class="H">START</div><div class="V teal">K</div></div>
      <div class="x-sarr" style="left:676px" data-at="3@0.1" data-fx="fade">${ARR}</div>
      <div class="x-step" style="left:760px" data-at="3@0.15" data-fx="pop"><div class="H">REVERSE</div><div class="V warm">1/K</div></div>
      <div class="x-sarr" style="left:1196px" data-at="3@0.6" data-fx="fade">${ARR}</div>
      <div class="x-step" style="left:1280px" data-at="3@0.65" data-fx="pop"><div class="H">× 2: SQUARE IT</div><div class="V warm">(1/K)<sup>2</sup></div></div>
      <div class="x-row" style="top:730px;border:3px solid rgba(60,199,188,.7)" data-at="5"><div class="L teal">× ½</div><div class="E">${HALF}${N2} + ${THREEHALF}${H2} ${EQ} ${NH3}</div>
        <div class="D"><span class="teal" data-at="5@0.7" data-fx="fade">${KN} = √K</span></div></div>
      <div class="banner" style="top:870px;font-size:44px" data-at="6" data-fx="pop">The same rules apply to <span class="gold">Q</span>: it has the same form as K</div>`,
  })

  // ---------- the trick: line up with Hess's law ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Line it up with Hess's law</h2>
      <div class="card x-tab" data-at="0@0.5"><table>
        <tr><th>Do this</th><th>ΔH</th><th>K</th></tr>
        <tr class="x-r1"><td class="warm" data-at="1" data-fx="fade">Reverse</td><td data-at="1@0.3" data-fx="fade">−ΔH</td><td class="teal" data-at="1@0.7" data-fx="pop">1/K</td></tr>
        <tr class="x-r2"><td class="teal" data-at="2" data-fx="fade">Multiply by c</td><td data-at="2@0.3" data-fx="fade">c·ΔH</td><td class="teal" data-at="2@0.7" data-fx="pop">K<sup>c</sup></td></tr>
        <tr class="x-r3"><td class="pri" data-at="3" data-fx="fade">Add</td><td data-at="3@0.2" data-fx="fade">ΔH<sub>1</sub> + ΔH<sub>2</sub></td><td class="teal" data-at="3@0.65" data-fx="pop">${K1} × ${K2}</td></tr>
      </table></div>
      <div class="banner" style="top:860px;font-size:56px" data-at="4" data-fx="pop"><span class="gold">ΔH adds</span>, <span class="teal">K multiplies</span></div>`,
    update(c) {
      const b = c.b
      for (let i = 1; i <= 3; i++) {
        const on = c.t >= b[i].start && c.t < (b[i + 1]?.start ?? 1e9) && c.t < b[4].start
        c.$('.x-r' + i).style.background = on ? 'rgba(141,141,240,.14)' : 'transparent'
      }
    },
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">What is the new K?</h2>
      <div class="x-row" style="top:300px" data-at="1@0.15" data-fx="pop"><div class="L">GIVEN</div><div class="E">${FWD}</div><div class="D">K = 4.0 × 10<sup>2</sup></div></div>
      <div class="x-row" style="top:420px;border:3px solid rgba(242,196,67,.75)" data-at="1@0.6" data-fx="pop"><div class="L gold">FIND K FOR</div><div class="E">${REV}</div><div class="D gold"><span data-at="in" data-fx="fade" data-out="3">K = ?</span></div></div>
      <div class="x-row" style="top:420px;background:none;border:none" data-at="3@0.3" data-fx="pop"><div class="D good">K = 2.5 × 10<sup>−3</sup></div></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="700" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="x-num" x="960" y="726" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><div class="ok">${CHECK}</div><div class="A good">2.5 × 10<sup>−3</sup></div>
        <div class="W" style="top:180px" data-at="4" data-fx="fade"><span class="warm">Reversed</span> ${ARR} ${KN} = 1/K</div>
        <div class="W" style="top:258px" data-at="5" data-fx="fade">1 / (4.0 × 10<sup>2</sup>) = <span class="good">2.5 × 10<sup>−3</sup></span></div></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.45 * win})`
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="190" viewBox="0 0 440 190" font-weight="900" text-anchor="middle">
    <text x="90" y="120" font-size="90" style="fill:${TXT}">K</text>
    <path d="M150 70 Q220 20 290 70" fill="none" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/>
    <text x="350" y="78" font-size="60" style="fill:${WARM}">1</text><line x1="315" y1="98" x2="385" y2="98" stroke="${WARM}" stroke-width="6"/><text x="350" y="160" font-size="60" style="fill:${WARM}">K</text></svg>`
  const r2 = `<svg width="440" height="190" viewBox="0 0 440 190" font-weight="900" text-anchor="middle">
    <text x="120" y="130" font-size="100" style="fill:${TEAL}">K<tspan dy="-44" font-size="56">c</tspan></text>
    <text x="320" y="80" font-size="40" style="fill:${TXT}">× ½</text><line x1="260" y1="100" x2="380" y2="100" stroke="${TEAL}" stroke-width="6" marker-end="url(#mk-teal)"/>
    <text x="320" y="166" font-size="56" style="fill:${TEAL}">√K</text></svg>`
  const r3 = `<svg width="440" height="190" viewBox="0 0 440 190" font-weight="900" text-anchor="middle">
    <text x="220" y="120" font-size="80" style="fill:${PRI}">K<tspan dy="16" font-size="46">1</tspan><tspan dy="-16"> × K</tspan><tspan dy="16" font-size="46">2</tspan></text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="warm">Reverse</span> the equation:<br>new K = 1/K</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="teal">Multiply</span> by c:<br>new K = K<sup>c</sup><br>½ ${ARR} square root</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="pri">Add</span> equations:<br>multiply the Ks</p></div>`,
  })
  void clamp; void lerp
})()
